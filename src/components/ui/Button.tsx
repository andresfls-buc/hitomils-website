import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'filled' | 'ghost' | 'ghost-light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  external?: boolean
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'filled',
  size = 'md',
  className,
  external = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-sans uppercase tracking-widest transition-all duration-200 cursor-pointer'

  const sizes = {
    sm: 'text-xs px-5 py-2.5',
    md: 'text-xs px-8 py-3.5',
    lg: 'text-xs px-10 py-4',
  }

  const variants = {
    filled:
      'bg-[#A8796A] text-white hover:bg-[#C9A99A] border border-[#A8796A] hover:border-[#C9A99A]',
    ghost:
      'bg-transparent text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white',
    'ghost-light':
      'bg-transparent text-white border border-white hover:bg-white hover:text-[#2C2C2C]',
  }

  const classes = cn(base, sizes[size], variants[variant], className)

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
