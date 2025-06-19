"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, MessageCircle, User } from "lucide-react"
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
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold gradient-text">TrueKland</span>
            </Link>

            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "relative flex items-center space-x-2 transition-all duration-200",
                      pathname === item.href && "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="hidden lg:inline">{item.name}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-12 w-12 p-1 transition-all duration-200",
                  pathname === item.href ? "text-primary bg-primary/10" : "text-gray-600",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
                {item.badge && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
