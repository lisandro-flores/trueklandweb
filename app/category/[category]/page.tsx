"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import CategoryItems from "@/components/category/CategoryItems"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
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
