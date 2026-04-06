'use client'

import { clsx } from 'clsx'

type ConditionVariant = 'A' | 'B' | 'C' | 'D'
type BadgeVariant = 'condition' | 'type' | 'featured' | 'new' | 'default'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  condition?: ConditionVariant
  className?: string
}

const conditionStyles: Record<ConditionVariant, string> = {
  A: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  B: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  C: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  D: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
}

const conditionLabels: Record<ConditionVariant, string> = {
  A: 'Like New',
  B: 'Good',
  C: 'Fair',
  D: 'Needs Work',
}

const variantStyles: Record<BadgeVariant, string> = {
  condition: '',
  type: 'bg-secondary-500/60 text-white/80 border border-white/10',
  featured: 'bg-gradient-to-r from-primary-500 to-primary-400 text-white',
  new: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
  default: 'bg-white/10 text-white/70 border border-white/10',
}

export function Badge({ children, variant = 'default', condition, className }: BadgeProps) {
  const isCondition = variant === 'condition' && condition

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        isCondition ? conditionStyles[condition] : variantStyles[variant],
        className
      )}
    >
      {isCondition ? (
        <>
          <span className="font-bold">{condition}</span>
          <span>{conditionLabels[condition]}</span>
        </>
      ) : (
        children
      )}
    </span>
  )
}
