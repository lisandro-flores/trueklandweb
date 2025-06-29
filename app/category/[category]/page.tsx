"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import CategoryItems from "@/components/category/CategoryItems"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = React.use(params)
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
      <CategoryItems category={decodeURIComponent(category)} />
    </DashboardLayout>
  )
}
