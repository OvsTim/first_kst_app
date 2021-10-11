import * as RNLocalize from 'react-native-localize';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './locales/en';
import ru from './locales/ru';

let lang = 'ru';
const locales = RNLocalize.getLocales();
if (Array.isArray(locales)) {
  lang = locales[0].languageCode;
}

export const resources = {
  en: en,
  ru: ru,
} as const;

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  lng: lang,
  debug: true,
  resources: resources,
  ns: ['main', 'errors'],
  defaultNS: 'main',
});

export default i18n;
