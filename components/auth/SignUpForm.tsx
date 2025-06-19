"use client"

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"

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
        title: "Verificación",
        description: "Se ha enviado un correo de verificación. Por favor, revisa tu correo electrónico.",
      })
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
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
          title: "Éxito",
          description: "Registro exitoso, por favor inicia sesión.",
        })
        onSignUpSuccess()
      } else {
        toast({
          title: "Error",
          description: "El correo electrónico no ha sido verificado.",
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

  if (pendingVerification) {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <p className="text-center text-gray-700">
          Por favor, verifica tu correo electrónico y luego presiona "Verificar Correo".
        </p>
        <Button
          onClick={onPressVerify}
          className="w-full h-12 rounded-full text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Verificar Correo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <Input
          type="text"
          placeholder="Nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-12"
        />
      </div>

      <div>
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          className="h-12"
        />
      </div>

      <div className="relative">
        <Input
          type={passwordVisible ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 pr-10"
        />
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="absolute right-3 top-3 text-gray-500"
        >
          {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative">
        <Input
          type={confirmPasswordVisible ? "text" : "password"}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-12 pr-10"
        />
        <button
          type="button"
          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          className="absolute right-3 top-3 text-gray-500"
        >
          {confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Button
        onClick={onSignUpPress}
        disabled={loading}
        className="w-full h-12 rounded-full text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {loading ? "Registrando..." : "Registrar"}
      </Button>
    </div>
  )
}
