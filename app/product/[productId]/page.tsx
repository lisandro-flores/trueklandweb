"use client"

import { useEffect } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import ProductDetail from "@/components/products/ProductDetail"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = React.use(params)
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
      <ProductDetail productId={productId} />
    </DashboardLayout>
  )
}
