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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-indigo-400/20 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-500/50 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Image and Branding */}
        <div className="flex-1 relative overflow-hidden">
          <Image src={imagen || "/placeholder.svg"} alt="TrueKland" fill className="object-cover" priority />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40" />

          {/* Left Side Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white">
            {/* Logo/Brand */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-lg mb-6">
                <Sparkles className="w-6 h-6" />
                <span className="text-lg font-semibold">TrueKland</span>
              </div>

              <h1 className="text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Tu Comunidad
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  de Intercambio
                </span>
              </h1>

              <p className="text-xl text-white/90 font-light max-w-lg leading-relaxed mb-8">
                Donde cada objeto tiene una segunda oportunidad y cada intercambio cuenta una historia única
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Intercambios Seguros</h3>
                  <p className="text-white/80 text-sm">Sistema de verificación y confianza</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Comunidad Activa</h3>
                  <p className="text-white/80 text-sm">Miles de usuarios intercambiando</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Alcance Global</h3>
                  <p className="text-white/80 text-sm">Conecta con personas de todo el mundo</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1.5K+</div>
                <div className="text-sm text-white/80">Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">8.2K+</div>
                <div className="text-sm text-white/80">Intercambios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.2%</div>
                <div className="text-sm text-white/80">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="flex-1 flex items-center justify-center p-16 bg-white/50 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  {showSignIn ? "¡Bienvenido de vuelta!" : "¡Únete a nosotros!"}
                </h2>
                <p className="text-gray-600 text-lg">
                  {showSignIn ? "Inicia sesión para continuar tu aventura" : "Crea tu cuenta y comienza a intercambiar"}
                </p>
              </div>

              {/* Form Toggle */}
              <div className="flex items-center justify-center mb-10">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-1.5 rounded-full shadow-inner">
                  <div className="flex">
                    <Button
                      variant={showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(true)}
                      className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                        showSignIn
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                      }`}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant={!showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(false)}
                      className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                        !showSignIn
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
                      }`}
                    >
                      Registrarse
                    </Button>
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div className="backdrop-blur-sm bg-white/80 rounded-3xl border border-white/40 shadow-xl p-8">
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
                <p className="text-gray-600 mb-4 text-lg">
                  {showSignIn ? "¿Nuevo en TrueKland?" : "¿Ya tienes cuenta?"}
                </p>
                <Button
                  onClick={toggleForm}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white hover:shadow-lg transition-all duration-300 group px-8 py-3 rounded-full text-lg font-medium"
                >
                  {showSignIn ? "Crear cuenta gratuita" : "Iniciar sesión"}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Confiable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Rápido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen">
        {/* Hero Image Section - Optimized for Mobile */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
          <Image src={imagen || "/placeholder.svg"} alt="TrueKland" fill className="object-cover" priority />

          {/* Mobile Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />

          {/* Mobile Hero Content */}
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="text-center text-white space-y-4 px-4 max-w-sm mx-auto">
              {/* Mobile Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>TrueKland</span>
              </div>

              {/* Mobile Title */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Tu Comunidad
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    de Intercambio
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed">
                  Intercambia, conecta y descubre
                </p>
              </div>

              {/* Mobile Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-xs">
                  <Star className="w-3 h-3 text-yellow-300" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-xs">
                  <Users className="w-3 h-3 text-green-300" />
                  <span>Activo</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-xs">
                  <Shield className="w-3 h-3 text-blue-300" />
                  <span>Gratuito</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-12 fill-slate-50">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Mobile Main Content */}
        <div className="relative z-10 px-4 py-6 -mt-6">
          <div
            className={`backdrop-blur-sm bg-white/95 rounded-3xl border border-white/40 shadow-2xl overflow-hidden transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Mobile Welcome Section */}
            <div className="p-6 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {showSignIn ? "¡Bienvenido!" : "¡Únete hoy!"}
                </h2>

                <p className="text-gray-600 text-sm sm:text-base">
                  {showSignIn ? "Inicia sesión para continuar" : "Crea tu cuenta gratuita"}
                </p>

                {/* Mobile Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-3 py-1.5 rounded-full text-xs font-medium border border-pink-200">
                    <Repeat className="w-3 h-3" />
                    <span>Intercambia</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1.5 rounded-full text-xs font-medium border border-cyan-200">
                    <Users className="w-3 h-3" />
                    <span>Conecta</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200">
                    <Search className="w-3 h-3" />
                    <span>Descubre</span>
                  </div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    1.5K+
                  </div>
                  <div className="text-xs text-gray-600">Usuarios</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    8.2K+
                  </div>
                  <div className="text-xs text-gray-600">Intercambios</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                    99.2%
                  </div>
                  <div className="text-xs text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Mobile Form Section */}
            <div className="px-4 pb-6">
              {/* Mobile Form Toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-full shadow-inner w-full max-w-xs">
                  <div className="flex">
                    <Button
                      variant={showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(true)}
                      className={`flex-1 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                        showSignIn
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                      }`}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant={!showSignIn ? "default" : "ghost"}
                      onClick={() => setShowSignIn(false)}
                      className={`flex-1 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                        !showSignIn
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
                      }`}
                    >
                      Registrarse
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Forms Container */}
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-white/40 shadow-xl p-4">
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
                <p className="text-gray-600 mb-3 text-sm">
                  {showSignIn ? "¿Nuevo en TrueKland?" : "¿Ya tienes cuenta?"}
                </p>
                <Button
                  onClick={toggleForm}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white hover:shadow-lg transition-all duration-300 group px-6 py-2.5 rounded-full font-medium text-sm w-full sm:w-auto"
                >
                  {showSignIn ? "Crear cuenta gratuita" : "Iniciar sesión"}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Mobile Trust Indicators */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-4 py-4 border-t border-white/40">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>Confiable</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                  <span>Gratuito</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-3 h-3 text-purple-500" />
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
