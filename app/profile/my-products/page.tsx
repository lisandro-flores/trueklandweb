"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import MyProducts from "@/components/profile/MyProducts"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function MyProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
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
      <MyProducts />
    </DashboardLayout>
  )
}
