// Tipos globales para TrueKland
export interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  images: string[]
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
  userId: string
  location?: {
    lat: number
    lng: number
    address: string
  }
  condition: 'nuevo' | 'como_nuevo' | 'bueno' | 'regular'
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  description?: string
  isActive: boolean
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLogin: Date
  isActive: boolean
  rating?: number
  totalExchanges?: number
  bio?: string
  location?: {
    city: string
    country: string
  }
  preferences?: {
    categories: string[]
    maxDistance: number
    notifications: boolean
  }
}

export interface Exchange {
  id: string
  fromUserId: string
  toUserId: string
  fromProductId: string
  toProductId: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  rating?: {
    fromUserRating: number
    toUserRating: number
    fromUserComment?: string
    toUserComment?: string
  }
}

export interface ChatMessage {
  id: string
  exchangeId: string
  senderId: string
  receiverId: string
  message: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'system'
}

export interface Notification {
  id: string
  userId: string
  type: 'exchange_request' | 'exchange_accepted' | 'exchange_rejected' | 'message' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: {
    exchangeId?: string
    productId?: string
    userId?: string
  }
}

export interface Review {
  id: string
  fromUserId: string
  toUserId: string
  exchangeId: string
  rating: number
  comment?: string
  createdAt: Date
}

// Tipos para formularios
export interface ProductFormData {
  title: string
  desc: string
  category: string
  price: string
  condition: Product['condition']
  images: File[]
  tags: string[]
}

export interface ExchangeRequest {
  fromProductId: string
  toProductId: string
  message?: string
}

// Tipos de respuesta de Firebase
export interface FirebaseResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Estados de la aplicación
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AppError {
  code: string
  message: string
  details?: unknown
}
