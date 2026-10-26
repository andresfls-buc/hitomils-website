import type { Service, AddOn } from '@/types'

export const services: Service[] = [
  {
    id: 'bridal-combo-salon',
    title: 'Bridal Hair & Makeup — At Salon',
    description:
      'Bridal makeup and wedding hairstyling at a Sapporo salon, with a pre-wedding consultation to plan your look. Skin preparation, makeup and an updo or styled finish are included, with communication in English or Japanese.',
    includes: [
      'Full bridal makeup',
      'Bridal hairstyling',
      'Pre-wedding consultation',
      'Skin prep & foundation',
      'Eye makeup including lashes',
      'Updo or styled finish',
    ],
    price: '¥12,000〜',
    priceNote: 'Starting price. Final quote after consultation.',
    category: 'bridal',
  },
  {
    id: 'bridal-combo-hotel',
    title: 'Bridal Hair & Makeup — At Hotel',
    description:
      'Wedding hair and makeup in your hotel room in Sapporo, Hokkaido. Hitomi brings her kit to you for bridal preparation, with travel to other Hokkaido locations and elsewhere in Japan available on request.',
    includes: [
      'Full bridal makeup',
      'Bridal hairstyling',
      'Pre-wedding consultation',
      'Skin prep & foundation',
      'Eye makeup including lashes',
      'Updo or styled finish',
    ],
    price: '¥22,000〜',
    priceNote: 'Starting price. Includes travel within Sapporo city. Final quote after consultation.',
    category: 'bridal',
  },
  {
    id: 'event-makeup',
    title: 'Special Occasion Makeup',
    description:
      'Makeup in Sapporo for graduation ceremonies, parties, formal dinners and photo shoots. Skin preparation, foundation, eye makeup and finishing are tailored to your event and preferred style.',
    includes: [
      'Foundation & skin prep',
      'Eye makeup & lashes',
      'Contouring & finishing',
      'Personalized to your event',
    ],
    price: 'On request',
    priceNote: 'Price varies by location and time. Please enquire via Instagram.',
    category: 'occasion',
  },
  {
    id: 'event-hair',
    title: 'Special Occasion Hairstyling',
    description:
      'Special occasion hairstyling in Sapporo, Hokkaido, for graduations, parties and photo shoots. Choose an updo, romantic curls or a sleek finish, with hair accessory placement and setting included.',
    includes: [
      'Blow-dry & prep',
      'Styled updo or finish',
      'Hair accessory placement',
      'Setting spray finish',
    ],
    price: 'On request',
    priceNote: 'Price varies by location and time. Please enquire via Instagram.',
    category: 'occasion',
  },
]

export const addOns: AddOn[] = [
  { title: 'Outside Sapporo city (travel & accommodation)', price: '+¥15,000〜¥40,000' },
  { title: 'Early morning surcharge', price: 'Varies by time — please enquire' },
  { title: 'Additional bridesmaids makeup', price: 'On request' },
  { title: 'Additional bridesmaids hair', price: 'On request' },
]
