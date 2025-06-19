"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import LoginPage from "@/components/auth/LoginPage"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  return <LoginPage />
}
