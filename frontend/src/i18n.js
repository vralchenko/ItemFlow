import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import de from './locales/de/translation.json';
import ru from './locales/ru/translation.json';
import uk from './locales/uk/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: { translation: en },
            de: { translation: de },
            ru: { translation: ru },
            uk: { translation: uk }
        }
    });

export default i18n;