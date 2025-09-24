import { createI18n } from 'vue-i18n';
import en from './en.json';
import zh from './zh.json';
import { useUserStore } from '@/stores/modules/user.store';
import { computed } from 'vue';

function languageFromStore() {
  const userStore = useUserStore();
  return userStore.getLang || uni.getStorageSync('l') || 'zh';
}

const lang = computed(() => languageFromStore());
const defaultLang = uni.getStorageSync('l') || 'zh';

const i18n = createI18n({
  legacy: false, // use Composition API mode
  locale: defaultLang,
  fallbackLocale: 'zh',
  globalInjection: true, // allows using $t globally
  messages: { en, zh },
});

export default i18n;

export const translate = (key) => {
  if (!key) return '';
  return i18n.global.t(key);
};
