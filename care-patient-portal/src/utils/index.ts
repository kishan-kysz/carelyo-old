import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { env } from './env';

type Age = {
	years: number;
	months: number;
	days: number;
	weeks: number;
};

export function formatMinutes(minutes: number) {
	return minutes < 10 ? `0${minutes}` : minutes;
}

export function formatSeconds(seconds: number) {
	return seconds < 10 ? `0${seconds}` : seconds;
}

export const formatTime = (minutes: number, seconds: number) =>
	`${formatMinutes(minutes)}:${formatSeconds(seconds)}`;

export const formatName = ({
	title,
	surName,
}: {
	title: string;
	surName: string;
}) => {
	const { t } = useTranslation(['default']);
	const dynamicTitle = title.toLowerCase();
	const translatedTitle = t(`tr.${dynamicTitle}`);
	return `${translatedTitle[0].toUpperCase()}${`${translatedTitle.slice(
		1
	)} ${surName[0].toUpperCase()}`}${surName.slice(1)}`;
};

export const initials = ({
	firstName,
	surName,
}: {
	firstName: string;
	surName: string;
}) => `${firstName.charAt(0)}${surName.charAt(0)}`;

const now = new Date();
export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-GB', {
		year: 'numeric',
		weekday: 'long',
		day: 'numeric',
		month: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});

export const dateFixed = now.toISOString().slice(0, 10);
export const randomizeString = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const formatDateByDOB = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate();
	const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
	const formattedDay = day + suffix;
	const monthIndex = date.getMonth();
	const monthNames = [
	  "January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	const formattedMonth = monthNames[monthIndex];
	const year = date.getFullYear();
	return `${formattedDay} ${formattedMonth} ${year}`;
};

export const getTime = () => {
	const day = `0${now.getDate()}`.slice(-2);
	const hour = `0${now.getHours()}`.slice(-2);
	const minute = `0${now.getMinutes()}`.slice(-2);
	const month = `0${now.getMonth() + 1}`.slice(-2);
	const date = `${now.getFullYear()}-${month}-${day}`;

	return { day, month, date, hour, minute };
};

export const greetUser = () => {
	const { t } = useTranslation(['default']);
	const currentTime = parseInt(getTime().hour);

	if (currentTime >= 0 && currentTime <= 12) {
		return t('tr.morning');
	} else if (currentTime > 12 && currentTime <= 18) {
		return t('tr.afternoon');
	} else {
		return t('tr.evening');
	}
};

export const convertToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			const result = fileReader.result;
			if (typeof result === 'string') {
				resolve(result.split(',')[1]);
			} else {
				reject(new Error('Failed to convert file to base64'));
			}
		};
		fileReader.onerror = (error) => {
			console.error(`Failed to read file: ${error.target?.error}`);
			reject(error);
		};
	});
};

export const createUTCdateForISO = (dateString: Date | string) => {
	const dateOffSet =
		Date.parse(new Date(dateString).toDateString()) -
		new Date().getTimezoneOffset() * 60 * 1000;
	return new Date(dateOffSet).toISOString();
};

export const convertBaseToString = (data: string) => {
	const binaryString = window.atob(data);
	return new Uint8Array(
		Uint8Array.from(binaryString, (char) => char.charCodeAt(0))
	);
};
const sleep = async (ms: number) => {
	await new Promise((resolve) => setTimeout(resolve, ms));
	console.log('Slept for', ms, 'ms');
};
// eslint-disable-next-line no-unused-vars
export const logExecutionTime = <T extends (...args: any[]) => Promise<any>>(
	func: T
): T => {
	// @ts-expect-error
	return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		const start = performance.now();
		if (env.VITE_DEBUG_SLEEP === 'true') {
			await sleep(env.VITE_DEBUG_SLEEP_TIME_MS);
		}
		const result = await func(...args);
		const end = performance.now();
		performance.measure(func.name, { start, end });
		console.log(
			`Function ${func.name} took ${
				performance.getEntriesByName(func.name)[0].duration
			} milliseconds to execute.`
		);
		return result;
	};
};

export const formatUrlParamsToNumber = (params?: string) => {
	if (params) {
		return parseInt(params);
	}
};

export const calculateAge = (dateString: string) => {
	const birthDate = new Date(dateString);
	if (isNaN(birthDate.getTime())) return null; // invalid date string

	const today = new Date();
	const years = today.getFullYear() - birthDate.getFullYear();
	const months = today.getMonth() - birthDate.getMonth();
	const timeDifference = today.getTime() - birthDate.getTime();
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const weeks = Math.floor(days / 7);

	return { years, months, days, weeks };
};

export const formatAge = (age: Age | null) => {
	if (!age) return '';
	let ageText: string;
	switch (true) {
		case age.weeks < 1:
			ageText = `${age.days} days`;
			break;
		case age.months <= 1 && age.years === 0:
			ageText = `${age.weeks} weeks`;
			break;
		case age.weeks > 4 && age.years < 1:
			ageText = `${age.months} month`;
			break;
		default:
			ageText = `${age.years} years`;
			break;
	}

	return ageText;
};
export const createNewDate = (dateString: string) => {
	const age = calculateAge(dateString);
	const formattedAge = formatAge(age);
	return `${new Date(dateString).toDateString()} (Age: ${formattedAge})`;
};
export const sortByDate = (a: string, b: string) => dayjs(b).diff(dayjs(a));

export const getAge = (dateOfBirth: string) => {
	const currentYear = new Date().getFullYear();
	const birthYear = new Date(dateOfBirth).getFullYear();
	return currentYear - birthYear;
};

export const calculateAgeByDOB = (birthDate : string) => {
    const currentDate = new Date();
    const dob = new Date(birthDate);

    let years = currentDate.getFullYear() - dob.getFullYear();
    let months = currentDate.getMonth() - dob.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
}

export const transformImages = async (value: File[]) => {
	return await Promise.all(
		value.map(async (file) => {
			return {
				encodedContent: await convertToBase64(file),
				objectName: file.name,
			};
		})
	);
};
