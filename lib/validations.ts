// lib/validations.ts - Validaciones con Zod + Seguridad OWASP
import { z } from 'zod'
import { APP_LIMITS, ERROR_MESSAGES } from './constants'
import { sanitizeInput, validateEmail } from './security'

export const ProductSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(APP_LIMITS.MAX_TITLE_LENGTH, `El título no puede exceder ${APP_LIMITS.MAX_TITLE_LENGTH} caracteres`)
    .transform(sanitizeInput), // Sanitizar XSS
  
  desc: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(APP_LIMITS.MAX_DESCRIPTION_LENGTH, `La descripción no puede exceder ${APP_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres`)
    .transform(sanitizeInput), // Sanitizar XSS
  
  category: z.string()
    .min(1, 'Debes seleccionar una categoría'),
  
  price: z.string()
    .regex(/^\d+$/, 'El precio debe ser un número válido')
    .max(10, 'El precio no puede exceder 10 dígitos')
    .optional(),
  
  images: z.array(z.string().url('URL de imagen inválida'))
    .min(1, 'Debes agregar al menos una imagen')
    .max(APP_LIMITS.MAX_IMAGES_PER_PRODUCT, `Máximo ${APP_LIMITS.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`),
  
  condition: z.enum(['nuevo', 'como_nuevo', 'bueno', 'regular']).default('bueno'),
  
  tags: z.array(
    z.string()
      .max(30, 'Cada tag no puede exceder 30 caracteres')
      .transform(sanitizeInput)
  ).max(APP_LIMITS.MAX_TAGS_PER_PRODUCT).optional()
})

export type ProductFormData = z.infer<typeof ProductSchema>

// Validación de archivos de imagen con seguridad mejorada
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Validar tamaño
  if (file.size > APP_LIMITS.MAX_IMAGE_SIZE) {
    return { isValid: false, error: ERROR_MESSAGES.IMAGE_TOO_LARGE }
  }
  
  // Validar tamaño mínimo (prevenir archivos vacíos o corruptos)
  if (file.size < 100) {
    return { isValid: false, error: 'Archivo demasiado pequeño o corrupto' }
  }

  // Validar tipo MIME
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Solo se permiten archivos de imagen (JPG, PNG, WebP)' }
  }
  
  // Validar extensión de archivo (doble verificación)
  const fileName = file.name.toLowerCase()
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
    return { isValid: false, error: 'Extensión de archivo no permitida' }
  }

  return { isValid: true }
}

// Schema de usuario con validación de email robusta
export const UserSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(254, 'Email demasiado largo')
    .refine(validateEmail, 'Formato de email inválido'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  
  displayName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .transform(sanitizeInput),
})

// Schema para mensajes de chat
export const MessageSchema = z.object({
  message: z.string()
    .min(1, 'El mensaje no puede estar vacío')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .transform(sanitizeInput),
  
  chatId: z.string().min(1, 'ID de chat inválido'),
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
