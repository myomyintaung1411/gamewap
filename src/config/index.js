import { createI18n } from 'vue-i18n';
import en from './en.json';
import zh from './zh.json';

function getDefaultLang() {
  let lang = 'zh';
  try {
    // APP-PLUS runtime
    // #ifdef APP-PLUS
    lang = uni.getStorageSync('l') || lang;
    // #endif

    // H5 runtime
    // #ifndef APP-PLUS
    if (typeof window !== 'undefined' && window.localStorage) {
      lang = window.localStorage.getItem('l') || lang;
    }
    // #endif
  } catch (e) {
    // fallback to zh
  }
  return lang;
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLang(),
  fallbackLocale: 'zh',
  globalInjection: true,
  messages: { en, zh },
});

export default i18n;

export const translate = (key) => {
  if (!key) return '';
  return i18n.global.t(key);
};
