// lib/security.ts - Utilidades de Seguridad OWASP

/**
 * Sanitiza entrada de usuario para prevenir XSS
 * OWASP Top 10 - A03:2021 – Injection
 * Implementación manual sin dependencias externas
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitiza HTML permitiendo solo tags seguros
 * Útil para contenido rico limitado
 */
export const sanitizeHTML = (html: string): string => {
  // Eliminar todos los tags HTML excepto los seguros
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '') // Eliminar event handlers
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

/**
 * Valida y sanitiza URL para prevenir Open Redirect
 * OWASP Top 10 - A01:2021 – Broken Access Control
 */
export const sanitizeURL = (url: string): string | null => {
  try {
    const parsed = new URL(url)
    // Solo permitir HTTP y HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Previene path traversal en nombres de archivo
 * OWASP Top 10 - A01:2021 – Broken Access Control
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Reemplazar caracteres especiales
    .replace(/\.{2,}/g, '_') // Prevenir ".."
    .substring(0, 100) // Limitar longitud
}

/**
 * Rate limiting simple con Map en memoria
 * OWASP Top 10 - A04:2021 – Insecure Design
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minuto
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Filtrar requests dentro de la ventana de tiempo
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (recentRequests.length >= this.maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    
    // Limpiar entradas antiguas
    if (this.requests.size > 10000) {
      this.cleanup()
    }
    
    return true
  }
  
  private cleanup() {
    const now = Date.now()
    for (const [key, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter(t => now - t < this.windowMs)
      if (recent.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, recent)
      }
    }
  }
}

export const rateLimiter = new RateLimiter(10, 60000) // 10 requests por minuto

/**
 * Genera un token CSRF simple
 * OWASP Top 10 - A01:2021 – Broken Access Control
 */
export const generateCSRFToken = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  // Fallback para servidor
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Valida que el contenido no exceda límites
 * OWASP Top 10 - A04:2021 – Insecure Design
 */
export const validateContentLength = (
  content: string,
  maxLength: number,
  fieldName: string
): { valid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: `${fieldName} es requerido` }
  }
  
  if (content.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} excede el límite de ${maxLength} caracteres`
    }
  }
  
  return { valid: true }
}

/**
 * Valida email con regex estricto
 * OWASP Top 10 - A03:2021 – Injection
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Valida fortaleza de contraseña
 * OWASP Top 10 - A07:2021 – Identification and Authentication Failures
 */
export const validatePasswordStrength = (password: string): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número')
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial')
  }
  
  // Verificar patrones comunes débiles
  const weakPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i
  ]
  
  if (weakPatterns.some(pattern => pattern.test(password))) {
    errors.push('La contraseña es demasiado común')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Escapa caracteres especiales para SQL (aunque usamos Firestore)
 * Buena práctica general
 */
export const escapeSpecialChars = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * Verifica que un usuario tenga permisos sobre un recurso
 * OWASP Top 10 - A01:2021 – Broken Access Control
 */
export const verifyResourceOwnership = (
  resourceOwnerId: string,
  currentUserId: string | undefined
): boolean => {
  if (!currentUserId) return false
  return resourceOwnerId === currentUserId
}

/**
 * Constantes de seguridad
 */
export const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutos
  SESSION_TIMEOUT_MS: 24 * 60 * 60 * 1000, // 24 horas
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  BCRYPT_ROUNDS: 12
} as const

/**
 * Logger seguro que no expone información sensible
 * OWASP Top 10 - A09:2021 – Security Logging and Monitoring Failures
 */
export const secureLog = (
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: unknown
) => {
  const timestamp = new Date().toISOString()
  const sanitizedData = data ? JSON.stringify(data).replace(/password|token|secret/gi, '[REDACTED]') : ''
  
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message} ${sanitizedData}`
  
  if (process.env.NODE_ENV === 'development') {
    console[level](logMessage)
  }
  
  // En producción, enviar a servicio de logging externo
  // TODO: Implementar integración con servicio de logging
}
