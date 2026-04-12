'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Shield,
  Lock,
  Lightbulb,
  ShoppingBasket,
  Smartphone,
  BatteryCharging,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  User,
  MessageSquare,
} from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { BookingModal } from '@/components/rentals/BookingModal'
import { clsx } from 'clsx'

const MOCK_RENTALS = [
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=3',
    ownerRating: 4.9,
    ownerReviews: 47,
    ownerResponseTime: '< 1 hour',
    ownerJoined: '2022',
    photos: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    ],
    features: ['Helmet included', 'Lock included', 'Lights', 'Basket'],
    condition: 'A',
    description: 'Perfect city bike for exploring Málaga. This Trek FX 3 is a versatile fitness hybrid that handles city streets with ease. The helmet and lock are always included at no extra cost. Pickup from the city center — I\'m flexible with timing.',
    pickupLocation: 'Alameda Principal, Málaga',
    reviews: [
      { author: 'James T.', rating: 5, date: 'March 2026', comment: 'Excellent bike, very clean and well maintained. Pedro was super helpful with the pickup.' },
      { author: 'Sofia R.', rating: 5, date: 'February 2026', comment: 'Perfect for exploring the city! Helmet fit great and the lock worked flawlessly.' },
      { author: 'Mike C.', rating: 4, date: 'January 2026', comment: 'Great bike, easy process. Would definitely rent again.' },
    ],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=5',
    ownerRating: 5.0,
    ownerReviews: 31,
    ownerResponseTime: '< 2 hours',
    ownerJoined: '2023',
    photos: [
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
    ],
    features: ['Helmet included', 'Phone mount', 'Charger', '70km range'],
    condition: 'A',
    description: 'Premium e-bike perfect for coastal rides. 70km range per charge. Delivery available within 5km of Marbella.',
    pickupLocation: 'Puerto Banús, Marbella',
    reviews: [
      { author: 'Thomas H.', rating: 5, date: 'March 2026', comment: 'Incredible e-bike. The range is amazing and the bike is in perfect condition.' },
      { author: 'Anna W.', rating: 5, date: 'February 2026', comment: 'Sarah was fantastic. The bike was delivered to our hotel!' },
    ],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=8',
    ownerRating: 4.7,
    ownerReviews: 23,
    ownerResponseTime: '< 4 hours',
    ownerJoined: '2021',
    photos: [
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80',
    ],
    features: ['Helmet included', 'Gloves', 'Repair kit', 'Lights'],
    condition: 'A',
    description: 'Rugged trail bike for the hills around Ronda. Full suspension, hydraulic brakes. Perfect for beginners and intermediate riders.',
    pickupLocation: 'Plaza de España, Ronda',
    reviews: [
      { author: 'Lars N.', rating: 5, date: 'March 2026', comment: 'The trails around Ronda are incredible and this bike handled everything!' },
    ],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=12',
    ownerRating: 4.8,
    ownerReviews: 62,
    ownerResponseTime: '< 1 hour',
    ownerJoined: '2020',
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    features: ['Helmet included', 'Cycling shoes', 'Cycling jersey', 'Lock included'],
    condition: 'A',
    description: 'High-performance aluminum road bike. Ideal for the coastal route from Torremolinos to Málaga.',
    pickupLocation: 'Paseo Marítimo, Torremolinos',
    reviews: [],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=9',
    ownerRating: 4.9,
    ownerReviews: 18,
    ownerResponseTime: '< 3 hours',
    ownerJoined: '2023',
    photos: [
      'https://images.unsplash.com/photo-1606206873764-fd15e242ea52?w=800&q=80',
    ],
    features: ['Helmet included', 'Panniers', 'Phone mount', 'Repair kit'],
    condition: 'A',
    description: 'Versatile gravel bike perfect for mixed terrain around Nerja. Explore dirt roads and coastal paths alike.',
    pickupLocation: 'Balcón de Europa, Nerja',
    reviews: [],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=25',
    ownerRating: 4.6,
    ownerReviews: 14,
    ownerResponseTime: '< 6 hours',
    ownerJoined: '2022',
    photos: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    ],
    features: ['Helmet included', 'Carry bag', 'Lights', 'Lock included'],
    condition: 'A',
    description: 'Iconic British folding bike. Perfect for combining with public transport or storing in your apartment.',
    pickupLocation: 'Puerto Deportivo, Estepona',
    reviews: [],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=15',
    ownerRating: 4.8,
    ownerReviews: 39,
    ownerResponseTime: '< 2 hours',
    ownerJoined: '2021',
    photos: [
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
    ],
    features: ['Helmet included', 'Pannier rack', 'Charger', '120km range'],
    condition: 'A',
    description: 'Long-range e-trekking bike. The 120km battery range lets you explore the entire Costa del Sol in a day.',
    pickupLocation: 'Paseo Marítimo Rey de España, Fuengirola',
    reviews: [],
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
    ownerAvatar: 'https://i.pravatar.cc/150?img=20',
    ownerRating: 4.7,
    ownerReviews: 55,
    ownerResponseTime: '< 1 hour',
    ownerJoined: '2022',
    photos: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
    ],
    features: ['Helmet included', 'Basket', 'Lights', 'Lock included'],
    condition: 'A',
    description: 'Super comfortable hybrid with upright riding position. Great for relaxed rides along the seafront promenade.',
    pickupLocation: 'Mijas Pueblo, Mijas',
    reviews: [],
  },
]

