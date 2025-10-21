"use client"

import { useState, useEffect } from 'react'
import { AlertCircle, Camera, Smartphone, Settings } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CameraPermissionHelperProps {
  onRetry: () => void
  error?: string | null
}

export function CameraPermissionHelper({ onRetry, error }: CameraPermissionHelperProps) {
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    setIsAndroid(/Android/i.test(userAgent))
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-orange-100 rounded-full">
            <Camera className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Permisos de Cámara Necesarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="text-sm text-[#B4C7E7]">
            Para tomar fotos de tus productos, necesitamos acceso a tu cámara.
          </div>

          {isAndroid && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900">Instrucciones para Android:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Toca el ícono de <strong>candado</strong> o <strong>información</strong> en la barra de dirección</li>
                    <li>Busca la opción <strong>&quot;Cámara&quot;</strong> o <strong>&quot;Permisos&quot;</strong></li>
                    <li>Selecciona <strong>&quot;Permitir&quot;</strong> o <strong>&quot;Activar&quot;</strong></li>
                    <li>Recarga la página</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#1A2F4F]/50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Settings className="h-5 w-5 text-[#B4C7E7] mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-[#E6F1FF]">Alternativa:</h4>
                <p className="text-sm text-[#B4C7E7]">
                  Ve a la configuración de tu navegador → Configuración del sitio → TruekLand → Cámara → Permitir
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={onRetry} className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Intentar de Nuevo
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Tus fotos se almacenan de forma segura y privada
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CameraPermissionHelper
