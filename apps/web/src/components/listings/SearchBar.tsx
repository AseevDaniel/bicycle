'use client'

import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { clsx } from 'clsx'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search bikes, brands, models...',
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className={clsx('relative flex items-center', className)}>
      <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-24 py-3 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <div className="absolute right-3 flex items-center gap-2">
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-secondary-700 rounded border border-gray-200 dark:border-secondary-600 font-mono">
          <span className="text-[10px]">⌃</span>K
        </kbd>
      </div>
    </div>
  )
}
