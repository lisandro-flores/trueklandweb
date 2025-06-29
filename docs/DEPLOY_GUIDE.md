# 🚀 Guía de Despliegue - TruekLand

## 📋 Pre-requisitos

### 1. Configuración de Firebase
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto o usar uno existente
3. Habilitar servicios necesarios:
   - **Authentication** (Google, Email/Password)
   - **Firestore Database**
   - **Storage**
4. Obtener configuración del proyecto

### 2. Variables de Entorno
Crear `.env.local` con tu configuración de Firebase:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 🔥 Configuración de Firebase

### 1. Firestore Database
1. Crear base de datos en modo **Test** inicialmente
2. Aplicar las reglas de seguridad desde `firestore.rules`:

```javascript
// Copiar el contenido de firestore.rules y aplicar en la consola
```

### 2. Authentication
1. Habilitar **Google** provider
2. Habilitar **Email/Password** provider
3. Configurar dominio autorizado

### 3. Storage
1. Habilitar Firebase Storage
2. Configurar reglas de seguridad para imágenes
3. Crear carpetas: `products/`, `profiles/`

### 4. Collections Iniciales
Crear estas colecciones en Firestore:

- `Category` - Para categorías de productos
- `UserPost` - Para productos publicados
- `exchanges` - Para intercambios
- `chats` - Para conversaciones
- `notifications` - Para notificaciones

---

## 🌐 Despliegue en Vercel (Recomendado)

### 1. Preparación
```bash
# Instalar Vercel CLI
npm i -g vercel

# En el directorio del proyecto
cd truekland
```

### 2. Despliegue
```bash
# Primer despliegue
vercel

# Seguir las instrucciones:
# - Set up and deploy "truekland"? Yes
# - Which scope? Tu cuenta/equipo
# - Link to existing project? No
# - Project name: truekland
# - Directory: ./
# - Override settings? No

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... agregar todas las variables
```

### 3. Dominio Personalizado (Opcional)
```bash
# Agregar dominio custom
vercel domains add your-domain.com
vercel alias your-deployment-url.vercel.app your-domain.com
```

---

## 🚀 Despliegue en Netlify

### 1. Build Settings
- **Base directory:** `truekland/`
- **Build command:** `npm run build`
- **Publish directory:** `.next/`

### 2. Environment Variables
Agregar en Netlify Dashboard > Site Settings > Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
# ... todas las variables
```

### 3. Deploy
- Conectar repositorio GitHub
- Configurar auto-deploy en `main` branch
- First deploy automático

---

## 🐳 Docker (Opcional)

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Deploy con Docker
```bash
# Build
docker build -t truekland .

# Run
docker run -p 3000:3000 truekland
```

---

## ✅ Checklist Post-Despliegue

### Funcionalidad
- [ ] Registro de usuarios funciona
- [ ] Login con Google funciona
- [ ] Subida de imágenes funciona
- [ ] Creación de productos funciona
- [ ] Sistema de intercambios funciona
- [ ] Chat en tiempo real funciona
- [ ] Notificaciones funcionan

### Performance
- [ ] Lighthouse score > 90
- [ ] Tiempo de carga < 3 segundos
- [ ] Imágenes optimizadas
- [ ] Mobile responsive

### SEO
- [ ] Meta tags configurados
- [ ] Sitemap generado
- [ ] Robots.txt configurado
- [ ] Open Graph tags

### Seguridad
- [ ] HTTPS habilitado
- [ ] Firebase rules aplicadas
- [ ] Variables de entorno seguras
- [ ] Headers de seguridad

---

## 📊 Monitoreo y Analytics

### 1. Google Analytics
```javascript
// En app/layout.tsx, agregar:
// Google Analytics tracking code
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

### 3. Performance Monitoring
- Vercel Analytics (automático)
- Web Vitals tracking
- Firebase Performance Monitoring

---

## 🔧 Mantenimiento

### Updates Regulares
```bash
# Actualizar dependencias
npm update

# Revisar vulnerabilidades
npm audit

# Build y test
npm run build
npm run type-check
npm run lint
```

### Backup
- Firestore: Export automático semanal
- Storage: Sync con cloud storage
- Code: GitHub repository protegido

---

## 🆘 Troubleshooting

### Errores Comunes

**1. Firebase Connection Issues**
- Verificar variables de entorno
- Comprobar reglas de Firestore
- Revisar dominios autorizados

**2. Build Failures**
- `npm run type-check` para errores TypeScript
- `npm run lint` para errores ESLint
- Verificar imports y exports

**3. Performance Issues**
- Optimizar imágenes
- Revisar bundle size
- Implementar lazy loading

### Logs y Debugging
```bash
# Logs de Vercel
vercel logs

# Logs de Netlify
netlify logs

# Logs locales
npm run dev -- --debug
```

---

## 📞 Soporte

Para problemas técnicos:
1. Revisar la documentación en `README.md`
2. Consultar los logs de despliegue
3. Verificar configuración de Firebase
4. Contactar al equipo de desarrollo

---

*Guía de despliegue para TruekLand - Versión 1.0*
*Última actualización: 28 de junio de 2025*
