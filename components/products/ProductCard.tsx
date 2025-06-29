"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, User, Calendar } from "lucide-react"
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
    <Card className="group product-card mobile-card">
      <div className="relative overflow-hidden rounded-t-xl">
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

        <Badge className="absolute top-3 left-3 badge-primary backdrop-blur-sm">
          {product.category}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 glass h-9 w-9 touch-target ${
            isLiked ? "text-red-500" : "text-gray-600"
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
        <h3 className="font-semibold text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-[var(--color-turquesa)] transition-colors duration-300">
          {product.title}
        </h3>

        <p className="text-[var(--color-azul-oscuro)] text-sm mb-4 line-clamp-2 leading-relaxed">{product.desc}</p>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden glass ring-2 ring-[var(--color-turquesa)]/20 flex-shrink-0">
            {product.userImage ? (
              <Image
                src={product.userImage || "/placeholder.svg"}
                alt={product.userName}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-[var(--color-gris-oscuro)] truncate font-medium block">{product.userName}</span>
            <div className="flex items-center text-xs text-[var(--color-azul-oscuro)] mt-1">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              {formatDate(product.createdAt)}
            </div>
          </div>
        </div>

        {product.price && (
          <div className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            ${product.price}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.id}`} className="w-full">
          <Button className="btn-primary w-full touch-target">
            <span className="flex items-center justify-center gap-2">
              Ver Detalles
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
