"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { ArrowLeft, Heart, MessageCircle, Share2, User, Calendar, Edit, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

  router.push(`/chats/new?with=${product?.userEmail}`)

  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
    } catch {
      return "N/A"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-bold text-gray-600 mb-2">Producto no encontrado</h2>
        <Button onClick={() => router.push("/explore")}>Volver a explorar</Button>
      </div>
    )
  }

  const isOwner = user?.email === product.userEmail

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 hover:bg-gray-100 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-all duration-300 ${
                isLiked ? "text-red-500 bg-red-50 border-red-200" : "hover:bg-gray-100"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />

            </Button>

            <Button variant="outline" size="sm" onClick={handleShare} className="hover:bg-gray-100">
              <Share2 className="h-4 w-4" />
            </Button>

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/product/${productId}/edit`)
}
                className="hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Image Section - Mantiene el tamaño original */}
          <Card className="overflow-hidden border shadow-sm bg-white">
            <CardContent className="p-0">
              <div className="aspect-square relative group">
                <Image
                  src={imageError ? "/placeholder.svg?height=400&width=400" : product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  priority
                />
              </div>
            </CardContent>
          </Card>

          {/* Compact Product Information */}
          <div className="space-y-4">
            {/* Main Product Card */}
            <Card className="border shadow-sm bg-white">
              <CardContent className="p-5">
                {/* Category and Date */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(product.createdAt)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900">{product.title}</h1>

                {/* Price */}
                {product.price && (
                  <div className="mb-4">
                    <div className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md">
                      <span className="text-2xl font-bold">${product.price}</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Descripción</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {product.desc}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information Card */}
            <Card className="border shadow-sm bg-white">
              <CardContent className="p-5">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {product.userImage ? (
                        <Image
                          src={product.userImage || "/placeholder.svg"}
                          alt={product.userName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{product.userName}</h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span>4.8 (127)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isOwner && (
                    <Button
                      onClick={handleStartChat}
                      className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar Vendedor
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/user/${encodeURIComponent(product.userEmail)}`)
}
                    className="w-full h-9 text-sm border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Ver Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}