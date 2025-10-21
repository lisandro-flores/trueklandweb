// Lazy Loading Configuration para optimización de bundle
// Componentes que se cargan bajo demanda para mejorar performance

import dynamic from 'next/dynamic'

// Chat Components (solo cargan cuando se necesitan)
export const ChatSystem = dynamic(
  () => import('@/components/chat/ChatSystem'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    ),
    ssr: false // No renderizar en servidor (requiere autenticación)
  }
)

export const ChatRoom = dynamic(
  () => import('@/components/chat/ChatRoom'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    ),
    ssr: false 
  }
)

// Exchange System (pesado, solo para página específica)
export const ExchangeSystem = dynamic(
  () => import('@/components/exchange/ExchangeSystem'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    ),
    ssr: false 
  }
)

// Profile Components
export const EditProfileForm = dynamic(
  () => import('@/components/profile/EditProfileForm'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    )
  }
)

export const MyProducts = dynamic(
  () => import('@/components/profile/MyProducts'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    )
  }
)

// Product Edit Component (optimizado sin SSR)
export const EditProduct = dynamic(
  () => import('@/components/products/EditProduct'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f2b3]" />
      </div>
    ),
    ssr: false 
  }
)

// PWA Install Prompt (solo cuando sea necesario)
export const PWAInstallPrompt = dynamic(
  () => import('@/components/ui/PWAInstallPrompt'),
  { ssr: false }
)

