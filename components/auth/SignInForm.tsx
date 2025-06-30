"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword, signInWithPopup, getAuth } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { app, googleProvider, db } from "@/lib/firebase"
import Image from "next/image"

export default function SignInForm() {
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = getAuth(app)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
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
        toast({
          title: "¡Bienvenido de vuelta! 🎉",
          description: "Has iniciado sesión exitosamente.",
        })
        router.push("/dashboard")
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

      toast({
        title: "¡Bienvenido! 🎉",
        description: "Has iniciado sesión con Google exitosamente.",
      })
      router.push("/dashboard")
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
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 glass-effect rounded-2xl mb-3 border border-white/30">
          <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-[#91f2b3]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold gradient-text">
          ¡Bienvenido! 👋
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">Inicia sesión para continuar</p>
      </div>

      {/* Google Sign In Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-2xl blur opacity-20"></div>
        <Button
          onClick={onGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="relative w-full h-12 sm:h-14 lg:h-16 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center space-x-3"
        >
          <Image
            src="/assets/Google.svg"
            alt="Google"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6"
          />
          <span className="text-sm sm:text-base">Continuar con Google</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">o continúa con email</span>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#91f2b3]" />
          <span>Correo electrónico</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="input-modern relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg pl-10 sm:pl-12"
          />
          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-[#91f2b3] transition-colors" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-[#fcf326]" />
          <span>Contraseña</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf326]/20 to-[#91f2b3]/20 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="Tu contraseña segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-modern relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg pl-10 sm:pl-12 pr-10 sm:pr-12"
          />
          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-[#fcf326] transition-colors" />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#fcf326] transition-colors p-1 sm:p-2 rounded-full hover:bg-[#fcf326]/10"
          >
            {passwordVisible ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link href="/forgot-password">
          <button className="text-xs sm:text-sm text-[#91f2b3] hover:text-[#fcf326] font-medium hover:underline transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </Link>
      </div>

      {/* Sign In Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-30"></div>
        <Button
          onClick={onSignInPress}
          disabled={loading}
          className="btn-primary relative w-full h-12 sm:h-14 lg:h-16 rounded-full text-sm sm:text-base lg:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin"></div>
              <span>Iniciando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </Button>
      </div>

      {/* Security Note */}
      <div className="text-center">
        <span className="text-xs text-gray-500 flex items-center justify-center space-x-1.5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#91f2b3] rounded-full animate-pulse inline-block"></span>
          <span>Conexión segura SSL</span>
        </span>
      </div>
    </div>
  )
}
