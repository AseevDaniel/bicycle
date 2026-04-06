'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MapListing } from './ListingPopup'
import { TYPE_COLORS } from './mapConstants'
import { clsx } from 'clsx'

const BIKE_TYPES = ['all', 'road', 'mountain', 'gravel', 'electric', 'city', 'hybrid']

const CONDITION_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'A', label: 'A · Like New' },
  { value: 'B', label: 'B · Good' },
  { value: 'C', label: 'C · Fair' },
  { value: 'D', label: 'D · Needs Work' },
]

export interface FilterState {
  search: string
  bikeType: string
  minPrice: string
  maxPrice: string
  condition: string
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  bikeType: 'all',
  minPrice: '',
  maxPrice: '',
  condition: 'all',
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  selectedListing: string | null
  onListingSelect: (id: string | null) => void
  listings: MapListing[]
  filteredListings: MapListing[]
}

export function FilterPanel({
  filters,
  onFilterChange,
  selectedListing,
  onListingSelect,
  listings: _listings,
  filteredListings,
}: FilterPanelProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(true)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.bikeType !== 'all') count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.condition !== 'all') count++
    return count
  }, [filters])

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onFilterChange({ ...filters, [key]: value })
  }

  function clearFilters() {
    onFilterChange(DEFAULT_FILTERS)
  }

  return (
    <div className="flex flex-col h-full bg-secondary-900 border-r border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-400" />
            <h2 className="font-bold text-white text-base">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-white/40 hover:text-white/70 text-xs flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="text-white/50 hover:text-white/80 transition-colors"
              aria-label={filtersExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              {filtersExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search bikes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-500/60 focus:bg-white/8 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible filters */}
      <AnimatePresence initial={false}>
        {filtersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden border-b border-white/10"
          >
            <div className="px-4 py-3 space-y-4">
              {/* Bike Type Pills */}
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                  Bike Type
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {BIKE_TYPES.map((type) => {
                    const isActive = filters.bikeType === type
                    const color = type !== 'all' ? TYPE_COLORS[type] : undefined
                    return (
                      <button
                        key={type}
                        onClick={() => updateFilter('bikeType', type)}
                        className={clsx(
                          'px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-150',
                          isActive
                            ? 'text-white shadow-sm scale-105'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'
                        )}
                        style={
                          isActive
                            ? {
                                backgroundColor: color ?? '#FF4D00',
                                borderColor: 'transparent',
                              }
                            : {}
                        }
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                  Price Range (€)
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-all"
                    min={0}
                  />
                  <span className="text-white/30 text-xs flex-shrink-0">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary-500/60 transition-all"
                    min={0}
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                  Condition
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CONDITION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilter('condition', opt.value)}
                      className={clsx(
                        'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150',
                        filters.condition === opt.value
                          ? 'bg-primary-500 text-white scale-105'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/10">
        <p className="text-white/40 text-xs">
          <span className="text-white/70 font-semibold">{filteredListings.length}</span>{' '}
          {filteredListings.length === 1 ? 'listing' : 'listings'} found
        </p>
      </div>

      {/* Listings list - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <p className="text-white/30 text-sm">No listings match your filters</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-primary-400 hover:text-primary-300 text-xs underline transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filteredListings.map((listing) => {
              const isSelected = selectedListing === listing.id
              const color = TYPE_COLORS[listing.bikeType] ?? TYPE_COLORS.default

              return (
                <motion.li
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    onClick={() => onListingSelect(isSelected ? null : listing.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150',
                      isSelected
                        ? 'bg-primary-500/15 border-l-2 border-primary-500'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-secondary-700">
                      <img
                        src={listing.photo}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement
                          t.style.display = 'none'
                        }}
                      />
                      {/* Type dot */}
                      <span
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-secondary-900"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm leading-tight line-clamp-1 mb-0.5">
                        {listing.title}
                      </p>
                      <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                        <MapPin className="w-3 h-3 text-accent-400 flex-shrink-0" />
                        <span className="truncate">{listing.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-400 text-sm">
                          €{listing.price.toLocaleString()}
                        </span>
                        <span className="text-white/30 text-xs capitalize bg-white/5 px-1.5 py-0.5 rounded">
                          {listing.bikeType}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export type { MapListing }
export { DEFAULT_FILTERS }
