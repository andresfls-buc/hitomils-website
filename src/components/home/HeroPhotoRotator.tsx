import Image from 'next/image'

export default function HeroPhotoRotator() {
  return (
    <div className="mhero-photo">
      <Image
        src="/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg"
        alt="Bride with a natural updo and soft bridal makeup, Sapporo"
        fill
        priority
        sizes="(max-width: 900px) 100vw, 54vw"
        className="mhero-frame object-cover"
        data-on="true"
        style={{ objectPosition: '55% 20%' }}
      />
    </div>
  )
}