const featureIcon = (feature: string) => {
  const f = feature.toLowerCase()
  if (f.includes('helmet')) return <Shield className="w-4 h-4 text-accent-400" />
  if (f.includes('lock')) return <Lock className="w-4 h-4 text-accent-400" />
  if (f.includes('light')) return <Lightbulb className="w-4 h-4 text-accent-400" />
  if (f.includes('basket')) return <ShoppingBasket className="w-4 h-4 text-accent-400" />
  if (f.includes('phone') || f.includes('mount')) return <Smartphone className="w-4 h-4 text-accent-400" />
  if (f.includes('charg') || f.includes('range')) return <BatteryCharging className="w-4 h-4 text-accent-400" />
  return <Zap className="w-4 h-4 text-accent-400" />
}

const RULES = [
  'Bike must be returned in the same condition as received',
  'Helmet is required when cycling on public roads',
  'No off-road use unless explicitly permitted by owner',
  'Report any damage immediately — do not attempt DIY repairs',
  'Deposit is fully refunded within 48h of return if no damage',
  'Late returns incur an additional charge of 50% of daily rate per hour',
]


export default function RentalDetailPage() {
  const params = useParams()
  const id = params.id as string
  const rental = MOCK_RENTALS.find((r) => r.id === id)

  const [photoIndex, setPhotoIndex] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  if (!rental) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🚲</p>
          <h1 className="text-white text-2xl font-bold mb-2">Rental not found</h1>
          <Link href="/rentals" className="text-primary-400 hover:text-primary-300 underline">
            Browse all rentals
          </Link>
        </div>
      </div>
    )
  }

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [startDate, endDate])

  const totalPrice = totalDays * rental.pricePerDay + rental.deposit

  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + rental.photos.length) % rental.photos.length)
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % rental.photos.length)

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Back nav */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/rentals"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to rentals
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-secondary-700"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={rental.photos[photoIndex]}
                  alt={rental.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent" />

                {rental.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {rental.photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={clsx(
                            'w-2 h-2 rounded-full transition-all duration-200',
                            i === photoIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Instant book badge */}
                <div className="absolute top-4 left-4">
                  {rental.instantBook ? (
                    <span className="inline-flex items-center gap-1.5 bg-accent-500/90 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Instant Book
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                      Request to Book
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {rental.photos.length > 1 && (
                <div className="flex gap-2 p-3 bg-secondary-800">
                  {rental.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={clsx(
                        'w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200',
                        i === photoIndex ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title + info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-primary-400 text-sm font-semibold capitalize mb-1 block">{rental.bikeType} bike</span>
                  <h1 className="text-3xl font-bold text-white">{rental.title}</h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-400">€{rental.pricePerDay}</p>
                  <p className="text-white/40 text-sm">per day</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-accent-400" />
                  {rental.city}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-white/30" />
                  {rental.pickupLocation}
                </div>
              </div>

              <p className="text-white/70 leading-relaxed">{rental.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-3">
                {rental.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-white/80">
                    {featureIcon(feature)}
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Pricing Summary</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Per Day', price: rental.pricePerDay },
                    { label: 'Per Week', price: rental.pricePerWeek },
                    { label: 'Per Month', price: rental.pricePerMonth },
                  ].map(({ label, price }) => (
                    <div key={label} className="bg-secondary-700/60 rounded-xl p-3 text-center">
                      <p className="text-primary-400 font-bold text-lg">€{price}</p>
                      <p className="text-white/40 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-3">
                  + €{rental.deposit} fully refundable deposit
                </p>
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-400" />
                Rental Rules
              </h2>
              <ul className="space-y-2.5">
                {RULES.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Reviews */}
            {rental.reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-secondary-800/50 border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-white font-bold text-lg mb-1">Reviews</h2>
                <div className="flex items-center gap-3 mb-6">
                  <StarRating rating={rental.ownerRating} showValue size="md" />
                  <span className="text-white/50 text-sm">({rental.ownerReviews} total)</span>
                </div>
                <div className="space-y-4">
                  {rental.reviews.map((review, i) => (
                    <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                            {review.author[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{review.author}</p>
                            <p className="text-white/40 text-xs">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column — Booking widget */}
          <div className="space-y-5">
            {/* Booking widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-800/70 border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-white font-bold text-xl mb-5">Book This Bike</h2>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-secondary-700 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-secondary-700 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Price calc */}
              {totalDays > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-secondary-700/60 rounded-xl p-4 mb-5 space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">€{rental.pricePerDay} × {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                    <span className="text-white">€{rental.pricePerDay * totalDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Refundable deposit</span>
                    <span className="text-white">€{rental.deposit}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-primary-400 font-bold text-lg">€{totalPrice}</span>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setModalOpen(true)}
                disabled={totalDays === 0}
                className={clsx(
                  'w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200',
                  totalDays > 0
                    ? 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98]'
                    : 'bg-secondary-600 text-white/30 cursor-not-allowed'
                )}
              >
                {totalDays > 0 ? (
                  rental.instantBook ? (
                    <><Zap className="w-4 h-4 inline mr-2 fill-current" />Book Now</>
                  ) : (
                    'Request to Book'
                  )
                ) : (
                  'Select dates to book'
                )}
              </button>

              <p className="text-white/30 text-xs text-center mt-3">
                No charge until confirmed · Free cancellation 24h before
              </p>
            </motion.div>

            {/* Owner card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary-800/70 border border-white/10 rounded-2xl p-5"
            >
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Your Host</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={rental.ownerAvatar}
                  alt={rental.ownerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/30"
                />
                <div>
                  <p className="text-white font-bold">{rental.ownerName}</p>
                  <StarRating rating={rental.ownerRating} size="sm" showValue reviewCount={rental.ownerReviews} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-secondary-700/60 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-accent-400 mx-auto mb-1" />
                  <p className="text-white/40 text-xs">Response time</p>
                  <p className="text-white text-xs font-semibold">{rental.ownerResponseTime}</p>
                </div>
                <div className="bg-secondary-700/60 rounded-xl p-3 text-center">
                  <User className="w-4 h-4 text-accent-400 mx-auto mb-1" />
                  <p className="text-white/40 text-xs">Member since</p>
                  <p className="text-white text-xs font-semibold">{rental.ownerJoined}</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message Host
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rental={{
          id: rental.id,
          title: rental.title,
          photo: rental.photos[0],
          city: rental.city,
          pricePerDay: rental.pricePerDay,
          deposit: rental.deposit,
        }}
        startDate={startDate}
        endDate={endDate}
        totalDays={totalDays}
        totalPrice={totalPrice}
      />
    </div>
  )
}
