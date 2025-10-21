"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword, signInWithPopup, getAuth } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, LogIn, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { app, googleProvider, db } from "@/lib/firebase"
import { GoogleIcon } from "@/components/ui/google-icon"

export default function SignInForm() {
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const auth = getAuth(app)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleEmailBlur = () => {
    if (emailAddress && !validateEmail(emailAddress)) {
      setEmailError("Por favor ingresa un email válido")
    } else {
      setEmailError("")
    }
  }

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
    } else {
      setPasswordError("")
    }
  }

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(emailAddress)) {
      toast({
        title: "Error",
        description: "Por favor, introduce un correo electrónico válido.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailAddress, password)
      const user = userCredential.user

      if (user.emailVerified) {
        // Verificar si es admin y redirigir al panel de admin
        const isAdmin = user.email === "admin@truekland.com"
        
        toast({
          title: isAdmin ? "¡Bienvenido Administrador! 🛡️" : "¡Bienvenido de vuelta! 🎉",
          description: "Has iniciado sesión exitosamente.",
        })
        
        router.push(isAdmin ? "/admin" : "/explore")
      } else {
        toast({
          title: "Verificación pendiente",
          description: "Por favor, verifica tu correo electrónico.",
          variant: "destructive",
        })
      }
    } catch (err: unknown) {
      console.error(err)
      const error = err as { code?: string }
      if (error.code === "auth/wrong-password") {
        toast({
          title: "Error",
          description: "La contraseña es incorrecta.",
          variant: "destructive",
        })
      } else if (error.code === "auth/user-not-found") {
        toast({
          title: "Error",
          description: "No hay ningún usuario registrado con este correo electrónico.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al intentar iniciar sesión.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onGoogleSignIn = async () => {
    setLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Verificar si el usuario ya existe en Firestore
      const userDocRef = doc(db, "Users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Crear documento del usuario si no existe
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email || "",
          imageUrl: user.photoURL || "",
          createdAt: new Date().toISOString(),
          provider: "google"
        })
      }

      // Verificar si es admin y redirigir al panel de admin
      const isAdmin = user.email === "admin@truekland.com"

      toast({
        title: isAdmin ? "¡Bienvenido Administrador! 🛡️" : "¡Bienvenido! 🎉",
        description: "Has iniciado sesión con Google exitosamente.",
      })
      router.push(isAdmin ? "/admin" : "/explore")
    } catch (err: unknown) {
      console.error(err)
      const error = err as { code?: string; message?: string }
      
      if (error.code === "auth/popup-closed-by-user") {
        toast({
          title: "Cancelado",
          description: "El inicio de sesión fue cancelado.",
          variant: "destructive",
        })
      } else if (error.code === "auth/popup-blocked") {
        toast({
          title: "Popup bloqueado",
          description: "Por favor, permite las ventanas emergentes para continuar.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al iniciar sesión con Google.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Message - Only show on mobile */}
      <div className="text-center space-y-2 lg:hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#112240]/80 backdrop-blur-md rounded-2xl mb-3 border border-[#233554]">
          <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-[#91f2b3]" aria-hidden="true" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
          ¡Bienvenido! 👋
        </h3>
        <p className="text-[#B4C7E7] text-sm sm:text-base">Inicia sesión para continuar</p>
      </div>

      {/* Google Sign In Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-2xl blur opacity-30"></div>
        <Button
          onClick={onGoogleSignIn}
          disabled={loading}
          variant="outline"
          type="button"
          aria-label="Continuar con Google"
          className="relative w-full h-12 sm:h-14 lg:h-16 rounded-2xl border-2 border-[#233554] hover:border-[#00D8E8] bg-[#112240]/80 hover:bg-[#1A2F4F] text-[#E6F1FF] font-semibold flex items-center justify-center space-x-3 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <GoogleIcon size={24} />
              <span className="text-sm sm:text-base">Continuar con Google</span>
            </>
          )}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#233554]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#0A1628] text-[#8FA3C4]">o continúa con email</span>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label 
          htmlFor="email"
          className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2"
        >
          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#91f2b3]" aria-hidden="true" />
          <span>Correo electrónico</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={emailAddress}
            onChange={(e) => {
              setEmailAddress(e.target.value)
              if (emailError) setEmailError("")
            }}
            onBlur={handleEmailBlur}
            className={`relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg pl-10 sm:pl-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all ${
              emailError ? "border-[#EF4444] focus:border-[#EF4444]" : ""
            }`}
            aria-invalid={emailError ? "true" : "false"}
            aria-describedby={emailError ? "email-error" : undefined}
            autoComplete="email"
          />
          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#91f2b3] transition-colors" aria-hidden="true" />
        </div>
        {emailError && (
          <p id="email-error" className="text-[#EF4444] text-xs sm:text-sm flex items-center space-x-1" role="alert">
            <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full"></span>
            <span>{emailError}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label 
          htmlFor="password"
          className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2"
        >
          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-[#fcf326]" aria-hidden="true" />
          <span>Contraseña</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf326]/10 to-[#91f2b3]/10 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            id="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Tu contraseña segura"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError("")
            }}
            onBlur={handlePasswordBlur}
            className={`relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg pl-10 sm:pl-12 pr-10 sm:pr-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all ${
              passwordError ? "border-[#EF4444] focus:border-[#EF4444]" : ""
            }`}
            aria-invalid={passwordError ? "true" : "false"}
            aria-describedby={passwordError ? "password-error" : undefined}
            autoComplete="current-password"
          />
          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#fcf326] transition-colors" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#8FA3C4] hover:text-[#fcf326] transition-colors p-1 sm:p-2 rounded-full hover:bg-[#fcf326]/10"
          >
            {passwordVisible ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
        {passwordError && (
          <p id="password-error" className="text-[#EF4444] text-xs sm:text-sm flex items-center space-x-1" role="alert">
            <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full"></span>
            <span>{passwordError}</span>
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link href="/forgot-password">
          <button className="text-xs sm:text-sm text-[#00D8E8] hover:text-[#91f2b3] font-medium hover:underline transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </Link>
      </div>

      {/* Sign In Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-40"></div>
        <Button
          onClick={onSignInPress}
          disabled={loading || !!emailError || !!passwordError}
          type="button"
          aria-label="Iniciar sesión"
          className="relative w-full h-12 sm:h-14 lg:h-16 rounded-full text-sm sm:text-base lg:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] hover:opacity-90 text-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin" aria-hidden="true" />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      {/* Security Note */}
      <div className="text-center">
        <span className="text-xs text-[#8FA3C4] flex items-center justify-center space-x-1.5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10B981] rounded-full animate-pulse inline-block"></span>
          <span>Conexión segura SSL</span>
        </span>
      </div>
    </div>
  )
}
