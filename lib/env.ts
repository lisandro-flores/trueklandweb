import { z } from 'zod'

/**
 * Esquema de validación para variables de entorno
 * Usa Zod para asegurar que todas las variables requeridas estén presentes
 */
const envSchema = z.object({
  // Firebase Configuration (Requeridas)
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, 'Firebase API Key es requerida'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, 'Firebase Auth Domain es requerido')
    .regex(/\.firebaseapp\.com$/, 'Debe ser un dominio válido de Firebase'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'Firebase Project ID es requerido'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'Firebase Storage Bucket es requerido')
    .regex(/\.appspot\.com$/, 'Debe ser un bucket válido de Firebase'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'Firebase Messaging Sender ID es requerido'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z
    .string()
    .min(1, 'Firebase App ID es requerido')
    .regex(/^1:[0-9]+:web:[a-zA-Z0-9]+$/, 'Debe ser un App ID válido de Firebase'),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('Debe ser una URL válida')
    .default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .default('TrueKland'),

  // Optional Services
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
})

/**
 * Valida y parsea las variables de entorno
 * Lanza un error si alguna variable requerida falta o es inválida
 */
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `  ❌ ${err.path.join('.')}: ${err.message}`
      }).join('\n')

      throw new Error(
        `\n⚠️  Variables de entorno inválidas o faltantes:\n\n${missingVars}\n\n` +
        `💡 Tip: Copia .env.example a .env.local y configura tus credenciales de Firebase.\n`
      )
    }
    throw error
  }
}

/**
 * Variables de entorno validadas y tipadas
 * Exporta un objeto con todas las variables necesarias
 */
export const env = validateEnv()

/**
 * Tipo de las variables de entorno para usar en TypeScript
 */
export type Env = z.infer<typeof envSchema>
