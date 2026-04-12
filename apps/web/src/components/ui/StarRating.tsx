'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { clsx } from 'clsx'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
  reviewCount?: number
  className?: string
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
  lg: 'w-6 h-6',
}

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState(rating)

  const displayRating = interactive ? (hovered ?? selected) : rating
  const starSize = sizeMap[size]
  const textSize = textSizeMap[size]

  const handleClick = (star: number) => {
    if (!interactive) return
    setSelected(star)
    onChange?.(star)
  }

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1
          const filled = displayRating >= starValue
          const partial = !filled && displayRating > i

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(null)}
              className={clsx(
                'relative transition-transform duration-100',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              {/* Background star (empty) */}
              <Star
                className={clsx(starSize, 'text-white/20')}
                strokeWidth={1.5}
              />
              {/* Filled overlay */}
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(displayRating - i) * 100}%` : '100%' }}
                >
                  <Star
                    className={clsx(
                      starSize,
                      interactive && hovered !== null
                        ? 'fill-primary-400 text-primary-400'
                        : 'fill-yellow-400 text-yellow-400'
                    )}
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {(showValue || reviewCount !== undefined) && (
        <div className={clsx('flex items-center gap-1', textSize)}>
          {showValue && (
            <span className="font-semibold text-white">{rating.toFixed(1)}</span>
          )}
          {reviewCount !== undefined && (
            <span className="text-white/50">
              {reviewCount > 0 ? `(${reviewCount})` : 'No reviews'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
