import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Crear respuesta
  const response = NextResponse.next()

  // Configurar cabeceras de seguridad adicionales
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy (CSP) - Configuración completa para Firebase
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseapp.com https://*.firebase.google.com https://*.googleapis.com https://*.gstatic.com;
    style-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com;
    img-src 'self' data: https: blob:;
    font-src 'self' data: https://*.gstatic.com;
    connect-src 'self' https://*.firebaseio.com https://*.firebase.google.com https://*.googleapis.com wss://*.firebaseio.com https://firebasestorage.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com;
    frame-src 'self' https://*.firebaseapp.com https://*.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)
  
  // Permissions Policy (antes Feature-Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(self), geolocation=(self), payment=()'
  )
  
  // Strict Transport Security (solo para HTTPS en producción)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Evitar que se almacenen en caché páginas sensibles
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/chats')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
