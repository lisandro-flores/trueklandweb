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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)
  const storage = getStorage(app)

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

      setMessages(messagesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [chatId, user, db])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
      })

      setNewMessage("")
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
      <Card className="glass-effect border-0 rounded-b-none">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div>
                <h2 className="font-semibold">{otherUserName}</h2>
                <p className="text-sm text-gray-600">En línea</p>
              </div>
            </div>

            {/* Chat Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeleteChat}
                  className="text-red-600 focus:text-red-600"
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
      <Card className="flex-1 glass-effect border-0 rounded-none overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === user?.email ? "justify-end" : "justify-start"}`}
              >
                <div className="group relative">
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === user?.email
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.type === "image" && message.image ? (
                      <div className="space-y-2">
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden">
                          <Image
                            src={message.image || "/placeholder.svg"}
                            alt="Imagen del chat"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs opacity-75">{formatTime(message.timestamp)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="break-words">{message.text}</p>
                        <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Delete button - only show for own messages */}
                  {message.sender === user?.email && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="glass-effect border-0 rounded-t-none">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" ref={fileInputRef} />

            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={sending}>
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1"
              disabled={sending}
            />

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
