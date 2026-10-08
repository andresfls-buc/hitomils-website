export const landingLocales = {
  'zh-tw': { lang: 'zh-TW', label: '繁體中文（台灣）', ogLocale: 'zh_TW' },
  'zh-hk': { lang: 'zh-HK', label: '繁體中文（香港）', ogLocale: 'zh_HK' },
  en: { lang: 'en', label: 'English', ogLocale: 'en_US' },
} as const

export type LandingLocale = keyof typeof landingLocales
export const defaultLandingLocale: LandingLocale = 'zh-tw'
export const landingEntryPath = '/wedding-hair-makeup-japan'
export const landingLocaleKeys = Object.keys(landingLocales) as LandingLocale[]
export const landingPath = (locale: LandingLocale) => `/${locale}/wedding-hair-makeup-japan`
export const isLandingLocale = (locale: string): locale is LandingLocale =>
  Object.hasOwn(landingLocales, locale)

export const instagramUrl = 'https://www.instagram.com/hitomi.l.s_sapporo/'

export const landingNav = {
  en: { services: 'Services', work: 'Selected work', locations: 'Locations', faq: 'FAQ', contact: 'Instagram', menu: 'Open menu', close: 'Close menu', navigation: 'Main navigation', languages: 'Choose language' },
  'zh-hk': { services: '服務', work: '作品', locations: '服務地區', faq: '常見問題', contact: 'Instagram 查詢', menu: '開啟選單', close: '關閉選單', navigation: '主要導覽', languages: '選擇語言' },
  'zh-tw': { services: '服務', work: '作品', locations: '服務地區', faq: '常見問題', contact: 'Instagram 詢問', menu: '開啟選單', close: '關閉選單', navigation: '主要導覽', languages: '選擇語言' },
} satisfies Record<LandingLocale, Record<string, string>>
