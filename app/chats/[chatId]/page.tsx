"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import ChatRoom from "@/components/chat/ChatRoom"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = React.use(params)
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
      <ChatRoom chatId={chatId} />
    </DashboardLayout>
  )
}
