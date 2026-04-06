'use client'

import { useState } from 'react'
import { Heart, MapPin, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Badge } from './Badge'
import { clsx } from 'clsx'

export interface ListingCardProps {
  id: string
  title: string
  price: number
  condition: 'A' | 'B' | 'C' | 'D'
  bikeType: string
  brand: string
  year: number
  city: string
  photos: string[]
  sellerRating: number
  isFeatured?: boolean
  isNegotiable?: boolean
  isRental?: boolean
  rentalPrice?: number
}

export function ListingCard({
  id,
  title,
  price,
  condition,
  bikeType,
  brand,
  year,
  city,
  photos,
  sellerRating,
  isFeatured,
  isNegotiable,
  isRental,
  rentalPrice,
}: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imgError, setImgError] = useState(false)
  const locale = useLocale()

  const photo = photos[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'

  return (
    <div className="group relative bg-white border border-gray-200 dark:bg-secondary-500/40 dark:backdrop-blur-sm dark:border-white/10 rounded-2xl overflow-hidden hover:border-primary-400 dark:hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1">
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-secondary-700">
        {!imgError ? (
          <img
            src={photo}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-secondary-600 dark:to-secondary-800">
            <span className="text-6xl">🚲</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-secondary-900/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="condition" condition={condition} />
          {isFeatured && <Badge variant="featured">⭐ Featured</Badge>}
        </div>

        {/* Favorite */}
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

        {/* Bike type badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="type">{bikeType}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-gray-400 dark:text-white/50 text-sm mb-3">
          <span className="font-medium text-gray-600 dark:text-white/70">{brand}</span>
          <span>•</span>
          <span>{year}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-600 dark:text-white/70">{sellerRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 dark:text-white/50 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 text-accent-500 dark:text-accent-400" />
          <span>{city}</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-500 dark:text-primary-400">
              €{price.toLocaleString()}
            </span>
            {isNegotiable && (
              <span className="text-xs text-gray-400 dark:text-white/40 ml-1.5">negotiable</span>
            )}
            {isRental && rentalPrice && (
              <div className="text-xs text-accent-500 dark:text-accent-400 mt-0.5">€{rentalPrice}/day rental</div>
            )}
          </div>

          <Link
            href={`/${locale}/listings/${id}`}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
