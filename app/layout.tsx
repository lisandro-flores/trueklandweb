import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "TrueKland - Intercambia, Conecta y Descubre",
    template: "%s | TrueKland"
  },
  description: "Plataforma de intercambio de artículos donde cada objeto tiene una segunda oportunidad. Únete a nuestra comunidad y descubre un nuevo mundo de posibilidades.",
  keywords: ["intercambio", "trueque", "comunidad", "sostenible", "segunda mano", "marketplace"],
  authors: [{ name: "TrueKland Team" }],
  creator: "TrueKland",
  publisher: "TrueKland",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TrueKland - Intercambia, Conecta y Descubre",
    description: "Plataforma de intercambio de artículos donde cada objeto tiene una segunda oportunidad.",
    url: '/',
    siteName: "TrueKland",
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'TrueKland Logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TrueKland - Intercambia, Conecta y Descubre",
    description: "Plataforma de intercambio de artículos donde cada objeto tiene una segunda oportunidad.",
    images: ['/placeholder-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icon512_rounded.png",
    icon: "/icon512_rounded.png"
  },
  generator: 'Next.js',
  applicationName: 'TrueKland',
  referrer: 'origin-when-cross-origin',
  category: 'marketplace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00D8E8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TruekLand" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <link rel="apple-touch-startup-image" href="/icon512_rounded.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} safe-area-top safe-area-bottom`} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
            <PWAInstallPrompt />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
