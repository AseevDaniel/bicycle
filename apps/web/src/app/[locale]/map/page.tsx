'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Map, List, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterPanel, type FilterState, DEFAULT_FILTERS } from '@/components/map/FilterPanel'
import { MAP_LISTINGS } from '@/components/map/mapData'

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

// Full dataset of Costa del Sol listings
export const MAP_LISTINGS: MapListing[] = [
  {
    id: '1',
    title: 'Trek Domane SL 6',
    price: 2800,
    bikeType: 'road',
    condition: 'B',
    lat: 36.7196,
    lng: -4.42,
    city: 'Málaga',
    photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&q=80',
    brand: 'Trek',
    year: 2022,
  },
  {
    id: '2',
    title: 'Specialized Stumpjumper',
    price: 3200,
    bikeType: 'mountain',
    condition: 'A',
    lat: 36.5101,
    lng: -4.8825,
    city: 'Marbella',
    photo: 'https://images.unsplash.com/photo-1619731454956-d9f57b0e3d48?w=200&q=80',
    brand: 'Specialized',
    year: 2023,
  },
  {
    id: '3',
    title: 'Giant TCR Advanced',
    price: 1900,
    bikeType: 'road',
    condition: 'C',
    lat: 36.539,
    lng: -4.62,
    city: 'Fuengirola',
    photo: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80',
    brand: 'Giant',
    year: 2021,
  },
  {
    id: '4',
    title: 'Haibike Trekking 5',
    price: 2200,
    bikeType: 'electric',
    condition: 'B',
    lat: 36.4314,
    lng: -5.1483,
    city: 'Estepona',
    photo: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=200&q=80',
    brand: 'Haibike',
    year: 2022,
  },
  {
    id: '5',
    title: 'Cannondale Topstone',
    price: 2600,
    bikeType: 'gravel',
    condition: 'A',
    lat: 36.5991,
    lng: -4.514,
    city: 'Benalmádena',
    photo: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&q=80',
    brand: 'Cannondale',
    year: 2023,
  },
  {
    id: '6',
    title: 'Scott Scale 970',
    price: 1400,
    bikeType: 'mountain',
    condition: 'B',
    lat: 36.7871,
    lng: -4.5564,
    city: 'Antequera',
    photo: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=200&q=80',
    brand: 'Scott',
    year: 2021,
  },
  {
    id: '7',
    title: 'Orbea Gain D40',
    price: 3100,
    bikeType: 'electric',
    condition: 'A',
    lat: 36.5225,
    lng: -4.7435,
    city: 'Mijas',
    photo: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=200&q=80',
    brand: 'Orbea',
    year: 2023,
  },
  {
    id: '8',
    title: 'Trek FX 3 Disc',
    price: 950,
    bikeType: 'city',
    condition: 'B',
    lat: 36.5236,
    lng: -4.6392,
    city: 'Torremolinos',
    photo: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=200&q=80',
    brand: 'Trek',
    year: 2020,
  },
  {
    id: '9',
    title: 'Pinarello Dogma F',
    price: 6800,
    bikeType: 'road',
    condition: 'A',
    lat: 36.4988,
    lng: -4.9742,
    city: 'San Pedro de Alcántara',
    photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&q=80',
    brand: 'Pinarello',
    year: 2023,
  },
  {
    id: '10',
    title: 'Cube Touring Hybrid',
    price: 1750,
    bikeType: 'hybrid',
    condition: 'B',
    lat: 36.6553,
    lng: -4.5436,
    city: 'Churriana',
    photo: 'https://images.unsplash.com/photo-1526382822038-bc4d9576e5de?w=200&q=80',
    brand: 'Cube',
    year: 2022,
  },
  {
    id: '11',
    title: 'BMC Roadmachine 01',
    price: 4200,
    bikeType: 'road',
    condition: 'A',
    lat: 36.7399,
    lng: -4.3818,
    city: 'Málaga East',
    photo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&q=80',
    brand: 'BMC',
    year: 2022,
  },
  {
    id: '12',
    title: 'Merida Big Nine 600',
    price: 1200,
    bikeType: 'mountain',
    condition: 'C',
    lat: 36.4747,
    lng: -5.0211,
    city: 'Manilva',
    photo: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=200&q=80',
    brand: 'Merida',
    year: 2020,
  },
  {
    id: '13',
    title: 'Riese & Müller Supercharger',
    price: 5400,
    bikeType: 'electric',
    condition: 'A',
    lat: 36.5637,
    lng: -4.7289,
    city: 'Alhaurín el Grande',
    photo: 'https://images.unsplash.com/photo-1591464080935-38e3f5e3e898?w=200&q=80',
    brand: 'Riese & Müller',
    year: 2023,
  },
  {
    id: '14',
    title: 'Canyon Grail CF SL',
    price: 3800,
    bikeType: 'gravel',
    condition: 'B',
    lat: 36.5801,
    lng: -4.9221,
    city: 'Coin',
    photo: 'https://images.unsplash.com/photo-1623005329857-29f85c3f85a5?w=200&q=80',
    brand: 'Canyon',
    year: 2022,
  },
  {
    id: '15',
    title: 'Brompton M6L',
    price: 1600,
    bikeType: 'city',
    condition: 'B',
    lat: 36.4919,
    lng: -4.8664,
    city: 'Puerto Banús',
    photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&q=80',
    brand: 'Brompton',
    year: 2021,
  },
  {
    id: '16',
    title: 'Colnago V3Rs',
    price: 7200,
    bikeType: 'road',
    condition: 'A',
    lat: 36.715,
    lng: -4.4898,
    city: 'Málaga West',
    photo: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=200&q=80',
    brand: 'Colnago',
    year: 2023,
  },
  {
    id: '17',
    title: 'Santa Cruz Hightower',
    price: 4500,
    bikeType: 'mountain',
    condition: 'A',
    lat: 36.6738,
    lng: -4.4942,
    city: 'Cártama',
    photo: 'https://images.unsplash.com/photo-1619731454956-d9f57b0e3d48?w=200&q=80',
    brand: 'Santa Cruz',
    year: 2022,
  },
  {
    id: '18',
    title: 'Specialized Vado SL',
    price: 3900,
    bikeType: 'electric',
    condition: 'B',
    lat: 36.4545,
    lng: -5.0838,
    city: 'Casares',
    photo: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=200&q=80',
    brand: 'Specialized',
    year: 2023,
  },
  {
    id: '19',
    title: 'Salsa Warbird',
    price: 3300,
    bikeType: 'gravel',
    condition: 'B',
    lat: 36.6347,
    lng: -4.5589,
    city: 'Alhaurín de la Torre',
    photo: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&q=80',
    brand: 'Salsa',
    year: 2022,
  },
  {
    id: '20',
    title: 'Giant Escape City',
    price: 700,
    bikeType: 'city',
    condition: 'D',
    lat: 36.5602,
    lng: -4.6421,
    city: 'Benalmádena Costa',
    photo: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=200&q=80',
    brand: 'Giant',
    year: 2019,
  },
]

function applyFilters(listings: MapListing[], filters: FilterState): MapListing[] {
  return listings.filter((l) => {
    // Search
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
    // Bike type
    if (filters.bikeType !== 'all' && l.bikeType !== filters.bikeType) return false
    // Condition
    if (filters.condition !== 'all' && l.condition !== filters.condition) return false
    // Price range
    if (filters.minPrice && l.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false
    return true
  })
}

export default function MapPage() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')

  const filteredListings = useMemo(
    () => applyFilters(MAP_LISTINGS, filters),
    [filters]
  )

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
        {/* Left panel: filters + listing list */}
        <div className="w-[40%] max-w-sm flex-shrink-0 h-full overflow-hidden">
          <FilterPanel {...filterPanelProps} />
        </div>

        {/* Right panel: map */}
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

        {/* Content */}
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

                {/* Floating listing indicator when something is selected */}
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
