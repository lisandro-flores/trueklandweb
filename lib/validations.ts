// lib/validations.ts - Validaciones con Zod
import { z } from 'zod'
import { APP_LIMITS, ERROR_MESSAGES } from './constants'

export const ProductSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(APP_LIMITS.MAX_TITLE_LENGTH, `El título no puede exceder ${APP_LIMITS.MAX_TITLE_LENGTH} caracteres`),
  
  desc: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(APP_LIMITS.MAX_DESCRIPTION_LENGTH, `La descripción no puede exceder ${APP_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres`),
  
  category: z.string()
    .min(1, 'Debes seleccionar una categoría'),
  
  price: z.string()
    .regex(/^\d+$/, 'El precio debe ser un número válido')
    .optional(),
  
  images: z.array(z.string().url())
    .min(1, 'Debes agregar al menos una imagen')
    .max(APP_LIMITS.MAX_IMAGES_PER_PRODUCT, `Máximo ${APP_LIMITS.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`),
  
  condition: z.enum(['nuevo', 'como_nuevo', 'bueno', 'regular']).default('bueno'),
  
  tags: z.array(z.string()).max(APP_LIMITS.MAX_TAGS_PER_PRODUCT).optional()
})

export type ProductFormData = z.infer<typeof ProductSchema>

// Validación de archivos de imagen
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > APP_LIMITS.MAX_IMAGE_SIZE) {
    return { isValid: false, error: ERROR_MESSAGES.IMAGE_TOO_LARGE }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Solo se permiten archivos de imagen (JPG, PNG, WebP)' }
  }

  return { isValid: true }
}

export const UserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export const ExchangeSchema = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  fromProductId: z.string(),
  toProductId: z.string(),
  message: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'rejected', 'completed'])
})

export type Product = z.infer<typeof ProductSchema>
export type UserData = z.infer<typeof UserSchema>
export type Exchange = z.infer<typeof ExchangeSchema>
