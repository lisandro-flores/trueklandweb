"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import UserProfile from "@/components/user/UserProfile"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function UserProfilePage({ params }: { params: { email: string } }) {
  const { email } = params
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
      <UserProfile email={decodeURIComponent(email)} />
    </DashboardLayout>
  )
}
