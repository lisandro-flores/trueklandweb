"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAuth, signOut } from "firebase/auth"
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore"
import { User, Package, MessageCircle, Settings, LogOut, Edit, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface UserStats {
  totalProducts: number
  activeChats: number
  totalExchanges: number
}

export default function ProfileContent() {
  const [stats, setStats] = useState<UserStats>({
    totalProducts: 0,
    activeChats: 0,
    totalExchanges: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const auth = getAuth(app)
  const db = getFirestore(app)

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return

      try {
        // Fetch user's products
        const productsQuery = query(collection(db, "UserPost"), where("userEmail", "==", user.email))
        const productsSnapshot = await getDocs(productsQuery)

        // Fetch user's chats
        const chatsQuery = query(collection(db, "chats"), where("users", "array-contains", user.email))
        const chatsSnapshot = await getDocs(chatsQuery)

        setStats({
          totalProducts: productsSnapshot.docs.length,
          activeChats: chatsSnapshot.docs.length,
          totalExchanges: 12, // Mock data - would need to implement exchange tracking
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [user, db])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Fecha no disponible"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#91f2b3] to-[#fcf326] border-4 border-[#233554] shadow-lg">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "Usuario"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1A2F4F]">
                    <User className="h-12 w-12 text-[#8FA3C4]" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] shadow-lg shadow-[#91f2b3]/30"
                onClick={() => router.push("/profile/edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold gradient-text mb-2">{user?.displayName || "Usuario"}</h1>
              <p className="text-[#B4C7E7] mb-4">{user?.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#8FA3C4]">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {formatDate(user?.metadata?.creationTime || "")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Ubicación no especificada</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] hover:shadow-xl hover:shadow-[#91f2b3]/10 transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#91f2b3] to-[#7fd89f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="h-6 w-6 text-[#0A1628]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E6F1FF] mb-1">{stats.totalProducts}</h3>
            <p className="text-[#E6F1FF]/70">Productos Publicados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] hover:shadow-xl hover:shadow-[#fcf326]/10 transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#fcf326] to-[#e8e01f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle className="h-6 w-6 text-[#0A1628]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E6F1FF] mb-1">{stats.activeChats}</h3>
            <p className="text-[#E6F1FF]/70">Chats Activos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] hover:shadow-xl hover:shadow-[#91f2b3]/10 transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Badge className="h-6 w-6 text-[#0A1628]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E6F1FF] mb-1">{stats.totalExchanges}</h3>
            <p className="text-[#E6F1FF]/70">Intercambios Realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554]">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/profile/my-products">
            <Button variant="outline" className="w-full justify-start h-12 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all">
              <Package className="h-5 w-5 mr-3" />
              Mis Productos
            </Button>
          </Link>

          <Link href="/chats">
            <Button variant="outline" className="w-full justify-start h-12 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all">
              <MessageCircle className="h-5 w-5 mr-3" />
              Mis Conversaciones
            </Button>
          </Link>

          <Link href="/add-post">
            <Button className="w-full justify-start h-12 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20 transition-all">
              <Package className="h-5 w-5 mr-3" />
              Publicar Nuevo Producto
            </Button>
          </Link>

          <Separator className="bg-[#233554]" />

          <Link href="/profile/edit">
            <Button variant="outline" className="w-full justify-start h-12 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all">
              <Edit className="h-5 w-5 mr-3" />
              Editar Perfil
            </Button>
          </Link>

          <Button variant="outline" className="w-full justify-start h-12 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all">
            <Settings className="h-5 w-5 mr-3" />
            Configuración de Cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
