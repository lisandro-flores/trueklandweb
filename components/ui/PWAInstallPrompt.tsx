"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export default function PWAInstallPrompt() {
  const { canInstall, installPWA, isStandalone } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Mostrar prompt después de 3 segundos si se puede instalar
    const timer = setTimeout(() => {
      if (canInstall && !isStandalone && !isDismissed) {
        setIsVisible(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [canInstall, isStandalone, isDismissed])

  useEffect(() => {
    // Verificar si ya fue dismisseado anteriormente
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleInstall = async () => {
    try {
      await installPWA()
      setIsVisible(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!isVisible || !canInstall || isStandalone) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-40 animate-slide-up">
      <Card className="glass border-[var(--color-turquesa)]/30 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-turquesa)] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-gris-oscuro)] text-sm">
                ¡Instala TruekLand!
              </p>
              <p className="text-xs text-[var(--color-azul-oscuro)] mt-1">
                Accede más rápido desde tu pantalla de inicio
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-[var(--color-turquesa)] hover:bg-[var(--color-azul-oscuro)] text-white text-xs px-3 py-1.5 h-auto"
              >
                <Download className="w-3 h-3 mr-1" />
                Instalar
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-[var(--color-azul-oscuro)] hover:bg-[var(--color-gris-300)] p-1.5 h-auto w-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
