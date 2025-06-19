"use client"

import { useState } from "react"
import Image from "next/image"
import SignInForm from "./SignInForm"
import SignUpForm from "./SignUpForm"

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true)

  const toggleForm = () => {
    setShowSignIn(!showSignIn)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src="./../../assets/images/cam.png"
          alt="TrueKland"
          fill
          className="object-cover rounded-b-3xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6 bg-white rounded-t-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-700 mt-6 gradient-text">Bienvenido</h1>

        <div className="mt-8 text-center">
          <p className="text-lg">
            ¡<span className="text-pink-500 font-semibold">Intercambia</span>,{" "}
            <span className="text-cyan-400 font-semibold">Conecta y</span>,{" "}
            <span className="text-blue-600 font-semibold">Descubre</span>. Convierte lo que ya no necesitas en algo
            valioso para los demás.
          </p>
        </div>

        <div className="mt-8 animate-fade-in">
          {showSignIn ? <SignInForm /> : <SignUpForm onSignUpSuccess={() => setShowSignIn(true)} />}
        </div>

        <div className="mt-6 text-center">
          <button onClick={toggleForm} className="text-primary hover:underline font-medium">
            {showSignIn ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  )
}
