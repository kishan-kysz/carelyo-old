import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const whitelist = [
	'en',
	'fr',
	'sv',
	'sw',
	'ig',
	'ha',
	'yo',
	'za',
	'de',
	'pt',
	'es',
	'gh',
	'ew',
];

const changeLanguage = (lng) => {
	i18n.changeLanguage(lng);
	window.history.pushState({}, document.title, `/${lng}`);
};

const languageFromURL = window.location.pathname.substring(1);
const detectedLanguage = i18n.language || 'En';
const language = whitelist.includes(languageFromURL)
	? languageFromURL
	: detectedLanguage;

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'En',
		whitelist,
		nonExplicitWhitelist: true,
		load: whitelist,
		backend: {
			loadPath: '/translation/{{lng}}/{{ns}}.json',
		},
		detection: {
			order: ['localStorage'],
			lookupFromPathIndex: 0,
			checkWhitelist: true,
		},

		debug: false,

		ns: ['default'],

		interpolation: {
			escapeValue: false,
			formatSeparator: ',',
		},
		react: {
			wait: true,
			useSuspense: true,
		},
	});

i18n.changeLanguage(language);

export default i18n;
export { changeLanguage };
