"use client"

import { useState, useRef, useCallback } from 'react'

interface UseCameraReturn {
  isSupported: boolean
  isLoading: boolean
  error: string | null
  hasPermission: boolean | null
  stream: MediaStream | null
  capturePhoto: () => Promise<File | null>
  startCamera: (facingMode?: 'user' | 'environment') => Promise<boolean>
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

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'environment'): Promise<boolean> => {
    console.log('🎬 Iniciando cámara con facingMode:', facingMode)
    
    if (!isSupported) {
      console.error('❌ Cámara no soportada')
      setError('La cámara no es compatible con este dispositivo')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Primero verificar permisos
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
          console.log('🔐 Estado de permisos:', permission.state)
          if (permission.state === 'denied') {
            setError('Permisos de cámara denegados. Ve a configuración del navegador para habilitarlos.')
            setHasPermission(false)
            setIsLoading(false)
            return false
          }
        } catch (e) {
          // Algunos navegadores no soportan la API de permisos, continuamos
          console.log('⚠️ Permissions API not supported, continuing...')
        }
      }

      // Configuraciones optimizadas para móvil
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: facingMode, // Usar el parámetro recibido
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      }

      console.log('📹 Solicitando acceso a cámara con constraints:', constraints)
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('✅ Stream obtenido:', mediaStream.getTracks().length, 'tracks')
      
      setStream(mediaStream)
      setHasPermission(true)

      // Asignar el stream al video element si existe
      if (videoRef.current) {
        console.log('📺 Asignando stream al video')
        videoRef.current.srcObject = mediaStream
        // Forzar reproducción en móviles
        try {
          await videoRef.current.play()
          console.log('▶️ Video reproduciendo')
        } catch (playError) {
          console.warn('⚠️ Autoplay failed, user interaction may be required:', playError)
        }
      }

      return true
    } catch (err) {
      console.error('Error accessing camera:', err)
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('Permisos de cámara denegados. Para usar la cámara:\n1. Toca el ícono de candado/configuración en la barra de dirección\n2. Permite el acceso a la cámara\n3. Recarga la página')
            setHasPermission(false)
            break
          case 'NotFoundError':
            setError('No se encontró ninguna cámara en el dispositivo.')
            break
          case 'NotReadableError':
            setError('La cámara está siendo usada por otra aplicación. Cierra otras apps que puedan estar usando la cámara.')
            break
          case 'OverconstrainedError':
            setError('La configuración de la cámara no es compatible. Intentando con configuración básica...')
            // Intentar con configuración más básica
            try {
              const basicConstraints: MediaStreamConstraints = {
                video: { facingMode: facingMode },
                audio: false
              }
              const basicStream = await navigator.mediaDevices.getUserMedia(basicConstraints)
              setStream(basicStream)
              setHasPermission(true)
              if (videoRef.current) {
                videoRef.current.srcObject = basicStream
                try {
                  await videoRef.current.play()
                } catch (playError) {
                  console.warn('Autoplay failed:', playError)
                }
              }
              setError(null)
              return true
            } catch (basicErr) {
              setError('Error de configuración de cámara incluso con configuración básica')
            }
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
    console.log('⏹️ Deteniendo cámara')
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('🛑 Deteniendo track:', track.label)
        track.stop()
      })
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
      console.log('📺 Video element limpiado')
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
      console.log('📹 Asignando stream al video element')
      element.srcObject = stream
      // Configurar atributos importantes para móviles
      element.setAttribute('playsinline', 'true')
      element.setAttribute('webkit-playsinline', 'true')
      element.muted = true
      // Intentar reproducir
      element.play().catch(err => {
        console.warn('⚠️ Error en autoplay:', err)
      })
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
