import Image from 'next/image'
import { cn } from '@/lib/utils'

const versions = {
  navbar: { src: '/brand/hl-navbar@2x.png', width: 320, height: 224, className: 'w-10 md:w-12' },
  footer: { src: '/brand/hl-footer@2x.png', width: 480, height: 336, className: 'w-20' },
  hero: { src: '/brand/hl-master.png', width: 1040, height: 729, className: 'w-full' },
}

export default function BrandLogo({
  variant = 'navbar',
  light = false,
  decorative = false,
  className,
}: {
  variant?: keyof typeof versions
  light?: boolean
  decorative?: boolean
  className?: string
}) {
  const image = versions[variant]
  return (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt={decorative ? '' : 'Hitomi Landazabal'}
      unoptimized
      loading={variant === 'footer' ? 'lazy' : 'eager'}
      className={cn('block h-auto', image.className, light && 'brightness-0 invert', className)}
    />
  )
}
