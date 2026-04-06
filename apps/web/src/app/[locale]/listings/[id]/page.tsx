'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Star,
  Eye,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  Shield,
  ZoomIn,
  Home,
  ChevronRight as Chevron,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ListingCard, type ListingCardData } from '@/components/listings/ListingCard'

// ─── Full Mock Data ───────────────────────────────────────────────────────────

interface FullListing extends ListingCardData {
  frameMaterial: string
  color: string
  weight?: string
  lat: number
  lng: number
  sellerAvatar: string
  sellerReviews: number
  description: string
}

const FULL_LISTINGS: FullListing[] = [
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
    frameMaterial: 'Carbon',
    color: 'Matte Black',
    weight: '7.8 kg',
    photos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
    ],
    city: 'Málaga',
    lat: 36.7196,
    lng: -4.42,
    sellerName: 'Carlos M.',
    sellerAvatar: 'https://i.pravatar.cc/80?img=1',
    sellerRating: 4.9,
    sellerReviews: 23,
    views: 142,
    favoritesCount: 18,
    createdAt: '2024-12-15',
    isNegotiable: false,
    isFeatured: true,
    description:
      'Selling my Trek Domane SL 6 after upgrading to a newer model. Carbon frame with Shimano 105 groupset and hydraulic disc brakes. Serviced 3 months ago at Trek official dealer. Perfect for road cycling along Costa del Sol. Minor scratches on chainstay, otherwise in excellent condition. Includes original packaging and all accessories.',
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
    frameMaterial: 'Aluminum',
    color: 'Forest Green',
    weight: '13.2 kg',
    photos: [
      'https://images.unsplash.com/photo-1619731454956-d9f57b0e3d48?w=800&q=80',
      'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80',
    ],
    city: 'Marbella',
    lat: 36.5101,
    lng: -4.8825,
    sellerName: 'James W.',
    sellerAvatar: 'https://i.pravatar.cc/80?img=2',
    sellerRating: 4.7,
    sellerReviews: 11,
    views: 89,
    favoritesCount: 24,
    createdAt: '2024-12-20',
    isNegotiable: true,
    isFeatured: true,
    description:
      'Nearly new Stumpjumper Comp. British expat moving back to UK. 29er, 130mm travel, SRAM NX Eagle drivetrain. Only 200km ridden. Comes with pedals and extra set of brake pads. This bike is in showroom condition.',
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
    frameMaterial: 'Aluminum',
    color: 'Metallic Blue',
    weight: '9.4 kg',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'],
    city: 'Fuengirola',
    lat: 36.5376,
    lng: -4.6257,
    sellerName: 'Ana López',
    sellerAvatar: 'https://i.pravatar.cc/80?img=5',
    sellerRating: 4.5,
    sellerReviews: 8,
    views: 203,
    favoritesCount: 31,
    createdAt: '2024-12-18',
    isNegotiable: true,
    isFeatured: false,
    description:
      'Great all-rounder for city commuting and light off-road use. Hydraulic disc brakes, Shimano Tiagra groupset. Used daily for 18 months, well maintained and regularly serviced.',
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
    frameMaterial: 'Carbon',
    color: 'Jet Black',
    weight: '7.1 kg',
    photos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'],
    city: 'Estepona',
    lat: 36.4297,
    lng: -5.1467,
    sellerName: 'Michael B.',
    sellerAvatar: 'https://i.pravatar.cc/80?img=3',
    sellerRating: 5.0,
    sellerReviews: 31,
    views: 317,
    favoritesCount: 47,
    createdAt: '2024-12-22',
    isNegotiable: false,
    isFeatured: true,
    description:
      'Top-of-the-range Synapse Carbon. Race geometry, Shimano Ultegra Di2 electronic shifting. Barely used - only 500km. Selling due to health reasons. Full warranty still valid.',
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
    frameMaterial: 'Aluminum',
    color: 'Grey & Black',
    weight: '22.5 kg',
    photos: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    city: 'Torremolinos',
    lat: 36.622,
    lng: -4.4997,
    sellerName: 'Ingrid S.',
    sellerAvatar: 'https://i.pravatar.cc/80?img=9',
    sellerRating: 4.8,
    sellerReviews: 17,
    views: 445,
    favoritesCount: 62,
    createdAt: '2024-12-23',
    isNegotiable: false,
    isFeatured: true,
    description:
      'Powerful Bosch Performance Line CX motor, 625Wh battery with 120km range. Hydraulic disc brakes, integrated lighting, rear carrier. Moving country, need to sell quickly. Full service history.',
  },
]

// Fallback listing for IDs not in the full list
const SIMILAR_LISTINGS: ListingCardData[] = [
  {
    id: '5',
    title: 'Scott Scale 940 - Trail MTB',
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
]

const conditionLabels: Record<string, string> = {
  A: 'Like New',
  B: 'Excellent',
  C: 'Good',
  D: 'Fair',
}

const conditionStyles: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  D: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
}

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '9', '17'].map((id) => ({ id }))
}

