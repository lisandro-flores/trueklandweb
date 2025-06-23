"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Sparkles, Grid3X3, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFirestore, collection, query, where, getCountFromServer } from "firebase/firestore"
import { app } from "@/lib/firebase"

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
  const [categoriesWithCount, setCategoriesWithCount] = useState<Category[]>(categoryList)
  const displayedCategories = showAll ? categoriesWithCount : categoriesWithCount.slice(0, 8)

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore(app)
      const updatedCategories = await Promise.all(
        categoryList.map(async (cat) => {
          try {
            const snap = await getCountFromServer(
              query(
                collection(db, "UserPost"),
                where("category", "==", cat.name),
                where("isAuthorized", "==", true)
              )
            )
            return { ...cat, count: snap.data().count }
          } catch {
            return { ...cat, count: 0 }
          }
        })
      )
      setCategoriesWithCount(updatedCategories)
    }
    fetchCounts()
  }, [categoryList])

  const categoriesToShow = categoriesWithCount.length > 0 ? displayedCategories : [];

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon Badge */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center shadow-lg">
            <Grid3X3 className="w-6 h-6 text-gray-800" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
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
            className="bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 group px-6 py-3 rounded-full"
          >
            <span className="font-medium text-gray-700 group-hover:text-gray-800">
              {showAll ? "Ver menos" : "Ver todas"}
            </span>
            <ChevronRight
              className={`ml-2 h-4 w-4 transition-all duration-300 group-hover:text-[#91f2b3] ${
                showAll ? "rotate-90" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
        {categoriesToShow.map((category, index) => (
          <Link
            key={category.id || index}
            href={`/category/${encodeURIComponent(category.name)}`}
            className="group relative"
          >
            {/* Category Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-105">
              {/* Background Gradient */}
              <div className="bg-gradient-to-br from-white to-gray-50 group-hover:from-[#91f2b3] group-hover:to-[#fcf326] transition-all duration-300">
                {/* Content */}
                <div className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                  {/* Icon Container */}
                  <div className="relative mx-auto">
                    {category.icon.startsWith("http") ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden border-3 border-gray-200 shadow-lg">
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
                        className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br ${
                          category.color || "from-[#91f2b3] to-[#fcf326]"
                        } flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-3 border-white`}
                      >
                        {category.icon}
                      </div>
                    )}

                    {/* Popular Badge - Siempre visible para las primeras 3 */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#fcf326] to-[#91f2b3] rounded-full flex items-center justify-center shadow-lg">
                          <Star className="w-3 h-3 text-gray-800" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 leading-tight">{category.name}</h3>

                    {/* Product Count - Siempre visible */}
                    <Badge
                      variant="secondary"
                      className="bg-[#91f2b3] text-gray-800 border-0 px-3 py-1 text-xs font-medium rounded-full"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {category.count || 0} productos
                    </Badge>
                  </div>
                </div>

                {/* Bottom Accent Line - Siempre visible */}
                <div className="h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3]"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Indicator */}
      {!showAll && categoryList.length > 8 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-[#91f2b3] text-gray-800 px-6 py-3 rounded-full text-sm font-medium border border-gray-200 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>+{categoryList.length - 8} categorías más disponibles</span>
          </div>
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#91f2b3] rounded-full"></div>
            <span>Categorías verificadas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-[#fcf326]" />
            <span>Productos de calidad</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#fcf326] rounded-full"></div>
            <span>Actualizadas diariamente</span>
          </div>
        </div>
      </div>
    </div>
  )
}
