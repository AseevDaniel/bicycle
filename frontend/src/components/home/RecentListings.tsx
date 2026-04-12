'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ListingCard, ListingCardProps } from '@/components/ui/ListingCard'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

const MOCK_RECENT: ListingCardProps[] = [
  {
    id: 'r1',
    title: 'Scott Scale 940 Hardtail MTB',
    price: 890,
    condition: 'B',
    bikeType: 'Mountain',
    brand: 'Scott',
    year: 2021,
    city: 'Malaga',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80'],
    sellerRating: 4.5,
    isNegotiable: true,
  },
  {
    id: 'r2',
    title: 'Orbea Orca M30 Road',
    price: 1600,
    condition: 'A',
    bikeType: 'Road',
    brand: 'Orbea',
    year: 2022,
    city: 'Benalmadena',
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'],
    sellerRating: 4.8,
    isNegotiable: false,
  },
  {
    id: 'r3',
    title: 'Cube Nuroad EX Gravel',
    price: 1100,
    condition: 'B',
    bikeType: 'Gravel',
    brand: 'Cube',
    year: 2022,
    city: 'Marbella',
    photos: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80'],
    sellerRating: 4.6,
    isNegotiable: true,
  },
  {
    id: 'r4',
    title: 'Gazelle Ultimate T10 HMB E-bike',
    price: 3200,
    condition: 'A',
    bikeType: 'Electric',
    brand: 'Gazelle',
    year: 2023,
    city: 'Torremolinos',
    photos: ['https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80'],
    sellerRating: 4.9,
    isFeatured: true,
    isNegotiable: false,
  },
  {
    id: 'r5',
    title: 'Pinarello Paris Carbon Road',
    price: 2400,
    condition: 'B',
    bikeType: 'Road',
    brand: 'Pinarello',
    year: 2021,
    city: 'Estepona',
    photos: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80'],
    sellerRating: 4.7,
    isNegotiable: true,
  },
  {
    id: 'r6',
    title: 'Dahon Mariner D8 Folding',
    price: 420,
    condition: 'C',
    bikeType: 'Folding',
    brand: 'Dahon',
    year: 2020,
    city: 'Fuengirola',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80'],
    sellerRating: 4.3,
    isNegotiable: true,
  },
  {
    id: 'r7',
    title: 'Trek Marlin 7 Mountain Bike',
    price: 650,
    condition: 'B',
    bikeType: 'Mountain',
    brand: 'Trek',
    year: 2022,
    city: 'Nerja',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80'],
    sellerRating: 4.4,
    isNegotiable: false,
  },
  {
    id: 'r8',
    title: 'Cervelo Caledonia-5 Gravel',
    price: 3800,
    condition: 'A',
    bikeType: 'Gravel',
    brand: 'Cervelo',
    year: 2023,
    city: 'Marbella',
    photos: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80'],
    sellerRating: 5.0,
    isFeatured: true,
    isNegotiable: false,
  },
]

export function RecentListings() {
  const [listings] = useState<ListingCardProps[]>(MOCK_RECENT)
  const scrollRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-20 bg-white dark:bg-secondary-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-accent-500 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest">
              Just Listed
            </span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Recent Listings</h2>
            <p className="text-gray-500 dark:text-white/50 mt-1">Fresh bikes just added to the marketplace</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/50 text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/50 text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href={`/${locale}/listings?sort=newest`}
              className="hidden sm:flex items-center gap-2 text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 font-semibold transition-colors group"
            >
              See All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex-shrink-0 w-72 snap-start"
            >
              <ListingCard {...listing} />
            </motion.div>
          ))}

          {/* See more card */}
          <div className="flex-shrink-0 w-72 snap-start">
            <Link
              href={`/${locale}/listings?sort=newest`}
              className="flex flex-col items-center justify-center h-full min-h-[320px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all duration-300 group p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-500/30 transition-colors">
                <ArrowRight className="w-8 h-8 text-primary-500 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-lg">View All Recent</p>
              <p className="text-gray-400 dark:text-white/40 text-sm mt-1">847 bikes available</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
