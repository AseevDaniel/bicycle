'use client'
import { useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  ShieldCheck,
  Calendar,
  Package,
  ShoppingBag,
  Tag,
  MessageSquare,
  Settings,
  Heart,
  Edit2,
  Trash2,
  Plus,
  Camera,
  MapPin,
  Phone,
  Globe,
  LogOut,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ProfileTabs, Tab } from '@/components/profile/ProfileTabs'
import { clsx } from 'clsx'
import Link from 'next/link'
import toast from 'react-hot-toast'

/* ─── Mock data ─── */
const MOCK_LISTINGS = [
  {
    id: 'l1',
    title: 'Trek Domane SL 6 Road Bike',
    price: 2800,
    condition: 'B',
    photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
    views: 142,
    status: 'active',
  },
  {
    id: 'l2',
    title: 'Specialized Allez Sprint',
    price: 1650,
    condition: 'A',
    photo: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
    views: 89,
    status: 'active',
  },
  {
    id: 'l3',
    title: 'Giant TCR Advanced Pro',
    price: 3200,
    condition: 'B',
    photo: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
    views: 210,
    status: 'sold',
  },
]

const MOCK_SAVED = [
  {
    id: 's1',
    title: 'Cannondale SuperSix EVO',
    price: 4500,
    condition: 'A',
    photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
    city: 'Marbella',
  },
  {
    id: 's2',
    title: 'Pinarello Dogma F12',
    price: 6800,
    condition: 'B',
    photo: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80',
    city: 'Malaga',
  },
  {
    id: 's3',
    title: 'Colnago C64 Carbon',
    price: 5200,
    condition: 'A',
    photo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    city: 'Fuengirola',
  },
]

const MOCK_REVIEWS = [
  {
    id: 'r1',
    reviewer: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/40?img=3' },
    rating: 5,
    comment: 'Fantastic seller! The bike was exactly as described and packaging was perfect. Would buy again!',
    date: '2025-03-15',
    listing: 'Trek Domane SL 5',
  },
  {
    id: 'r2',
    reviewer: { name: 'Sofia Martinez', avatar: 'https://i.pravatar.cc/40?img=9' },
    rating: 5,
    comment: 'Very responsive and honest. Quick transaction, great communication throughout.',
    date: '2025-02-28',
    listing: 'Shimano 105 Groupset',
  },
  {
    id: 'r3',
    reviewer: { name: 'Thomas Berger', avatar: 'https://i.pravatar.cc/40?img=7' },
    rating: 4,
    comment: 'Good experience overall. Minor delay in response but all went smoothly in the end.',
    date: '2025-01-10',
    listing: 'Fizik Saddle',
  },
]

const conditionStyles: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  D: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
}
const conditionLabels: Record<string, string> = { A: 'Like New', B: 'Excellent', C: 'Good', D: 'Fair' }

/* ─── Settings form schema ─── */
const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  languages: z.string().optional(),
})
type SettingsFormData = z.infer<typeof settingsSchema>

/* ─── Star rating component ─── */
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={clsx(
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5',
            i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
    </div>
  )
}

