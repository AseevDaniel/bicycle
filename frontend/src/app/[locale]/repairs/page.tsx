'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Wrench, MapPin, ChevronDown, Truck, Star } from 'lucide-react'
import { MechanicCard, type MechanicData } from '@/components/repairs/MechanicCard'
import { clsx } from 'clsx'

const MOCK_MECHANICS: MechanicData[] = [
  {
    id: 'm1',
    name: 'Miguel Torres',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Certified Shimano mechanic with 15 years experience. Specializing in road bikes and e-bikes. Former professional cyclist turned full-time wrench.',
    specialties: ['Road', 'E-bike', 'Shimano certified'],
    rating: 4.9,
    reviewCount: 87,
    city: 'Málaga',
    isMobile: true,
    priceRange: { min: 30, max: 120 },
    responseTime: '< 2 hours',
    languages: ['es', 'en'],
    services: [
      { id: 's1', name: 'Full Tune-Up', price: 65, duration: '2-3 hours', category: 'maintenance' },
      { id: 's2', name: 'Brake Adjustment', price: 25, duration: '30 min', category: 'repair' },
      { id: 's3', name: 'Drivetrain Service', price: 45, duration: '1.5 hours', category: 'maintenance' },
      { id: 's4', name: 'Wheel Truing', price: 20, duration: '30 min', category: 'repair' },
    ],
  },
  {
    id: 'm2',
    name: 'Lena Hoffmann',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'German-trained bicycle technician with a passion for mountain bikes and suspension setup. 10 years in the industry. Workshop based in Marbella.',
    specialties: ['MTB', 'Suspension', 'SRAM certified'],
    rating: 4.8,
    reviewCount: 53,
    city: 'Marbella',
    isMobile: false,
    priceRange: { min: 35, max: 150 },
    responseTime: '< 4 hours',
    languages: ['de', 'en', 'es'],
    services: [
      { id: 's1', name: 'Suspension Service (fork)', price: 80, duration: '3-4 hours', category: 'maintenance' },
      { id: 's2', name: 'Full Tune-Up', price: 70, duration: '2-3 hours', category: 'maintenance' },
      { id: 's3', name: 'Tyre Change (pair)', price: 35, duration: '45 min', category: 'repair' },
      { id: 's4', name: 'Hydraulic Brake Bleed', price: 45, duration: '1 hour', category: 'repair' },
    ],
  },
  {
    id: 'm3',
    name: 'Andrés Vega',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'E-bike specialist and Bosch certified technician. Based in Torremolinos, mobile service available along the coast from Málaga to Estepona.',
    specialties: ['E-bike', 'Bosch certified', 'Cargo bikes'],
    rating: 4.7,
    reviewCount: 41,
    city: 'Torremolinos',
    isMobile: true,
    priceRange: { min: 40, max: 130 },
    responseTime: '< 3 hours',
    languages: ['es', 'en'],
    services: [
      { id: 's1', name: 'E-bike Diagnostics', price: 40, duration: '1 hour', category: 'repair' },
      { id: 's2', name: 'Battery Health Check', price: 30, duration: '30 min', category: 'maintenance' },
      { id: 's3', name: 'Motor Service', price: 90, duration: '3 hours', category: 'maintenance' },
      { id: 's4', name: 'Cable & Housing Set', price: 50, duration: '1.5 hours', category: 'repair' },
    ],
  },
  {
    id: 'm4',
    name: 'Tom Richardson',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'British-born ex-racer with a passion for road and gravel bikes. Precision cable routing and custom builds are my specialty. Workshop in Fuengirola.',
    specialties: ['Road', 'Gravel', 'Custom builds'],
    rating: 5.0,
    reviewCount: 29,
    city: 'Fuengirola',
    isMobile: false,
    priceRange: { min: 30, max: 140 },
    responseTime: '< 2 hours',
    languages: ['en', 'es'],
    services: [
      { id: 's1', name: 'Race-Ready Setup', price: 90, duration: '3-4 hours', category: 'maintenance' },
      { id: 's2', name: 'Fit Consultation', price: 60, duration: '1 hour', category: 'maintenance' },
      { id: 's3', name: 'Custom Cable Routing', price: 70, duration: '2 hours', category: 'repair' },
      { id: 's4', name: 'Bearing Overhaul', price: 55, duration: '2 hours', category: 'maintenance' },
    ],
  },
  {
    id: 'm5',
    name: 'Fatima El Amrani',
    avatar: 'https://i.pravatar.cc/150?img=45',
    bio: 'Versatile mechanic handling everything from city bikes to full-suspension MTB. Friendly, affordable, and always on time. Serving Nerja and surroundings.',
    specialties: ['City', 'MTB', 'Kids bikes'],
    rating: 4.6,
    reviewCount: 68,
    city: 'Nerja',
    isMobile: true,
    priceRange: { min: 20, max: 90 },
    responseTime: '< 5 hours',
    languages: ['es', 'fr', 'en'],
    services: [
      { id: 's1', name: 'Basic Service', price: 35, duration: '1 hour', category: 'maintenance' },
      { id: 's2', name: 'Puncture Repair', price: 20, duration: '30 min', category: 'repair' },
      { id: 's3', name: 'Gear Indexing', price: 25, duration: '45 min', category: 'repair' },
      { id: 's4', name: 'Full Tune-Up', price: 60, duration: '2 hours', category: 'maintenance' },
    ],
  },
  {
    id: 'm6',
    name: 'Pavel Novák',
    avatar: 'https://i.pravatar.cc/150?img=17',
    bio: 'Czech mechanic specializing in touring and long-distance setups. Expert in rack, fender, and luggage system installation. Workshop in Estepona.',
    specialties: ['Touring', 'Road', 'Fitting'],
    rating: 4.8,
    reviewCount: 22,
    city: 'Estepona',
    isMobile: false,
    priceRange: { min: 30, max: 110 },
    responseTime: '< 6 hours',
    languages: ['en', 'de', 'ru'],
    services: [
      { id: 's1', name: 'Touring Setup', price: 80, duration: '3 hours', category: 'maintenance' },
      { id: 's2', name: 'Rack & Fender Install', price: 45, duration: '1.5 hours', category: 'repair' },
      { id: 's3', name: 'Full Tune-Up', price: 65, duration: '2-3 hours', category: 'maintenance' },
      { id: 's4', name: 'Headset Service', price: 40, duration: '1 hour', category: 'maintenance' },
    ],
  },
]

