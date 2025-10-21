"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { collection, getDocs, query, where, orderBy, getFirestore } from "firebase/firestore"
import { Search, Filter, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { app } from "@/lib/firebase"
import { Product, Category } from "@/lib/types"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

export default function ExploreContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showFilters, setShowFilters] = useState(false)
  const db = getFirestore(app)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const postsQuery = query(
          collection(db, "UserPost"),
          where("isAuthorized", "==", true),
          orderBy("createdAt", "desc"),
        )
        const postsSnapshot = await getDocs(postsQuery)
        const productsData = postsSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || '',
            desc: data.desc || '',
            category: data.category || '',
            price: data.price || '0',
            images: data.images || [data.image || ''].filter(Boolean), // Convert single image to array
            userName: data.userName || '',
            userEmail: data.userEmail || '',
            userImage: data.userImage || '',
            createdAt: data.createdAt || '',
            isAuthorized: data.isAuthorized || false,
            condition: data.condition || 'bueno',
            tags: data.tags || []
          }
        }) as Product[]

        setProducts(productsData)
        setFilteredProducts(productsData)

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            icon: data.icon || '',
            color: data.color || '#000000'
          }
        }) as Category[]
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [db])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <LoadingSpinner />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
              Explorando productos increíbles
            </h3>
            <p className="text-[#B4C7E7]">Preparando la mejor selección para ti...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Descubre lo mejor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent drop-shadow-lg">
            Explorar Productos
          </h1>

          <p className="text-xl text-[#B4C7E7] max-w-2xl mx-auto">
            Encuentra productos únicos y extraordinarios de nuestra comunidad
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8FA3C4] group-hover:text-[#91f2b3] transition-colors" />
              <Input
                type="text"
                placeholder="¿Qué estás buscando hoy? 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-[#233554] bg-[#0A1628] text-[#E6F1FF] placeholder:text-[#5A6B89] shadow-lg rounded-2xl focus:ring-2 focus:ring-[#91f2b3] focus:border-[#91f2b3] transition-all duration-300"
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 h-12 px-6 rounded-xl transition-all duration-300 ${
                  showFilters
                    ? "bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 shadow-lg hover:shadow-xl"
                    : "bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F] hover:border-[#00D8E8] hover:shadow-lg"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </div>

            {/* Results Badge */}
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 text-[#E6F1FF] border-2 border-[#233554] px-4 py-2 text-sm font-medium rounded-full"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {filteredProducts.length} productos encontrados
              </Badge>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="bg-[#1A2F4F]/50 rounded-2xl border-2 border-[#233554] p-6 space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full"></div>
                  <h3 className="text-lg font-semibold text-[#E6F1FF]">Filtros de búsqueda</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#B4C7E7]">📂 Categoría</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] rounded-xl">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#112240] border-2 border-[#233554]">
                        <SelectItem value="all">🌟 Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center space-x-2">
                              {category.icon && category.icon.startsWith("http") ? (
                                <Image
                                  src={category.icon || "/placeholder.svg"}
                                  alt={category.name}
                                  width={16}
                                  height={16}
                                  className="rounded-sm object-cover"
                                />
                              ) : (
                                <span className="text-sm">{category.icon || "📦"}</span>
                              )}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#B4C7E7]">🔄 Ordenar por</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] rounded-xl">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#112240] border-2 border-[#233554]">
                        <SelectItem value="newest">🆕 Más recientes</SelectItem>
                        <SelectItem value="oldest">⏰ Más antiguos</SelectItem>
                        <SelectItem value="title">🔤 Título A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-lg p-6 sm:p-8">
              <ProductList products={filteredProducts} />
            </div>
          </div>
        ) : (
          <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-lg">
            <div className="text-center py-16 sm:py-24 px-6">
              {/* Animated Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center mb-8 border-2 border-[#233554]">
                <Filter className="h-12 w-12 text-gray-900" />
              </div>

              {/* Content */}
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#E6F1FF]">
                  {searchTerm || selectedCategory !== "all"
                    ? "🔍 No encontramos coincidencias"
                    : "📦 Próximamente más productos"}
                </h3>

                <p className="text-[#B4C7E7] text-lg leading-relaxed">
                  {searchTerm || selectedCategory !== "all"
                    ? "Intenta ajustar tus filtros de búsqueda o explora otras categorías"
                    : "Estamos trabajando para traerte los mejores productos de nuestra comunidad"}
                </p>

                {(searchTerm || selectedCategory !== "all") && (
                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
                      }}
                      className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      ✨ Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
