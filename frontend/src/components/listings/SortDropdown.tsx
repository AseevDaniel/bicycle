'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { clsx } from 'clsx'

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'most_viewed'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'most_viewed', label: 'Most Viewed' },
]

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = SORT_OPTIONS.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl text-sm text-gray-700 dark:text-white hover:border-primary transition-colors whitespace-nowrap"
      >
        <span>{selected?.label ?? 'Sort'}</span>
        <ChevronDown className={clsx('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={clsx(
                'w-full flex items-center justify-between px-4 py-3 text-sm transition-colors',
                option.value === value
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-secondary-700'
              )}
            >
              {option.label}
              {option.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
