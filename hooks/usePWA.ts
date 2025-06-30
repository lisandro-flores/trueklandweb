"use client"

import { useState, useEffect } from 'react'

interface PWAInstallPrompt {
  canInstall: boolean
  installPWA: () => Promise<void>
  isInstalled: boolean
  isStandalone: boolean
  supportsCamera: boolean
  requestCameraPermission: () => Promise<boolean>
}

export function usePWA(): PWAInstallPrompt {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [supportsCamera, setSupportsCamera] = useState(false)

  useEffect(() => {
    // Detectar si ya está instalada como PWA
    const checkIfInstalled = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      
      setIsStandalone(isStandaloneMode || isIOSStandalone)
      setIsInstalled(isStandaloneMode || isIOSStandalone)
    }

    // Verificar soporte de cámara
    const checkCameraSupport = () => {
      const hasCamera = 'mediaDevices' in navigator && 
                       'getUserMedia' in navigator.mediaDevices
      setSupportsCamera(hasCamera)
    }

    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    // Escuchar cuando se instala
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    checkIfInstalled()
    checkCameraSupport()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async (): Promise<void> => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
      setCanInstall(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const requestCameraPermission = async (): Promise<boolean> => {
    if (!supportsCamera) return false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      })
      
      // Cerrar inmediatamente el stream de prueba
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('Camera permission denied:', error)
      return false
    }
  }

  return {
    canInstall,
    installPWA,
    isInstalled,
    isStandalone,
    supportsCamera,
    requestCameraPermission
  }
}
