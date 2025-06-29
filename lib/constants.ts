// Constantes para categorías de productos
export const DEFAULT_CATEGORIES = [
  { name: "Electrónicos", icon: "📱", color: "#3B82F6" },
  { name: "Ropa", icon: "👕", color: "#EF4444" },
  { name: "Hogar", icon: "🏠", color: "#10B981" },
  { name: "Deportes", icon: "🏀", color: "#F59E0B" },
  { name: "Libros", icon: "📚", color: "#8B5CF6" },
  { name: "Juguetes", icon: "🧸", color: "#EC4899" },
  { name: "Música", icon: "🎵", color: "#06B6D4" },
  { name: "Otros", icon: "📦", color: "#6B7280" },
]

// Condiciones de productos
export const PRODUCT_CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo', description: 'Sin usar, con etiquetas' },
  { value: 'como_nuevo', label: 'Como nuevo', description: 'Usado muy poco' },
  { value: 'bueno', label: 'Bueno', description: 'Signos menores de uso' },
  { value: 'regular', label: 'Regular', description: 'Signos evidentes de uso' }
] as const

// Límites de la aplicación
export const APP_LIMITS = {
  MAX_IMAGES_PER_PRODUCT: 5,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TAGS_PER_PRODUCT: 10
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  IMAGE_TOO_LARGE: 'La imagen debe ser menor a 5MB',
  IMAGE_REQUIRED: 'Debes seleccionar al menos una imagen',
  NETWORK_ERROR: 'Error de conexión. Intenta nuevamente',
  UNAUTHORIZED: 'Debes iniciar sesión para continuar'
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Tu producto ha sido publicado correctamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado correctamente'
} as const
