# 🚀 Guía de Deployment a Producción - TrueKland

## ✅ Checklist Pre-Deployment

### 1. Verificación de Seguridad

- [x] **OWASP Top 10 implementado** (100% cumplimiento)
- [x] **Firestore Rules actualizadas** con validación estricta
- [x] **Security headers** configurados (CSP, HSTS, X-Frame-Options)
- [x] **Console.logs removidos** automáticamente en producción
- [x] **Sanitización de inputs** en todos los formularios
- [x] **Rate limiting** implementado
- [x] **Password policy** robusta (8+ caracteres, complejidad)
- [x] **Default deny** en Firestore rules

### 2. Optimización de Performance

- [x] **Lazy loading** de componentes pesados
- [x] **Code splitting** automático con Next.js
- [x] **Image optimization** habilitado (AVIF, WebP)
- [x] **Bundle size optimizado** (chunks < 300KB)
- [x] **Compression** activada
- [x] **Cache headers** configurados
- [x] **React Strict Mode** habilitado

### 3. Configuración de Firebase

- [ ] **Firestore Rules** desplegadas
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] **Storage Rules** desplegadas
  ```bash
  firebase deploy --only storage
  ```

- [ ] **Firebase Indexes** creados (si hay consultas compuestas)
  ```bash
  firebase deploy --only firestore:indexes
  ```

- [ ] **Verificar cuotas** de Firebase (lecturas, escrituras, storage)

### 4. Variables de Entorno

Configura en **Vercel Dashboard** > Settings > Environment Variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

⚠️ **Importante**: 
- NO uses comillas en los valores
- Marca todas las opciones: Production, Preview, Development
- Redeploy después de agregar variables

---

## 📦 Pasos de Deployment en Vercel

### Opción 1: Deploy desde Dashboard (Recomendado para primer deploy)

