# 🚀 Guía de Despliegue para TruekLand

## Pre-requisitos de Producción

### 1. Variables de Entorno
Crea un archivo `.env.local` con las siguientes variables:

```bash
# Firebase Configuration (OBLIGATORIO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Environment
NODE_ENV=production
```

### 2. Configuración de Firebase
- Asegúrate de que Firestore esté configurado en modo producción
- Sube las reglas de seguridad: `firebase deploy --only firestore:rules`
- Configura las reglas de Storage: `firebase deploy --only storage`

### 3. Verificación Pre-Despliegue
Ejecuta nuestro script de verificación:

```bash
npm run deploy-ready
```

Este comando ejecutará:
- ✅ Verificación de linting
- ✅ Verificación de tipos TypeScript
- ✅ Verificación de configuración
- ✅ Build de producción

## Opciones de Despliegue

### 🟢 Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Vercel detectará automáticamente que es un proyecto Next.js
4. El despliegue será automático en cada push

### 🟡 Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Build command: `npm run build`
4. Publish directory: `.next`

### 🟠 Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

### 🔵 Docker
```dockerfile
# Dockerfile incluido en el proyecto
docker build -t truekland .
docker run -p 3000:3000 truekland
```

## Configuración de Dominio

### DNS Records
- A record: apunta a la IP de tu servidor
- CNAME record: www.tudominio.com → tudominio.com

### SSL/TLS
- La mayoría de plataformas incluyen SSL automático
- Para dominios personalizados, configura Let's Encrypt

## Monitoreo y Mantenimiento

### 📊 Analytics
- Configura Google Analytics si está habilitado
- Monitorea el rendimiento en Core Web Vitals

### 🐛 Error Tracking
- Considera integrar Sentry para tracking de errores
- Configura logs apropiados para debugging

### 🔄 Actualizaciones
- Mantén las dependencias actualizadas
- Revisa regularmente las reglas de Firebase

## Checklist Final

- [ ] Variables de entorno configuradas
- [ ] Reglas de Firebase desplegadas
- [ ] SSL certificado configurado
- [ ] Dominio personalizado funcionando
- [ ] Tests de funcionalidad realizados
- [ ] Backup de datos importante
- [ ] Monitoreo configurado

## Troubleshooting

### Error: "Firebase configuration missing"
- Verifica que todas las variables NEXT_PUBLIC_FIREBASE_* estén configuradas

### Error: "Permission denied"
- Revisa las reglas de Firestore en la consola de Firebase

### Build fails
- Ejecuta `npm run lint:check` y `npm run type-check` para identificar errores

## Soporte Post-Despliegue

### Respaldos
- Exporta regularmente los datos de Firestore
- Mantén backups de las reglas de seguridad

### Escalabilidad
- Monitorea el uso de Firebase
- Considera el plan de precios según el crecimiento

¡Tu aplicación TruekLand está lista para conquistar el mundo! 🌍✨
