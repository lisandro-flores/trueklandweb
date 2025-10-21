"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import HomeContent from "@/components/home/HomeContent"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Redirigir admin a su panel
    if (user && user.email === "admin@truekland.com") {
      router.push("/admin")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <HomeContent />
    </DashboardLayout>
  )
}
