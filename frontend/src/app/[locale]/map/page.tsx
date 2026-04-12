'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Map, List, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterPanel, type FilterState, DEFAULT_FILTERS } from '@/components/map/FilterPanel'
import { MAP_LISTINGS } from '@/components/map/mapData'
import type { MapListing } from '@/components/map/ListingPopup'

// Dynamic import for Leaflet — must be SSR-disabled
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary-800 animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-white/50 text-sm">Loading map...</p>
    </div>
  ),
})

function applyFilters(listings: MapListing[], filters: FilterState): MapListing[] {
  return listings.filter((l) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (
        !l.title.toLowerCase().includes(q) &&
        !l.city.toLowerCase().includes(q) &&
        !(l.brand ?? '').toLowerCase().includes(q)
      ) {
        return false
      }
    }
    if (filters.bikeType !== 'all' && l.bikeType !== filters.bikeType) return false
    if (filters.condition !== 'all' && l.condition !== filters.condition) return false
    if (filters.minPrice && l.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false
    return true
  })
}

export default function MapPage() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')

  const filteredListings = useMemo(() => applyFilters(MAP_LISTINGS, filters), [filters])

  const filterPanelProps = {
    filters,
    onFilterChange: setFilters,
    selectedListing,
    onListingSelect: setSelectedListing,
    listings: MAP_LISTINGS,
    filteredListings,
  }

  const mapViewProps = {
    listings: filteredListings,
    selectedId: selectedListing,
    onListingSelect: setSelectedListing,
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-secondary-900 overflow-hidden">
      {/* ── Desktop: split view ── */}
      <div className="hidden md:flex h-full">
        {/* Left panel: filters + listing list (40%) */}
        <div className="w-[40%] max-w-sm flex-shrink-0 h-full overflow-hidden">
          <FilterPanel {...filterPanelProps} />
        </div>

        {/* Right panel: map (60%) */}
        <div className="flex-1 h-full relative">
          <MapView {...mapViewProps} />
        </div>
      </div>

      {/* ── Mobile: tab/toggle view ── */}
      <div className="md:hidden flex flex-col h-full">
        {/* Toggle bar */}
        <div className="flex-shrink-0 flex bg-secondary-800 border-b border-white/10">
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileView === 'map'
                ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Map className="w-4 h-4" />
            Map
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileView === 'list'
                ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <List className="w-4 h-4" />
            List
            {filteredListings.length > 0 && (
              <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {filteredListings.length}
              </span>
            )}
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            {mobileView === 'map' ? (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <MapView {...mapViewProps} />

                {/* Floating card when a listing is selected on mobile */}
                <AnimatePresence>
                  {selectedListing && (
                    <motion.div
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 80, opacity: 0 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="absolute bottom-4 left-4 right-4 z-[500]"
                    >
                      {(() => {
                        const listing = MAP_LISTINGS.find((l) => l.id === selectedListing)
                        if (!listing) return null
                        return (
                          <div className="bg-secondary-800/95 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
                            <img
                              src={listing.photo}
                              alt={listing.title}
                              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-sm line-clamp-1">
                                {listing.title}
                              </p>
                              <p className="text-white/50 text-xs">{listing.city}</p>
                              <p className="text-primary-400 font-bold text-sm">
                                €{listing.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedListing(null)}
                              className="flex-shrink-0 text-white/40 hover:text-white/70 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-auto"
              >
                <FilterPanel {...filterPanelProps} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
