"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, where, orderBy, getFirestore } from "firebase/firestore"
import { ArrowLeft, Package, Sparkles, TrendingUp, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  images: string[]
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface CategoryItemsProps {
  category: string
}

export default function CategoryItems({ category }: CategoryItemsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()
  const db = getFirestore(app)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const postsQuery = query(
          collection(db, "UserPost"),
          where("category", "==", category),
          where("isAuthorized", "==", true),
          orderBy("createdAt", "desc"),
        )
        const postsSnapshot = await getDocs(postsQuery)
        const productsData = postsSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            desc: data.desc,
            category: data.category,
            price: data.price,
            images: Array.isArray(data.images)
              ? data.images
              : data.image
                ? [data.image]
                : [],
            userName: data.userName,
            userEmail: data.userEmail,
            userImage: data.userImage,
            createdAt: data.createdAt,
            isAuthorized: data.isAuthorized,
          }
        }) as Product[]

        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setLoading(false)
        setTimeout(() => setShowContent(true), 200)
      }
    }

    fetchCategoryProducts()
  }, [category, db])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#91f2b3]/20 to-[#fcf326]/20 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            //style={{
              //backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2391f2b3' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              //backgroundSize: "60px 60px",
            //}}
          ></div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          {/* Category Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center shadow-2xl">
              <Package className="w-12 h-12 text-gray-800" />
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="relative">
            <LoadingSpinner />
            <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
              Explorando {category}
            </h3>
            <p className="text-gray-600 text-lg">Cargando productos increíbles...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#91f2b3]/20 to-[#fcf326]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2391f2b3' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div
        className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Header Section */}
        <div className="backdrop-blur-sm bg-white/60 rounded-3xl border border-white/30 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Navigation and Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2 h-12 px-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 hover:bg-white hover:shadow-lg transition-all duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Volver</span>
            </Button>

            {/* Stats Badge */}
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-[#91f2b3]/20 to-[#fcf326]/20 text-gray-800 border-0 px-6 py-3 text-lg font-medium rounded-full shadow-lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {products.length} productos
            </Badge>
          </div>

          {/* Category Title */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Categoría Especial</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
              {category}
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre todos los productos increíbles disponibles en esta categoría
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Products Section */}
        {products.length > 0 ? (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Productos Disponibles</h2>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>Ordenados por fecha</span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="backdrop-blur-sm bg-white/40 rounded-3xl border border-white/30 shadow-lg p-6 sm:p-8">
              <ProductList products={products} />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl opacity-50"></div>
            <div className="relative backdrop-blur-sm bg-white/60 rounded-3xl border border-white/30 shadow-lg">
              <div className="text-center py-16 sm:py-24 px-6">
                {/* Empty State Icon */}
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-[#91f2b3]/30 to-[#fcf326]/30 rounded-full flex items-center justify-center mb-8 relative">
                  <Package className="h-16 w-16 text-[#91f2b3]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full blur-xl opacity-20 animate-pulse"></div>
                </div>

                {/* Empty State Content */}
                <div className="space-y-6 max-w-lg mx-auto">
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">🚀 ¡Sé el pionero!</h3>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    Aún no hay productos en la categoría{" "}
                    <span className="font-semibold text-[#91f2b3]">"{category}"</span>. ¡Esta es tu oportunidad de ser
                    el primero en compartir algo increíble!
                  </p>

                  {/* Call to Action */}
                  <div className="pt-6">
                    <Button
                      onClick={() => router.push("/add-post")}
                      className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-800 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-lg">Publicar Primer Producto</span>
                      <Sparkles className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 text-sm text-gray-500">
                    <p>💡 Comparte productos únicos y conecta con la comunidad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
