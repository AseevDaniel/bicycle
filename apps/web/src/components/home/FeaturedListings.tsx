'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ListingCard, ListingCardProps } from '@/components/ui/ListingCard'
import { ArrowRight } from 'lucide-react'

const MOCK_LISTINGS: ListingCardProps[] = [
  {
    id: '1',
    title: 'Trek Domane SL 6 Road Bike',
    price: 2800,
    condition: 'A',
    bikeType: 'Road',
    brand: 'Trek',
    year: 2023,
    city: 'Marbella',
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'],
    sellerRating: 4.9,
    isFeatured: true,
    isNegotiable: false,
  },
  {
    id: '2',
    title: 'Specialized Stumpjumper EVO',
    price: 3200,
    condition: 'B',
    bikeType: 'Mountain',
    brand: 'Specialized',
    year: 2022,
    city: 'Malaga',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80'],
    sellerRating: 4.7,
    isFeatured: true,
    isNegotiable: true,
  },
  {
    id: '3',
    title: 'Cannondale Topstone Carbon',
    price: 1950,
    condition: 'A',
    bikeType: 'Gravel',
    brand: 'Cannondale',
    year: 2023,
    city: 'Estepona',
    photos: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80'],
    sellerRating: 5.0,
    isFeatured: false,
    isNegotiable: false,
  },
  {
    id: '4',
    title: 'Riese & Müller Supercharger 3',
    price: 5400,
    condition: 'A',
    bikeType: 'Electric',
    brand: 'Riese & Müller',
    year: 2023,
    city: 'Fuengirola',
    photos: ['https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80'],
    sellerRating: 4.8,
    isFeatured: true,
    isNegotiable: false,
  },
  {
    id: '5',
    title: 'Giant Revolt Advanced Pro',
    price: 2100,
    condition: 'B',
    bikeType: 'Gravel',
    brand: 'Giant',
    year: 2022,
    city: 'Torremolinos',
    photos: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80'],
    sellerRating: 4.6,
    isFeatured: false,
    isNegotiable: true,
  },
  {
    id: '6',
    title: 'Brompton C Line Explore',
    price: 1400,
    condition: 'A',
    bikeType: 'Folding',
    brand: 'Brompton',
    year: 2023,
    city: 'Nerja',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80'],
    sellerRating: 4.9,
    isFeatured: false,
    isNegotiable: false,
  },
]

function SkeletonCard() {
  return (
    <div className="bg-secondary-500/40 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-white/5 rounded-lg w-3/4" />
        <div className="h-4 bg-white/5 rounded-lg w-1/2" />
        <div className="h-4 bg-white/5 rounded-lg w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-white/5 rounded-lg w-24" />
          <div className="h-9 bg-white/5 rounded-xl w-20" />
        </div>
      </div>
    </div>
  )
}

export function FeaturedListings() {
  const [listings, setListings] = useState<ListingCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:4000/v1/listings/featured', {
          signal: AbortSignal.timeout(3000),
        })
        if (!res.ok) throw new Error('API unavailable')
        const data = await res.json()
        setListings(data.listings || MOCK_LISTINGS)
      } catch {
        setListings(MOCK_LISTINGS)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-secondary-900 to-secondary-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest">
              Hand-picked
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2">
              Featured Listings
            </h2>
            <p className="text-white/50 mt-2 text-lg">
              Premium bikes from verified sellers across Costa del Sol
            </p>
          </div>
          <a
            href="/listings?featured=true"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors group whitespace-nowrap"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ListingCard {...listing} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
