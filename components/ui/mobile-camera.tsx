"use client"

import { useState, useEffect, useRef } from 'react'
import { Camera, X, RotateCcw, Check, AlertCircle, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCamera } from '@/hooks/useCamera'
import CameraPermissionHelper from '@/components/ui/camera-permission-helper'
import Image from 'next/image'

interface MobileCameraProps {
  onCapture: (file: File) => void
  onClose: () => void
  isOpen: boolean
}

export default function MobileCamera({ onCapture, onClose, isOpen }: MobileCameraProps) {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const {
    isSupported,
    isLoading,
    error,
    hasPermission,
    stream,
    capturePhoto,
    startCamera,
    stopCamera,
    isMobile
  } = useCamera()

  // Iniciar cámara cuando se abre el modal
  useEffect(() => {
    if (isOpen && isSupported) {
      startCamera()
    }
    
    return () => {
      stopCamera()
    }
  }, [isOpen, isSupported, startCamera, stopCamera])

  // Asignar stream al video cuando esté disponible
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const handleCapture = async () => {
    const file = await capturePhoto()
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage(imageUrl)
    }
  }

  const handleConfirm = () => {
    if (capturedImage) {
      // Convertir la imagen capturada de vuelta a File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
          onCapture(file)
          handleClose()
        })
    }
  }

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
      setCapturedImage(null)
    }
  }

  const handleClose = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
      setCapturedImage(null)
    }
    stopCamera()
    onClose()
  }

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    
    stopCamera()
    // Reiniciar con la nueva cámara
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black border-[#233554]">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#233554]">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Tomar Foto
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Permission Error - Show Helper */}
            {error && hasPermission === false && (
              <div className="p-4">
                <CameraPermissionHelper 
                  onRetry={startCamera}
                  error={error}
                />
              </div>
            )}

            {/* Other Errors */}
            {error && hasPermission !== false && (
              <div className="p-4">
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
                <div className="mt-4">
                  <Button 
                    onClick={startCamera}
                    variant="outline"
                    className="w-full"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}

            {/* Not Supported */}
            {!isSupported && (
              <div className="p-6 text-center">
                <Smartphone className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Cámara no disponible</p>
                <p className="text-sm text-gray-500">
                  Tu dispositivo no soporta acceso a la cámara
                </p>
              </div>
            )}

            {/* Not Mobile Warning */}
            {isSupported && !isMobile && (
              <div className="p-4">
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-200">
                    Esta función está optimizada para dispositivos móviles
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-[#233554] border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-300">Iniciando cámara...</p>
              </div>
            )}

            {/* Camera View */}
            {isSupported && !isLoading && !error && (
              <div className="relative aspect-[4/3] bg-black">
                {capturedImage ? (
                  // Preview de la imagen capturada
                  <div className="relative w-full h-full">
                    <Image
                      src={capturedImage}
                      alt="Captured"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  // Video de la cámara
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Camera Controls Overlay */}
                {!capturedImage && stream && (
                  <div className="absolute inset-0 flex items-end justify-center pb-6">
                    <div className="flex items-center gap-4">
                      {/* Switch Camera Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={switchCamera}
                        className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </Button>

                      {/* Capture Button */}
                      <Button
                        onClick={handleCapture}
                        size="icon"
                        className="w-16 h-16 rounded-full bg-white text-black hover:bg-[#E6F1FF] border-4 border-white"
                      >
                        <div className="w-6 h-6 bg-black rounded-full" />
                      </Button>

                      {/* Spacer for symmetry */}
                      <div className="w-12 h-12" />
                    </div>
                  </div>
                )}

                {/* Preview Controls */}
                {capturedImage && (
                  <div className="absolute inset-0 flex items-end justify-center pb-6">
                    <div className="flex items-center gap-4">
                      {/* Retake Button */}
                      <Button
                        variant="ghost"
                        onClick={handleRetake}
                        className="bg-black/50 text-white hover:bg-black/70 px-4 py-2 rounded-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Repetir
                      </Button>

                      {/* Confirm Button */}
                      <Button
                        onClick={handleConfirm}
                        className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-full"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Usar Foto
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Permission Denied */}
            {hasPermission === false && (
              <div className="p-6 text-center">
                <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Permisos necesarios</p>
                <p className="text-sm text-gray-500 mb-4">
                  Necesitamos acceso a tu cámara para tomar fotos
                </p>
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="border-[#233554] text-[#B4C7E7] hover:bg-[#1A2F4F]"
                >
                  Intentar de nuevo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
