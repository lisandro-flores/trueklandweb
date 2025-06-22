"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, MessageCircle, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"

export default function Navbar() {
  const pathname = usePathname()
  const [unreadChats, setUnreadChats] = useState(0)
  const { user } = useAuth()
  const db = getFirestore(app)

  useEffect(() => {
    if (!user) return

    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", user.email))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadChats(snapshot.docs.length)
    })

    return () => unsubscribe()
  }, [user, db])

  const navItems = [
    {
      name: "Inicio",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Explorar",
      href: "/explore",
      icon: Search,
    },
    {
      name: "Publicar",
      href: "/add-post",
      icon: PlusSquare,
    },
    {
      name: "Chats",
      href: "/chats",
      icon: MessageCircle,
      badge: unreadChats > 0 ? unreadChats : null,
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-gray-800 font-bold text-xl">T</span>
              </div>
              <div className="flex items-center space-x-2"> 
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
                  TrueKland
                </span>
                <Sparkles className="w-5 h-5 text-[#fcf326]" />
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} aria-current={isActive ? "page" : undefined}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-semibold",
                        isActive
                          ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-800 shadow-xl transform scale-105"
                          : "text-gray-700 hover:bg-[#91f2b3] hover:text-white hover:shadow-lg hover:scale-105",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="hidden lg:inline">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="destructive"
                          className="absolute flex items-center justify-center -top-2 -right-2 h-5 w-5 p-0 text-xs font-bold leading-none bg-red-500 border-2 border-white"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
      {/*  <div className="h-0.5 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]"></div>*/}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="relative group"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex flex-col items-center justify-center h-14 w-14 p-1 rounded-2xl transition-all duration-300",
                    isActive
                      ? "bg-[#91f2b3] text-white shadow-lg transform scale-110"
                      : "text-gray-600 hover:bg-[#fcf326] hover:text-gray-800 hover:shadow-lg hover:scale-105",
                  )}
                >
                  <item.icon className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] font-medium leading-tight">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute flex items-center justify-center -top-1 -right-1 h-4 w-4 p-0 text-[9px] font-bold leading-none bg-red-500 border border-white"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Top Accent Line */}
        <div className="h-0.5 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]"></div>
      </nav>
    </>
  )
}
