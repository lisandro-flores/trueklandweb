# 🚨 Tareas Críticas - TrueKland

## Resolver HOY (Bloquea el desarrollo)

### 1. Configuración Firebase
```bash
# Crear archivo .env.local con tus credenciales reales
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 2. Limpiar Dependencias Conflictivas
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. Configurar React 18 (Compatibilidad)
El proyecto usa React 19 que tiene problemas de compatibilidad.
Considera downgrade a React 18 LTS para estabilidad.

### 4. Definir Estructura de Base de Datos
Firestore necesita colecciones bien definidas:
- Users
- UserPost  
- Category
- Chats
- Messages
