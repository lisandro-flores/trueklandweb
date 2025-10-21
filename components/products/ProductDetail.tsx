"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { doc, getDoc, getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { ArrowLeft, Heart, MessageCircle, Share2, User, Calendar, Edit, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
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

  const handleStartChat = async () => {
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
    // Buscar si ya existe un chat entre ambos usuarios
    const chatsRef = collection(db, "chats")
    const q = query(
      chatsRef,
      where("users", "array-contains", user.email)
    )
    const querySnapshot = await getDocs(q)
    let chatId: string | null = null

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (product && data.users.includes(product.userEmail)) {
        chatId = doc.id
      }
    })

    // Si no existe, crear el chat
    if (!chatId) {
      if (!product) {
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive",
        })
        return
      }
      const newChat = await addDoc(chatsRef, {
        users: [user.email, product.userEmail],
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
        lastMessageSender: "",
        createdAt: serverTimestamp(),
      })
      chatId = newChat.id
    }

    router.push(`/chats/${chatId}`)
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
      <div className="text-center py-8 bg-[#0A1628] min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#E6F1FF] mb-2">Producto no encontrado</h2>
          <Button onClick={() => router.push("/explore")} className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900">Volver a explorar</Button>
        </div>
      </div>
    )
  }

  const isOwner = user?.email === product.userEmail

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8] text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-all duration-300 border-2 ${
                isLiked ? "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]" : "bg-[#1A2F4F]/50 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8]"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />

            </Button>

            <Button variant="outline" size="sm" onClick={handleShare} className="bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8]">
              <Share2 className="h-4 w-4" />
            </Button>

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/product/${productId}/edit`)
}
                className="bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Image Section - Mantiene el tamaño original */}
          <Card className="overflow-hidden border-2 border-[#233554] shadow-xl bg-[#112240]/95">
            <CardContent className="p-0">
              <div className="aspect-square relative group">
                <Image
                  src={imageError ? "/placeholder.svg" : product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  priority
                  unoptimized={product.images[0].includes('firebasestorage.googleapis.com')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compact Product Information */}
          <div className="space-y-4">
            {/* Main Product Card */}
            <Card className="border-2 border-[#233554] shadow-xl bg-[#112240]/95">
              <CardContent className="p-5">
                {/* Category and Date */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 text-[#E6F1FF] border-2 border-[#233554]">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-xs text-[#8FA3C4]">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(product.createdAt)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-[#E6F1FF]">{product.title}</h1>

                {/* Price */}
                {product.price && (
                  <div className="mb-4">
                    <div className="inline-flex flex-col items-start bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 px-4 py-2 rounded-xl shadow-md">
                      <span className="text-xs font-medium opacity-80">Valor aproximado</span>
                      <span className="text-2xl font-bold">${product.price} MXN</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-[#E6F1FF]">Descripción</h3>
                  <p className="text-[#B4C7E7] text-sm leading-relaxed bg-[#1A2F4F]/50 p-4 rounded-lg border-l-4 border-[#00D8E8]">
                    {product.desc}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information Card */}
            <Card className="border-2 border-[#233554] shadow-xl bg-[#112240]/95">
              <CardContent className="p-5">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1A2F4F] border-2 border-[#233554]">
                      {product.userImage ? (
                        <Image
                          src={product.userImage || "/placeholder.svg"}
                          alt={product.userName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#91f2b3] to-[#fcf326]">
                          <User className="h-6 w-6 text-gray-900" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#10B981] rounded-full border-2 border-[#112240]"></div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#E6F1FF]">{product.userName}</h4>
                    <div className="flex items-center text-xs text-[#8FA3C4]">
                      <Star className="h-3 w-3 text-[#fcf326] mr-1" />
                      <span>4.8 (127)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isOwner && (
                    <Button
                      onClick={handleStartChat}
                      className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar Vendedor
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/user/${encodeURIComponent(product.userEmail)}`)
}
                    className="w-full h-9 text-sm bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8]"
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