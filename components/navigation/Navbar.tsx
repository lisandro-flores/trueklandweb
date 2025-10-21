"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, PlusSquare, MessageCircle, User, Sparkles, ArrowLeftRight, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const [unreadChats, setUnreadChats] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useAuth()

  // Verifica si el usuario es admin
  const isAdmin = user?.email === "admin@truekland.com" // Ajusta según tu lógica

  useEffect(() => {
    if (!user) return

    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", user.email))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        // Solo cuenta si hay mensajes no leídos y el último mensaje no es del usuario actual
        if (
          data.unreadCount &&
          data.unreadCount > 0 &&
          data.lastMessageSender !== user.email
        ) {
          count++
        }
      })
      setUnreadChats(count)
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Explorar",
      href: "/explore",
      icon: Search,
    },
    {
      name: "Intercambios",
      href: "/exchanges",
      icon: ArrowLeftRight,
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

  // Agregar item de Admin si el usuario es administrador (al inicio)
  if (isAdmin) {
    navItems.unshift({
      name: "Admin",
      href: "/admin",
      icon: Shield,
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[#112240]/95 backdrop-blur-xl border-b border-[#233554] shadow-2xl"
            : "bg-[#112240]/90 backdrop-blur-lg border-b border-[#233554]",
        )}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]" />

        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo with enhanced effects */}
            <Link href="/explore" className="flex items-center py-3 group relative">
              <div className="relative">
                <div className="absolute inset-0 bg-[#91f2b3]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative h-14 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <Image
                    src="/TrueklandNavBar.png"
                    width={220}
                    height={220}
                    alt="TrueKland"
                    className="h-full w-auto object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#fcf326] opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            </Link>

            {/* Navigation Items with solid colors */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <div key={item.name} className="relative group">
                    <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm border-2 overflow-hidden",
                          isActive
                            ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-lg border-[#91f2b3]/30 scale-105"
                            : "text-[#E6F1FF] hover:bg-[#1A2F4F] hover:text-[#91f2b3] border-transparent hover:scale-105 hover:shadow-lg hover:border-[#233554]",
                        )}
                      >
                        <div className="relative flex items-center gap-3">
                          <div className="relative">
                            <item.icon
                              className={cn(
                                "h-5 w-5 transition-all duration-300",
                                isActive ? "drop-shadow-sm" : "group-hover:scale-110",
                              )}
                            />
                            {item.badge && (
                              <span className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                <Badge
                                  variant="destructive"
                                  className="flex items-center justify-center h-5 w-5 p-0 text-xs font-bold bg-[#EF4444] text-white border-2 border-[#112240] rounded-full shadow"
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                              </span>
                            )}
                          </div>
                          <span className="hidden lg:inline font-medium tracking-wide">{item.name}</span>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </Button>
                    </Link>

                    {/* Floating indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#91f2b3] animate-pulse shadow-lg" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with dark theme */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#112240]/95 backdrop-blur-xl border-t border-[#233554] shadow-2xl mobile-nav safe-area-bottom">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]" />

        <div className="flex justify-around items-center h-20 sm:h-24 px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group flex-1 max-w-[80px]">
                <Link href={item.href} aria-current={isActive ? "page" : undefined} className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "relative flex items-center justify-center h-14 sm:h-16 w-full p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 border-2 overflow-hidden touch-target",
                      isActive
                        ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-lg border-[#91f2b3]/30 scale-105"
                        : "text-[#E6F1FF] hover:bg-[#1A2F4F] hover:text-[#91f2b3] border-transparent hover:scale-105 hover:shadow-lg hover:border-[#233554]",
                    )}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <div className="relative">
                        <item.icon
                          className={cn(
                            "h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300",
                            isActive ? "drop-shadow-sm" : "group-hover:scale-110",
                          )}
                        />
                        {item.badge && (
                          <span className="absolute -top-2 -right-2 z-20">
                            <Badge
                              variant="destructive"
                              className="flex items-center justify-center h-5 w-5 p-0 text-[10px] font-bold bg-[#EF4444] text-white border-2 border-[#112240] rounded-full shadow"
                            >
                              {item.badge > 9 ? "9+" : item.badge}
                            </Badge>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-full transition-transform duration-700" />
                  </Button>
                </Link>

                {/* Floating indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#91f2b3] animate-pulse shadow-lg" />
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-20" />
      <div className="md:hidden h-20 sm:h-24" />
    </>
  )
}
