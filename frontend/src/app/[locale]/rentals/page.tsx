'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, MapPin, Calendar, Zap, ChevronDown } from 'lucide-react'
import { RentalCard, type RentalData } from '@/components/rentals/RentalCard'
import { clsx } from 'clsx'

type PricingView = 'daily' | 'weekly' | 'monthly'

const MOCK_RENTALS: RentalData[] = [
  {
    id: 'r1',
    title: 'Trek FX 3 - City Commuter',
    bikeType: 'city',
    brand: 'Trek',
    pricePerDay: 25,
    pricePerWeek: 140,
    pricePerMonth: 350,
    deposit: 100,
    city: 'Málaga',
    instantBook: true,
    ownerName: 'Pedro S.',
    ownerRating: 4.9,
    ownerReviews: 47,
    photo: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
    features: ['Helmet included', 'Lock included', 'Lights', 'Basket'],
    condition: 'A',
    description: 'Perfect city bike for exploring Málaga. Helmet and lock included. Pickup from city center.',
  },
  {
    id: 'r2',
    title: 'Specialized Turbo Como - E-Bike',
    bikeType: 'electric',
    brand: 'Specialized',
    pricePerDay: 65,
    pricePerWeek: 350,
    pricePerMonth: 900,
    deposit: 300,
    city: 'Marbella',
    instantBook: true,
    ownerName: 'Sarah K.',
    ownerRating: 5.0,
    ownerReviews: 31,
    photo: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
    features: ['Helmet included', 'Phone mount', 'Charger', '70km range'],
    condition: 'A',
    description: 'Premium e-bike perfect for coastal rides. 70km range per charge. Delivery available.',
  },
  {
    id: 'r3',
    title: 'Scott Aspect 940 - Trail MTB',
    bikeType: 'mountain',
    brand: 'Scott',
    pricePerDay: 45,
    pricePerWeek: 240,
    pricePerMonth: 600,
    deposit: 200,
    city: 'Ronda',
    instantBook: false,
    ownerName: 'Carlos M.',
    ownerRating: 4.7,
    ownerReviews: 23,
    photo: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80',
    features: ['Helmet included', 'Gloves', 'Repair kit', 'Lights'],
    condition: 'A',
    description: 'Rugged trail bike for the hills around Ronda. Full suspension, hydraulic brakes. Perfect for beginners and intermediate riders.',
  },
  {
    id: 'r4',
    title: 'Cannondale CAAD13 - Road Rocket',
    bikeType: 'road',
    brand: 'Cannondale',
    pricePerDay: 55,
    pricePerWeek: 290,
    pricePerMonth: 750,
    deposit: 250,
    city: 'Torremolinos',
    instantBook: true,
    ownerName: 'Hans B.',
    ownerRating: 4.8,
    ownerReviews: 62,
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    features: ['Helmet included', 'Cycling shoes', 'Cycling jersey', 'Lock included'],
    condition: 'A',
    description: 'High-performance aluminum road bike. Ideal for the coastal route from Torremolinos to Málaga.',
  },
  {
    id: 'r5',
    title: 'Bianchi Orso - Gravel Adventure',
    bikeType: 'gravel',
    brand: 'Bianchi',
    pricePerDay: 50,
    pricePerWeek: 270,
    pricePerMonth: 680,
    deposit: 220,
    city: 'Nerja',
    instantBook: true,
    ownerName: 'Maria L.',
    ownerRating: 4.9,
    ownerReviews: 18,
    photo: 'https://images.unsplash.com/photo-1606206873764-fd15e242ea52?w=800&q=80',
    features: ['Helmet included', 'Panniers', 'Phone mount', 'Repair kit'],
    condition: 'A',
    description: 'Versatile gravel bike perfect for mixed terrain around Nerja. Explore dirt roads and coastal paths alike.',
  },
  {
    id: 'r6',
    title: 'Brompton M6L - Folding City',
    bikeType: 'city',
    brand: 'Brompton',
    pricePerDay: 30,
    pricePerWeek: 160,
    pricePerMonth: 400,
    deposit: 150,
    city: 'Estepona',
    instantBook: false,
    ownerName: 'Ana P.',
    ownerRating: 4.6,
    ownerReviews: 14,
    photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    features: ['Helmet included', 'Carry bag', 'Lights', 'Lock included'],
    condition: 'A',
    description: 'Iconic British folding bike. Perfect for combining with public transport or storing in your apartment.',
  },
  {
    id: 'r7',
    title: 'Cube Kathmandu Hybrid - E-Trekking',
    bikeType: 'electric',
    brand: 'Cube',
    pricePerDay: 70,
    pricePerWeek: 380,
    pricePerMonth: 980,
    deposit: 350,
    city: 'Fuengirola',
    instantBook: true,
    ownerName: 'Dirk V.',
    ownerRating: 4.8,
    ownerReviews: 39,
    photo: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
    features: ['Helmet included', 'Pannier rack', 'Charger', '120km range'],
    condition: 'A',
    description: 'Long-range e-trekking bike. The 120km battery range lets you explore the entire Costa del Sol in a day.',
  },
  {
    id: 'r8',
    title: 'Giant Cypress DX - Hybrid Comfort',
    bikeType: 'hybrid',
    brand: 'Giant',
    pricePerDay: 22,
    pricePerWeek: 120,
    pricePerMonth: 280,
    deposit: 80,
    city: 'Mijas',
    instantBook: true,
    ownerName: 'Luisa G.',
    ownerRating: 4.7,
    ownerReviews: 55,
    photo: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
    features: ['Helmet included', 'Basket', 'Lights', 'Lock included'],
    condition: 'A',
    description: 'Super comfortable hybrid with upright riding position. Great for relaxed rides along the seafront promenade.',
  },
]

