# 🚀 Guía de Despliegue a Producción - TruekLand

## ✅ Pre-requisitos

### 1. Verificación del Proyecto
```bash
npm run pre-production
```

### 2. Variables de Entorno
Asegúrate de tener configuradas todas las variables de entorno necesarias:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Producción
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

## 🔧 Configuración de Firebase

### 1. Reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

### 2. Configuración de Authentication
- Habilita los métodos de autenticación necesarios
- Configura dominios autorizados
- Configura políticas de contraseñas

### 3. Storage Rules
```bash
firebase deploy --only storage
```

## 🌐 Opciones de Despliegue

### Opción 1: Vercel (Recomendado)
```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel --prod
```

### Opción 2: Netlify
```bash
# Build local
npm run build

# Sube la carpeta .next/static y out/
```

### Opción 3: Firebase Hosting
```bash
# Instala Firebase CLI
npm install -g firebase-tools

# Configura Firebase
firebase init hosting

# Despliega
firebase deploy --only hosting
```

## 🔒 Checklist de Seguridad

- [ ] Variables de entorno configuradas
- [ ] Firestore rules desplegadas
- [ ] Storage rules configuradas
- [ ] CSP (Content Security Policy) configurada
- [ ] HTTPS habilitado
- [ ] Dominios autorizados en Firebase
- [ ] Rate limiting configurado

## 📊 Monitoreo Post-Despliegue

### 1. Firebase Analytics
```javascript
// Ya configurado en el proyecto
```

### 2. Performance Monitoring
```javascript
// Verificar métricas en Firebase Console
```

### 3. Error Tracking
- Revisar Firebase Crashlytics
- Configurar alertas

## 🔧 Configuraciones Específicas por Plataforma

### Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Netlify
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

## 🚨 Troubleshooting

### Error: Firebase not initialized
- Verificar variables de entorno
- Comprobar configuración de Firebase

### Error: Build failed
```bash
npm run clean
npm install
npm run build
```

### Error: Authentication not working
- Verificar dominios autorizados en Firebase Console
- Comprobar configuración de OAuth

## 📱 PWA Configuration

El proyecto ya está configurado como PWA:
- ✅ Manifest.json configurado
- ✅ Service Worker (Next.js automático)
- ✅ Iconos optimizados
- ✅ Tema y colores configurados

## 🔄 Actualizaciones Futuras

### Desarrollo
```bash
git checkout develop
git pull origin develop
# hacer cambios
git push origin develop
```

### Producción
```bash
git checkout main
git merge develop
git push origin main
# El despliegue se hará automáticamente
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:
1. Revisa los logs de la plataforma de hosting
2. Verifica la configuración de Firebase
3. Comprueba las variables de entorno
4. Ejecuta el script de verificación local

---

**¡Tu aplicación TruekLand está lista para cambiar el mundo del intercambio!** 🌟
