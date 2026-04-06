'use client'

import dynamic from 'next/dynamic'
import { Component, type ReactNode } from 'react'

class HeroErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; error?: string }
> {
  state = { failed: false }
  static getDerivedStateFromError(error: Error) {
    console.error('[HeroSection] 3D render error:', error)
    return { failed: true, error: error.message }
  }
  render() {
    if (this.state.failed) {
      // Fallback: gradient hero without 3D
      return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent" />
        </section>
      )
    }
    return this.props.children
  }
}

const HeroSectionDynamic = dynamic(
  () => import('./HeroSection').then((m) => m.HeroSection),
  { ssr: false }
)

export function HeroSectionClient() {
  return (
    <HeroErrorBoundary>
      <HeroSectionDynamic />
    </HeroErrorBoundary>
  )
}
