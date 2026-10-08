import type { GalleryImage } from '@/types'
import type { LandingLocale } from '@/lib/landing'
import { portfolioImages } from '@/data/portfolio'

export type LandingGalleryImage = GalleryImage & {
  captions: Record<LandingLocale, string>
}

const captions: Record<string, Record<LandingLocale, string>> = {
  '/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg': { en: 'Natural bridal makeup and an elegant updo · Sapporo', 'zh-hk': '札幌自然新娘妝容與優雅盤髮', 'zh-tw': '札幌自然新娘彩妝與優雅盤髮' },
  '/images/portfolio/bridal-makeup-close-up-coral-tones-hokkaido.jpg': { en: 'Warm coral bridal makeup · Hokkaido', 'zh-hk': '北海道暖珊瑚色新娘妝容', 'zh-tw': '北海道暖珊瑚色新娘彩妝' },
  '/images/portfolio/bridal-makeup-soft-glam-off-shoulder-hokkaido.jpg': { en: 'Soft glam bridal makeup · Hokkaido', 'zh-hk': '北海道柔和亮澤新娘妝容', 'zh-tw': '北海道柔和亮澤新娘彩妝' },
  '/images/portfolio/bridal-makeup-half-down-hair-mixed-bouquet-sapporo.jpg': { en: 'Half-down hair and a mixed bouquet · Sapporo', 'zh-hk': '札幌半放髮造型與混色花束', 'zh-tw': '札幌半放髮造型與混色花束' },
  '/images/portfolio/bridal-makeup-natural-auburn-hair-sapporo.jpg': { en: 'Natural makeup with auburn hair · Sapporo', 'zh-hk': '札幌自然妝容與赤褐色頭髮', 'zh-tw': '札幌自然彩妝與赤褐色頭髮' },
  '/images/portfolio/bridal-makeup-hotel-room-pink-bouquet-sapporo.jpg': { en: 'Bridal makeup with a pink peony bouquet · Sapporo', 'zh-hk': '札幌新娘妝容與粉紅牡丹花束', 'zh-tw': '札幌新娘彩妝與粉紅牡丹花束' },
  '/images/portfolio/bridal-makeup-veil-smiling-bride-hokkaido.jpg': { en: 'A smiling bride with a veil · Hokkaido', 'zh-hk': '北海道頭紗新娘的微笑肖像', 'zh-tw': '北海道頭紗新娘的微笑肖像' },
  '/images/portfolio/bridal-makeup-winter-snow-fur-stole-hokkaido.jpg': { en: 'Winter bridal makeup with a fur stole · Hokkaido', 'zh-hk': '北海道冬日新娘妝容與毛披肩', 'zh-tw': '北海道冬日新娘彩妝與毛披肩' },
  '/images/portfolio/cherry-blossom-wedding-couple-bridal-makeup-sapporo.jpg': { en: 'A couple beneath cherry blossoms · Sapporo', 'zh-hk': '札幌櫻花下的新婚夫婦', 'zh-tw': '札幌櫻花下的新婚夫婦' },
  '/images/portfolio/autumn-bride-bridal-makeup-fall-foliage-birch-hokkaido.jpg': { en: 'A bride among autumn leaves and birch trees · Hokkaido', 'zh-hk': '北海道白樺與秋葉間的新娘', 'zh-tw': '北海道白樺與秋葉間的新娘' },
  '/images/portfolio/lavender-field-bride-veil-bridal-makeup-hokkaido.jpg': { en: 'A bride beneath her veil in a lavender field · Hokkaido', 'zh-hk': '北海道薰衣草田中的頭紗新娘', 'zh-tw': '北海道薰衣草田中的頭紗新娘' },
  '/images/portfolio/wedding-couple-bridal-makeup-lakeside-hokkaido.jpg': { en: 'A couple beside a Hokkaido lake', 'zh-hk': '北海道湖畔的新婚夫婦', 'zh-tw': '北海道湖畔的新婚夫婦' },
  '/images/portfolio/bridal-hair-updo-gold-pins-outdoor-hokkaido.jpg': { en: 'An updo with gold pins · Hokkaido', 'zh-hk': '北海道金色髮夾盤髮造型', 'zh-tw': '北海道金色髮夾盤髮造型' },
  '/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg': { en: 'A half-up style with pink peonies · Hokkaido', 'zh-hk': '北海道粉紅牡丹花束半束髮造型', 'zh-tw': '北海道粉紅牡丹花束半束髮造型' },
  '/images/portfolio/bridal-hair-loose-waves-gypsophila-bouquet-hokkaido.jpg': { en: 'Loose waves with a gypsophila bouquet · Hokkaido', 'zh-hk': '北海道滿天星花束與自然波浪髮型', 'zh-tw': '北海道滿天星花束與自然波浪髮型' },
  '/images/portfolio/bridal-hair-half-up-pearl-pins-garden-sapporo.jpg': { en: 'A half-up style with pearl pins · Sapporo', 'zh-hk': '札幌珍珠髮夾半束髮造型', 'zh-tw': '札幌珍珠髮夾半束髮造型' },
  '/images/portfolio/bridal-updo-pearl-pins-back-view-lace-gown-sapporo.jpg': { en: 'A pearl-pinned updo with a lace gown · Sapporo', 'zh-hk': '札幌蕾絲婚紗與珍珠髮夾盤髮', 'zh-tw': '札幌蕾絲婚紗與珍珠髮夾盤髮' },
  '/images/portfolio/bridal-hair-half-up-braided-pearl-pins-hokkaido.jpg': { en: 'A braided half-up style with pearl pins · Hokkaido', 'zh-hk': '北海道珍珠髮夾編織半束髮造型', 'zh-tw': '北海道珍珠髮夾編織半束髮造型' },
}

export const landingGallery: LandingGalleryImage[] = Object.entries(captions).map(
  ([src, localizedCaptions]) => ({
    ...portfolioImages.find((image) => image.src === src)!,
    captions: localizedCaptions,
  }),
)