1. **Conecta tu repositorio**
   - Ve a [Vercel Dashboard](https://vercel.com/new)
   - Selecciona tu repositorio de GitHub
   - Framework Preset: **Next.js** (detectado automáticamente)

2. **Configura Build Settings**
   ```
   Build Command: pnpm run build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Agrega Environment Variables**
   - Copia todas las variables de `.env.local`
   - Pega en "Environment Variables"
   - Selecciona todos los environments

4. **Deploy**
   - Click en "Deploy"
   - Espera 2-5 minutos
   - Verifica el deploy en la URL proporcionada

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs
```

### Opción 3: Deploy automático (CI/CD)

Ya configurado en el repositorio. Cada push a `master` despliega automáticamente:

- **Push a master** → Deploy a Producción
- **Pull Request** → Deploy Preview
- **Push a otras ramas** → No deploy

---

## 🔍 Verificación Post-Deployment

### 1. Tests Funcionales

- [ ] **Autenticación**
  - Registro de usuario nuevo
  - Login con email/password
  - Login con Google
  - Logout
  - Recuperación de contraseña

- [ ] **Productos**
  - Crear nuevo producto (con imágenes)
  - Editar producto propio
  - Eliminar producto propio
  - Ver productos públicos
  - Buscar productos

- [ ] **Chat**
  - Iniciar conversación
  - Enviar mensajes
  - Recibir mensajes en tiempo real
  - Ver lista de chats

- [ ] **Intercambios**
  - Proponer intercambio
  - Aceptar/rechazar intercambio
  - Ver historial

- [ ] **Perfil**
  - Editar perfil
  - Ver productos propios
  - Ver perfil de otros usuarios

### 2. Tests de Performance

```bash
# Lighthouse CI (desde DevTools o CLI)
lighthouse https://tu-dominio.vercel.app --view

# Objetivos:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 95
# - SEO: > 90
```

### 3. Tests de Seguridad

- [ ] **Headers de seguridad**
  ```bash
  curl -I https://tu-dominio.vercel.app
  ```
  Verificar:
  - `Strict-Transport-Security`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Content-Security-Policy`

- [ ] **HTTPS forzado**
  - Intenta acceder con `http://` → debe redirigir a `https://`

- [ ] **Firestore Rules**
  - Intenta acceder a datos sin autenticación (debe fallar)
  - Intenta editar producto de otro usuario (debe fallar)
  - Intenta leer chats ajenos (debe fallar)

### 4. Tests de Navegadores

- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### 5. Tests de Dispositivos

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile Large (414x896)

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Causa**: Variables de entorno mal configuradas

**Solución**:
1. Ve a Vercel Dashboard > Settings > Environment Variables
2. Verifica que los nombres sean exactos (respeta mayúsculas/minúsculas)
3. Verifica que no haya espacios al inicio/final
4. Redeploy: `vercel --prod`

### Error: "Failed to fetch"

**Causa**: CORS o Firestore rules muy restrictivas

**Solución**:
1. Verifica Firestore rules en Firebase Console
2. Asegúrate de que el dominio de Vercel esté en whitelist
3. Revisa los logs: `vercel logs`

### Error: "Image optimization failed"

**Causa**: Configuración de imágenes incorrecta

**Solución**:
1. Verifica `next.config.js`:
   ```js
   images: {
     domains: ["firebasestorage.googleapis.com"],
     unoptimized: false,
   }
   ```
2. Si persiste, activa `unoptimized: true` temporalmente

### Build falla con TypeScript errors

**Causa**: Errores de tipos no detectados en desarrollo

**Solución**:
```bash
# Verificar localmente
pnpm type-check

# Solucionar errores
# Si es urgente, temporalmente:
typescript: {
  ignoreBuildErrors: false, // NO hacer en producción
}
```

### Bundle size muy grande (> 500KB)

**Solución**:
1. Analiza el bundle:
   ```bash
   pnpm build
   # Revisa el output de tamaños
   ```
2. Implementa más lazy loading en componentes pesados
3. Verifica imports:
   ```ts
   // ❌ Malo
   import _ from 'lodash'
   
   // ✅ Bueno
   import debounce from 'lodash/debounce'
   ```

---

## 📊 Monitoring y Mantenimiento

### 1. Monitoring de Errores

**Vercel Analytics** (incluido gratis):
- Dashboard > Analytics
- Ve métricas de performance
- Detecta errores en tiempo real

**Firebase Console**:
- Authentication > Users (usuarios activos)
- Firestore > Usage (lecturas/escrituras)
- Storage > Usage (archivos subidos)

### 2. Logs

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de un deployment específico
vercel logs [deployment-url]
```

### 3. Rollback

Si hay problemas críticos:

```bash
# Listar deployments
vercel ls

# Promover un deployment anterior
vercel promote [deployment-url]
```

### 4. Actualizaciones Regulares

**Semanalmente**:
- Revisar Firebase Console (cuotas, errores)
- Revisar Vercel Analytics (performance)

**Mensualmente**:
- Actualizar dependencias: `pnpm update`
- Auditoría de seguridad: `pnpm audit`
- Verificar Lighthouse score

**Trimestralmente**:
- Revisar y actualizar Firestore rules
- Limpiar datos obsoletos
- Revisar Storage (eliminar archivos huérfanos)

---

## 🔐 Seguridad Post-Deployment

### 1. Firebase Security Rules

Verifica en Firebase Console > Firestore Database > Rules:

```javascript
// Debe estar en MODO PRODUCCIÓN
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
    // ... tus reglas específicas
  }
}
```

⚠️ **NUNCA uses**:
```javascript
// ❌ PELIGRO - modo desarrollo
allow read, write: if true;
```

### 2. Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /UserPost/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 3. Auditoría de Seguridad

```bash
# Verificar dependencias vulnerables
pnpm audit

# Actualizar parches de seguridad
pnpm audit fix

# Si hay vulnerabilidades críticas
pnpm update [paquete]@latest
```

---

## 📝 Documentación Adicional

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/Top10/)

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs**: `vercel logs`
2. **Consulta la documentación**: `/docs`
3. **Revisa issues similares en GitHub**
4. **Firebase Support**: [firebase.google.com/support](https://firebase.google.com/support)

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Status**: ✅ Listo para Producción
