"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import EditProduct from "@/components/products/EditProduct"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
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
      <EditProduct productId={productId} />
    </DashboardLayout>
  )
}
