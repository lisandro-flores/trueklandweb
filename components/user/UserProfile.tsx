"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { collection, query, where, getDocs, orderBy, getFirestore } from "firebase/firestore"
import { ArrowLeft, User, MessageCircle, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  image: string
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface UserProfileProps {
  email: string
}

export default function UserProfile({ email }: UserProfileProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const productsQuery = query(
          collection(db, "UserPost"),
          where("userEmail", "==", email),
          where("isAuthorized", "==", true),
          orderBy("createdAt", "desc"),
        )
        const productsSnapshot = await getDocs(productsQuery)
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        setProducts(productsData)

        // Get user name from first product
        if (productsData.length > 0) {
          setUserName(productsData[0].userName)
        } else {
          setUserName(email.split("@")[0])
        }
      } catch (error) {
        console.error("Error fetching user products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProducts()
  }, [email, db])

  const handleStartChat = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para contactar a este usuario",
        variant: "destructive",
      })
      return
    }

    if (user.email === email) {
      toast({
        title: "No puedes contactarte",
        description: "No puedes iniciar un chat contigo mismo",
        variant: "destructive",
      })
      return
    }

    // Navigate to chat
    router.push(`/chats/new?with=${email}`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const isOwnProfile = user?.email === email

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="glass-effect border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              {products.length > 0 && products[0].userImage ? (
                <Image src={products[0].userImage || "/placeholder.svg"} alt={userName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold gradient-text mb-2">{userName}</h1>
              <p className="text-gray-600 mb-4">{email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro activo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Ubicación no especificada</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {products.length} productos publicados
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  Usuario verificado
                </Badge>
              </div>
            </div>

            {!isOwnProfile && (
              <Button
                onClick={handleStartChat}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* User's Products */}
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-6">Productos de {userName}</h2>

        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-16 glass-effect rounded-2xl">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Este usuario no ha publicado productos</h3>
            <p className="text-gray-500">Aún no hay productos disponibles de este usuario</p>
          </div>
        )}
      </div>
    </div>
  )
}
