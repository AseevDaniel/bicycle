'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'

export interface FilterState {
  bikeTypes: string[]
  conditions: string[]
  brands: string[]
  priceMin: number
  priceMax: number
  city: string
}

export const INITIAL_FILTERS: FilterState = {
  bikeTypes: [],
  conditions: [],
  brands: [],
  priceMin: 0,
  priceMax: 10000,
  city: '',
}

const BIKE_TYPES = [
  'Road', 'Mountain', 'Gravel', 'Electric', 'City',
  'Hybrid', 'BMX', 'Kids', 'Folding', 'Cargo',
]

const CONDITIONS = [
  { value: 'A', label: 'Like New' },
  { value: 'B', label: 'Excellent' },
  { value: 'C', label: 'Good' },
  { value: 'D', label: 'Fair' },
]

const BRANDS = [
  'Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott',
  'Merida', 'Cube', 'Canyon', 'Bianchi', 'Orbea',
  'Santa Cruz', 'Pinarello', 'Colnago', 'BMC', 'Wilier',
]

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 dark:border-secondary-700 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  )
}

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClose?: () => void
  isMobile?: boolean
}

export function FilterSidebar({ filters, onChange, onClose, isMobile }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.bikeTypes.length > 0 ||
    filters.conditions.length > 0 ||
    filters.brands.length > 0 ||
    filters.city !== '' ||
    filters.priceMin > 0 ||
    filters.priceMax < 10000

  const toggleArrayFilter = (
    key: 'bikeTypes' | 'conditions' | 'brands',
    value: string
  ) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: updated })
  }

  const clearFilters = () => onChange(INITIAL_FILTERS)

  return (
    <div
      className={clsx(
        'bg-white dark:bg-secondary-800',
        isMobile
          ? 'h-full overflow-y-auto p-5'
          : 'rounded-2xl border border-gray-100 dark:border-secondary-700 p-5 sticky top-24'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900 dark:text-white text-base">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary font-medium hover:underline"
            >
              Clear all
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Bike Type */}
      <FilterSection title="Bike Type">
        <div className="space-y-2">
          {BIKE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.bikeTypes.includes(type.toLowerCase())}
                onChange={() => toggleArrayFilter('bikeTypes', type.toLowerCase())}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">Min (€)</label>
              <input
                type="number"
                min={0}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={(e) =>
                  onChange({ ...filters, priceMin: Math.min(Number(e.target.value), filters.priceMax) })
                }
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-secondary-700 border border-gray-200 dark:border-secondary-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">Max (€)</label>
              <input
                type="number"
                min={filters.priceMin}
                max={10000}
                value={filters.priceMax}
                onChange={(e) =>
                  onChange({ ...filters, priceMax: Math.max(Number(e.target.value), filters.priceMin) })
                }
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-secondary-700 border border-gray-200 dark:border-secondary-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-white/40">
            <span>€{filters.priceMin.toLocaleString()}</span>
            <span>€{filters.priceMax.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10000}
            step={50}
            value={filters.priceMax}
            onChange={(e) =>
              onChange({ ...filters, priceMax: Math.max(Number(e.target.value), filters.priceMin) })
            }
            className="w-full accent-primary"
          />
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="space-y-2">
          {CONDITIONS.map((cond) => (
            <label key={cond.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.conditions.includes(cond.value)}
                onChange={() => toggleArrayFilter('conditions', cond.value)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {cond.label}
              </span>
              <span className="ml-auto text-xs font-bold text-gray-400 dark:text-white/30 border border-gray-200 dark:border-secondary-600 rounded px-1">
                {cond.value}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleArrayFilter('brands', brand)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" defaultOpen={false}>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          placeholder="City or area..."
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-secondary-700 border border-gray-200 dark:border-secondary-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </FilterSection>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full mt-4 py-2.5 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
