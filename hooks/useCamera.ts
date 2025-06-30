"use client"

import { useState, useRef, useCallback } from 'react'

interface UseCameraReturn {
  isSupported: boolean
  isLoading: boolean
  error: string | null
  hasPermission: boolean | null
  stream: MediaStream | null
  capturePhoto: () => Promise<File | null>
  startCamera: () => Promise<boolean>
  stopCamera: () => void
  isMobile: boolean
  setVideoRef: (element: HTMLVideoElement | null) => void
}

export const useCamera = (): UseCameraReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Detectar si es un dispositivo móvil
  const isMobile = typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Verificar si la cámara es soportada
  const isSupported = typeof window !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices

  const startCamera = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('La cámara no es compatible con este dispositivo')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Configuraciones optimizadas para móvil
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: 'environment', // Cámara trasera por defecto
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setHasPermission(true)

      // Asignar el stream al video element si existe
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      return true
    } catch (err) {
      console.error('Error accessing camera:', err)
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('Permisos de cámara denegados. Por favor, permite el acceso a la cámara.')
            setHasPermission(false)
            break
          case 'NotFoundError':
            setError('No se encontró ninguna cámara en el dispositivo.')
            break
          case 'NotReadableError':
            setError('La cámara está siendo usada por otra aplicación.')
            break
          case 'OverconstrainedError':
            setError('La configuración de la cámara no es compatible.')
            break
          default:
            setError('Error al acceder a la cámara: ' + err.message)
        }
      } else {
        setError('Error desconocido al acceder a la cámara')
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!stream || !videoRef.current) {
      setError('La cámara no está disponible')
      return null
    }

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setError('Error al crear el canvas')
        return null
      }

      // Establecer dimensiones del canvas basadas en el video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame actual del video en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convertir a blob y luego a File
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const timestamp = new Date().getTime()
            const file = new File([blob], `photo_${timestamp}.jpg`, { 
              type: 'image/jpeg' 
            })
            resolve(file)
          } else {
            setError('Error al capturar la foto')
            resolve(null)
          }
        }, 'image/jpeg', 0.9) // 90% de calidad
      })
    } catch (err) {
      console.error('Error capturing photo:', err)
      setError('Error al capturar la foto')
      return null
    }
  }, [stream])

  // Limpiar al desmontar
  const cleanup = useCallback(() => {
    stopCamera()
  }, [stopCamera])

  // Asignar la referencia del video
  const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element
    if (element && stream) {
      element.srcObject = stream
    }
  }, [stream])

  return {
    isSupported,
    isLoading,
    error,
    hasPermission,
    stream,
    capturePhoto,
    startCamera,
    stopCamera: cleanup,
    isMobile,
    setVideoRef
  }
}
