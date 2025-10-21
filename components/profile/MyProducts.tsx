"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { ArrowLeft, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { Product } from "@/lib/types"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) return

      try {
        const productsQuery = query(
          collection(db, "UserPost"),
          where("userEmail", "==", user.email),
          orderBy("createdAt", "desc"),
        )
        const productsSnapshot = await getDocs(productsQuery)
        const productsData = productsSnapshot.docs.map((doc) => {
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
      } catch (error) {
        console.error("Error fetching my products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyProducts()
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="flex items-center space-x-2 text-[#E6F1FF] hover:text-[#91f2b3] hover:bg-[#1A2F4F] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>

          <div className="flex items-center space-x-4">
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF]"
            >
              {products.length} productos
            </Badge>

            <Button
              onClick={() => router.push("/add-post")}
              className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent mb-2">
          Mis Productos
        </h1>
        <p className="text-[#E6F1FF]/70">Gestiona todos tus productos publicados</p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="text-center py-16 bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] rounded-2xl">
          <Package className="h-16 w-16 text-[#E6F1FF]/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#E6F1FF] mb-2">Aún no has publicado productos</h3>
          <p className="text-[#E6F1FF]/60 mb-6">Comienza a intercambiar publicando tu primer producto</p>
          <Button
            onClick={() => router.push("/add-post")}
            className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Publicar Primer Producto
          </Button>
        </div>
      )}
    </div>
  )
}
