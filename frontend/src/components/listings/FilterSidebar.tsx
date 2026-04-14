'use client'

import { useMemo, useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import {
  BIKE_FILTERS_CONFIG,
  getAllowedWheels,
  getAllowedBrakes,
  getAllowedGroupsets,
} from '@/lib/filtersConfig'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Static constants ─────────────────────────────────────────────────────────

const BIKE_TYPE_KEYS = Object.keys(BIKE_FILTERS_CONFIG)

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
  'Sunday', 'Tern', 'Brompton', 'Dahon',
]

// ─── FilterSection ────────────────────────────────────────────────────────────

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
            <span className="w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {badge}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  )
}

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

function CheckboxItem({
  label,
  checked,
  onChange,
  sublabel,
}: {
  label: string
  checked: boolean
  onChange: () => void
  sublabel?: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 flex-shrink-0"
      />
      <span className="text-sm text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-tight">
        {label}
      </span>
      {sublabel && (
        <span className="ml-auto text-xs font-bold text-gray-400 dark:text-white/30 border border-gray-200 dark:border-secondary-600 rounded px-1 flex-shrink-0">
          {sublabel}
        </span>
      )}
    </label>
  )
}

// ─── FilterSidebar ────────────────────────────────────────────────────────────

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClose?: () => void
  isMobile?: boolean
}

export function FilterSidebar({ filters, onChange, onClose, isMobile }: FilterSidebarProps) {
  // Compute allowed options based on selected bike types
  const allowedWheels = useMemo(() => getAllowedWheels(filters.bikeTypes), [filters.bikeTypes])
  const allowedBrakes = useMemo(() => getAllowedBrakes(filters.bikeTypes), [filters.bikeTypes])
  const allowedGroupsets = useMemo(() => getAllowedGroupsets(filters.bikeTypes), [filters.bikeTypes])

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

  // Generic multi-select toggle
  const toggleArrayFilter = (
    key: 'bikeTypes' | 'conditions' | 'brands' | 'wheels' | 'brakes' | 'groupsets',
    value: string
  ) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: updated })
  }

  // Bike type toggle — resets incompatible dependent filters
  const handleBikeTypeToggle = (typeKey: string) => {
    const newTypes = filters.bikeTypes.includes(typeKey)
      ? filters.bikeTypes.filter((v) => v !== typeKey)
      : [...filters.bikeTypes, typeKey]

    const newAllowedWheels = getAllowedWheels(newTypes)
    const newAllowedBrakes = getAllowedBrakes(newTypes)
    const newAllowedGroupsetsFlat = Object.values(getAllowedGroupsets(newTypes)).flat()

    onChange({
      ...filters,
      bikeTypes: newTypes,
      wheels: filters.wheels.filter((w) => newAllowedWheels.includes(w)),
      brakes: filters.brakes.filter((b) => newAllowedBrakes.includes(b)),
      groupsets: filters.groupsets.filter((g) => newAllowedGroupsetsFlat.includes(g)),
    })
  }

  const clearFilters = () => onChange(INITIAL_FILTERS)

  const showDependentFilters = true // always show, options adapt to selection

  return (
    <div
      className={clsx(
        'bg-white dark:bg-secondary-800',
        isMobile
          ? 'h-full overflow-y-auto p-5'
          : 'rounded-2xl border border-gray-100 dark:border-secondary-700 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto'
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
      <FilterSection title="Bike Type" badge={filters.bikeTypes.length}>
        <div className="space-y-2">
          {BIKE_TYPE_KEYS.map((key) => (
            <CheckboxItem
              key={key}
              label={BIKE_FILTERS_CONFIG[key].name}
              checked={filters.bikeTypes.includes(key)}
              onChange={() => handleBikeTypeToggle(key)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Wheel Size — dynamic */}
      {showDependentFilters && (
        <FilterSection
          title="Wheel Size"
          defaultOpen={filters.bikeTypes.length > 0}
          badge={filters.wheels.length}
        >
          {filters.bikeTypes.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-white/40 italic">
              Select a bike type to see compatible wheel sizes.
            </p>
          ) : (
            <div className="space-y-2">
              {allowedWheels.map((w) => (
                <CheckboxItem
                  key={w}
                  label={w}
                  checked={filters.wheels.includes(w)}
                  onChange={() => toggleArrayFilter('wheels', w)}
                />
              ))}
            </div>
          )}
        </FilterSection>
      )}

      {/* Brakes — dynamic */}
      {showDependentFilters && (
        <FilterSection
          title="Brakes"
          defaultOpen={filters.bikeTypes.length > 0}
          badge={filters.brakes.length}
        >
          {filters.bikeTypes.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-white/40 italic">
              Select a bike type to see compatible brake types.
            </p>
          ) : (
            <div className="space-y-2">
              {allowedBrakes.map((b) => (
                <CheckboxItem
                  key={b}
                  label={b}
                  checked={filters.brakes.includes(b)}
                  onChange={() => toggleArrayFilter('brakes', b)}
                />
              ))}
            </div>
          )}
        </FilterSection>
      )}

      {/* Drivetrain / Components — dynamic, grouped by brand */}
      {showDependentFilters && (
        <FilterSection
          title="Drivetrain"
          defaultOpen={filters.bikeTypes.length > 0}
          badge={filters.groupsets.length}
        >
          {filters.bikeTypes.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-white/40 italic">
              Select a bike type to see compatible drivetrain options.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(allowedGroupsets).map(([brand, options]) => (
                <div key={brand}>
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5">
                    {brand}
                  </p>
                  <div className="space-y-1.5">
                    {options.map((opt) => (
                      <CheckboxItem
                        key={opt}
                        label={opt}
                        checked={filters.groupsets.includes(opt)}
                        onChange={() => toggleArrayFilter('groupsets', opt)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </FilterSection>
      )}

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
      <FilterSection title="Condition" badge={filters.conditions.length}>
        <div className="space-y-2">
          {CONDITIONS.map((cond) => (
            <CheckboxItem
              key={cond.value}
              label={cond.label}
              checked={filters.conditions.includes(cond.value)}
              onChange={() => toggleArrayFilter('conditions', cond.value)}
              sublabel={cond.value}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={false} badge={filters.brands.length}>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <CheckboxItem
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleArrayFilter('brands', brand)}
            />
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
