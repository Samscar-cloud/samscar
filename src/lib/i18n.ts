export type Locale = 'fr' | 'en' | 'ru'

export const locales: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ru: 'Русский',
}

export const translations = {
  fr: {
    home: 'Accueil',
    services: 'Services',
    booking: 'Réservation',
    account: 'Mon compte',
    admin: 'Admin',
    signIn: 'Se connecter',
  },
  en: {
    home: 'Home',
    services: 'Services',
    booking: 'Booking',
    account: 'Account',
    admin: 'Admin',
    signIn: 'Sign in',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    booking: 'Запись',
    account: 'Аккаунт',
    admin: 'Админ',
    signIn: 'Войти',
  },
}

export function t(locale: Locale, key: keyof typeof translations['fr']) {
  return translations[locale][key] ?? translations['fr'][key]
}
