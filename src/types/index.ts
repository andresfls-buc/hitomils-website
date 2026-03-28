export interface Service {
  id: string
  title: string
  description: string
  includes: string[]
  price: string
  priceNote?: string
  category: 'bridal' | 'hair' | 'occasion'
}

export interface AddOn {
  title: string
  price: string
}

export interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
  category: 'bridal-makeup' | 'hairstyling' | 'special-occasion'
}

export interface Testimonial {
  quote: string
  name: string
  occasion: string
}
