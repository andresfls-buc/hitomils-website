import type { Service, AddOn } from '@/types'

export const services: Service[] = [
  {
    id: 'bridal-makeup',
    title: 'Bridal Makeup',
    description:
      'A flawless, long-lasting bridal look tailored to your features and wedding aesthetic. Whether you prefer a soft natural glow or a polished evening look, every detail is crafted with care.',
    includes: [
      'In-depth pre-wedding consultation',
      'Full foundation & skin prep',
      'Eye makeup including lashes',
      'Contouring & highlighting',
      'Setting for all-day wear',
      'Touch-up kit provided',
    ],
    price: '¥35,000',
    priceNote: 'Starting price. Final quote provided after consultation.',
    category: 'bridal',
  },
  {
    id: 'bridal-hair',
    title: 'Bridal Hairstyling',
    description:
      'Elegant updos, flowing waves, or traditional Japanese kanzashi styles — crafted to complement your dress and last through every moment of your day.',
    includes: [
      'Pre-wedding hair consultation',
      'Professional blow-dry & prep',
      'Updo or styled finish',
      'Accessories placement (if provided)',
      'Hairpin & bobby pin set included',
      'Final touch-up before ceremony',
    ],
    price: '¥30,000',
    priceNote: 'Starting price. Final quote provided after consultation.',
    category: 'hair',
  },
  {
    id: 'bridal-combo',
    title: 'Bridal Makeup & Hair (Combo)',
    description:
      'The full bridal experience — makeup and hair together for a cohesive, harmonious look. Ideal for brides who want a seamless, stress-free morning.',
    includes: [
      'All bridal makeup services',
      'All bridal hairstyling services',
      'Unified look consultation',
      'Extended session time',
      'Touch-up kit provided',
      'Preferred scheduling slot',
    ],
    price: '¥58,000',
    priceNote: 'Starting price. Includes both makeup and hair. Final quote after consultation.',
    category: 'bridal',
  },
  {
    id: 'trial-session',
    title: 'Trial / Preview Session',
    description:
      'A dedicated session before your wedding day to perfect your bridal look. We explore styles, test products on your skin, and ensure everything is exactly right.',
    includes: [
      'Full makeup or hair styling',
      'Style exploration & adjustment',
      'Product skin-compatibility test',
      'Photo documentation of final look',
      'Feedback & refinement discussion',
    ],
    price: '¥25,000',
    priceNote: 'Per session (makeup or hair). Combined trial available at ¥40,000.',
    category: 'bridal',
  },
  {
    id: 'event-makeup',
    title: 'Special Occasion Makeup',
    description:
      'For parties, graduation ceremonies, formal dinners, photo shoots, and any moment you want to look your absolute best.',
    includes: [
      'Foundation & skin prep',
      'Eye makeup & lashes',
      'Contouring & finishing',
      'Personalized to your event',
    ],
    price: '¥18,000',
    priceNote: 'Starting price.',
    category: 'occasion',
  },
  {
    id: 'event-hair',
    title: 'Special Occasion Hairstyling',
    description:
      'Polished updos, romantic curls, or sleek finishes for any formal event. Perfect for graduation ceremonies, parties, and photo shoots.',
    includes: [
      'Blow-dry & prep',
      'Styled updo or finish',
      'Hair accessory placement',
      'Setting spray finish',
    ],
    price: '¥15,000',
    priceNote: 'Starting price.',
    category: 'occasion',
  },
]

export const addOns: AddOn[] = [
  { title: 'Early morning surcharge (before 7:00 AM)', price: '+¥5,000' },
  { title: 'Travel fee (outside central Sapporo)', price: 'From ¥3,000' },
  { title: 'Additional bridesmaids makeup', price: '¥15,000 each' },
  { title: 'Additional bridesmaids hair', price: '¥12,000 each' },
  { title: 'Eyelash extensions removal & redo', price: '+¥3,000' },
]
