# ⚙️ Configuración

## Firebase Setup

### 1. Authentication

#### Email/Password

1. En Firebase Console → Authentication → Sign-in method
2. Habilita **Email/Password**
3. No requiere configuración adicional

#### Google Sign-In

1. Habilita **Google** como proveedor
2. Configura el correo de soporte del proyecto
3. Añade dominios autorizados (localhost y tu dominio de producción)

### 2. Firestore Database

#### Reglas de Seguridad

Las reglas ya están definidas en `firestore.rules`. Para desplegarlas:

```bash
firebase deploy --only firestore:rules
```

#### Colecciones Principales

El sistema crea automáticamente estas colecciones:

- `posts` - Productos publicados
- `chats` - Conversaciones entre usuarios
- `messages` - Mensajes de chat
- `exchanges` - Intercambios entre usuarios
- `sliders` - Imágenes del slider principal

### 3. Storage

#### Reglas de Seguridad

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
    match /profiles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 2 * 1024 * 1024;
    }
  }
}
```

#### Estructura de Carpetas

```
storage/
├── products/          # Imágenes de productos
│   └── {userId}/
│       └── {timestamp}.jpg
├── profiles/          # Fotos de perfil
│   └── {userId}.jpg
└── sliders/          # Imágenes del slider
    └── {timestamp}.jpg
```

### 4. Usuario Administrador

Para crear un usuario administrador:

1. Registra un usuario con email: `admin@truekland.com`
2. El sistema detectará automáticamente el rol de admin
3. El admin tendrá acceso a `/admin`

### 5. Variables de Entorno

#### Desarrollo (.env.local)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Producción

Configura las mismas variables en tu plataforma de hosting (Vercel, etc.)

## Configuración Opcional

### PWA (Progressive Web App)

Ya está configurado en `public/manifest.json`. Para personalizar:

- Edita `manifest.json` con tu información
- Cambia los iconos en `public/icons/`

### Analytics

Si quieres habilitar Google Analytics:

1. En Firebase Console → Analytics
2. La configuración ya está en el código
3. Los eventos se registran automáticamente

### Notificaciones Push

Ya implementadas con la API de Notificaciones del navegador. No requiere configuración adicional.

## Verificación

Para verificar que Firebase está configurado correctamente:

```bash
# Instala Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Verifica el proyecto
firebase projects:list
```

## Siguiente Paso

Continúa con [Primeros Pasos](./quick-start.md) para empezar a usar el sistema.
