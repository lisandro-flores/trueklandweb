# 🚢 Guía de Despliegue

## Pre-requisitos

- Cuenta en [Vercel](https://vercel.com) (recomendado) o plataforma similar
- Proyecto de Firebase en producción configurado
- Variables de entorno preparadas

## Despliegue en Vercel

### Paso 1: Preparar el Proyecto

```bash
# Verificar que todo compile
pnpm build

# Verificar que no haya errores
pnpm lint
```

### Paso 2: Conectar con Vercel

#### Opción A: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Opción B: Desde Dashboard

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel:

1. Settings → Environment Variables
2. Agrega todas las variables de `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_produccion
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### Paso 4: Deploy

```bash
# Production deploy
vercel --prod
```

## Configuración de Firebase para Producción

### 1. Dominios Autorizados

En Firebase Console → Authentication → Settings → Authorized domains:

- Agrega tu dominio de Vercel: `tu-app.vercel.app`
- Si tienes dominio custom: `tudominio.com`

### 2. Reglas de Firestore

Despliega las reglas de seguridad:

```bash
firebase deploy --only firestore:rules
```

### 3. Reglas de Storage

```bash
firebase deploy --only storage
```

### 4. Verificar Cuotas

- Authentication: 10,000 verificaciones/día (plan gratuito)
- Firestore: 50,000 lecturas/día
- Storage: 1GB almacenamiento, 5GB descarga/día

## Optimizaciones para Producción

### 1. Images

Las imágenes ya usan Next.js Image con optimización automática:
```tsx
<Image
  src={url}
  alt="Descripción"
  fill
  className="object-cover"
/>
```

### 2. Caching

Next.js cachea automáticamente:
- Static pages: Indefinidamente
- Dynamic pages: Según configuración

### 3. Bundle Size

Para verificar el tamaño del bundle:

```bash
pnpm build
pnpm analyze
```

## Dominios Personalizados

### Configurar en Vercel

1. Settings → Domains
2. Add Domain: `tudominio.com`
3. Configurar DNS:
   - Type: CNAME
   - Name: @
   - Value: cname.vercel-dns.com

### Configurar en Firebase

1. Authentication → Authorized domains → Add domain
2. Agrega: `tudominio.com` y `www.tudominio.com`

## SSL/HTTPS

Vercel proporciona SSL automáticamente:
- Certificado Let's Encrypt
- Renovación automática
- HTTPS forzado por defecto

## Monitoreo Post-Deploy

### 1. Analytics de Vercel

- Dashboard → Analytics
- Ver métricas de rendimiento
- Core Web Vitals

### 2. Firebase Console

- Authentication → Users (verificar registros)
- Firestore → Data (verificar escrituras)
- Storage → Files (verificar uploads)

### 3. Logs

```bash
# Ver logs en tiempo real
vercel logs tu-deployment-url --follow
```

## Rollback en Caso de Problemas

### Desde CLI

```bash
# Ver deployments
vercel list

# Hacer rollback
vercel rollback [deployment-url]
```

### Desde Dashboard

1. Deployments → Ver historial
2. Click en deployment anterior
3. Promote to Production

## Checklist de Despliegue

- [ ] Build exitoso localmente
- [ ] Todas las variables de entorno configuradas
- [ ] Firebase configurado para producción
- [ ] Dominios autorizados en Firebase
- [ ] Reglas de Firestore desplegadas
- [ ] Reglas de Storage desplegadas
- [ ] SSL configurado (automático en Vercel)
- [ ] Analytics habilitado
- [ ] Usuario admin creado
- [ ] Pruebas en producción completadas

## Troubleshooting

### Error: Firebase not configured

**Causa**: Variables de entorno no configuradas en Vercel

**Solución**: Verifica que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén en Vercel Settings

### Error: Unauthorized domain

**Causa**: Dominio no autorizado en Firebase

**Solución**: Agrega el dominio en Firebase Console → Authentication → Authorized domains

### Error: 404 en rutas dinámicas

**Causa**: Vercel necesita rebuilding

**Solución**: 
```bash
vercel --force
```

## Próximos Pasos

- [Checklist de Producción](./production-checklist.md)
- [Variables de Entorno](./environment-variables.md)
