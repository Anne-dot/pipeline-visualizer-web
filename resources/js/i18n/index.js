import { createI18n } from 'vue-i18n'
import en from './en.json'
import et from './et.json'

// Get saved language from localStorage or use Estonian as default
const savedLanguage = localStorage.getItem('language') || 'et'

export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    et
  }
})

// Helper to save language preference
export const setLanguage = (lang) => {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
}