const BIKE_TYPES = ['All', 'city', 'electric', 'mountain', 'road', 'gravel', 'hybrid']
const CITIES = ['All', 'Málaga', 'Marbella', 'Ronda', 'Torremolinos', 'Nerja', 'Estepona', 'Fuengirola', 'Mijas']

export default function RentalsPage() {
  const [pricingView, setPricingView] = useState<PricingView>('daily')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [maxPrice, setMaxPrice] = useState(150)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [instantOnly, setInstantOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_RENTALS.filter((r) => {
      if (selectedType !== 'All' && r.bikeType !== selectedType) return false
      if (selectedCity !== 'All' && r.city !== selectedCity) return false
      if (instantOnly && !r.instantBook) return false
      const price = pricingView === 'daily' ? r.pricePerDay : pricingView === 'weekly' ? r.pricePerWeek : r.pricePerMonth
      if (price > maxPrice) return false
      return true
    })
  }, [selectedType, selectedCity, instantOnly, maxPrice, pricingView])

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-orange-400" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&q=60')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary-900/80" />

        <div className="relative container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/30">
              <Zap className="w-4 h-4" />
              Instant booking available
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Rent a Bike in
              <br />
              <span className="text-white/90">Costa del Sol</span>
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
              Explore the sun-soaked coast on two wheels. Premium bikes from local owners — city cruisers, e-bikes, mountain, and road bikes.
            </p>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">200+</p>
                <p className="text-sm">Bikes available</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-sm">Cities covered</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.8★</p>
                <p className="text-sm">Average rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-0 z-30 bg-secondary-800/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Bike type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-secondary-700 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-primary-500/50 cursor-pointer"
              >
                {BIKE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-secondary-700 capitalize">
                    {t === 'All' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* City */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-secondary-700 border border-white/10 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-primary-500/50 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-secondary-700">
                    {c === 'All' ? 'All cities' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2 bg-secondary-700 border border-white/10 rounded-xl px-3 py-1.5">
              <Calendar className="w-4 h-4 text-accent-400 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none w-32"
                placeholder="From"
              />
              <span className="text-white/30">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none w-32"
                placeholder="To"
              />
            </div>

            {/* Pricing toggle */}
            <div className="flex gap-1 bg-secondary-700 rounded-xl p-1 border border-white/10">
              {(['daily', 'weekly', 'monthly'] as PricingView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setPricingView(v)}
                  className={clsx(
                    'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 capitalize',
                    pricingView === v
                      ? 'bg-primary-500 text-white'
                      : 'text-white/50 hover:text-white'
                  )}
                >
                  {v === 'daily' ? 'Daily' : v === 'weekly' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>

            {/* Instant book toggle */}
            <button
              onClick={() => setInstantOnly(!instantOnly)}
              className={clsx(
                'flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200',
                instantOnly
                  ? 'bg-accent-500/20 border-accent-500/40 text-accent-400'
                  : 'bg-secondary-700 border-white/10 text-white/60 hover:text-white'
              )}
            >
              <Zap className={clsx('w-4 h-4', instantOnly ? 'fill-current' : '')} />
              Instant Book
            </button>

            {/* Results count */}
            <div className="ml-auto text-white/40 text-sm">
              {filtered.length} bike{filtered.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🚲</p>
            <h3 className="text-white font-bold text-xl mb-2">No bikes found</h3>
            <p className="text-white/50">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rental, i) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <RentalCard rental={rental} pricingView={pricingView} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
