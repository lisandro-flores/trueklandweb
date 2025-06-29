"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import ExchangeSystem from "@/components/exchange/ExchangeSystem"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ExchangesPage() {
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
      <div className="container mx-auto px-4 py-8">
        <ExchangeSystem />
      </div>
    </DashboardLayout>
  )
}
