'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import {
  getAllowedWheels,
  getAllowedBrakes,
  getAllowedGroupsets,
  hasDependentFilters,
  BIKE_FILTER_CONFIG,
  BIKE_TYPE_CONFIG_MAP,
} from '@/lib/bikeFiltersConfig'

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

export interface FilterState {
  bikeTypes: string[]
  conditions: string[]
  brands: string[]
  priceMin: number
  priceMax: number
  city: string
  wheels: string[]
  brakes: string[]
  groupsets: string[]
}

export const INITIAL_FILTERS: FilterState = {
  bikeTypes: [],
  conditions: [],
  brands: [],
  priceMin: 0,
  priceMax: 10000,
  city: '',
  wheels: [],
  brakes: [],
  groupsets: [],
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

// ---------------------------------------------------------------------------
// FilterSection
// ---------------------------------------------------------------------------

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: number
}

function FilterSection({ title, children, defaultOpen = true, badge }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 dark:border-secondary-700 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge != null && badge > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-primary text-white text-[10px] font-bold leading-none">
              {badge}
            </span>
          )}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared checkbox row
// ---------------------------------------------------------------------------

interface CheckboxRowProps {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  suffix?: React.ReactNode
}

function CheckboxRow({ label, checked, onChange, disabled = false, suffix }: CheckboxRowProps) {
  return (
    <label
      className={clsx(
        'flex items-center gap-2.5 cursor-pointer group',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
      />
      <span className="text-sm text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {label}
      </span>
      {suffix && <span className="ml-auto">{suffix}</span>}
    </label>
  )
}

// ---------------------------------------------------------------------------
// Helper: collect human-readable config names for selected bike types
// ---------------------------------------------------------------------------

function getConfiguredTypeNames(bikeTypes: string[]): string[] {
  const seenKeys = new Set<string>()
  const names: string[] = []
  for (const type of bikeTypes) {
    const key = BIKE_TYPE_CONFIG_MAP[type]
    if (key && BIKE_FILTER_CONFIG[key] && !seenKeys.has(key)) {
      seenKeys.add(key)
      names.push(BIKE_FILTER_CONFIG[key].name)
    }
  }
  return names
}

// ---------------------------------------------------------------------------
// FilterSidebar
// ---------------------------------------------------------------------------

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
    filters.priceMax < 10000 ||
    filters.wheels.length > 0 ||
    filters.brakes.length > 0 ||
    filters.groupsets.length > 0

  // ---- Toggle handlers ---------------------------------------------------

  /** Toggles a bike type and resets all dependent filters. */
  const toggleBikeType = (type: string) => {
    const updated = filters.bikeTypes.includes(type)
      ? filters.bikeTypes.filter((v) => v !== type)
      : [...filters.bikeTypes, type]
    onChange({ ...filters, bikeTypes: updated, wheels: [], brakes: [], groupsets: [] })
  }

  const toggleArrayFilter = (key: 'conditions' | 'brands', value: string) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: updated })
  }

  const toggleWheel = (value: string) => {
    const updated = filters.wheels.includes(value)
      ? filters.wheels.filter((v) => v !== value)
      : [...filters.wheels, value]
    onChange({ ...filters, wheels: updated })
  }

  const toggleBrake = (value: string) => {
    const updated = filters.brakes.includes(value)
      ? filters.brakes.filter((v) => v !== value)
      : [...filters.brakes, value]
    onChange({ ...filters, brakes: updated })
  }

  const toggleGroupset = (value: string) => {
    const updated = filters.groupsets.includes(value)
      ? filters.groupsets.filter((v) => v !== value)
      : [...filters.groupsets, value]
    onChange({ ...filters, groupsets: updated })
  }

  const clearFilters = () => onChange(INITIAL_FILTERS)

  // ---- Derived data for dependent filters --------------------------------

  const showDependentFilters = hasDependentFilters(filters.bikeTypes)
  const allowedWheels = getAllowedWheels(filters.bikeTypes)
  const allowedBrakes = getAllowedBrakes(filters.bikeTypes)
  const allowedGroupsets = getAllowedGroupsets(filters.bikeTypes)
  const configuredTypeNames = getConfiguredTypeNames(filters.bikeTypes)

  // ---- Render ------------------------------------------------------------

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

      {/* ---------------------------------------------------------------- */}
      {/* Bike Type                                                         */}
      {/* ---------------------------------------------------------------- */}
      <FilterSection title="Bike Type">
        <div className="space-y-2">
          {BIKE_TYPES.map((type) => {
            const value = type.toLowerCase()
            return (
              <CheckboxRow
                key={type}
                label={type}
                checked={filters.bikeTypes.includes(value)}
                onChange={() => toggleBikeType(value)}
              />
            )
          })}
        </div>
      </FilterSection>

      {/* ---------------------------------------------------------------- */}
      {/* Dependent sections: Wheel Size, Brakes, Transmission             */}
      {/* Only visible when at least one configured bike type is selected.  */}
      {/* ---------------------------------------------------------------- */}
      {showDependentFilters && (
        <>
          {/* Context info pill */}
          <div className="mb-3 -mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-500 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 inline-block flex-shrink-0" />
              Showing filters for {configuredTypeNames.join(', ')}
            </span>
          </div>

          {/* Wheel Size */}
          <FilterSection title="Wheel Size" badge={filters.wheels.length}>
            <div className="border-l-2 border-primary/40 pl-3 space-y-2">
              {allowedWheels.map((wheel) => (
                <CheckboxRow
                  key={wheel}
                  label={wheel}
                  checked={filters.wheels.includes(wheel)}
                  onChange={() => toggleWheel(wheel)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Brakes */}
          <FilterSection title="Brakes" badge={filters.brakes.length}>
            <div className="border-l-2 border-primary/40 pl-3 space-y-2">
              {allowedBrakes.map((brake) => (
                <CheckboxRow
                  key={brake}
                  label={brake}
                  checked={filters.brakes.includes(brake)}
                  onChange={() => toggleBrake(brake)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Transmission */}
          <FilterSection title="Transmission" badge={filters.groupsets.length}>
            <div className="border-l-2 border-primary/40 pl-3 space-y-4">
              {allowedGroupsets.map(({ brand, models }) => (
                <div key={brand}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/30 mb-1.5">
                    {brand}
                  </p>
                  <div className="space-y-1.5">
                    {models.map((model) => (
                      <CheckboxRow
                        key={model}
                        label={model}
                        checked={filters.groupsets.includes(model)}
                        onChange={() => toggleGroupset(model)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FilterSection>
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Price Range                                                       */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Condition                                                         */}
      {/* ---------------------------------------------------------------- */}
      <FilterSection title="Condition">
        <div className="space-y-2">
          {CONDITIONS.map((cond) => (
            <CheckboxRow
              key={cond.value}
              label={cond.label}
              checked={filters.conditions.includes(cond.value)}
              onChange={() => toggleArrayFilter('conditions', cond.value)}
              suffix={
                <span className="text-xs font-bold text-gray-400 dark:text-white/30 border border-gray-200 dark:border-secondary-600 rounded px-1">
                  {cond.value}
                </span>
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* ---------------------------------------------------------------- */}
      {/* Brand                                                             */}
      {/* ---------------------------------------------------------------- */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <CheckboxRow
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleArrayFilter('brands', brand)}
            />
          ))}
        </div>
      </FilterSection>

      {/* ---------------------------------------------------------------- */}
      {/* Location                                                          */}
      {/* ---------------------------------------------------------------- */}
      <FilterSection title="Location" defaultOpen={false}>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          placeholder="City or area..."
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-secondary-700 border border-gray-200 dark:border-secondary-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </FilterSection>

      {/* ---------------------------------------------------------------- */}
      {/* Clear all (bottom CTA)                                            */}
      {/* ---------------------------------------------------------------- */}
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
