"use client"

import { useState } from "react"
import { Mail, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/firebase"
import Link from "next/link"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu correo electrónico.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setEmailSent(true)
        toast({
          title: "Email enviado",
          description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo enviar el email de recuperación.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#112240] to-[#0A1628] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-[#233554] bg-[#112240]/95 backdrop-blur-lg">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-gray-900 drop-shadow-md" strokeWidth={3} />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
              ¡Email Enviado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-[#B4C7E7] mb-4 text-lg">
                Hemos enviado un enlace de recuperación a:
              </p>
              <div className="bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-lg p-4 mb-6 border border-[#233554]">
                <p className="font-semibold text-[#E6F1FF] text-lg">
                  {email}
                </p>
              </div>
              <p className="text-sm text-[#8FA3C4] mb-6 leading-relaxed">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña. Si no lo encuentras, verifica tu carpeta de spam.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full h-12 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8] transition-all"
              >
                Enviar a otro correo
              </Button>
              
              <Link href="/" className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] hover:opacity-90 text-gray-900 font-semibold shadow-lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#112240] to-[#0A1628] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-[#233554] bg-[#112240]/95 backdrop-blur-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Mail className="w-10 h-10 text-gray-900 drop-shadow-md" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
            Recuperar Contraseña
          </CardTitle>
          <p className="text-[#B4C7E7] mt-3 text-base">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#E6F1FF]">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8FA3C4] w-5 h-5" />
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-[#233554] bg-[#0A1628] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] transition-all"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] hover:opacity-90 text-gray-900 font-semibold shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar enlace de recuperación
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center text-[#B4C7E7] hover:text-[#E6F1FF] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
