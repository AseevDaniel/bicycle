'use client'

import { useState } from 'react'
import { Heart, MapPin, Eye, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export interface ListingCardData {
  id: string
  title: string
  price: number
  condition: 'A' | 'B' | 'C' | 'D'
  bikeType: string
  brand: string
  model: string
  year: number
  frameSize: string
  city: string
  photos: string[]
  sellerName: string
  sellerRating: number
  views: number
  favoritesCount: number
  createdAt: string
  isNegotiable: boolean
  isFeatured: boolean
}

const conditionStyles: Record<string, string> = {
  A: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  B: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  C: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
  D: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30',
}

const conditionLabels: Record<string, string> = {
  A: 'Like New',
  B: 'Excellent',
  C: 'Good',
  D: 'Fair',
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

interface ListingCardProps {
  listing: ListingCardData
  viewMode?: 'grid' | 'list'
}

export function ListingCard({ listing, viewMode = 'grid' }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imgError, setImgError] = useState(false)
  const params = useParams()
  const locale = params?.locale as string | undefined

  const photo =
    listing.photos[0] ||
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'

  const href = locale ? `/${locale}/listings/${listing.id}` : `/listings/${listing.id}`

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        whileHover={{ y: -2 }}
        className="group bg-white dark:bg-secondary-800 border border-gray-100 dark:border-secondary-700 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        <Link href={href} className="flex gap-4 p-4">
          <div className="relative w-36 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-secondary-700">
            {!imgError ? (
              <img
                src={photo}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🚲</div>
            )}
            {listing.isFeatured && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                ★ Featured
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-0.5">
                  {listing.brand} · {listing.year} · {listing.frameSize}
                </p>
              </div>
              <span className="text-xl font-bold text-primary whitespace-nowrap">
                €{listing.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', conditionStyles[listing.condition])}>
                {conditionLabels[listing.condition]}
              </span>
              <span className="text-xs text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-secondary-700 px-2 py-0.5 rounded-full capitalize">
                {listing.bikeType}
              </span>
              {listing.isNegotiable && (
                <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">Negotiable</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/40">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent-500" />
                  {listing.city}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {listing.views}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {listing.sellerRating.toFixed(1)}
                </span>
                <span>{timeAgo(listing.createdAt)}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorited(!isFavorited)
                }}
                className={clsx(
                  'p-1.5 rounded-full transition-all duration-200',
                  isFavorited
                    ? 'text-red-500 bg-red-50 dark:bg-red-500/10'
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                )}
                aria-label="Toggle favorite"
              >
                <Heart className={clsx('w-4 h-4', isFavorited && 'fill-current')} />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-secondary-800 border border-gray-100 dark:border-secondary-700 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <Link href={href} className="block">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-secondary-700">
          {!imgError ? (
            <img
              src={photo}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-secondary-700 dark:to-secondary-900">
              <span className="text-6xl">🚲</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm', conditionStyles[listing.condition])}>
              {conditionLabels[listing.condition]}
            </span>
            {listing.isFeatured && (
              <span className="bg-gradient-to-r from-primary to-primary-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ★ Featured
              </span>
            )}
          </div>

          {/* Bike type badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/50 backdrop-blur-sm text-white/90 text-xs font-medium px-2 py-0.5 rounded-full capitalize">
              {listing.bikeType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-1">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 dark:text-white/50 text-sm mb-2">
            <span className="font-medium text-gray-600 dark:text-white/70">{listing.brand}</span>
            <span>·</span>
            <span>{listing.year}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 dark:text-white/40 text-sm mb-4">
            <MapPin className="w-3.5 h-3.5 text-accent-500" />
            <span>{listing.city}</span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                €{listing.price.toLocaleString()}
              </span>
              {listing.isNegotiable && (
                <span className="text-xs text-gray-400 dark:text-white/40 ml-1.5">negotiable</span>
              )}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-secondary-700 text-xs text-gray-400 dark:text-white/40">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {listing.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {listing.favoritesCount}
            </span>
            <span className="ml-auto">{timeAgo(listing.createdAt)}</span>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className={clsx(
          'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
          isFavorited
            ? 'bg-red-500 text-white scale-110'
            : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
        )}
        aria-label="Toggle favorite"
      >
        <Heart className={clsx('w-4 h-4', isFavorited && 'fill-current')} />
      </button>
    </motion.div>
  )
}
