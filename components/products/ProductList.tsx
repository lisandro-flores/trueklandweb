"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Grid3X3, List, Sparkles, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

interface ProductListProps {
  products: Product[]
  viewMode?: "grid" | "list"
  showHeader?: boolean
}

export default function ProductList({ products, viewMode = "grid", showHeader = true }: ProductListProps) {
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(viewMode)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Mostrar productos gradualmente para mejor UX
    if (products.length <= 8 || showAll) {
      setVisibleProducts(products)
    } else {
      setVisibleProducts(products.slice(0, 8))
    }
  }, [products, showAll])

  const getGridClasses = () => {
    switch (currentViewMode) {
      case "list":
        return "grid grid-cols-1 gap-4"
      case "grid":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    }
  }

  if (products.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#112240] to-[#1A2F4F] rounded-3xl opacity-50"></div>
        <div className="relative backdrop-blur-md bg-[#112240]/80 rounded-3xl border-2 border-[#233554] shadow-lg">
          <div className="text-center py-16 sm:py-24 px-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#91f2b3]/30 to-[#fcf326]/30 rounded-full flex items-center justify-center mb-8 relative border-2 border-[#233554]">
              <Package className="h-12 w-12 text-[#91f2b3]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#E6F1FF] mb-4">📦 No hay productos disponibles</h3>
            <p className="text-[#B4C7E7] text-lg">Aún no se han agregado productos a esta sección</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 gap-4">
          {/* Left Side - Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold text-[#E6F1FF]">Productos Destacados</h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 text-[#E6F1FF] border-2 border-[#233554] px-3 py-1 text-sm font-medium rounded-full"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {products.length} productos
            </Badge>
          </div>

          {/* Right Side - View Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-[#B4C7E7] hidden sm:block">Vista:</span>
            <div className="flex items-center bg-[#1A2F4F]/80 backdrop-blur-sm rounded-xl border-2 border-[#233554] p-1 shadow-sm">
              <Button
                variant={currentViewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode("grid")}
                className={`h-8 px-3 rounded-lg transition-all duration-300 ${
                  currentViewMode === "grid"
                    ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-md"
                    : "text-[#B4C7E7] hover:text-[#91f2b3] hover:bg-[#1A2F4F]"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={currentViewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode("list")}
                className={`h-8 px-3 rounded-lg transition-all duration-300 ${
                  currentViewMode === "list"
                    ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-md"
                    : "text-[#B4C7E7] hover:text-[#91f2b3] hover:bg-[#1A2F4F]"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3]/5 to-[#fcf326]/5 rounded-3xl blur-3xl"></div>

        <div className="relative">
          <div className={`${getGridClasses()} transition-all duration-500`}>
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                className="group animate-fade-in hover:scale-[1.02] transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Card Container with Hover Effects */}
                <div className="relative">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 scale-95 group-hover:scale-100"></div>

                  {/* Product Card */}
                  <div className="relative backdrop-blur-sm bg-[#112240]/60 rounded-2xl border border-[#233554] shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <ProductCard product={product} />
                  </div>

                  {/* Floating Badge for New Products */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-[#fcf326] to-[#91f2b3] text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Nuevo
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Section */}
          {!showAll && products.length > 8 && (
            <div className="mt-12 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-30"></div>
                <Button
                  onClick={() => setShowAll(true)}
                  className="relative bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-800 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
                >
                  <Package className="w-5 h-5" />
                  <span>{`Ver ${products.length - 8} productos más`}</span>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-[#E6F1FF]/50 text-sm mt-4">
                Mostrando {visibleProducts.length} de {products.length} productos
              </p>
            </div>
          )}

          {/* Show Less Button */}
          {showAll && products.length > 8 && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => setShowAll(false)}
                variant="outline"
                className="bg-[#1A2F4F]/50 backdrop-blur-sm border-[#233554] hover:bg-[#1A2F4F] hover:shadow-lg transition-all duration-300"
              >
                Mostrar menos productos
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats */}
      {showHeader && products.length > 0 && (
        <div className="backdrop-blur-sm bg-[#112240]/40 rounded-2xl border border-[#233554] shadow-lg p-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-[#B4C7E7]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#91f2b3] rounded-full animate-pulse"></div>
              <span>Productos verificados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fcf326] rounded-full animate-pulse delay-200"></div>
              <span>Actualizados recientemente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#91f2b3] rounded-full animate-pulse delay-400"></div>
              <span>Comunidad activa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
