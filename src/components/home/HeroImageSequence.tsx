'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const BRIDAL = {
  src: '/images/home/bridal-makeup-veil-reclining-soft-gaze-sapporo.jpg',
  alt: 'Bridal makeup, soft gaze — Sapporo',
}

export default function HeroImageSequence() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 1.8, ease: 'easeOut' },
        scale:   { duration: 2.8, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <Image
        src={BRIDAL.src}
        alt={BRIDAL.alt}
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </motion.div>
  )
}
