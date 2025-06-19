"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, query, where, onSnapshot, orderBy, getFirestore } from "firebase/firestore"
import { MessageCircle, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface Chat {
  id: string
  users: string[]
  lastMessage: string
  lastMessageTime: string
  lastMessageSender: string
  unreadCount?: number
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const db = getFirestore(app)

  useEffect(() => {
    if (!user) return

    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", user.email), orderBy("lastMessageTime", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[]

      setChats(chatsData)
      setFilteredChats(chatsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, db])

  useEffect(() => {
    if (searchTerm) {
      const filtered = chats.filter((chat) => {
        const otherUser = chat.users.find((u) => u !== user?.email)
        return (
          otherUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setFilteredChats(filtered)
    } else {
      setFilteredChats(chats)
    }
  }, [chats, searchTerm, user])

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      } else if (diffInHours < 168) {
        // 7 days
        return date.toLocaleDateString("es-ES", { weekday: "short" })
      } else {
        return date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        })
      }
    } catch {
      return ""
    }
  }

  const getOtherUserEmail = (chat: Chat) => {
    return chat.users.find((u) => u !== user?.email) || ""
  }

  const getOtherUserName = (email: string) => {
    return email.split("@")[0] // Simple fallback
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Mis Chats</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const otherUserEmail = getOtherUserEmail(chat)
              const otherUserName = getOtherUserName(otherUserEmail)
              const isUnread = chat.lastMessageSender !== user?.email && chat.unreadCount && chat.unreadCount > 0

              return (
                <Link key={chat.id} href={`/chats/${chat.id}`}>
                  <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 glass-effect border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                          </div>
                          {isUnread && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold truncate ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                              {otherUserName}
                            </h3>
                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                          </div>

                          <p className={`text-sm truncate ${isUnread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                            {chat.lastMessageSender === user?.email ? "Tú: " : ""}
                            {chat.lastMessage}
                          </p>
                        </div>

                        {isUnread && chat.unreadCount && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "No se encontraron conversaciones" : "No tienes conversaciones"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza a intercambiar productos para iniciar conversaciones"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
