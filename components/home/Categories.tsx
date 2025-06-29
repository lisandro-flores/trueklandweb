"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Sparkles, Grid3X3, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id?: string
  name: string
  icon: string
  color?: string
  count?: number
}

interface CategoriesProps {
  categoryList: Category[]
}

export default function Categories({ categoryList }: CategoriesProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedCategories = showAll ? categoryList : categoryList.slice(0, 8)

  const defaultCategories: Category[] = [
    { name: "Electrónicos", icon: "📱", color: "from-primary to-secondary", count: 245 },
    { name: "Ropa", icon: "👕", color: "from-secondary to-accent", count: 189 },
    { name: "Hogar", icon: "🏠", color: "from-primary to-accent", count: 156 },
    { name: "Deportes", icon: "⚽", color: "from-accent to-primary", count: 98 },
    { name: "Libros", icon: "📚", color: "from-secondary to-primary", count: 134 },
    { name: "Juguetes", icon: "🧸", color: "from-accent to-secondary", count: 87 },
    { name: "Música", icon: "🎵", color: "from-primary to-secondary", count: 76 },
    { name: "Otros", icon: "📦", color: "from-secondary to-accent", count: 203 },
  ]

  const categoriesToShow = categoryList.length > 0 ? displayedCategories : defaultCategories

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon Badge */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <Grid3X3 className="w-6 h-6 text-gray-800" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">
              Categorías Populares
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Explora por categorías y encuentra lo que buscas</p>
          </div>
        </div>

        {/* View Toggle */}
        {categoryList.length > 8 && (
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="btn-secondary px-6 py-3 rounded-full"
          >
            <span className="font-medium">
              {showAll ? "Ver menos" : "Ver todas"}
            </span>
            <ChevronRight
              className={`ml-2 h-4 w-4 transition-all duration-300 ${
                showAll ? "rotate-90" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-3 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:gap-6 min-w-max sm:min-w-0">
          {categoriesToShow.map((category, index) => (
            <Link
              key={category.id || index}
              href={`/category/${encodeURIComponent(category.name)}`}
              className="group relative flex-shrink-0 w-24 sm:w-auto"
            >
              {/* Category Card */}
              <div className="glass-effect rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                {/* Background Gradient */}
                <div className="bg-gradient-to-br from-white/50 to-white/20 hover:from-[#91f2b3]/10 hover:to-[#fcf326]/10 transition-all duration-300">
                  {/* Content */}
                  <div className="p-2 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4">
                    {/* Icon Container */}
                    <div className="relative mx-auto">
                      {category.icon.startsWith("http") ? (
                        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-full overflow-hidden border-2 sm:border-3 border-border shadow-lg">
                          <Image
                            src={category.icon || "/placeholder.svg"}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#91f2b3] to-[#fcf326] flex items-center justify-center text-lg sm:text-2xl md:text-3xl shadow-lg border-2 sm:border-3 border-white/30`}
                        >
                          {category.icon}
                        </div>
                      )}

                      {/* Popular Badge - Siempre visible para las primeras 3 */}
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10">
                          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-[#fcf326] to-[#91f2b3] rounded-full flex items-center justify-center shadow-lg">
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 text-gray-800" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm md:text-base text-gray-800 leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Accent Line - Siempre visible */}
                  <div className="h-0.5 sm:h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Show More Indicator */}
      {!showAll && categoryList.length > 8 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-800 px-6 py-3 rounded-full text-sm font-medium shadow-lg border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>+{categoryList.length - 8} categorías más disponibles</span>
          </div>
        </div>
      )}
    </div>
  )
}
