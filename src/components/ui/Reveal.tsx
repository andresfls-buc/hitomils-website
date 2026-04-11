'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  /** pixels to drift upward from — keep subtle for elegance */
  y?: number
  className?: string
}

/**
 * Wraps any content with a scroll-triggered fade-up animation.
 * Plays once, triggers slightly before the element is fully visible,
 * and uses a slow expo-out ease to match the brand's elegant tone.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{
        duration: 1.0,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
