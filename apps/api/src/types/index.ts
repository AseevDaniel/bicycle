export interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  brand: string
  model: string
  year: number
  type: 'road' | 'mountain' | 'gravel' | 'electric' | 'city' | 'hybrid'
  size: string
  color: string
  city: string
  province: string
  images: string[]
  sellerId: string
  sellerName: string
  featured: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export interface Rental {
  id: string
  title: string
  description: string
  pricePerDay: number
  pricePerWeek?: number
  brand: string
  model: string
  type: 'road' | 'mountain' | 'gravel' | 'electric' | 'city' | 'hybrid'
  size: string
  city: string
  ownerId: string
  ownerName: string
  images: string[]
  available: boolean
  rating: number
  reviewCount: number
  features: string[]
  createdAt: string
}

export interface Mechanic {
  id: string
  name: string
  bio: string
  city: string
  address: string
  phone: string
  email: string
  rating: number
  reviewCount: number
  yearsExperience: number
  services: MechanicService[]
  certifications: string[]
  workingHours: string
  avatar: string
  verified: boolean
  createdAt: string
}

export interface MechanicService {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  city: string
  phone?: string
  bio?: string
  rating: number
  reviewCount: number
  listingsCount: number
  joinedAt: string
  verified: boolean
}

export interface Conversation {
  id: string
  participants: string[]
  listingId?: string
  listingTitle?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  createdAt: string
  read: boolean
}

export interface Review {
  id: string
  reviewerId: string
  reviewerName: string
  reviewerAvatar: string
  targetId: string
  targetType: 'user' | 'mechanic'
  rating: number
  comment: string
  createdAt: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
