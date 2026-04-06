'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, List, Map, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { ListingCard, type ListingCardData } from '@/components/listings/ListingCard'
import { FilterSidebar, type FilterState, INITIAL_FILTERS } from '@/components/listings/FilterSidebar'
import { SearchBar } from '@/components/listings/SearchBar'
import { SortDropdown, type SortOption } from '@/components/listings/SortDropdown'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LISTINGS: ListingCardData[] = [
  {
    id: '1',
    title: 'Trek Domane SL 6 - Excellent Road Bike',
    price: 2800,
    condition: 'B',
    bikeType: 'road',
    brand: 'Trek',
    model: 'Domane SL 6',
    year: 2022,
    frameSize: '56cm',
    city: 'Málaga',
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'],
    sellerName: 'Carlos M.',
    sellerRating: 4.9,
    views: 142,
    favoritesCount: 18,
    createdAt: '2024-12-15',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Specialized Stumpjumper Comp - MTB Beast',
    price: 3200,
    condition: 'A',
    bikeType: 'mountain',
    brand: 'Specialized',
    model: 'Stumpjumper Comp',
    year: 2023,
    frameSize: 'L',
    city: 'Marbella',
    photos: ['https://images.unsplash.com/photo-1619731454956-d9f57b0e3d48?w=800&q=80'],
    sellerName: 'James W.',
    sellerRating: 4.7,
    views: 89,
    favoritesCount: 24,
    createdAt: '2024-12-20',
    isNegotiable: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Giant Contend AR 1 - Perfect City Commuter',
    price: 950,
    condition: 'B',
    bikeType: 'city',
    brand: 'Giant',
    model: 'Contend AR 1',
    year: 2021,
    frameSize: 'M',
    city: 'Fuengirola',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'],
    sellerName: 'Ana López',
    sellerRating: 4.5,
    views: 203,
    favoritesCount: 31,
    createdAt: '2024-12-18',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Cannondale Synapse Carbon - Race Ready',
    price: 4500,
    condition: 'A',
    bikeType: 'road',
    brand: 'Cannondale',
    model: 'Synapse Carbon',
    year: 2023,
    frameSize: '54cm',
    city: 'Estepona',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'],
    sellerName: 'Michael B.',
    sellerRating: 5.0,
    views: 317,
    favoritesCount: 47,
    createdAt: '2024-12-22',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Scott Scale 940 - Trail Mountain Bike',
    price: 1650,
    condition: 'C',
    bikeType: 'mountain',
    brand: 'Scott',
    model: 'Scale 940',
    year: 2020,
    frameSize: 'M',
    city: 'Benalmádena',
    photos: ['https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80'],
    sellerName: 'Pedro R.',
    sellerRating: 4.2,
    views: 76,
    favoritesCount: 9,
    createdAt: '2024-12-10',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Cube Kathmandu Hybrid Pro E-Bike',
    price: 3800,
    condition: 'A',
    bikeType: 'electric',
    brand: 'Cube',
    model: 'Kathmandu Hybrid Pro',
    year: 2023,
    frameSize: 'L',
    city: 'Torremolinos',
    photos: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    sellerName: 'Ingrid S.',
    sellerRating: 4.8,
    views: 445,
    favoritesCount: 62,
    createdAt: '2024-12-23',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '7',
    title: 'Merida Scultura 400 - Lightweight Road',
    price: 1200,
    condition: 'B',
    bikeType: 'road',
    brand: 'Merida',
    model: 'Scultura 400',
    year: 2021,
    frameSize: '52cm',
    city: 'Nerja',
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'],
    sellerName: 'Sophie D.',
    sellerRating: 4.6,
    views: 98,
    favoritesCount: 14,
    createdAt: '2024-12-08',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '8',
    title: 'Orbea Gain M30 Electric Road Bike',
    price: 5200,
    condition: 'A',
    bikeType: 'electric',
    brand: 'Orbea',
    model: 'Gain M30',
    year: 2023,
    frameSize: '54cm',
    city: 'Mijas',
    photos: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    sellerName: 'Alejandro V.',
    sellerRating: 4.9,
    views: 521,
    favoritesCount: 78,
    createdAt: '2024-12-21',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '9',
    title: 'Canyon Spectral 125 - All-Mountain',
    price: 2200,
    condition: 'B',
    bikeType: 'mountain',
    brand: 'Canyon',
    model: 'Spectral 125',
    year: 2022,
    frameSize: 'M',
    city: 'Vélez-Málaga',
    photos: ['https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80'],
    sellerName: 'Thomas H.',
    sellerRating: 4.4,
    views: 167,
    favoritesCount: 22,
    createdAt: '2024-12-17',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '10',
    title: 'Bianchi Intenso - Classic Italian Road',
    price: 7500,
    condition: 'A',
    bikeType: 'road',
    brand: 'Bianchi',
    model: 'Intenso',
    year: 2023,
    frameSize: '58cm',
    city: 'Málaga',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'],
    sellerName: 'Roberto F.',
    sellerRating: 5.0,
    views: 389,
    favoritesCount: 55,
    createdAt: '2024-12-24',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '11',
    title: 'Trek FX 3 Disc - Versatile Fitness Bike',
    price: 680,
    condition: 'C',
    bikeType: 'hybrid',
    brand: 'Trek',
    model: 'FX 3 Disc',
    year: 2020,
    frameSize: 'M',
    city: 'Fuengirola',
    photos: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80'],
    sellerName: 'Laura G.',
    sellerRating: 4.3,
    views: 55,
    favoritesCount: 7,
    createdAt: '2024-12-05',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '12',
    title: 'Specialized Turbo Vado SL - Speed Pedelec',
    price: 6800,
    condition: 'A',
    bikeType: 'electric',
    brand: 'Specialized',
    model: 'Turbo Vado SL',
    year: 2023,
    frameSize: 'L',
    city: 'Marbella',
    photos: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    sellerName: 'Chris P.',
    sellerRating: 4.8,
    views: 612,
    favoritesCount: 91,
    createdAt: '2024-12-25',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '13',
    title: 'Giant Escape 3 - City Commuter Ready',
    price: 420,
    condition: 'C',
    bikeType: 'city',
    brand: 'Giant',
    model: 'Escape 3',
    year: 2019,
    frameSize: 'S',
    city: 'Estepona',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'],
    sellerName: 'María J.',
    sellerRating: 4.1,
    views: 43,
    favoritesCount: 5,
    createdAt: '2024-11-28',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '14',
    title: 'Scott Addict RC 10 - Pro Carbon Road',
    price: 5500,
    condition: 'B',
    bikeType: 'road',
    brand: 'Scott',
    model: 'Addict RC 10',
    year: 2022,
    frameSize: '56cm',
    city: 'Benalmádena',
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'],
    sellerName: 'Franz K.',
    sellerRating: 4.7,
    views: 278,
    favoritesCount: 39,
    createdAt: '2024-12-19',
    isNegotiable: false,
    isFeatured: false,
  },
  {
    id: '15',
    title: 'Cannondale Topstone 3 - Gravel Explorer',
    price: 1450,
    condition: 'B',
    bikeType: 'gravel',
    brand: 'Cannondale',
    model: 'Topstone 3',
    year: 2022,
    frameSize: 'M',
    city: 'Torremolinos',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'],
    sellerName: 'Dave S.',
    sellerRating: 4.6,
    views: 134,
    favoritesCount: 20,
    createdAt: '2024-12-13',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '16',
    title: 'Cube Aim SL - Kids Mountain Bike 24"',
    price: 350,
    condition: 'B',
    bikeType: 'kids',
    brand: 'Cube',
    model: 'Aim SL',
    year: 2022,
    frameSize: '24"',
    city: 'Nerja',
    photos: ['https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80'],
    sellerName: 'Emma L.',
    sellerRating: 4.9,
    views: 87,
    favoritesCount: 12,
    createdAt: '2024-12-16',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '17',
    title: 'Trek Marlin 7 - Hard Tail MTB',
    price: 880,
    condition: 'C',
    bikeType: 'mountain',
    brand: 'Trek',
    model: 'Marlin 7',
    year: 2020,
    frameSize: 'L',
    city: 'Mijas',
    photos: ['https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80'],
    sellerName: 'Pablo A.',
    sellerRating: 4.0,
    views: 62,
    favoritesCount: 8,
    createdAt: '2024-12-02',
    isNegotiable: true,
    isFeatured: false,
  },
  {
    id: '18',
    title: 'Tern GSD S10 - Electric Cargo Bike',
    price: 4200,
    condition: 'A',
    bikeType: 'cargo',
    brand: 'Tern',
    model: 'GSD S10',
    year: 2023,
    frameSize: 'One Size',
    city: 'Vélez-Málaga',
    photos: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    sellerName: 'Nina B.',
    sellerRating: 4.8,
    views: 234,
    favoritesCount: 33,
    createdAt: '2024-12-22',
    isNegotiable: false,
    isFeatured: true,
  },
  {
    id: '19',
    title: 'Brompton Electric - Compact Folding',
    price: 2950,
    condition: 'B',
    bikeType: 'folding',
    brand: 'Brompton',
    model: 'Electric',
    year: 2022,
    frameSize: 'One Size',
    city: 'Málaga',
    photos: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80'],
    sellerName: 'Oliver T.',
    sellerRating: 4.7,
    views: 301,
    favoritesCount: 44,
    createdAt: '2024-12-20',
    isNegotiable: false,
    isFeatured: false,
  },
  {
    id: '20',
    title: 'BMX Sunday Blueprint 20" - Street Ready',
    price: 250,
    condition: 'D',
    bikeType: 'bmx',
    brand: 'Sunday',
    model: 'Blueprint',
    year: 2019,
    frameSize: '20"',
    city: 'Fuengirola',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'],
    sellerName: 'Diego M.',
    sellerRating: 3.9,
    views: 38,
    favoritesCount: 4,
    createdAt: '2024-11-20',
    isNegotiable: true,
    isFeatured: false,
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-secondary-800 border border-gray-100 dark:border-secondary-700 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-secondary-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-secondary-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-secondary-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-secondary-700 rounded w-1/3" />
        <div className="h-6 bg-gray-200 dark:bg-secondary-700 rounded w-1/4 mt-2" />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ListingsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')

  const sortFromUrl = (searchParams.get('sort') as SortOption) ?? 'newest'
  const pageFromUrl = Number(searchParams.get('page') ?? '1')

  const filtersFromUrl: FilterState = {
    bikeTypes: searchParams.get('types')?.split(',').filter(Boolean) ?? [],
    conditions: searchParams.get('conditions')?.split(',').filter(Boolean) ?? [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) ?? [],
    priceMin: Number(searchParams.get('priceMin') ?? '0'),
    priceMax: Number(searchParams.get('priceMax') ?? '10000'),
    city: searchParams.get('city') ?? '',
  }

  // Simulate loading
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(t)
  }, [searchParams])

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const handleFilterChange = (filters: FilterState) => {
    updateUrl({
      types: filters.bikeTypes.join(',') || null,
      conditions: filters.conditions.join(',') || null,
      brands: filters.brands.join(',') || null,
      priceMin: filters.priceMin > 0 ? String(filters.priceMin) : null,
      priceMax: filters.priceMax < 10000 ? String(filters.priceMax) : null,
      city: filters.city || null,
    })
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...MOCK_LISTINGS]

    const q = searchParams.get('q')?.toLowerCase() ?? ''
    if (q) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          l.bikeType.toLowerCase().includes(q)
      )
    }

    if (filtersFromUrl.bikeTypes.length > 0) {
      result = result.filter((l) => filtersFromUrl.bikeTypes.includes(l.bikeType))
    }
    if (filtersFromUrl.conditions.length > 0) {
      result = result.filter((l) => filtersFromUrl.conditions.includes(l.condition))
    }
    if (filtersFromUrl.brands.length > 0) {
      result = result.filter((l) => filtersFromUrl.brands.includes(l.brand))
    }
    if (filtersFromUrl.city) {
      result = result.filter((l) =>
        l.city.toLowerCase().includes(filtersFromUrl.city.toLowerCase())
      )
    }
    result = result.filter(
      (l) => l.price >= filtersFromUrl.priceMin && l.price <= filtersFromUrl.priceMax
    )

    switch (sortFromUrl) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'most_viewed':
        result.sort((a, b) => b.views - a.views)
        break
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [searchParams])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((pageFromUrl - 1) * PAGE_SIZE, pageFromUrl * PAGE_SIZE)

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* ── Hero / Search bar ─────────────────────────────── */}
      <div className="bg-secondary dark:bg-secondary-900 border-b border-secondary-700/50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Bikes for Sale</h1>
          <p className="text-white/50 text-sm mb-4">
            {filtered.length} listing{filtered.length !== 1 ? 's' : ''} on Costa del Sol
          </p>
          <SearchBar
            value={searchValue}
            onChange={handleSearch}
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ── Desktop Sidebar ───────────────────────────── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filtersFromUrl}
              onChange={handleFilterChange}
            />
          </aside>

          {/* ── Main Content ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl text-sm text-gray-700 dark:text-white hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(filtersFromUrl.bikeTypes.length + filtersFromUrl.conditions.length + filtersFromUrl.brands.length) > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {filtersFromUrl.bikeTypes.length + filtersFromUrl.conditions.length + filtersFromUrl.brands.length}
                  </span>
                )}
              </button>

              {/* Results count */}
              <p className="text-sm text-gray-500 dark:text-white/50 flex-1">
                <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> results
              </p>

              {/* View on Map */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl text-sm text-gray-700 dark:text-white hover:border-accent-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">View on Map</span>
              </button>

              <SortDropdown value={sortFromUrl} onChange={handleSort} />

              {/* View toggle */}
              <div className="flex items-center bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'p-2.5 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'p-2.5 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  )}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {(filtersFromUrl.bikeTypes.length > 0 ||
              filtersFromUrl.conditions.length > 0 ||
              filtersFromUrl.brands.length > 0 ||
              filtersFromUrl.city ||
              filtersFromUrl.priceMin > 0 ||
              filtersFromUrl.priceMax < 10000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filtersFromUrl.bikeTypes.map((t) => (
                  <FilterChip
                    key={t}
                    label={t}
                    onRemove={() =>
                      handleFilterChange({
                        ...filtersFromUrl,
                        bikeTypes: filtersFromUrl.bikeTypes.filter((x) => x !== t),
                      })
                    }
                  />
                ))}
                {filtersFromUrl.conditions.map((c) => (
                  <FilterChip
                    key={c}
                    label={`Condition ${c}`}
                    onRemove={() =>
                      handleFilterChange({
                        ...filtersFromUrl,
                        conditions: filtersFromUrl.conditions.filter((x) => x !== c),
                      })
                    }
                  />
                ))}
                {filtersFromUrl.brands.map((b) => (
                  <FilterChip
                    key={b}
                    label={b}
                    onRemove={() =>
                      handleFilterChange({
                        ...filtersFromUrl,
                        brands: filtersFromUrl.brands.filter((x) => x !== b),
                      })
                    }
                  />
                ))}
                {filtersFromUrl.city && (
                  <FilterChip
                    label={filtersFromUrl.city}
                    onRemove={() => handleFilterChange({ ...filtersFromUrl, city: '' })}
                  />
                )}
                {(filtersFromUrl.priceMin > 0 || filtersFromUrl.priceMax < 10000) && (
                  <FilterChip
                    label={`€${filtersFromUrl.priceMin} – €${filtersFromUrl.priceMax}`}
                    onRemove={() =>
                      handleFilterChange({ ...filtersFromUrl, priceMin: 0, priceMax: 10000 })
                    }
                  />
                )}
              </div>
            )}

            {/* Grid / List */}
            {isLoading ? (
              <div
                className={clsx(
                  'grid gap-4',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <NoResults onClear={() => handleFilterChange(INITIAL_FILTERS)} />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={clsx(
                  'grid gap-4',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {paginated.map((listing) => (
                  <motion.div key={listing.id} variants={itemVariants}>
                    <ListingCard listing={listing} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={pageFromUrl}
                totalPages={totalPages}
                onPageChange={handlePage}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden overflow-hidden shadow-2xl"
            >
              <FilterSidebar
                filters={filtersFromUrl}
                onChange={(f) => {
                  handleFilterChange(f)
                  setMobileFilterOpen(false)
                }}
                onClose={() => setMobileFilterOpen(false)}
                isMobile
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium capitalize">
      {label}
      <button onClick={onRemove} className="hover:text-primary-700 transition-colors" aria-label={`Remove ${label} filter`}>
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bikes found</h3>
      <p className="text-gray-500 dark:text-white/50 mb-6 max-w-sm">
        Try adjusting your filters or search terms to find what you&apos;re looking for.
      </p>
      <button
        onClick={onClear}
        className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 dark:border-secondary-700 text-gray-600 dark:text-white/60 disabled:opacity-30 hover:border-primary hover:text-primary transition-colors disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-gray-400 dark:text-white/30">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={clsx(
              'w-10 h-10 rounded-xl text-sm font-semibold transition-colors',
              p === currentPage
                ? 'bg-primary text-white'
                : 'border border-gray-200 dark:border-secondary-700 text-gray-600 dark:text-white/60 hover:border-primary hover:text-primary'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 dark:border-secondary-700 text-gray-600 dark:text-white/60 disabled:opacity-30 hover:border-primary hover:text-primary transition-colors disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
