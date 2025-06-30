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
      <Card className="glass-effect border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "Usuario"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                onClick={() => router.push("/profile/edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold gradient-text mb-2">{user?.displayName || "Usuario"}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
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
        <Card className="glass-effect border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.totalProducts}</h3>
            <p className="text-gray-600">Productos Publicados</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.activeChats}</h3>
            <p className="text-gray-600">Chats Activos</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Badge className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.totalExchanges}</h3>
            <p className="text-gray-600">Intercambios Realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="gradient-text">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/profile/my-products">
            <Button variant="outline" className="w-full justify-start h-12">
              <Package className="h-5 w-5 mr-3" />
              Mis Productos
            </Button>
          </Link>

          <Link href="/chats">
            <Button variant="outline" className="w-full justify-start h-12">
              <MessageCircle className="h-5 w-5 mr-3" />
              Mis Conversaciones
            </Button>
          </Link>

          <Link href="/add-post">
            <Button className="w-full justify-start h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Package className="h-5 w-5 mr-3" />
              Publicar Nuevo Producto
            </Button>
          </Link>

          <Separator />

          <Link href="/profile/edit">
            <Button variant="outline" className="w-full justify-start h-12">
              <Edit className="h-5 w-5 mr-3" />
              Editar Perfil
            </Button>
          </Link>

          <Button variant="outline" className="w-full justify-start h-12">
            <Settings className="h-5 w-5 mr-3" />
            Configuración de Cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
