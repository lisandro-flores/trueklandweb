# 🏗️ Estructura del Proyecto

## Árbol de Directorios

```
trueklandweb/
├── app/                          # Next.js App Router
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── add-post/                # Crear producto
│   ├── admin/                   # Panel administrador
│   ├── chats/                   # Sistema de chat
│   ├── dashboard/               # Dashboard usuario
│   ├── exchanges/               # Intercambios
│   ├── explore/                 # Explorar productos
│   ├── forgot-password/         # Recuperar contraseña
│   ├── product/[productId]/     # Detalle producto
│   ├── profile/                 # Perfil usuario
│   └── user/[email]/            # Perfil público
│
├── components/                   # Componentes React
│   ├── auth/                    # Autenticación
│   │   ├── LoginPage.tsx
│   │   ├── SignInForm.tsx
│   │   ├── SignUpForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── chat/                    # Sistema de chat
│   │   ├── ChatList.tsx
│   │   ├── ChatRoom.tsx
│   │   └── ChatSystem.tsx
│   ├── exchange/                # Intercambios
│   │   └── ExchangeSystem.tsx
│   ├── navigation/              # Navegación
│   │   └── Navbar.tsx
│   ├── posts/                   # Publicaciones
│   │   └── AddPostForm.tsx
│   ├── products/                # Productos
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductList.tsx
│   │   └── EditProduct.tsx
│   ├── profile/                 # Perfil
│   │   ├── ProfileContent.tsx
│   │   ├── EditProfileForm.tsx
│   │   └── MyProducts.tsx
│   └── ui/                      # Componentes UI (shadcn)
│
├── context/                      # React Context
│   └── AuthContext.tsx          # Contexto de autenticación
│
├── hooks/                        # Custom Hooks
│   ├── useAuth.ts               # Hook de autenticación
│   ├── useCamera.ts             # Hook de cámara
│   ├── useNotifications.ts      # Hook de notificaciones
│   ├── useProducts.ts           # Hook de productos
│   └── usePWA.ts                # Hook de PWA
│
├── lib/                          # Utilidades
│   ├── firebase.ts              # Configuración Firebase
│   ├── types.ts                 # Tipos TypeScript
│   ├── utils.ts                 # Utilidades generales
│   ├── validations.ts           # Validaciones
│   ├── constants.ts             # Constantes
│   └── design-system.ts         # Sistema de diseño
│
├── public/                       # Archivos estáticos
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO
│   └── icons/                   # Iconos PWA
│
├── docs/                         # Documentación
│   ├── 01-getting-started/      # Inicio
│   ├── 02-architecture/         # Arquitectura
│   ├── 03-features/             # Funcionalidades
│   ├── 04-deployment/           # Despliegue
│   └── 05-maintenance/          # Mantenimiento
│
├── .env.local                    # Variables de entorno (local)
├── .env.example                  # Ejemplo de variables
├── firestore.rules              # Reglas de Firestore
├── middleware.ts                # Middleware de Next.js
├── next.config.js               # Configuración Next.js
├── package.json                 # Dependencias
├── tailwind.config.ts           # Configuración Tailwind
└── tsconfig.json                # Configuración TypeScript
```

## Convenciones de Nombres

### Archivos

- **Componentes**: PascalCase (ej: `ProductCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth.ts`)
- **Utilidades**: camelCase (ej: `utils.ts`)
- **Páginas**: kebab-case (ej: `add-post/page.tsx`)

### Carpetas

- **Rutas**: kebab-case (ej: `forgot-password/`)
- **Componentes**: camelCase (ej: `products/`)

## Arquitectura de Componentes

### Estructura de un Componente

```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface ComponentProps {
  title: string
  onAction: () => void
}

// 3. Component
export default function Component({ title, onAction }: ComponentProps) {
  // 4. State
  const [loading, setLoading] = useState(false)

  // 5. Handlers
  const handleClick = async () => {
    setLoading(true)
    await onAction()
    setLoading(false)
  }

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Cargando...' : 'Acción'}
      </Button>
    </div>
  )
}
```

## Flujo de Datos

```
Usuario → Componente → Hook → Firebase → Firestore/Storage
                                ↓
                         Context/State
                                ↓
                            Re-render
```

## Patrones Utilizados

### 1. Context API para Estado Global

```typescript
// AuthContext proporciona:
- user: Usuario actual
- loading: Estado de carga
- signIn(): Función de login
- signOut(): Función de logout
```

### 2. Custom Hooks para Lógica

```typescript
// Cada funcionalidad tiene su hook:
- useAuth(): Autenticación
- useProducts(): Gestión de productos
- useChat(): Sistema de chat
```

### 3. Server Components + Client Components

```typescript
// Server Component (default)
export default function Page() {
  return <Content />
}

// Client Component (interactivo)
'use client'
export default function Content() {
  const [state, setState] = useState()
  // ...
}
```

## Siguiente Paso

Continúa con [Sistema de Diseño](./design-system.md) para entender el tema visual.
