// components/chat/ChatSystem.tsx - Sistema de chat
"use client"
import { useState, useEffect, useRef } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { ChatMessage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, User, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useNotifications } from '@/hooks/useNotifications'

interface ChatSystemProps {
  exchangeId: string
  otherUserId: string
  otherUserName: string
}

export default function ChatSystem({ exchangeId, otherUserId, otherUserName }: ChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!exchangeId) return

    const q = query(
      collection(db, 'chatMessages'),
      where('exchangeId', '==', exchangeId),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as ChatMessage[]

      setMessages(messagesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [exchangeId])

  // Enviar mensaje
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || sending) return

    setSending(true)

    try {
      const messageData: Omit<ChatMessage, 'id'> = {
        exchangeId,
        senderId: user.uid,
        receiverId: otherUserId,
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false,
        type: 'text'
      }

      await addDoc(collection(db, 'chatMessages'), {
        ...messageData,
        timestamp: serverTimestamp()
      })

      // Crear notificación para el otro usuario
      await createNotification(
        otherUserId,
        'message',
        'Nuevo mensaje',
        `${user.displayName || 'Un usuario'} te envió un mensaje`,
        { exchangeId }
      )

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      })
    }
  }

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Cargando chat...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-96 flex flex-col bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
          <User className="w-5 h-5 text-[#91f2b3]" />
          Chat con {otherUserName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No hay mensajes aún</p>
              <p className="text-sm">¡Inicia la conversación!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.senderId === user?.uid
              const showDate = index === 0 || 
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

              return (
                <div key={message.id} className="space-y-2">
                  {/* Separador de fecha */}
                  {showDate && (
                    <div className="text-center">
                      <span className="bg-[#0A1628]/90 text-[#E6F1FF]/70 text-xs px-3 py-1 rounded-full border-2 border-[#233554]">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}

                  {/* Mensaje */}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-md px-4 py-2 rounded-2xl ${
                      isOwn 
                        ? 'bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-[#0A1628] shadow-lg' 
                        : 'bg-[#1A2F4F]/80 text-[#E6F1FF] border-2 border-[#233554]'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        isOwn ? 'text-[#0A1628]/70' : 'text-[#E6F1FF]/50'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de envío */}
        <div className="border-t border-white/20 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={sending}
              className="flex-1 input-modern"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              size="icon"
              className="btn-primary rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
