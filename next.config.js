/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com", "avatars.githubusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com",
              "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
              "img-src 'self' data: blob: *.firebasestorage.googleapis.com *.googleusercontent.com *.googleapis.com",
              "font-src 'self' *.gstatic.com *.googleapis.com",
              "connect-src 'self' *.googleapis.com *.firebase.com *.firebaseio.com *.firebasestorage.googleapis.com",
              "frame-src 'self' *.google.com",
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
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  // Configuración adicional para ocultar información del servidor
  poweredByHeader: false
}

module.exports = nextConfig
