"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import ProfileContent from "@/components/profile/ProfileContent"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { User, Shield, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && !loading) {
      // Pequeño delay para mostrar animación de entrada
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#91f2b3]/20 to-[#fcf326]/20 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2391f2b3' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          {/* Profile Icon with Glow */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center shadow-2xl">
              <User className="w-12 h-12 text-gray-800" />
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="relative">
            <LoadingSpinner />
            <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
              Cargando tu perfil
            </h3>
            <p className="text-gray-600 text-lg">Preparando tu espacio personal...</p>

            {/* Loading Steps */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-[#91f2b3] rounded-full animate-pulse"></div>
                <span>Verificando identidad</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-[#fcf326] rounded-full animate-pulse delay-200"></div>
                <span>Cargando datos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23DC2626' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
          {/* Lock Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Acceso Restringido
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Necesitas iniciar sesión para acceder a tu perfil personal
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Ir al inicio</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#91f2b3]/20 to-[#fcf326]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2391f2b3' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <DashboardLayout>
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="backdrop-blur-sm bg-white/60 rounded-3xl border border-white/30 shadow-xl p-6 sm:p-8">
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="relative">
                  {user.photoURL ? (
                    <div className="relative">
                      <Image
                        src={user.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "Avatar"}
                        width={64}
                        height={64}
                        className="rounded-full border-3 border-white/50 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#91f2b3] rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#91f2b3] to-[#fcf326] flex items-center justify-center text-2xl font-bold text-gray-800 border-3 border-white/50 shadow-lg">
                      {user.displayName?.[0] || "U"}
                    </div>
                  )}
                </div>

                {/* Welcome Text */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">👋</span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
                      ¡Bienvenido de vuelta!
                    </h1>
                  </div>
                  <p className="text-gray-600 text-lg">
                    {user.displayName || "Usuario"}, gestiona tu perfil y configuración
                  </p>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block">
                  <div className="bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-[#91f2b3]/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#91f2b3] rounded-full"></div>
                      <span>En línea</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="backdrop-blur-sm bg-white/40 rounded-3xl border border-white/30 shadow-lg overflow-hidden">
            <ProfileContent />
          </div>
        </DashboardLayout>
      </div>
    </div>
  )
}
