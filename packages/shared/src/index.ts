// Bike Types
export type BikeType =
  | 'road'
  | 'mountain'
  | 'gravel'
  | 'city'
  | 'electric'
  | 'hybrid'
  | 'bmx'
  | 'kids'
  | 'folding'
  | 'cargo'
  | 'triathlon'

export type BikeCondition = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export const CONDITION_LABELS: Record<BikeCondition, string> = {
  A: 'Like New',
  B: 'Excellent',
  C: 'Good',
  D: 'Fair',
  E: 'Poor',
  F: 'Project Bike',
}

export type FrameMaterial = 'carbon' | 'aluminum' | 'steel' | 'titanium' | 'chromoly'

export interface Location {
  lat: number
  lng: number
  city: string
  region: string
  country: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: 'EUR'
  condition: BikeCondition
  bikeType: BikeType
  brand: string
  model: string
  year: number
  frameSize: string
  frameMaterial: FrameMaterial
  color: string
  photos: string[]
  location: Location
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  sellerRating: number
  sellerReviews: number
  isNegotiable: boolean
  isFeatured: boolean
  views: number
  favoritesCount: number
  createdAt: string
  updatedAt: string
}

export interface RentalListing {
  id: string
  title: string
  description: string
  pricePerDay: number
  pricePerWeek?: number
  pricePerMonth?: number
  deposit: number
  currency: 'EUR'
  bikeType: BikeType
  brand: string
  model: string
  condition: BikeCondition
  frameSize: string
  photos: string[]
  location: Location
  ownerId: string
  ownerName: string
  ownerAvatar?: string
  ownerRating: number
  instantBook: boolean
  availableFrom: string
  availableTo: string
  features: string[]
}

export interface MechanicProfile {
  id: string
  name: string
  avatar?: string
  bio: string
  specialties: string[]
  certifications: string[]
  rating: number
  reviewCount: number
  location: Location
  serviceRadius: number
  isMobile: boolean
  priceRange: { min: number; max: number }
  responseTime: string
  languages: string[]
  services: MechanicService[]
}

export interface MechanicService {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: 'maintenance' | 'repair' | 'upgrade' | 'custom'
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: Location
  rating: number
  reviewCount: number
  verificationLevel: 'unverified' | 'email' | 'phone' | 'id'
  joinedAt: string
  listings: number
  sales: number
  purchases: number
  languages: string[]
  roles: ('buyer' | 'seller' | 'renter' | 'mechanic')[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: 'text' | 'offer' | 'system'
  offerAmount?: number
  createdAt: string
  isRead: boolean
}

export interface Conversation {
  id: string
  listingId?: string
  listingTitle?: string
  listingPhoto?: string
  participants: { id: string; name: string; avatar?: string }[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

export interface Review {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  targetId: string
  rating: number
  comment: string
  categories: {
    communication: number
    accuracy: number
    timeliness: number
  }
  createdAt: string
}

export const BIKE_TYPES: { value: BikeType; label: string; icon: string }[] = [
  { value: 'road', label: 'Road', icon: '🚴' },
  { value: 'mountain', label: 'Mountain', icon: '🏔️' },
  { value: 'gravel', label: 'Gravel', icon: '🛤️' },
  { value: 'city', label: 'City', icon: '🏙️' },
  { value: 'electric', label: 'Electric', icon: '⚡' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔀' },
  { value: 'bmx', label: 'BMX', icon: '🤸' },
  { value: 'kids', label: 'Kids', icon: '👶' },
  { value: 'folding', label: 'Folding', icon: '📐' },
  { value: 'cargo', label: 'Cargo', icon: '📦' },
]

export const POPULAR_BRANDS = [
  'Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott', 'Bianchi',
  'Pinarello', 'Cervélo', 'Santa Cruz', 'Orbea', 'Merida', 'Cube',
  'Canyon', 'BMC', 'Colnago', 'Focus', 'Haibike', 'Riese & Müller'
]

export const FRAME_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

export const GROUPSET_BRANDS = ['Shimano', 'SRAM', 'Campagnolo', 'microSHIFT', 'Sturmey-Archer']
