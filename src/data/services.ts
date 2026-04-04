import type { Service, AddOn } from '@/types'

export const services: Service[] = [
  {
    id: 'bridal-combo-salon',
    title: 'Bridal Hair & Makeup — At Salon',
    description:
      'The full bridal experience at the salon — hair and makeup together for a cohesive, harmonious look. A calm, dedicated space to prepare for your most important day.',
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
      'Hitomi comes to you. Get ready in the comfort of your hotel room with a fully equipped artist on-site — no travel stress on your wedding morning.',
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
      'For parties, graduation ceremonies, formal dinners, photo shoots, and any moment you want to look your absolute best.',
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
      'Polished updos, romantic curls, or sleek finishes for any formal event. Perfect for graduation ceremonies, parties, and photo shoots.',
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