/* ─── Tab panels ─── */
function MyListingsTab({ localePath }: { localePath: string }) {
  const [listings, setListings] = useState(MOCK_LISTINGS)

  const deleteItem = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    toast.success('Listing deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{listings.length} listings</p>
        <Link
          href={`${localePath}/sell`}
          className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Listing
        </Link>
      </div>
      {listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No listings yet</p>
          <p className="text-sm mt-1">Start by creating your first listing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              layout
              exit={{ opacity: 0, scale: 0.9 }}
              className="card overflow-hidden group"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={listing.photo}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {listing.status === 'sold' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', conditionStyles[listing.condition])}>
                    {conditionLabels[listing.condition]}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{listing.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-primary">€{listing.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="w-3 h-3" />
                    {listing.views}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-secondary-600 hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(listing.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-secondary-600 hover:border-red-300 hover:text-red-500 text-gray-600 dark:text-gray-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <Link
                    href={`${localePath}/listings/${listing.id}`}
                    className="flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-secondary-600 hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function SavedTab({ localePath }: { localePath: string }) {
  const [saved, setSaved] = useState(MOCK_SAVED)

  const remove = (id: string) => {
    setSaved((prev) => prev.filter((s) => s.id !== id))
    toast.success('Removed from saved')
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{saved.length} saved listings</p>
      {saved.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No saved listings</p>
          <p className="text-sm mt-1">Browse and save bikes you like</p>
          <Link href={`${localePath}/buy`} className="btn-primary inline-flex mt-4 !py-2 !px-4 text-sm">
            Browse bikes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((item) => (
            <motion.div key={item.id} layout exit={{ opacity: 0, scale: 0.9 }} className="card overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => remove(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-secondary-800/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-primary">€{item.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {item.city}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewsTab() {
  return (
    <div className="space-y-4">
      {MOCK_REVIEWS.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-start gap-3">
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.reviewer.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">for {review.listing}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SettingsTab() {
  const { user } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name ?? '',
      bio: '',
      phone: '',
      location: 'Marbella, Spain',
      languages: 'English, Spanish',
    },
  })

  const onSubmit = async (_data: SettingsFormData) => {
    await new Promise((r) => setTimeout(r, 700))
    toast.success('Profile updated successfully!')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      toast.success('Avatar preview updated (demo)')
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 dark:border-secondary-600"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-primary hover:text-primary-600"
            >
              Change avatar
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">JPG, PNG up to 5MB</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <input {...register('name')} className="input" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={3}
            placeholder="Tell people a bit about yourself..."
            className="input resize-none"
          />
          {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Phone
          </label>
          <input {...register('phone')} placeholder="+34 600 000 000" className="input" />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Location
          </label>
          <input {...register('location')} placeholder="City, Country" className="input" />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Languages
          </label>
          <input {...register('languages')} placeholder="English, Spanish..." className="input" />
        </div>

        <button
          type="submit"
          disabled={!isDirty}
          className={clsx(
            'btn-primary w-full sm:w-auto',
            !isDirty && 'opacity-50 cursor-not-allowed'
          )}
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

/* ─── Main profile page ─── */
export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string | undefined
  const localePath = locale && locale !== 'en' ? `/${locale}` : ''
  const [activeTab, setActiveTab] = useState('listings')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You need to be logged in to view your profile.</p>
          <Link href={`${localePath}/login`} className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const tabs: Tab[] = [
    { id: 'listings', label: 'My Listings', icon: <Tag className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved', icon: <Heart className="w-4 h-4" />, badge: MOCK_SAVED.length },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: 2 },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  const handleLogout = () => {
    logout()
    router.push(`${localePath}/`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Profile header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-secondary-700 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white dark:border-secondary-800 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <span className="flex items-center gap-1 bg-accent/10 text-accent-700 dark:text-accent-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-accent/20">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <StarRating rating={user.rating} />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{user.rating}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">({user.reviewCount} reviews)</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-secondary-700">
          {[
            { label: 'Listings', value: user.listings, icon: Package },
            { label: 'Sales', value: user.sales, icon: Tag },
            { label: 'Purchases', value: user.purchases, icon: ShoppingBag },
            { label: 'Reviews', value: user.reviewCount, icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                <Icon className="w-3 h-3" />
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'listings' && <MyListingsTab localePath={localePath} />}
              {activeTab === 'saved' && <SavedTab localePath={localePath} />}
              {activeTab === 'messages' && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="font-medium text-gray-600 dark:text-gray-400">Go to your messages</p>
                  <Link href={`${localePath}/messages`} className="btn-primary inline-flex mt-4 !py-2 !px-4 text-sm gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Open Messages
                  </Link>
                </div>
              )}
              {activeTab === 'reviews' && <ReviewsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
