# 📦 Instalación

## Requisitos Previos

- **Node.js** 18.0 o superior
- **pnpm** 8.0 o superior (recomendado) o npm
- **Git**
- Cuenta de **Firebase**

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/lisandro-flores/trueklandweb.git
cd trueklandweb
```

### 2. Instalar Dependencias

```bash
# Con pnpm (recomendado)
pnpm install

# O con npm
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Firebase:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** con Email/Password y Google
4. Crea una base de datos **Firestore**
5. Configura **Storage** para imágenes
6. Copia las credenciales a tu `.env.local`

### 5. Ejecutar en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Verificación

Para verificar que todo está funcionando:

1. Abre [http://localhost:3000](http://localhost:3000)
2. Deberías ver la página de inicio
3. Intenta registrarte con un email
4. Verifica que Firebase recibe los datos

## Problemas Comunes

### Error: Firebase no está configurado

**Solución**: Verifica que el archivo `.env.local` existe y tiene todas las variables.

### Error: Cannot find module

**Solución**: Elimina `node_modules` y reinstala:
```bash
rm -rf node_modules
pnpm install
```

### Puerto 3000 ocupado

**Solución**: Usa un puerto diferente:
```bash
pnpm dev -p 3001
```

## Siguiente Paso

Continúa con la [Configuración](./configuration.md) para configurar Firebase en detalle.