export default function ListingDetailPage() {
  const params = useParams()
  const id = params.id as string
  const locale = params.locale as string

  const listing = FULL_LISTINGS.find((l) => l.id === id) ?? FULL_LISTINGS[0]

  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const photos = listing.photos.length > 0 ? listing.photos : [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
  ]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const prevPhoto = () =>
    setActivePhoto((p) => (p === 0 ? photos.length - 1 : p - 1))
  const nextPhoto = () =>
    setActivePhoto((p) => (p === photos.length - 1 ? 0 : p + 1))
  const prevLightbox = () =>
    setLightboxIndex((p) => (p === 0 ? photos.length - 1 : p - 1))
  const nextLightbox = () =>
    setLightboxIndex((p) => (p === photos.length - 1 ? 0 : p + 1))

  const specs = [
    { label: 'Bike Type', value: listing.bikeType, capitalize: true },
    { label: 'Brand', value: listing.brand },
    { label: 'Model', value: listing.model },
    { label: 'Year', value: String(listing.year) },
    { label: 'Condition', value: `${listing.condition} – ${conditionLabels[listing.condition]}` },
    { label: 'Frame Size', value: listing.frameSize },
    { label: 'Frame Material', value: listing.frameMaterial },
    { label: 'Color', value: listing.color },
    ...(listing.weight ? [{ label: 'Weight', value: listing.weight }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-secondary-800 border-b border-gray-100 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/40">
            <Link href={`/${locale}`} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <Chevron className="w-3.5 h-3.5" />
            <Link href={`/${locale}/listings`} className="hover:text-primary transition-colors">
              Bikes for Sale
            </Link>
            <Chevron className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column: Photos + Details ─────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-secondary-700">
              {/* Main Photo */}
              <div className="relative aspect-[16/10] bg-gray-100 dark:bg-secondary-700 group cursor-pointer">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto}
                    src={photos[activePhoto]}
                    alt={listing.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                    onClick={() => openLightbox(activePhoto)}
                  />
                </AnimatePresence>

                {/* Zoom hint */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {/* Featured badge */}
                {listing.isFeatured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-primary-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ★ Featured
                  </div>
                )}

                {/* Photo counter */}
                {photos.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {activePhoto + 1} / {photos.length}
                  </div>
                )}

                {/* Nav arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevPhoto() }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextPhoto() }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={clsx(
                        'relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                        i === activePhoto
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-secondary-500'
                      )}
                    >
                      <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-gray-100 dark:border-secondary-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-white/60 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Specs Table */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-gray-100 dark:border-secondary-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Specifications</h2>
              <div className="divide-y divide-gray-100 dark:divide-secondary-700">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center py-3 gap-4">
                    <span className="text-sm text-gray-500 dark:text-white/40 w-36 flex-shrink-0">
                      {spec.label}
                    </span>
                    <span className={clsx('text-sm font-medium text-gray-900 dark:text-white', spec.capitalize && 'capitalize')}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Listings */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Similar Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SIMILAR_LISTINGS.map((similar) => (
                  <ListingCard key={similar.id} listing={similar} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Sticky Price Card ───────── */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-gray-100 dark:border-secondary-700 shadow-sm">
                {/* Title + condition */}
                <div className="mb-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full', conditionStyles[listing.condition])}>
                      {listing.condition} – {conditionLabels[listing.condition]}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/30 capitalize bg-gray-100 dark:bg-secondary-700 px-2.5 py-1 rounded-full">
                      {listing.bikeType}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">
                    €{listing.price.toLocaleString()}
                  </span>
                  {listing.isNegotiable && (
                    <span className="ml-2 text-sm text-gray-400 dark:text-white/40">· Negotiable</span>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl transition-colors">
                    <Phone className="w-4 h-4" />
                    Contact Seller
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3.5 rounded-xl transition-all duration-200">
                    <MessageCircle className="w-4 h-4" />
                    Make Offer
                  </button>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-secondary-700">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200',
                      isFavorited
                        ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-500/10 dark:border-red-500/30'
                        : 'border-gray-200 dark:border-secondary-700 text-gray-600 dark:text-white/60 hover:border-red-300 hover:text-red-500'
                    )}
                  >
                    <Heart className={clsx('w-4 h-4', isFavorited && 'fill-current')} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-secondary-700 text-gray-600 dark:text-white/60 hover:border-gray-300 dark:hover:border-secondary-500 font-medium text-sm transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 dark:text-white/30">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {listing.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {listing.favoritesCount} saved
                  </span>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-5 border border-gray-100 dark:border-secondary-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-4">
                  Seller
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={listing.sellerAvatar}
                      alt={listing.sellerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-secondary-700"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent-500 rounded-full border-2 border-white dark:border-secondary-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{listing.sellerName}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {listing.sellerRating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 dark:text-white/40">
                        ({listing.sellerReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-white/30 flex-shrink-0" />
                    <span>Member since 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-white/30 flex-shrink-0" />
                    <span>Responds within 2 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-500 flex-shrink-0" />
                    <span className="text-accent-600 dark:text-accent-400 font-medium">Verified seller</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 text-sm font-semibold border border-gray-200 dark:border-secondary-700 text-gray-700 dark:text-white/70 rounded-xl hover:border-primary hover:text-primary transition-colors">
                  View Profile
                </button>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-5 border border-gray-100 dark:border-secondary-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-3">
                  Location
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-gray-900 dark:text-white">{listing.city}</span>
                  <span className="text-sm text-gray-400 dark:text-white/40">, Spain</span>
                </div>
                {/* Map placeholder */}
                <div className="relative w-full h-40 bg-gray-100 dark:bg-secondary-700 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-secondary-700 dark:to-secondary-900" />
                  <div className="relative flex flex-col items-center gap-2 text-gray-400 dark:text-white/30">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{listing.city}</span>
                    <span className="text-xs">Map view available on desktop</span>
                  </div>
                </div>
              </div>

              {/* Safety tip */}
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Safety Tip
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300/70 leading-relaxed">
                      Always meet in a safe, public place. Test ride before paying.
                      Never transfer money before seeing the bike.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex]}
                alt={listing.title}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </motion.div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                  {lightboxIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
