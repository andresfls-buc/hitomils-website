import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && 'text-center', className)}>
      {subtitle && (
        <p
          className={cn(
            'font-sans text-xs uppercase tracking-widest mb-3',
            light ? 'text-[#D6C4A8]' : 'text-[#B8A080]'
          )}
        >
          {subtitle}
        </p>
      )}
      <h2
        className={cn(
          'font-serif text-4xl md:text-5xl font-light leading-tight',
          light ? 'text-white' : 'text-[#2C2C2C]'
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          'mt-5 h-px w-16',
          centered && 'mx-auto',
          light ? 'bg-[#B8A080]' : 'bg-[#B8A080]'
        )}
      />
    </div>
  )
}
