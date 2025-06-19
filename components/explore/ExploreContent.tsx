"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, getFirestore } from "firebase/firestore"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { app } from "@/lib/firebase"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  image: string
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface Category {
  name: string
  icon: string
}

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
        const productsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        setProducts(productsData)
        setFilteredProducts(productsData)

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data()) as Category[]
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
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Explorar Productos</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{filteredProducts.length} productos encontrados</Badge>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl animate-slide-up">
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="oldest">Más antiguos</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="text-center py-16 glass-effect rounded-2xl">
          <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== "all"
              ? "Intenta ajustar tus filtros de búsqueda"
              : "Aún no hay productos disponibles"}
          </p>
        </div>
      )}
    </div>
  )
}
