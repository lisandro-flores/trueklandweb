/** @type {import('next').NextConfig} */
const nextConfig = {
  // DESACTIVADO PARA PRODUCCIÓN - Debe pasar validaciones
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com", "avatars.githubusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    unoptimized: false, // Optimizar imágenes en producción
  },
  
  // Optimizaciones de producción
  reactStrictMode: true,
  compress: true,
  
  // Eliminar console.logs en producción (excepto error y warn)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Configuración de cabeceras de seguridad
  async headers() {
    return [
      {
        // Aplicar cabeceras de seguridad a todas las rutas
        source: '/(.*)',
        headers: [
          // Content Security Policy - Previene ataques XSS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com apis.google.com accounts.google.com ssl.gstatic.com",
              "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com accounts.google.com fonts.googleapis.com",
              "img-src 'self' data: blob: https: *.firebasestorage.googleapis.com firebasestorage.googleapis.com *.googleusercontent.com *.googleapis.com *.gstatic.com",
              "font-src 'self' *.gstatic.com *.googleapis.com fonts.gstatic.com",
              "connect-src 'self' *.googleapis.com *.google.com *.firebase.com *.firebaseio.com *.firebasestorage.googleapis.com firebasestorage.googleapis.com accounts.google.com securetoken.googleapis.com identitytoolkit.googleapis.com",
              "frame-src 'self' *.google.com accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          // Anti-Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Previene MIME-sniffing attacks
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy - Permitir cámara para la funcionalidad de la app
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  // Configuración adicional para ocultar información del servidor
  poweredByHeader: false
}

module.exports = nextConfig
