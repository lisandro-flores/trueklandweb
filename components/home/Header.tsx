"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore, collection, query, where, getCountFromServer } from "firebase/firestore"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"
import Image from "next/image"
import { Bell, Gift, TrendingUp, MessageCircle, Package } from "lucide-react"
import { Button } from "../ui/button"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [exchangeCount, setExchangeCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [chatCount, setChatCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

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
      if (!user) return
      try {
        const db = getFirestore(app)
        // Intercambios
        const exchangesCountSnap = await getCountFromServer(
          query(collection(db, "Exchanges"), where("userId", "==", user.uid)),
        )
        setExchangeCount(exchangesCountSnap.data().count)

        // Publicaciones
        const postsCountSnap = await getCountFromServer(
          query(collection(db, "UserPost"), where("userId", "==", user.uid)),
        )
        setPostCount(postsCountSnap.data().count)

        // Chats activos
        const chatsCountSnap = await getCountFromServer(
          query(collection(db, "Chats"), where("members", "array-contains", user.uid)),
        )
        setChatCount(chatsCountSnap.data().count)
      } catch (error) {
        setExchangeCount(0)
        setPostCount(0)
        setChatCount(0)
        console.error("Error al obtener los contadores:", error)
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

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "🌅"
    if (hour < 18) return "☀️"
    return "🌙"
  }

  if (!visible) return null

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-br from-[#91f2b3] via-[#fcf326] to-[#91f2b3]">
          <div className="p-8 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
      {/* Animated Background */}
      <div className="bg-gradient-to-br from-[#91f2b3] via-[#fcf326] to-[#91f2b3]">
        {/* Main Content */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-20 text-gray-800 p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                {user?.photoURL ? (
                  <div className="relative">
                    <Image
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.displayName || "Avatar"}
                      width={64}
                      height={64}
                      className="rounded-full border-3 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#91f2b3] rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-2xl font-bold border-3 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl">
                    {user?.displayName?.[0] || "?"}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getGreetingEmoji()}</span>
                  <span className="text-lg font-semibold text-gray-800">{getGreeting()}</span>
                </div>
                <div className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {user?.displayName || "Invitado"}
                </div>
                <div className="text-sm text-gray-700 flex items-center space-x-2">
                  <span>📅</span>
                  <span>
                    {currentTime.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 hover:bg-white hover:bg-opacity-20 relative group transition-all duration-300 hover:scale-110"
                aria-label="Notificaciones"
              >
                <Bell className="h-6 w-6 transition-all duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 hover:bg-white hover:bg-opacity-20 group transition-all duration-300 hover:scale-110"
                aria-label="Regalos"
              >
                <Gift className="h-6 w-6 transition-all duration-300 group-hover:rotate-12" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {/* Intercambios */}
            <div className="group relative">
              <div className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full">
                    <TrendingUp className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{exchangeCount}</div>
                <div className="text-gray-700 text-sm font-medium">Intercambios</div>
              </div>
            </div>

            {/* Publicaciones */}
            <div className="group relative">
              <div className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#fcf326] to-[#91f2b3] rounded-full">
                    <Package className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{postCount}</div>
                <div className="text-gray-700 text-sm font-medium">Publicaciones</div>
              </div>
            </div>

            {/* Chats */}
            <div className="group relative">
              <div className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full">
                    <MessageCircle className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{chatCount}</div>
                <div className="text-gray-700 text-sm font-medium">Chats activos</div>
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]"></div>
        </div>
      </div>
    </div>
  )
}
