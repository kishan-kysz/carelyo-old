import langFlag from '../assets/Icons/header/flags';

export interface ILanguages {
	value: string;
	title: string;
	name: string;
	iconFlag: string;
}

const languages: ILanguages[] = [
	{ value: 'Za', title: 'Afrikaans', name: 'Za', iconFlag: langFlag.afrikaans },
	{ value: 'En', title: 'English', name: 'En', iconFlag: langFlag.english },
	{ value: 'Fr', title: 'French', name: 'Fr', iconFlag: langFlag.french },
	{ value: 'De', title: 'German', name: 'De', iconFlag: langFlag.german },
	{ value: 'Gh', title: 'Twi', name: 'Gh', iconFlag: langFlag.akan },
	{ value: 'Ew', title: 'Ewe', name: 'Ew', iconFlag: langFlag.ewe },
	{ value: 'Ig', title: 'Igbo', name: 'Ig', iconFlag: langFlag.nigeria },
	{ value: 'Ha', title: 'Hausa', name: 'Ha', iconFlag: langFlag.nigeria },
	{ value: 'Yo', title: 'Yoruba', name: 'Yo', iconFlag: langFlag.nigeria },
	{ value: 'Pt', title: 'Portugal', name: 'Pt', iconFlag: langFlag.portugal },
	{ value: 'Es', title: 'Spanish', name: 'Es', iconFlag: langFlag.spanish },
	{ value: 'Sw', title: 'Swahili', name: 'Sw', iconFlag: langFlag.swahili },
	{ value: 'Sv', title: 'Swedish', name: 'Sv', iconFlag: langFlag.swedish },
];

export default languages;
