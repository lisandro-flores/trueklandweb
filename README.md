# 🌍 TrueKland - Plataforma de Intercambio Sostenible# 🌟 TrueKland - Plataforma de Intercambio# 🌟 TruekLand - Intercambia, Conecta y Descubre



<div align="center">



**Cada objeto merece una segunda oportunidad**> Intercambia, Conecta y Descubre - Una plataforma moderna donde cada objeto tiene una segunda oportunidad.Una plataforma moderna de intercambio de artículos donde cada objeto tiene una segunda oportunidad. Construida con Next.js 15, React 19, TypeScript y Firebase.



[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat&logo=next.js)](https://nextjs.org/)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)## ✨ Características Principales

[![Firebase](https://img.shields.io/badge/Firebase-11.9-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)

[![OWASP](https://img.shields.io/badge/OWASP-100%25-success?style=flat)](https://owasp.org/Top10/)[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)



[Demo en Vivo](https://truekland.vercel.app) · [Documentación](./docs) · [Reportar Bug](https://github.com/lisandro-flores/trueklandweb/issues)[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)- 🔐 **Autenticación Segura** - Login con Google y email



</div>[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange)](https://firebase.google.com/)- 📱 **PWA Completa** - Instalable y funciona offline



---- 🎨 **Diseño Responsive** - Optimizado para móviles y desktop



## ✨ Características Principales## ✨ Características Principales- 💬 **Chat en Tiempo Real** - Comunicación directa entre usuarios



- 🔐 **Autenticación Segura**: Email/Password + Google OAuth con Firebase- 🔄 **Sistema de Intercambios** - Gestión completa de truques

- 📦 **Gestión de Productos**: CRUD completo con validación y sanitización

- 💬 **Chat en Tiempo Real**: Mensajería instantánea### 🔐 Autenticación Completa- 📸 **Subida de Imágenes** - Múltiples fotos por producto

- 🔄 **Sistema de Intercambios**: Proponer y gestionar intercambios

- 👤 **Perfiles de Usuario**: Edición completa y gestión de productos- Login con Google y Email/Password- 🏷️ **Categorización** - Organización intuitiva de productos

- 🔍 **Búsqueda Avanzada**: Por categoría, título, ubicación

- 📱 **Progressive Web App**: Instalable y offline-ready- Recuperación de contraseña- 🌙 **Modo Oscuro** - Interfaz adaptable

- 🎨 **Dark Theme Profesional**: Diseño moderno optimizado

- Panel de administración protegido (`admin@truekland.com`)

---

## � Tecnologías Utilizadas

## 🚀 Tech Stack

### 💬 Sistema de Chat en Tiempo Real

**Frontend**: Next.js 15.5.6 · React 19.0 · TypeScript 5.0 · TailwindCSS · Shadcn/ui

- Conversaciones instantáneas entre usuarios- **Frontend**: Next.js 15, React 19, TypeScript

**Backend**: Firebase (Auth, Firestore, Storage) · Zod Validation

- Indicador de "escribiendo..."- **Styling**: Tailwind CSS, shadcn/ui

**Security**: OWASP Top 10 (100% compliance) · CSP Headers · Rate Limiting

- Notificaciones push del navegador- **Backend**: Firebase (Auth, Firestore, Storage)

**Performance**: Code Splitting · Lazy Loading · Image Optimization (AVIF/WebP)

- Contador de mensajes no leídos- **Icons**: Lucide React

---

- Sonido de notificación- **PWA**: Service Worker, Manifest

## 🏁 Inicio Rápido

- **Estado**: Context API, Custom Hooks

```bash

# 1. Clonar e instalar### 🔄 Gestión de Intercambios

git clone https://github.com/lisandro-flores/trueklandweb.git

cd trueklandweb- Propuestas de intercambio entre usuarios## 📦 Instalación

pnpm install

- Estados: Pendiente, Aceptado, Rechazado, Completado

# 2. Configurar variables de entorno

cp .env.example .env.local- Historial completo de transacciones1. **Clonar el repositorio**

# Edita .env.local con tus credenciales de Firebase

```bash

# 3. Iniciar desarrollo

pnpm dev### 📱 Progressive Web App (PWA)git clone [tu-repositorio]



# Abrir http://localhost:3000- Instalable en dispositivos móviles y desktopcd truekland

```

- Funciona offline```

### Configuración Firebase

- Notificaciones push

1. Crea proyecto en [Firebase Console](https://console.firebase.google.com/)

2. Habilita Authentication (Email/Password + Google)- Experiencia nativa2. **Instalar dependencias**

3. Crea Firestore Database y Storage

4. Copia credenciales a `.env.local````bash

5. Despliega rules: `firebase deploy --only firestore:rules`

### 🎨 Diseño Profesionalpnpm install

---

- Tema oscuro completo (Navy Blue + Brand Gradient)```

## 🔐 Seguridad (OWASP Top 10 - 100%)

- Paleta de colores: Verde menta (#91f2b3) + Amarillo lima (#fcf326)

✅ **A01** - Control de acceso (Firestore Rules)  

✅ **A02** - Encriptación (HTTPS, Firebase Auth)  - Alto contraste (21:1) para accesibilidad3. **Configurar variables de entorno**

✅ **A03** - Protección contra inyección (sanitización)  

✅ **A04** - Diseño seguro (rate limiting, validación)  - Responsive design (Mobile First)```bash

✅ **A05** - Configuración segura (security headers, CSP)  

✅ **A06** - Dependencias actualizadas  - Animaciones fluidascp .env.example .env.local

✅ **A07** - Autenticación robusta (password policy)  

✅ **A08** - Integridad de datos (validación multi-capa)  ```

✅ **A09** - Logging seguro  

✅ **A10** - Protección SSRF  ### 🏷️ Gestión de ProductosEdita `.env.local` con tus credenciales de Firebase.



Ver documentación completa: [docs/05-maintenance/security.md](./docs/05-maintenance/security.md)- Subida de múltiples imágenes



---- Categorización intuitiva4. **Ejecutar en desarrollo**



## ⚡ Performance- Búsqueda y filtros```bash



**Lighthouse Score**: 95+ en todas las métricas  - Valor aproximado en MXNpnpm dev

**First Load JS**: < 300KB  

**Optimizaciones**: Code splitting, lazy loading, image optimization, aggressive caching- Edición y eliminación```



---



## 📁 Estructura del Proyecto## 🛠️ Tech Stack## 🔧 Scripts Disponibles



```

trueklandweb/

├── app/              # Next.js App Router| Tecnología | Versión | Uso |- `pnpm dev` - Servidor de desarrollo

├── components/       # Componentes React

│   ├── auth/        # Autenticación|-----------|---------|-----|- `pnpm build` - Build de producción

│   ├── chat/        # Sistema de chat

│   ├── products/    # Gestión de productos| Next.js | 15.2.4 | Framework React con App Router |- `pnpm start` - Servidor de producción

│   └── ui/          # Componentes UI (Shadcn)

├── lib/             # Utilidades| React | 19 | Biblioteca UI |- `pnpm lint` - Linter con corrección automática

│   ├── firebase.ts

│   ├── security.ts| TypeScript | 5.0 | Lenguaje tipado |- `pnpm lint:check` - Solo verificar errores

│   └── validations.ts

├── docs/            # Documentación completa| Tailwind CSS | 3.4 | Estilos utility-first |- `pnpm type-check` - Verificación de tipos TypeScript

├── firestore.rules  # Reglas de seguridad

└── vercel.json      # Config de Vercel| Firebase | 11.9.1 | Backend (Auth, Firestore, Storage) |

```

| shadcn/ui | Latest | Componentes UI |## 🏗️ Estructura del Proyecto

---

| Lucide React | Latest | Iconos |

## 🚢 Deploy a Producción

```

### Vercel (Recomendado)

## 🚀 Inicio Rápidotruekland/

```bash

vercel --prod├── app/                    # App Router de Next.js

```

### Prerrequisitos│   ├── dashboard/         # Página principal

### Checklist Pre-Deploy

│   ├── profile/           # Perfil de usuario

- [ ] Firestore Rules desplegadas

- [ ] Variables de entorno configuradas en Vercel- Node.js 18.0 o superior│   ├── add-post/          # Agregar productos

- [ ] Build exitoso: `pnpm build`

- [ ] Lighthouse score > 90- pnpm 8.0 o superior (recomendado)│   └── ...



Ver guía completa: [docs/04-deployment/production-deployment.md](./docs/04-deployment/production-deployment.md)- Cuenta de Firebase├── components/            # Componentes reutilizables



---│   ├── auth/             # Autenticación



## 📚 Documentación### Instalación│   ├── products/         # Productos



- 📖 [Getting Started](./docs/01-getting-started/quick-start.md) - Inicio en 10 minutos│   ├── ui/               # Componentes de UI

- 🏗️ [Architecture](./docs/02-architecture/project-structure.md) - Estructura

- 🔒 [Security](./docs/05-maintenance/security.md) - OWASP Top 10```bash│   └── ...

- 🚀 [Deployment](./docs/04-deployment/production-deployment.md) - Producción

# 1. Clonar el repositorio├── lib/                  # Utilidades y configuración

---

git clone https://github.com/lisandro-flores/trueklandweb.git├── context/              # Contextos de React

## 📄 Scripts Disponibles

cd trueklandweb├── assets/               # Recursos estáticos

```bash

pnpm dev           # Desarrollo (localhost:3000)└── public/               # Archivos públicos

pnpm build         # Build de producción

pnpm start         # Servidor producción# 2. Instalar dependencias```

pnpm lint          # Lint y fix

pnpm type-check    # Verificar tipospnpm install

pnpm audit         # Auditoría seguridad

```## 🔒 Configuración de Firebase



---# 3. Configurar variables de entorno



## 🤝 Contribuircp .env.example .env.local1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)



Las contribuciones son bienvenidas. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.# Edita .env.local con tus credenciales de Firebase2. Habilitar Authentication (Email/Password)



1. Fork el proyecto3. Crear base de datos Firestore

2. Crea tu branch: `git checkout -b feature/AmazingFeature`

3. Commit: `git commit -m 'Add: AmazingFeature'`# 4. Ejecutar en desarrollo4. Configurar Storage para imágenes

4. Push: `git push origin feature/AmazingFeature`

5. Abre un Pull Requestpnpm dev5. Agregar las credenciales a `.env.local`



---```



## 📄 Licencia## 🎨 Personalización



MIT License - Ver [LICENSE](LICENSE) para detallesLa aplicación estará disponible en [http://localhost:3000](http://localhost:3000)



---### Colores del Tema



<div align="center">## 📚 DocumentaciónLos colores principales están definidos en:



**Hecho con ❤️ para un futuro más sostenible**- `#91f2b3` - Verde primario



⭐ Si te gusta el proyecto, dale una estrella en GitHubLa documentación completa está organizada en `/docs`:- `#fcf326` - Amarillo secundario



[⬆ Volver arriba](#-truekland---plataforma-de-intercambio-sostenible)



</div>- **[Inicio Rápido](./docs/01-getting-started/)** - Instalación y configuración### Componentes UI


- **[Arquitectura](./docs/02-architecture/)** - Estructura del proyecto y diseñoUtilizamos Radix UI + Tailwind CSS para una experiencia consistente.

- **[Funcionalidades](./docs/03-features/)** - Guías de características

- **[Despliegue](./docs/04-deployment/)** - Guía para producción## 📱 PWA

- **[Mantenimiento](./docs/05-maintenance/)** - Actualizaciones y solución de problemas

La aplicación está configurada como PWA con:

### Accesos Rápidos- Manifest.json

- Service Worker (automático con Next.js)

| Documento | Descripción |- Iconos optimizados

|-----------|-------------|- Funcionalidad offline básica

| [Instalación](./docs/01-getting-started/installation.md) | Guía paso a paso |

| [Configuración](./docs/01-getting-started/configuration.md) | Setup de Firebase |## 🚀 Deployment

| [Estructura del Proyecto](./docs/02-architecture/project-structure.md) | Organización del código |

| [Sistema de Diseño](./docs/02-architecture/design-system.md) | Paleta y componentes |### Vercel (Recomendado)

| [Guía de Despliegue](./docs/04-deployment/deployment-guide.md) | Deploy a producción |```bash

vercel --prod

## 🔧 Scripts Disponibles```



```bash### Otras Plataformas

pnpm dev          # Ejecutar en desarrollo (http://localhost:3000)Asegúrate de configurar las variables de entorno en tu plataforma de deployment.

pnpm build        # Build para producción

pnpm start        # Servidor de producción## 🔍 SEO

pnpm lint         # Verificar código con ESLint

pnpm type-check   # Verificar tipos TypeScript- Meta tags completos

```- Open Graph configurado

- Sitemap automático

## 📁 Estructura del Proyecto- Structured data



```## 🤝 Contribuir

trueklandweb/

├── app/                    # Next.js App Router1. Fork el proyecto

│   ├── admin/             # Panel de administración2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)

│   ├── chats/             # Sistema de chat3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)

│   ├── explore/           # Explorar productos4. Push a la rama (`git push origin feature/nueva-funcionalidad`)

│   └── profile/           # Perfil de usuario5. Abre un Pull Request

├── components/            # Componentes React

│   ├── auth/             # Autenticación## 📄 Licencia

│   ├── chat/             # Chat

│   ├── products/         # ProductosEste proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

│   └── ui/               # Componentes UI (shadcn)

├── context/              # React Context## 🆘 Soporte

├── hooks/                # Custom Hooks

├── lib/                  # Utilidades y configuraciónSi tienes alguna pregunta o necesitas ayuda:

└── docs/                 # Documentación completa- Abre un issue en GitHub

```- Contacta al equipo de desarrollo



## 🔒 Seguridad---



- Autenticación con Firebase Auth**¡Gracias por usar TrueKland! 🌟**

- Reglas de seguridad en Firestore
- Validación de inputs
- Sanitización de datos
- HTTPS obligatorio en producción

## 🌐 Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Estado del Proyecto

- ✅ Sistema de autenticación
- ✅ Gestión de productos
- ✅ Sistema de chat con notificaciones
- ✅ Sistema de intercambios
- ✅ Panel de administración
- ✅ Tema oscuro homologado
- ✅ PWA configurado
- ✅ Responsive design

## 🤝 Contribución

Este es un proyecto privado. Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📝 Licencia

Proyecto privado - Todos los derechos reservados © 2025 TrueKland

## 👥 Equipo

Desarrollado por Lisandro Flores

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./docs/README.md) o revisa la [guía de solución de problemas](./docs/05-maintenance/troubleshooting.md).
