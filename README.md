# 🌟 TruekLand - Intercambia, Conecta y Descubre

Una plataforma moderna de intercambio de artículos donde cada objeto tiene una segunda oportunidad. Construida con Next.js 15, React 19, TypeScript y Firebase.

## ✨ Características Principales

- 🔐 **Autenticación Segura** - Login con Google y email
- 📱 **PWA Completa** - Instalable y funciona offline
- 🎨 **Diseño Responsive** - Optimizado para móviles y desktop
- 💬 **Chat en Tiempo Real** - Comunicación directa entre usuarios
- 🔄 **Sistema de Intercambios** - Gestión completa de truques
- 📸 **Subida de Imágenes** - Múltiples fotos por producto
- 🏷️ **Categorización** - Organización intuitiva de productos
- 🌙 **Modo Oscuro** - Interfaz adaptable

## � Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **PWA**: Service Worker, Manifest
- **Estado**: Context API, Custom Hooks

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone [tu-repositorio]
cd truekland
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```
Edita `.env.local` con tus credenciales de Firebase.

4. **Ejecutar en desarrollo**
```bash
pnpm dev
```

## 🔧 Scripts Disponibles

- `pnpm dev` - Servidor de desarrollo
- `pnpm build` - Build de producción
- `pnpm start` - Servidor de producción
- `pnpm lint` - Linter con corrección automática
- `pnpm lint:check` - Solo verificar errores
- `pnpm type-check` - Verificación de tipos TypeScript

## 🏗️ Estructura del Proyecto

```
truekland/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Página principal
│   ├── profile/           # Perfil de usuario
│   ├── add-post/          # Agregar productos
│   └── ...
├── components/            # Componentes reutilizables
│   ├── auth/             # Autenticación
│   ├── products/         # Productos
│   ├── ui/               # Componentes de UI
│   └── ...
├── lib/                  # Utilidades y configuración
├── context/              # Contextos de React
├── assets/               # Recursos estáticos
└── public/               # Archivos públicos
```

## 🔒 Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Crear base de datos Firestore
4. Configurar Storage para imágenes
5. Agregar las credenciales a `.env.local`

## 🎨 Personalización

### Colores del Tema
Los colores principales están definidos en:
- `#91f2b3` - Verde primario
- `#fcf326` - Amarillo secundario

### Componentes UI
Utilizamos Radix UI + Tailwind CSS para una experiencia consistente.

## 📱 PWA

La aplicación está configurada como PWA con:
- Manifest.json
- Service Worker (automático con Next.js)
- Iconos optimizados
- Funcionalidad offline básica

## 🚀 Deployment

### Vercel (Recomendado)
```bash
vercel --prod
```

### Otras Plataformas
Asegúrate de configurar las variables de entorno en tu plataforma de deployment.

## 🔍 SEO

- Meta tags completos
- Open Graph configurado
- Sitemap automático
- Structured data

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

---

**¡Gracias por usar TrueKland! 🌟**
