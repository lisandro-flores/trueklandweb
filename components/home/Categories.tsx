"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id?: string
  name: string
  icon: string
  color?: string
}

interface CategoriesProps {
  categoryList: Category[]
}

export default function Categories({ categoryList }: CategoriesProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedCategories = showAll ? categoryList : categoryList.slice(0, 8)

  const defaultCategories: Category[] = [
    { name: "Electrónicos", icon: "📱", color: "from-blue-500 to-blue-600" },
    { name: "Ropa", icon: "👕", color: "from-pink-500 to-pink-600" },
    { name: "Hogar", icon: "🏠", color: "from-green-500 to-green-600" },
    { name: "Deportes", icon: "⚽", color: "from-orange-500 to-orange-600" },
    { name: "Libros", icon: "📚", color: "from-purple-500 to-purple-600" },
    { name: "Juguetes", icon: "🧸", color: "from-yellow-500 to-yellow-600" },
    { name: "Música", icon: "🎵", color: "from-indigo-500 to-indigo-600" },
    { name: "Otros", icon: "📦", color: "from-gray-500 to-gray-600" },
  ]

  const categoriesToShow = categoryList.length > 0 ? displayedCategories : defaultCategories

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Categorías</h2>
        {categoryList.length > 8 && (
          <Button variant="ghost" onClick={() => setShowAll(!showAll)} className="text-primary hover:text-primary/80">
            {showAll ? "Ver menos" : "Ver todas"}
            <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoriesToShow.map((category, index) => (
          <Link key={category.id || index} href={`/category/${encodeURIComponent(category.name)}`} className="group">
            <div className="glass-effect rounded-2xl p-4 text-center hover:scale-105 transition-all duration-200 animate-fade-in">
              {category.icon.startsWith("http") ? (
                <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden">
                  <Image
                    src={category.icon || "/placeholder.svg"}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${
                    category.color || "from-blue-500 to-purple-600"
                  } flex items-center justify-center text-2xl`}
                >
                  {category.icon}
                </div>
              )}
              <h3 className="font-semibold text-sm text-gray-700 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