const CITIES = ['All', 'Málaga', 'Marbella', 'Torremolinos', 'Fuengirola', 'Nerja', 'Estepona']
const SPECIALTIES = ['All', 'Road', 'MTB', 'E-bike', 'City', 'Gravel', 'Touring']
const SERVICE_TYPES = ['All', 'maintenance', 'repair']

export default function RepairsPage() {
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [selectedServiceType, setSelectedServiceType] = useState('All')
  const [mobileOnly, setMobileOnly] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_MECHANICS.filter((m) => {
      if (selectedCity !== 'All' && m.city !== selectedCity) return false
      if (selectedSpecialty !== 'All' && !m.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) return false
      if (selectedServiceType !== 'All' && !m.services.some((s) => s.category === selectedServiceType)) return false
      if (mobileOnly && !m.isMobile) return false
      return true
    })
  }, [selectedCity, selectedSpecialty, selectedServiceType, mobileOnly])

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=1600&q=50')] bg-cover bg-center opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary-900 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="relative container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/30 mb-6">
              <Wrench className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Expert Bike Mechanics
              <br />
              <span className="text-gradient">Near You</span>
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto mb-8">
              Professional bicycle mechanics across Costa del Sol. From quick adjustments to full overhauls — mobile service available.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-sm">Certified mechanics</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-sm">Mobile mechanics</p>
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

            {/* Specialty */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none bg-secondary-700 border border-white/10 text-white text-sm rounded-xl px-4 pr-8 py-2.5 focus:outline-none focus:border-primary-500/50 cursor-pointer"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s} className="bg-secondary-700">
                    {s === 'All' ? 'All specialties' : s}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Service type */}
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="appearance-none bg-secondary-700 border border-white/10 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-primary-500/50 cursor-pointer"
              >
                {SERVICE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-secondary-700 capitalize">
                    {t === 'All' ? 'All services' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOnly(!mobileOnly)}
              className={clsx(
                'flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200',
                mobileOnly
                  ? 'bg-accent-500/20 border-accent-500/40 text-accent-400'
                  : 'bg-secondary-700 border-white/10 text-white/60 hover:text-white'
              )}
            >
              <Truck className="w-4 h-4" />
              Mobile Only
            </button>

            <div className="ml-auto text-white/40 text-sm">
              {filtered.length} mechanic{filtered.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔧</p>
            <h3 className="text-white font-bold text-xl mb-2">No mechanics found</h3>
            <p className="text-white/50">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((mechanic, i) => (
              <motion.div
                key={mechanic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <MechanicCard mechanic={mechanic} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-white/10 rounded-2xl p-8 text-center"
        >
          <Wrench className="w-10 h-10 text-primary-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-2xl mb-2">Are you a bike mechanic?</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Join BiciMarket and connect with cyclists who need your expertise across Costa del Sol.
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            List Your Services
          </button>
        </motion.div>
      </section>
    </div>
  )
}
