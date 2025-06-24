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
  updateDoc,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import { ArrowLeft, Send, User, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"
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
      const messagesRef = collection(db, "chats", chatId, "messages")
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        sender: user.email,
        timestamp: serverTimestamp(),
        type: "text",
      })

      // Update chat's last message
      await updateDoc(doc(db, "chats", chatId), {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">Cargando chat</h3>
            <p className="text-gray-600">Conectando con tu conversación...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50">
      {/* Header */}
      <div className=" bg-blue-600 hover:bg-blue-700 px-4 py-3 flex items-center space-x-3 shadow-lg rounded-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-gray-800 hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-lg truncate">{otherUserName}</h2>
          {/*<p className="text-gray-700 text-sm">En línea</p>*/}
        </div>
{/* 
  <Button variant="ghost" size="icon" className="text-white rounded-full">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button> 
*/}
        <div className="flex items-center space-x-2">
        
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
        <div className="space-y-3 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === user?.email ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative shadow-sm ${
                  message.sender === user?.email
                    ? " bg-blue-600 hover:bg-blue-700 text-white rounded-br-md"
                    : "bg-[#e5e5e5] text-gray-800 rounded-bl-md"
                }`}
              >
                {message.type === "image" && message.image ? (
                  <div className="space-y-2">
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden">
                      <Image
                        src={message.image || "/placeholder.svg"}
                        alt="Imagen del chat"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-xs text-gray-600">{formatTime(message.timestamp)}</span>
                      {message.sender === user?.email && (
                        <div className="flex">
                          <svg width="16" height="15" className="text-gray-600">
                            <path
                              fill="currentColor"
                              d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L3.724 9.587a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="break-words text-sm leading-relaxed">{message.text}</p>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <span className="text-xs text-white">{formatTime(message.timestamp)}</span>
                      {message.sender === user?.email && (
                        <div className="flex">
                          <svg width="16" height="15" className="text-white">
                            <path
                              fill="currentColor"
                              d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L3.724 9.587a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message tail */}
                <div
                  className={`absolute bottom-0 w-0 h-0 ${
                    message.sender === user?.email
                      ? "-right-2 border-l-8 border-l-[#91f2b3] border-t-8 border-t-transparent"
                      : "-left-2 border-r-8 border-r-gray-100 border-t-8 border-t-transparent"
                  }`}
                />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" ref={fileInputRef} />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            className="text-gray-800 hover:bg-white/20 rounded-full flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="bg-white border-none text-gray-800 placeholder-gray-500 rounded-full pl-4 pr-12 py-2 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-sm"
              disabled={sending}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-[#91f2b3] hover:bg-[#7de09a] text-gray-800 rounded-full w-10 h-10 p-0 flex-shrink-0 disabled:opacity-50 shadow-lg"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
