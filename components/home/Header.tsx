"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { collection, query, where, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"
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
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const auth = getAuth()
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
        // Intercambios
        const exchangesCountSnap = await getCountFromServer(
          query(collection(db, "Exchanges"), where("userId", "==", user.uid))
        )
        setExchangeCount(exchangesCountSnap.data().count)

        // Publicaciones
        const postsCountSnap = await getCountFromServer(
          query(collection(db, "UserPost"), where("userId", "==", user.uid))
        )
        setPostCount(postsCountSnap.data().count)

        // Chats activos
        const chatsCountSnap = await getCountFromServer(
          query(collection(db, "Chats"), where("members", "array-contains", user.uid))
        )
        setChatCount(chatsCountSnap.data().count)
      } catch (error) {
        setExchangeCount(0)
        setPostCount(0)
        setChatCount(0)
        // Opcional: muestra un toast o mensaje de error
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

  if (!visible) return null // Oculta el componente después de 3s

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#112240] to-[#1A2F4F]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2391f2b3%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative bg-[#112240]/50 backdrop-blur-md border-2 border-[#233554] text-[#E6F1FF] p-4 md:p-6 rounded-2xl animate-fade-in shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Avatar"}
                  width={40}
                  height={40}
                  className="md:w-12 md:h-12 rounded-full border-3 border-[#91f2b3] shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#91f2b3] to-[#fcf326] flex items-center justify-center text-lg md:text-2xl font-bold text-gray-900 shadow-lg">
                  {user?.displayName?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base md:text-lg font-semibold text-[#B4C7E7] truncate">{getGreeting()}</div>
              <div className="font-bold text-lg md:text-xl text-[#E6F1FF] truncate drop-shadow-sm">{user?.displayName || "Invitado"}</div>
              <div className="text-xs md:text-sm text-[#8FA3C4] hidden sm:block">{currentTime.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" className="text-[#B4C7E7] hover:bg-[#1A2F4F] hover:text-[#fcf326] relative h-8 w-8 md:h-10 md:w-10 border-2 border-transparent hover:border-[#233554]" aria-label="Notificaciones">
              <Bell className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#B4C7E7] hover:bg-[#1A2F4F] hover:text-[#91f2b3] h-8 w-8 md:h-10 md:w-10 border-2 border-transparent hover:border-[#233554]" aria-label="Regalos">
              <Gift className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>
        
        {/* Stats section with dark theme */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
          <div className="text-center p-2 md:p-3 rounded-xl bg-[#00D8E8]/10 border-2 border-[#00D8E8]/30 shadow-md">
            <div className="text-lg md:text-2xl font-bold text-[#00D8E8]">{exchangeCount}</div>
            <div className="text-[#B4C7E7] text-xs md:text-sm">Intercambios</div>
          </div>
          <div className="text-center p-2 md:p-3 rounded-xl bg-[#fcf326]/10 border-2 border-[#fcf326]/30 shadow-md">
            <div className="text-lg md:text-2xl font-bold text-[#fcf326] drop-shadow-sm">{postCount}</div>
            <div className="text-[#B4C7E7] text-xs md:text-sm">Publicaciones</div>
          </div>
          <div className="text-center p-2 md:p-3 rounded-xl bg-[#91f2b3]/10 border-2 border-[#91f2b3]/30 shadow-md">
            <div className="text-lg md:text-2xl font-bold text-[#91f2b3]">{chatCount}</div>
            <div className="text-[#B4C7E7] text-xs md:text-sm">Chats activos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
  
