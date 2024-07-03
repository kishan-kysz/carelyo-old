import { useLocalStorage } from '@mantine/hooks';
import { useCallback, useEffect } from 'react';

export default function useCountdown({
	id = 0,
	initMinute = 15,
	initSeconds = 0,
	callback,
}: {
	id?: number;
	initMinute?: number;
	initSeconds?: number;
	callback?: () => void;
}) {
	const [completed, setCompleted] = useLocalStorage({
		key: `time-${id}-state`,
		defaultValue: false,
	});
	const [{ minutes, seconds, retainTimestamp }, setTime] = useLocalStorage<{
		minutes: number;
		seconds: number;
		retainTimestamp?: number;
	}>({
		key: `time-${id}`,
		defaultValue: {
			minutes: initMinute,
			seconds: initSeconds,
			retainTimestamp: undefined,
		},
	});
	useEffect(() => {
		let myInterval: string | number | NodeJS.Timer | undefined;
		if (!completed) {
			myInterval = setInterval(() => {
				if (minutes <= 0 && seconds <= 0) {
					setCompleted(true);
					callback?.();
					clearInterval(myInterval);
				} else if (seconds === 0) {
					setTime({ minutes: minutes - 1, seconds: 59, retainTimestamp });
				} else {
					setTime({ minutes, seconds: seconds - 1, retainTimestamp });
				}
			}, 1000);
		}
		return () => {
			clearInterval(myInterval);
		};
	}, [initMinute, initSeconds, minutes, seconds, setTime, completed]);

	const handleReset = useCallback(() => {
		setCompleted(false);
		setTime({ minutes: 15, seconds: 0, retainTimestamp: Date.now() });
	}, []);

	const updateTimer = useCallback(
		(minutes: number, seconds: number) => {
			return setTime({ minutes, seconds, retainTimestamp });
		},
		[minutes, seconds]
	);

	return {
		completed,
		minutes,
		seconds,
		retainTimestamp,
		setCompleted,
		handleReset,
		updateTimer,
	};
}
