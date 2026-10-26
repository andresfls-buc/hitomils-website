import type { LandingLocale } from '@/lib/landing'

export type WeddingHeroImage = {
  src: string
  positionDesktop: string
  positionMobile: string
  caption: Record<LandingLocale, string>
  alt: Record<LandingLocale, string>
}

export const weddingHeroImages: WeddingHeroImage[] = [
  {
    src: '/images/portfolio/winter-bride-fur-cape-red-bouquet-snow-forest-hokkaido.jpg',
    positionDesktop: '50% 25%',
    positionMobile: '40% 30%',
    caption: {
      en: 'Winter bride · Hokkaido',
      'zh-hk': '北海道冬日新娘',
      'zh-tw': '北海道冬日新娘',
    },
    alt: {
      en: 'Bride in a white fur cape holding a red rose bouquet in a snowy Hokkaido forest.',
      'zh-hk': '北海道雪林中的新娘，穿白色毛披肩並手持紅玫瑰花束。',
      'zh-tw': '北海道雪林中的新娘，穿白色毛披肩並手持紅玫瑰花束。',
    },
  },
  {
    src: '/images/portfolio/autumn-bride-bridal-makeup-fall-foliage-birch-hokkaido.jpg',
    positionDesktop: '50% 22%',
    positionMobile: '55% 20%',
    caption: {
      en: 'Autumn bride · Hokkaido',
      'zh-hk': '北海道秋日新娘',
      'zh-tw': '北海道秋日新娘',
    },
    alt: {
      en: 'Smiling bride looking back among autumn foliage and birch trees in Hokkaido.',
      'zh-hk': '北海道秋葉與白樺樹間回眸微笑的新娘。',
      'zh-tw': '北海道秋葉與白樺樹間回眸微笑的新娘。',
    },
  },
  {
    src: '/images/portfolio/cherry-blossom-wedding-couple-bridal-makeup-sapporo.jpg',
    positionDesktop: '50% 58%',
    positionMobile: '50% 60%',
    caption: {
      en: 'Cherry blossom pre-wedding portrait · Sapporo',
      'zh-hk': '札幌櫻花婚前肖像',
      'zh-tw': '札幌櫻花婚前肖像',
    },
    alt: {
      en: 'Couple posing beneath cherry blossoms during a pre-wedding shoot in Sapporo.',
      'zh-hk': '札幌櫻花樹下拍攝婚前照片的一對新人。',
      'zh-tw': '札幌櫻花樹下拍攝婚前照片的一對新人。',
    },
  },
  {
    src: '/images/portfolio/summer-wedding-couple-lakeside-pond-pampas-bouquet-hokkaido.jpg',
    positionDesktop: '50% 28%',
    positionMobile: '50% 30%',
    caption: {
      en: 'Summer lakeside wedding · Hokkaido',
      'zh-hk': '北海道夏日湖畔婚禮',
      'zh-tw': '北海道夏日湖畔婚禮',
    },
    alt: {
      en: 'Wedding couple on a lakeside dock in Hokkaido; the bride holds a pampas grass bouquet.',
      'zh-hk': '北海道湖畔木棧道上的婚禮新人；新娘手持蒲葦花束。',
      'zh-tw': '北海道湖畔木棧道上的婚禮新人；新娘手持蒲葦花束。',
    },
  },
  {
    src: '/images/portfolio/winter-bridal-makeup-veil-birch-forest-hokkaido.jpg',
    positionDesktop: '50% 20%',
    positionMobile: '43% 30%',
    caption: {
      en: 'Winter veil portrait · Hokkaido',
      'zh-hk': '北海道冬日頭紗肖像',
      'zh-tw': '北海道冬日頭紗肖像',
    },
    alt: {
      en: 'Bride and groom beneath a veil among birch trees in winter, Hokkaido.',
      'zh-hk': '北海道冬日白樺林中頭紗下的婚禮新人。',
      'zh-tw': '北海道冬日白樺林中頭紗下的婚禮新人。',
    },
  },
]

export const heroCarouselLabels: Record<LandingLocale, {
  gallery: string
  slide: string
  photoCredit: string
}> = {
  en: {
    gallery: 'Wedding photo carousel',
    slide: 'Photo',
    photoCredit: 'Hair & makeup: Hitomi',
  },
  'zh-hk': {
    gallery: '婚禮照片輪播',
    slide: '照片',
    photoCredit: '化妝及髮型：Hitomi',
  },
  'zh-tw': {
    gallery: '婚禮照片輪播',
    slide: '照片',
    photoCredit: '妝髮造型：Hitomi',
  },
}
