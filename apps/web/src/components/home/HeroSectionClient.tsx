'use client'

import dynamic from 'next/dynamic'

export const HeroSectionClient = dynamic(
  () => import('./HeroSection').then((m) => m.HeroSection),
  { ssr: false }
)
