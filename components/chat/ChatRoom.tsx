"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import { ArrowLeft, Send, ImageIcon, User, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

interface Message {
  id: string
  text: string
  image?: string
  sender: string
  timestamp: string
  type: "text" | "image"
}

interface ChatRoomProps {
  chatId: string
}

export default function ChatRoom({ chatId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUserEmail, setOtherUserEmail] = useState("")
  const [otherUserName, setOtherUserName] = useState("")
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)
  const storage = getStorage(app)

  // Solicitar permiso de notificaciones
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "chats", chatId))
        if (chatDoc.exists()) {
          const chatData = chatDoc.data()
          const otherUser = chatData.users.find((u: string) => u !== user?.email)
          setOtherUserEmail(otherUser || "")
          setOtherUserName(otherUser?.split("@")[0] || "Usuario")
        }
      } catch (error) {
        console.error("Error fetching chat info:", error)
      }
    }

    if (user) {
      fetchChatInfo()
    }
  }, [chatId, user, db])

  // Escuchar estado de "escribiendo..." del otro usuario
  useEffect(() => {
    if (!user) return

    const chatDocRef = doc(db, "chats", chatId)
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        const typingUser = data.typing || {}
        
        // Verificar si el otro usuario está escribiendo
        if (typingUser[otherUserEmail]) {
          const lastTyping = typingUser[otherUserEmail].toDate()
          const now = new Date()
          const diffSeconds = (now.getTime() - lastTyping.getTime()) / 1000
          
          // Si escribió hace menos de 3 segundos, mostrar indicador
          setOtherUserTyping(diffSeconds < 3)
        } else {
          setOtherUserTyping(false)
        }
      }
    })

    return () => unsubscribe()
  }, [chatId, user, db, otherUserEmail])

  useEffect(() => {
    if (!user) return

    const messagesRef = collection(db, "chats", chatId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Message[]

      // Reproducir sonido si hay un mensaje nuevo del otro usuario
      if (messages.length > 0 && messagesData.length > messages.length) {
        const lastMessage = messagesData[messagesData.length - 1]
        if (lastMessage.sender !== user.email) {
          // Sonido de notificación simple
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVqzn77BdGAg+ltryxnMnBSx+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzxnksBSt6yfDdi0AIE1yw6OyiVBMMSqPf87FdGAg+ltry");
          audio.volume = 0.3
          audio.play().catch(() => {}) // Ignorar errores si el usuario no ha interactuado
        }
      }

      setMessages(messagesData)
      setLoading(false)

      // Marcar mensajes como leídos
      markMessagesAsRead()
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, user, db, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const markMessagesAsRead = async () => {
    if (!user) return

    try {
      const chatDocRef = doc(db, "chats", chatId)
      const chatDoc = await getDoc(chatDocRef)
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data()
        
        // Solo actualizar si el último mensaje no es del usuario actual
        if (chatData.lastMessageSender !== user.email && chatData.unreadCount > 0) {
          await updateDoc(chatDocRef, {
            unreadCount: 0
          })
        }
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setSending(true)

    try {
      const chatDocRef = doc(db, "chats", chatId)
      let chatDocSnap = await getDoc(chatDocRef)
      if (!chatDocSnap.exists()) {
        // Crea el chat si no existe
        await setDoc(chatDocRef, {
          users: [user.email, otherUserEmail],
          lastMessage: "",
          lastMessageTime: null,
          lastMessageSender: "",
        })
        chatDocSnap = await getDoc(chatDocRef)
      }

      const messagesRef = collection(db, "chats", chatId, "messages")
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        sender: user.email,
        timestamp: serverTimestamp(),
        type: "text",
      })

      await updateDoc(chatDocRef, {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        lastMessageSender: user.email,
        unreadCount: 1, // Incrementar contador para el otro usuario
      })

      setNewMessage("")

      // Intentar enviar notificación push
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Nuevo mensaje de " + (user.displayName || user.email), {
          body: newMessage.trim(),
          icon: "/TrueklandNavBar.png",
          badge: "/TrueklandNavBar.png",
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Error al enviar el mensaje",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const sendImage = async (file: File) => {
    if (!user) return

    setSending(true)

    try {
      // Upload image
      const imageRef = ref(storage, `chat-images/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(imageRef, file)
      const imageUrl = await getDownloadURL(snapshot.ref)

      // Send message with image
      const messagesRef = collection(db, "chats", chatId, "messages")
      await addDoc(messagesRef, {
        text: "",
        image: imageUrl,
        sender: user.email,
        timestamp: serverTimestamp(),
        type: "image",
      })

      // Update chat's last message
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: "📷 Imagen",
        lastMessageTime: serverTimestamp(),
        lastMessageSender: user.email,
      })

      toast({
        title: "Imagen enviada",
        description: "La imagen se ha enviado correctamente",
      })
    } catch (error) {
      console.error("Error sending image:", error)
      toast({
        title: "Error",
        description: "Error al enviar la imagen",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        })
        return
      }
      sendImage(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTyping = async (value: string) => {
    setNewMessage(value)

    if (!user || !value.trim()) return

    try {
      // Actualizar estado de "escribiendo..."
      const chatDocRef = doc(db, "chats", chatId)
      await updateDoc(chatDocRef, {
        [`typing.${user.email}`]: serverTimestamp()
      })

      // Limpiar el timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Establecer nuevo timeout para limpiar el estado después de 3 segundos
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          await updateDoc(chatDocRef, {
            [`typing.${user.email}`]: null
          })
        } catch (error) {
          console.error("Error clearing typing status:", error)
        }
      }, 3000)
    } catch (error) {
      console.error("Error updating typing status:", error)
    }
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", messageId))
      toast({
        title: "Mensaje eliminado",
        description: "El mensaje se ha eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el mensaje",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChat = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este chat completo? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      const result = await deleteChat(chatId)
      if (result.success) {
        toast({
          title: "Chat eliminado",
          description: "El chat ha sido eliminado correctamente",
        })
        router.push("/chats")
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
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] rounded-b-none">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="text-[#E6F1FF] hover:text-[#91f2b3] hover:bg-[#1A2F4F]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#91f2b3] to-[#fcf326] p-[2px]">
                <div className="w-full h-full flex items-center justify-center bg-[#1A2F4F] rounded-full">
                  <User className="h-5 w-5 text-[#91f2b3]" />
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-[#E6F1FF]">{otherUserName}</h2>
                {otherUserTyping ? (
                  <p className="text-sm text-[#fcf326] flex items-center gap-1 animate-pulse">
                    <span className="inline-block w-2 h-2 bg-[#fcf326] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block w-2 h-2 bg-[#fcf326] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block w-2 h-2 bg-[#fcf326] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="ml-1">Escribiendo...</span>
                  </p>
                ) : (
                  <p className="text-sm text-[#91f2b3]">● En línea</p>
                )}
              </div>
            </div>

            {/* Chat Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-[#E6F1FF] hover:text-[#91f2b3] hover:bg-[#1A2F4F]"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#112240] border-2 border-[#233554]">
                <DropdownMenuItem
                  onClick={handleDeleteChat}
                  className="text-[#EF4444] focus:text-[#EF4444] focus:bg-[#1A2F4F] cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 bg-[#0A1628]/95 backdrop-blur-md border-2 border-[#233554] border-t-0 border-b-0 rounded-none overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#233554] scrollbar-track-[#0A1628]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <User className="h-16 w-16 text-[#E6F1FF]/30 mx-auto mb-4" />
                  <p className="text-[#E6F1FF]/60">No hay mensajes aún</p>
                  <p className="text-[#E6F1FF]/40 text-sm mt-2">Envía un mensaje para comenzar la conversación</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === user?.email ? "justify-end" : "justify-start"}`}
                >
                  <div className="group relative">
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl transition-all duration-200 ${
                        message.sender === user?.email
                          ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-[#0A1628] font-medium shadow-lg shadow-[#91f2b3]/20"
                          : "bg-[#1A2F4F]/80 text-[#E6F1FF] border-2 border-[#233554] backdrop-blur-sm"
                      }`}
                    >
                      {message.type === "image" && message.image ? (
                        <div className="space-y-2">
                          <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-[#233554]">
                            <Image
                              src={message.image || "/placeholder.svg"}
                              alt="Imagen del chat"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className={`text-xs ${message.sender === user?.email ? "opacity-75" : "opacity-60"}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="break-words">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === user?.email ? "opacity-75" : "opacity-60"}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Delete button - only show for own messages */}
                    {message.sender === user?.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full shadow-lg"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] rounded-t-none">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" ref={fileInputRef} />

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={sending}
              className="bg-[#1A2F4F] border-2 border-[#233554] text-[#91f2b3] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
              disabled={sending}
            />

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="animate-spin h-4 w-4 border-2 border-[#0A1628] border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
