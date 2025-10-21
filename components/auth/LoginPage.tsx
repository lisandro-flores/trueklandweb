"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import SignInForm from "./SignInForm"
import SignUpForm from "./SignUpForm"
import imagen from "@/assets/images/Cam.jpeg"
import { Sparkles, ArrowRight, Users, Repeat, Search, Heart, Shield, Star, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toggleForm = () => {
    setShowSignIn(!showSignIn)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2391f2b3' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-green-400/20 rounded-full animate-bounce delay-100" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-yellow-400/20 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-500/30 rounded-full animate-pulse delay-700" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-[#0A1628]">
        {/* Left Side - Image and Branding */}
        <div className="flex-1 relative overflow-hidden">
          <Image src={imagen || "/placeholder.svg"} alt="TrueKland" fill className="object-cover opacity-40" priority />

          {/* Stronger Gradient Overlays for Better Contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628]/90 via-[#112240]/80 to-[#0A1628]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/5 to-[#fcf326]/5" />

          {/* Left Side Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white">
            {/* Logo/Brand */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 bg-[#112240]/95 backdrop-blur-md px-6 py-3 rounded-full border border-[#233554] shadow-2xl mb-6">
                <Sparkles className="w-6 h-6 text-[#91f2b3]" />
                <span className="text-lg font-semibold text-[#E6F1FF]">TrueKland</span>
              </div>

              <h1 className="text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="text-[#E6F1FF] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  Tu Comunidad
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  de Intercambio
                </span>
              </h1>

              <p className="text-xl text-[#B4C7E7] font-light max-w-lg leading-relaxed mb-8 drop-shadow-lg">
                Donde cada objeto tiene una segunda oportunidad y cada intercambio cuenta una historia única
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#112240]/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-[#233554]">
                  <Repeat className="w-6 h-6 text-[#91f2b3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#E6F1FF] drop-shadow-md">Intercambios Seguros</h3>
                  <p className="text-[#B4C7E7] text-sm drop-shadow-md">Sistema de verificación y confianza</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#112240]/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-[#233554]">
                  <Users className="w-6 h-6 text-[#fcf326]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#E6F1FF] drop-shadow-md">Comunidad Activa</h3>
                  <p className="text-[#B4C7E7] text-sm drop-shadow-md">Miles de usuarios intercambiando</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#112240]/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-[#233554]">
                  <Globe className="w-6 h-6 text-[#00D8E8]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#E6F1FF] drop-shadow-md">Alcance Global</h3>
                  <p className="text-[#B4C7E7] text-sm drop-shadow-md">Conecta con personas de todo el mundo</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center bg-[#112240]/50 backdrop-blur-sm rounded-xl p-4 border border-[#233554]">
                <div className="text-3xl font-bold text-[#E6F1FF] mb-1 drop-shadow-lg">1.5K+</div>
                <div className="text-sm text-[#B4C7E7] drop-shadow-md">Usuarios</div>
              </div>
              <div className="text-center bg-[#112240]/50 backdrop-blur-sm rounded-xl p-4 border border-[#233554]">
                <div className="text-3xl font-bold text-[#E6F1FF] mb-1 drop-shadow-lg">8.2K+</div>
                <div className="text-sm text-[#B4C7E7] drop-shadow-md">Intercambios</div>
              </div>
              <div className="text-center bg-[#112240]/50 backdrop-blur-sm rounded-xl p-4 border border-[#233554]">
                <div className="text-3xl font-bold text-[#E6F1FF] mb-1 drop-shadow-lg">99.2%</div>
                <div className="text-sm text-[#B4C7E7] drop-shadow-md">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="flex-1 flex items-center justify-center p-16 bg-[#112240]/90 backdrop-blur-sm border-l border-[#233554]">
          <div className="w-full max-w-lg">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent mb-4">
                  {showSignIn ? "¡Bienvenido de vuelta!" : "¡Únete a nosotros!"}
                </h2>
                <p className="text-[#B4C7E7] text-lg">
                  {showSignIn ? "Inicia sesión para continuar tu aventura" : "Crea tu cuenta y comienza a intercambiar"}
                </p>
              </div>

              {/* Form Toggle */}
              <div className="flex items-center justify-center mb-10">
                <div className="bg-[#0A1628] p-1.5 rounded-full shadow-inner border border-[#233554]">
                  <div className="flex">
                    <Button
                      variant={showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(true)}
                      className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                        showSignIn
                          ? "bg-gradient-to-r from-[#00D8E8] to-[#00A0B8] text-white shadow-lg transform scale-105"
                          : "text-[#B4C7E7] hover:text-[#E6F1FF] hover:bg-[#1A2F4F]"
                      }`}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant={!showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(false)}
                      className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                        !showSignIn
                          ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-lg transform scale-105"
                          : "text-[#B4C7E7] hover:text-[#E6F1FF] hover:bg-[#1A2F4F]"
                      }`}
                    >
                      Registrarse
                    </Button>
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div className="backdrop-blur-sm bg-[#0A1628]/80 rounded-3xl border border-[#233554] shadow-xl p-8">
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                >
                  {showSignIn ? <SignInForm /> : <SignUpForm onSignUpSuccess={() => setShowSignIn(true)} />}
                </div>
              </div>

              {/* Alternative Action */}
              <div className="text-center mt-8">
                <p className="text-[#B4C7E7] mb-4 text-lg">
                  {showSignIn ? "¿Nuevo en TrueKland?" : "¿Ya tienes cuenta?"}
                </p>
                <Button
                  onClick={toggleForm}
                  variant="outline"
                  className="bg-[#112240]/80 backdrop-blur-sm border-[#233554] hover:bg-[#1A2F4F] hover:border-[#00D8E8] transition-all duration-300 group px-8 py-3 rounded-full text-lg font-medium text-[#E6F1FF]"
                >
                  {showSignIn ? "Crear cuenta gratuita" : "Iniciar sesión"}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-[#B4C7E7]">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-[#EF4444]" />
                  <span>Confiable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#fcf326]" />
                  <span>Rápido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-[#0A1628]">
        {/* Hero Image Section - Optimized for Mobile */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
          <Image src={imagen || "/placeholder.svg"} alt="TrueKland" fill className="object-cover opacity-40" priority />

          {/* Stronger Mobile Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#112240]/80 to-[#0A1628]/90" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#91f2b3]/5 to-[#fcf326]/5" />

          {/* Mobile Hero Content */}
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="text-center text-white space-y-4 px-4 max-w-sm mx-auto">
              {/* Mobile Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#112240]/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-[#233554] shadow-2xl">
                <Sparkles className="w-4 h-4 text-[#91f2b3]" />
                <span className="text-[#E6F1FF]">TrueKland</span>
              </div>

              {/* Mobile Title */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-2xl">
                  <span className="text-[#E6F1FF] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                    Tu Comunidad
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    de Intercambio
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#B4C7E7] font-light leading-relaxed drop-shadow-lg">
                  Intercambia, conecta y descubre
                </p>
              </div>

              {/* Mobile Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <div className="flex items-center space-x-1 bg-[#112240]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#233554] text-xs shadow-lg">
                  <Star className="w-3 h-3 text-[#fcf326]" />
                  <span className="text-[#E6F1FF]">Seguro</span>
                </div>
                <div className="flex items-center space-x-1 bg-[#112240]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#233554] text-xs shadow-lg">
                  <Users className="w-3 h-3 text-[#91f2b3]" />
                  <span className="text-[#E6F1FF]">Activo</span>
                </div>
                <div className="flex items-center space-x-1 bg-[#112240]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#233554] text-xs shadow-lg">
                  <Shield className="w-3 h-3 text-[#00D8E8]" />
                  <span className="text-[#E6F1FF]">Gratuito</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-12 fill-[#0A1628]">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Mobile Main Content */}
        <div className="relative z-10 px-4 py-6 -mt-6">
          <div
            className={`backdrop-blur-sm bg-[#112240]/95 rounded-3xl border border-[#233554] shadow-2xl overflow-hidden transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Mobile Welcome Section */}
            <div className="p-6 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
                  {showSignIn ? "¡Bienvenido!" : "¡Únete hoy!"}
                </h2>

                <p className="text-[#B4C7E7] text-sm sm:text-base">
                  {showSignIn ? "Inicia sesión para continuar" : "Crea tu cuenta gratuita"}
                </p>

                {/* Mobile Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-[#91f2b3]/20 to-[#10B981]/20 text-[#91f2b3] px-3 py-1.5 rounded-full text-xs font-medium border border-[#91f2b3]/30">
                    <Repeat className="w-3 h-3" />
                    <span>Intercambia</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-[#fcf326]/20 to-[#F59E0B]/20 text-[#fcf326] px-3 py-1.5 rounded-full text-xs font-medium border border-[#fcf326]/30">
                    <Users className="w-3 h-3" />
                    <span>Conecta</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-[#00D8E8]/20 to-[#3B82F6]/20 text-[#00D8E8] px-3 py-1.5 rounded-full text-xs font-medium border border-[#00D8E8]/30">
                    <Search className="w-3 h-3" />
                    <span>Descubre</span>
                  </div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-[#0A1628]/50 border border-[#233554]">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#00D8E8] to-[#00A0B8] bg-clip-text text-transparent">
                    1.5K+
                  </div>
                  <div className="text-xs text-[#8FA3C4]">Usuarios</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#0A1628]/50 border border-[#233554]">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
                    8.2K+
                  </div>
                  <div className="text-xs text-[#8FA3C4]">Intercambios</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#0A1628]/50 border border-[#233554]">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EF4444] bg-clip-text text-transparent">
                    99.2%
                  </div>
                  <div className="text-xs text-[#8FA3C4]">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Mobile Form Section */}
            <div className="px-4 pb-6">
              {/* Mobile Form Toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#0A1628] p-1 rounded-full shadow-inner w-full max-w-xs border border-[#233554]">
                  <div className="flex">
                    <Button
                      variant={showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(true)}
                      className={`flex-1 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                        showSignIn
                          ? "bg-gradient-to-r from-[#00D8E8] to-[#00A0B8] text-white shadow-lg transform scale-105"
                          : "text-[#B4C7E7] hover:text-[#E6F1FF] hover:bg-[#1A2F4F]"
                      }`}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant={!showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(false)}
                      className={`flex-1 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                        !showSignIn
                          ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-lg transform scale-105"
                          : "text-[#B4C7E7] hover:text-[#E6F1FF] hover:bg-[#1A2F4F]"
                      }`}
                    >
                      Registrarse
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Forms Container */}
              <div className="backdrop-blur-sm bg-[#0A1628]/80 rounded-2xl border border-[#233554] shadow-xl p-4">
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                >
                  {showSignIn ? <SignInForm /> : <SignUpForm onSignUpSuccess={() => setShowSignIn(true)} />}
                </div>
              </div>

              {/* Mobile Alternative Action */}
              <div className="text-center mt-6">
                <p className="text-[#B4C7E7] mb-3 text-sm">
                  {showSignIn ? "¿Nuevo en TrueKland?" : "¿Ya tienes cuenta?"}
                </p>
                <Button
                  onClick={toggleForm}
                  variant="outline"
                  className="bg-[#112240]/80 backdrop-blur-sm border-[#233554] hover:bg-[#1A2F4F] hover:border-[#00D8E8] transition-all duration-300 group px-6 py-2.5 rounded-full font-medium text-sm w-full sm:w-auto text-[#E6F1FF]"
                >
                  {showSignIn ? "Crear cuenta gratuita" : "Iniciar sesión"}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Mobile Trust Indicators */}
            <div className="bg-gradient-to-r from-[#0A1628] via-[#112240] to-[#0A1628] px-4 py-4 border-t border-[#233554]">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#B4C7E7]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-3 h-3 text-[#EF4444]" />
                  <Heart className="w-3 h-3 text-[#EF4444]" />
                  <span>Confiable</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-[#00D8E8] rounded-full animate-pulse delay-200"></div>
                  <span>Gratuito</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-3 h-3 text-[#8B5CF6]" />
                  <span>Protegido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
