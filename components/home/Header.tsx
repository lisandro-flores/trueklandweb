"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"
import Image from "next/image"
import { Bell, Gift } from "lucide-react"
import { Button } from "../ui/button"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [exchangeCount, setExchangeCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [chatCount, setChatCount] = useState(0)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      unsubscribe()
      clearInterval(timeInterval)
    }
  }, [])

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore(app)
      if (user) {
        // Contar intercambios del usuario
        const exchangesSnapshot = await getDocs(
          query(collection(db, "Exchanges"), where("userId", "==", user.uid))
        )
        setExchangeCount(exchangesSnapshot.size)

        // Contar publicaciones del usuario
        const postsSnapshot = await getDocs(
          query(collection(db, "UserPost"), where("userId", "==", user.uid))
        )
        setPostCount(postsSnapshot.size)

        // Contar chats activos del usuario
        const chatsSnapshot = await getDocs(
          query(collection(db, "Chats"), where("members", "array-contains", user.uid))
        )
        setChatCount(chatsSnapshot.size)
      }
    }
    fetchCounts()
  }, [user])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "¡Buenos días!"
    if (hour < 18) return "¡Buenas tardes!"
    return "¡Buenas noches!"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div className="relative glass-effect border-0 text-white p-6 rounded-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Avatar"}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold">
                  {user?.displayName?.[0] || "?"}
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-semibold">{getGreeting()}</div>
              <div className="font-bold text-xl">{user?.displayName || "Invitado"}</div>
              <div className="text-sm opacity-80">{currentTime.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative" aria-label="Notificaciones">
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" aria-label="Regalos">
              <Gift className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{exchangeCount}</div>
            <div className="text-white/80 text-sm">Intercambios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{postCount}</div>
            <div className="text-white/80 text-sm">Publicaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{chatCount}</div>
            <div className="text-white/80 text-sm">Chats activos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
