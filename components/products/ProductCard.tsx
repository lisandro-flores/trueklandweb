"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 glass-effect border-0">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-square relative">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=300" : (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=300&width=300")}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700 hover:bg-white">{product.category}</Badge>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${isLiked ? "text-red-500" : "text-gray-600"}`}
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.desc}</p>

        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
            {product.userImage ? (
              <Image
                src={product.userImage || "/placeholder.svg"}
                alt={product.userName}
                width={24}
                height={24}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-3 w-3 text-gray-500" />
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600 truncate">{product.userName}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(product.createdAt)}
        </div>

        {product.price && <div className="text-lg font-bold text-primary mb-2">${product.price}</div>}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Link href={`/product/${product.id}`} className="flex-1">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Ver Detalles
          </Button>
        </Link>

       
      </CardFooter>
    </Card>
  )
}
