# 🚀 Guía de Inicio Rápido

## Bienvenido a TrueKland

Esta guía te llevará de cero a tener el proyecto funcionando en menos de 10 minutos.

## 📋 Pre-requisitos (5 min)

### Software Necesario

```bash
# Verifica que tienes Node.js instalado
node --version  # Debe ser >= 18.0

# Verifica que tienes pnpm (recomendado)
pnpm --version  # Si no lo tienes: npm install -g pnpm

# Verifica que tienes Git
git --version
```

### Cuenta de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ten las credenciales a la mano

## 🏃 Instalación Rápida (2 min)

```bash
# 1. Clonar
git clone https://github.com/lisandro-flores/trueklandweb.git
cd trueklandweb

# 2. Instalar
pnpm install

# 3. Configurar
cp .env.example .env.local
```

## ⚙️ Configuración Mínima (3 min)

### Edita `.env.local`

```env
# Reemplaza con tus credenciales de Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configurar Firebase Console

#### 1. Authentication

- Ve a Authentication → Sign-in method
- Habilita **Email/Password**
- Habilita **Google**

#### 2. Firestore Database

- Ve a Firestore Database
- Crea la base de datos en modo **test** (cambiarás las reglas después)
- Ubicación: Elige la más cercana

#### 3. Storage

- Ve a Storage
- Habilita Storage
- Acepta las reglas por defecto

## 🚀 Ejecutar (30 seg)

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ✅ Verificación

### 1. Ver la App

- ✅ Deberías ver la página de login
- ✅ El diseño debe ser oscuro (navy blue)
- ✅ No debe haber errores en consola

### 2. Crear Cuenta

```
1. Click en "Registrarse"
2. Ingresa email y contraseña
3. Deberías ser redirigido a /explore
```

### 3. Verificar Firebase

```
Firebase Console → Authentication → Users
- Deberías ver tu usuario registrado
```

## 🎯 Primeros Pasos

### Crear el Usuario Administrador

```
1. Registra un usuario con email: admin@truekland.com
2. Login con ese usuario
3. Serás redirigido automáticamente a /admin
4. Ya tienes acceso al panel de administración
```

### Publicar tu Primer Producto

```
1. Click en "Publicar" en la navegación
2. Sube al menos una imagen
3. Llena los campos requeridos:
   - Título
   - Descripción
   - Categoría
4. Click en "Publicar Producto"
```

### Probar el Chat

```
1. Crea un segundo usuario (otra cuenta)
2. Con el primer usuario, ve a /explore
3. Click en un producto del segundo usuario
4. Click en "Contactar"
5. Envía un mensaje
6. Cambia al segundo usuario y ve a /chats
7. Deberías ver el mensaje
```

## 🔥 Funcionalidades Disponibles

| Característica | Ruta | Descripción |
|---------------|------|-------------|
| Explorar | `/explore` | Ver todos los productos |
| Publicar | `/add-post` | Crear nuevo producto |
| Chats | `/chats` | Ver conversaciones |
| Intercambios | `/exchanges` | Gestionar truques |
| Perfil | `/profile` | Tu perfil y productos |
| Admin | `/admin` | Panel administrador |

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm dev          # Ejecutar en http://localhost:3000

# Build
pnpm build        # Compilar para producción
pnpm start        # Servidor de producción

# Calidad de código
pnpm lint         # Verificar errores
pnpm type-check   # Verificar tipos TypeScript

# Limpiar
rm -rf .next      # Limpiar build cache
rm -rf node_modules && pnpm install  # Reinstalar dependencias
```

## ❓ Problemas Comunes

### Error: "Firebase not configured"

**Solución**: Verifica que tu `.env.local` tiene todas las variables y son correctas.

### Error: "Port 3000 already in use"

**Solución**: 
```bash
pnpm dev -p 3001  # Usa otro puerto
```

### No se ven las imágenes

**Solución**: Verifica que Storage está habilitado en Firebase Console.

### Error al registrarse

**Solución**: Verifica que Authentication con Email/Password está habilitado.

## 📚 Siguiente Paso

Ahora que tienes todo funcionando, explora la documentación:

- [Configuración Completa](./configuration.md) - Setup detallado
- [Estructura del Proyecto](../02-architecture/project-structure.md) - Entender el código
- [Sistema de Diseño](../02-architecture/design-system.md) - Paleta de colores y componentes

## 🎉 ¡Listo!

Ya tienes TrueKland funcionando en tu máquina. ¡Feliz desarrollo!

---

**¿Necesitas ayuda?** Consulta el [README principal](../../README.md) o la [documentación completa](../README.md).
