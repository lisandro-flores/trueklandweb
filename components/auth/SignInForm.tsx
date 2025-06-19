"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"

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
        router.push("/dashboard")
      } else {
        toast({
          title: "Verificación pendiente",
          description: "Por favor, verifica tu correo electrónico.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/wrong-password") {
        toast({
          title: "Error",
          description: "La contraseña es incorrecta.",
          variant: "destructive",
        })
      } else if (err.code === "auth/user-not-found") {
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

  return (
    <div className="space-y-4 max-w-md mx-auto">
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

      <Button
        onClick={onSignInPress}
        disabled={loading}
        className="w-full h-12 rounded-full text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </div>
  )
}
