import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const whitelist = [
  'en',
  'fr',
  'sv',
  'sw',
  'de',
  'es',
  'gh',
  'pt',
  'za',
  'ig',
  'ha',
  'yo'
]

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng)
  window.history.pushState({}, document.title, `/${lng}`)
}

const languageFromURL = window.location.pathname.substring(1)
const detectedLanguage = i18n.language
const language = whitelist.includes(languageFromURL)
  ? languageFromURL
  : detectedLanguage

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'En',
    whitelist: [
      'en',
      'fr',
      'sv',
      'sw',
      'de',
      'es',
      'gh',
      'pt',
      'za',
      'ig',
      'ha',
      'yo'
    ],
    nonExplicitWhitelist: true,
    load: [
      'en',
      'fr',
      'sv',
      'sw',
      'de',
      'es',
      'gh',
      'pt',
      'za',
      'ig',
      'ha',
      'yo'
    ],
    backend: {
      // translate file path
      loadPath: '/translation/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage'],
      lookupFromPathIndex: 0,
      checkWhitelist: true
    },
    // fallbackLng: 'en',
    // disabled in production
    debug: false,
    // can have multiple namespaces, in case you want to divide a huge
    // translation into smaller pieces and load them on demand
    ns: ['default'],

    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true,
      useSuspense: true
    }
  })

i18n.changeLanguage(language)

export { changeLanguage }
