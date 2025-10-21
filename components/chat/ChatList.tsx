"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { collection, query, where, onSnapshot, orderBy, getFirestore } from "firebase/firestore"
import { MessageCircle, Search, User, Trash2, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { app, deleteChat } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface Chat {
  id: string
  users: string[]
  lastMessage: string
  lastMessageTime: string
  lastMessageSender: string
  unreadCount?: number
  createdAt?: string
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)

  useEffect(() => {
    if (!user) return

    const chatsRef = collection(db, "chats")
    const q = query(
      chatsRef,
      where("users", "array-contains", user.email),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData: Chat[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          users: data.users || [],
          lastMessage: data.lastMessage || "",
          lastMessageTime: data.lastMessageTime?.toDate ? data.lastMessageTime.toDate().toISOString() : (data.lastMessageTime || ""),
          lastMessageSender: data.lastMessageSender || "",
          unreadCount: data.unreadCount,
        }
      })

      // Imprimir cada chat con fechas legibles
      chatsData.forEach(chat => {
        console.log({
          ...chat,
          createdAt: chat.createdAt?.toString(),
          lastMessageTime: chat.lastMessageTime?.toString(),
        })
      })

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

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const result = await deleteChat(chatId)
      if (result.success) {
        toast({
          title: "Chat eliminado",
          description: "El chat ha sido eliminado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo eliminar el chat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el chat",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#112240]/95 backdrop-blur-md rounded-2xl p-6 border-2 border-[#233554]">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent mb-6">
          Mis Chats
        </h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-[#E6F1FF]/60" />
          <Input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
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
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[#0A1628]/80 backdrop-blur-sm border-2 border-[#233554] hover:border-[#91f2b3] hover:shadow-[#91f2b3]/10">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1A2F4F] border-2 border-[#233554]">
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-6 w-6 text-[#91f2b3]" />
                            </div>
                          </div>
                          {isUnread && <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-[#0A1628]"></div>}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold truncate ${isUnread ? "text-[#E6F1FF]" : "text-[#E6F1FF]/80"}`}>
                              {otherUserName}
                            </h3>
                            <span className="text-xs text-[#E6F1FF]/50">{formatTime(chat.lastMessageTime)}</span>
                          </div>

                          <p className={`text-sm truncate ${isUnread ? "text-[#E6F1FF] font-medium" : "text-[#E6F1FF]/60"}`}>
                            {chat.lastMessageSender === user?.email ? "Tú: " : ""}
                            {chat.lastMessage}
                          </p>
                        </div>

                        {isUnread && chat.unreadCount && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs bg-[#EF4444] text-white border-0">
                            {chat.unreadCount}
                          </Badge>
                        )}

                        {/* Opciones del chat */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-[#E6F1FF]/70 hover:text-[#91f2b3] hover:bg-[#1A2F4F]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#112240] border-2 border-[#233554]">
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="text-[#EF4444] focus:text-[#EF4444] focus:bg-[#1A2F4F] cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-[#E6F1FF]/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#E6F1FF] mb-2">
                {searchTerm ? "No se encontraron conversaciones" : "No tienes conversaciones"}
              </h3>
              <p className="text-[#E6F1FF]/60">
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
