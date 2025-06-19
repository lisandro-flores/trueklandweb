"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { ArrowLeft, Heart, MessageCircle, Share2, User, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  images: string
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "UserPost", productId))
       
        if (productDoc.exists()) {
          setProduct({
            id: productDoc.id,
            ...productDoc.data(),
          } as Product)
        } else {
          toast({
            title: "Error",
            description: "Producto no encontrado",
            variant: "destructive",
          })
          router.push("/explore")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Error al cargar el producto",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, db, router, toast])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.desc,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace se ha copiado al portapapeles",
      })
    }
  }

  const handleStartChat = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para contactar al vendedor",
        variant: "destructive",
      })
      return
    }

    if (user.email === product?.userEmail) {
      toast({
        title: "No puedes contactarte",
        description: "No puedes iniciar un chat contigo mismo",
        variant: "destructive",
      })
      return
    }

    // Navigate to chat
    router.push(`/chats/new?with=${product?.userEmail}`)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
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

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Producto no encontrado</h2>
        <Button onClick={() => router.push("/explore")}>Volver a explorar</Button>
      </div>
    )
  }

  const isOwner = user?.email === product.userEmail

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? "text-red-500 border-red-500" : ""}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>

          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>

          {isOwner && (
            <Button
              variant="outline"
              onClick={() => router.push(`/product/${productId}/edit`)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <Card className="glass-effect border-0">
          <CardContent className="p-0">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={imageError ? "/placeholder.svg?height=600&width=600" : product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary" className="text-sm">
                  {product.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(product.createdAt)}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4 gradient-text">{product.title}</h1>

              {product.price && <div className="text-2xl font-bold text-primary mb-4">${product.price}</div>}

              <p className="text-gray-700 leading-relaxed mb-6">{product.desc}</p>

              <Separator className="my-6" />

              {/* Seller Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {product.userImage ? (
                    <Image
                      src={product.userImage || "/placeholder.svg"}
                      alt={product.userName}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product.userName}</h3>
                  <p className="text-sm text-gray-600">Vendedor</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isOwner && (
                  <Button
                    onClick={handleStartChat}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contactar Vendedor
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => router.push(`/user/${encodeURIComponent(product.userEmail)}`)}
                  className="w-full h-12"
                >
                  <User className="h-5 w-5 mr-2" />
                  Ver Perfil del Vendedor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
