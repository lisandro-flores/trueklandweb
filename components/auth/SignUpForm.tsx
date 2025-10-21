"use client"

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, ArrowRight, Sparkles, Send, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { app, googleProvider } from "@/lib/firebase"
import { GoogleIcon } from "@/components/ui/google-icon"

interface SignUpFormProps {
  onSignUpSuccess: () => void
}

export default function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const { toast } = useToast()
  const auth = getAuth(app)
  const db = getFirestore(app)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const onSignUpPress = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce tu nombre completo.",
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

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: fullName })
      await sendEmailVerification(user)
      setPendingVerification(true)

      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, {
        createdAt: new Date().toISOString(),
        email: user.email,
        uid: user.uid,
        fullName: fullName,
      })

      toast({
        title: "¡Registro exitoso! 🎉",
        description: "Se ha enviado un correo de verificación. Por favor, revisa tu correo electrónico.",
      })
    } catch (error: unknown) {
      const authError = error as { code?: string }
      if (authError.code === "auth/email-already-in-use") {
        toast({
          title: "Error",
          description: "El correo electrónico ya está en uso. Por favor, usa otro correo.",
          variant: "destructive",
        })
      } else {
        console.error(error)
        toast({
          title: "Error",
          description: "Hubo un problema al intentar registrarse.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const onPressVerify = async () => {
    const user = auth.currentUser

    try {
      await user?.reload()
      if (user?.emailVerified) {
        toast({
          title: "¡Verificación exitosa! ✅",
          description: "Tu cuenta ha sido verificada. Ahora puedes iniciar sesión.",
        })
        onSignUpSuccess()
      } else {
        toast({
          title: "Error",
          description: "El correo electrónico no ha sido verificado aún.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Hubo un problema al verificar el correo.",
        variant: "destructive",
      })
    }
  }

  const onGoogleSignUp = async () => {
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
        title: "¡Registro exitoso! 🎉",
        description: "Te has registrado con Google exitosamente.",
      })
      onSignUpSuccess()
    } catch (err: unknown) {
      console.error(err)
      const error = err as { code?: string; message?: string }
      
      if (error.code === "auth/popup-closed-by-user") {
        toast({
          title: "Cancelado",
          description: "El registro fue cancelado.",
          variant: "destructive",
        })
      } else if (error.code === "auth/popup-blocked") {
        toast({
          title: "Popup bloqueado",
          description: "Por favor, permite las ventanas emergentes para continuar.",
          variant: "destructive",
        })
      } else if (error.code === "auth/account-exists-with-different-credential") {
        toast({
          title: "Cuenta existente",
          description: "Ya existe una cuenta con este correo electrónico.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al registrarse con Google.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center">
        {/* Verification Icon */}
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-[#91f2b3]/30 to-[#fcf326]/30 rounded-full flex items-center justify-center relative">
          <Send className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-[#91f2b3]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-20 animate-pulse"></div>
        </div>

        {/* Verification Content */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
            📧 Verifica tu correo
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-[#B4C7E7] leading-relaxed max-w-sm mx-auto text-sm sm:text-base lg:text-lg px-2">
              Hemos enviado un enlace de verificación a:
            </p>
            <p className="font-bold text-[#91f2b3] text-sm sm:text-base lg:text-lg bg-[#91f2b3]/10 px-3 py-2 rounded-full inline-block break-all">
              {emailAddress}
            </p>
            <p className="text-[#8FA3C4] text-xs sm:text-sm px-2">
              Revisa tu correo (incluyendo spam) y presiona el botón de abajo.
            </p>
          </div>
        </div>

        {/* Verify Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-30"></div>
          <Button
            onClick={onPressVerify}
            className="relative w-full h-12 sm:h-14 lg:h-16 rounded-full text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#91f2b3]/90 hover:to-[#fcf326]/90 text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 sm:space-x-3"
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <span>Verificar Correo</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center px-2">
          <p className="text-xs sm:text-sm text-[#E6F1FF]/60">
            ¿No recibiste el correo?{" "}
            <button className="text-[#91f2b3] hover:underline font-medium">reenviar verificación</button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Message - Only show on mobile */}
      <div className="text-center space-y-2 lg:hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fcf326]/20 to-[#91f2b3]/20 rounded-full mb-3 border border-[#233554]">
          <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-[#fcf326]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
          ¡Únete! 🚀
        </h3>
        <p className="text-[#B4C7E7] text-sm sm:text-base">Crea tu cuenta gratuita</p>
      </div>

      {/* Google Sign Up Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-2xl blur opacity-30"></div>
        <Button
          onClick={onGoogleSignUp}
          disabled={loading}
          variant="outline"
          type="button"
          aria-label="Registrarse con Google"
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
              <span className="text-sm sm:text-base">Registrarse con Google</span>
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
          <span className="px-4 bg-[#0A1628] text-[#8FA3C4]">o regístrate con email</span>
        </div>
      </div>

      {/* Full Name Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#91f2b3]" />
          <span>Nombre completo</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            type="text"
            placeholder="Tu nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all duration-300 pl-10 sm:pl-12"
          />
          <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#91f2b3] transition-colors" />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2">
          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#fcf326]" />
          <span>Correo electrónico</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf326]/10 to-[#91f2b3]/10 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all duration-300 pl-10 sm:pl-12"
          />
          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#fcf326] transition-colors" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2">
          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-[#91f2b3]" />
          <span>Contraseña</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/10 to-[#fcf326]/10 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all duration-300 pl-10 sm:pl-12 pr-10 sm:pr-12"
          />
          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#91f2b3] transition-colors" />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#8FA3C4] hover:text-[#91f2b3] transition-colors p-1 sm:p-2 rounded-full hover:bg-[#91f2b3]/10"
          >
            {passwordVisible ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-[#E6F1FF] flex items-center space-x-2">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#fcf326]" />
          <span>Confirmar contraseña</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf326]/10 to-[#91f2b3]/10 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="relative h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#5A6B89] focus:border-[#00D8E8] focus:ring-[#00D8E8] rounded-xl transition-all duration-300 pl-10 sm:pl-12 pr-10 sm:pr-12"
          />
          <CheckCircle className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#8FA3C4] group-hover:text-[#fcf326] transition-colors" />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#8FA3C4] hover:text-[#fcf326] transition-colors p-1 sm:p-2 rounded-full hover:bg-[#fcf326]/10"
          >
            {confirmPasswordVisible ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      <div className="space-y-2 bg-[#112240]/50 rounded-xl border border-[#233554] p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-semibold text-[#E6F1FF]">Requisitos:</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                password.length >= 6 ? "bg-[#91f2b3]" : "bg-[#233554]"
              }`}
            ></div>
            <span className={password.length >= 6 ? "text-[#91f2b3] font-medium" : "text-[#8FA3C4]"}>
              Mínimo 6 caracteres
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                password === confirmPassword && password.length > 0 ? "bg-[#fcf326]" : "bg-[#233554]"
              }`}
            ></div>
            <span
              className={
                password === confirmPassword && password.length > 0 ? "text-[#fcf326] font-medium" : "text-[#8FA3C4]"
              }
            >
              Las contraseñas coinciden
            </span>
          </div>
        </div>
      </div>

      {/* Sign Up Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcf326] to-[#91f2b3] rounded-full blur-xl opacity-40"></div>
        <Button
          onClick={onSignUpPress}
          disabled={loading}
          className="relative w-full h-12 sm:h-14 lg:h-16 rounded-full text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-[#fcf326] to-[#91f2b3] hover:opacity-90 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 sm:space-x-3"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
              <span>Creando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Crear cuenta</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </Button>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center bg-[#91f2b3]/10 rounded-xl border border-[#233554] p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#B4C7E7] leading-relaxed">
          Al registrarte, aceptas nuestros{" "}
          <button className="text-[#91f2b3] hover:text-[#fcf326] hover:underline font-semibold transition-colors">Términos</button> y{" "}
          <button className="text-[#91f2b3] hover:text-[#fcf326] hover:underline font-semibold transition-colors">Privacidad</button>
        </p>
      </div>
    </div>
  )
}
