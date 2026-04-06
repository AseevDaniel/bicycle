'use client'

import dynamic from 'next/dynamic'
import { Component, type ReactNode } from 'react'

class HeroErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return null
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
