"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, User, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  images: string[]
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()

  const isOwner = user?.email === product.userEmail

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch {
      return "Fecha no disponible"
    }
  }

  return (
    <Card className="group bg-[#112240]/95 border-2 border-[#233554] shadow-xl hover:shadow-2xl hover:border-[#00D8E8] transition-all duration-300 rounded-xl">
      <div className="relative overflow-hidden rounded-t-xl">
        <div className="aspect-square relative">
          <Image
            src={imageError ? "/placeholder.svg" : (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg")}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized={product.images && product.images.length > 0 && product.images[0].includes('firebasestorage.googleapis.com')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 border-0 backdrop-blur-sm shadow-lg font-semibold">
          {product.category}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-[#112240]/80 backdrop-blur-md border-2 border-[#233554] h-9 w-9 touch-target hover:bg-[#1A2F4F] hover:border-[#00D8E8] transition-all ${
            isLiked ? "text-[#EF4444] border-[#EF4444]" : "text-[#B4C7E7]"
          }`}
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${isLiked ? "fill-current scale-110" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4 md:p-6">
        <h3 className="font-semibold text-lg md:text-xl mb-2 line-clamp-2 text-[#E6F1FF] group-hover:text-[#91f2b3] transition-colors duration-300">
          {product.title}
        </h3>

        <p className="text-[#B4C7E7] text-sm mb-4 line-clamp-2 leading-relaxed">{product.desc}</p>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A2F4F] ring-2 ring-[#91f2b3]/30 flex-shrink-0">
            {product.userImage ? (
              <Image
                src={product.userImage || "/placeholder.svg"}
                alt={product.userName}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#91f2b3] to-[#fcf326]">
                <User className="h-4 w-4 text-gray-900" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-[#E6F1FF] truncate font-medium block">{product.userName}</span>
            <div className="flex items-center text-xs text-[#8FA3C4] mt-1">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              {formatDate(product.createdAt)}
            </div>
          </div>
        </div>

        {product.price && (
          <div className="text-sm font-medium text-[#E6F1FF]/70 mb-3">
            <span className="text-xs">Valor aprox:</span> <span className="text-lg font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">${product.price} MXN</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isOwner ? (
          <div className="flex gap-2 w-full">
            <Link href={`/product/${product.id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full touch-target bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#fcf326] hover:text-[#fcf326]">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Link href={`/product/${product.id}`} className="flex-1">
              <Button className="w-full touch-target bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 font-semibold hover:shadow-lg transition-all">
                Ver Detalles
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={`/product/${product.id}`} className="w-full">
            <Button className="w-full touch-target bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 font-semibold hover:shadow-lg transition-all">
              <span className="flex items-center justify-center gap-2">
                Ver Detalles
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
