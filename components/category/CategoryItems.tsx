"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, where, orderBy, getFirestore } from "firebase/firestore"
import { ArrowLeft, Package } from "lucide-react"
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
  image: string
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
        const productsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [category, db])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>

          <Badge variant="secondary" className="text-lg px-4 py-2">
            {products.length} productos
          </Badge>
        </div>

        <h1 className="text-3xl font-bold gradient-text mb-2">Categoría: {category}</h1>
        <p className="text-gray-600">Descubre todos los productos disponibles en esta categoría</p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="text-center py-16 glass-effect rounded-2xl">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay productos en esta categoría</h3>
          <p className="text-gray-500 mb-6">Sé el primero en publicar algo en "{category}"</p>
          <Button
            onClick={() => router.push("/add-post")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Publicar Producto
          </Button>
        </div>
      )}
    </div>
  )
}
