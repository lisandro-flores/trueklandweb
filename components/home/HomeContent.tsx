"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useProducts } from "@/hooks/useProducts"
import { Category } from "@/lib/types"
import Header from "./Header"
import Categories from "./Categories"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

export default function HomeContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const { products, loading: productsLoading, error } = useProducts()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
          icon: doc.data().icon || '',
          color: doc.data().color || '#000000',
          ...doc.data()
        })) as Category[]
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const isLoading = categoriesLoading || productsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="text-center space-y-6 bg-[#112240]/95 border-2 border-[#233554] p-8 rounded-2xl shadow-xl">
          <LoadingSpinner />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[#E6F1FF]">Cargando TruekLand</h3>
            <p className="text-[#B4C7E7]">Preparando la mejor experiencia para ti...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="text-center space-y-6 bg-[#112240]/95 border-2 border-[#233554] p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[#E6F1FF]">Error al cargar</h3>
            <p className="text-[#B4C7E7]">No se pudo cargar el contenido. Intenta recargar la página.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="relative z-10">
        <div className="sticky top-0 z-50 bg-[#112240]/95 backdrop-blur-xl border-b border-[#233554] shadow-lg">
          <Header />
        </div>

        <div className="space-y-8 md:space-y-12 py-6 md:py-8">
        
          {/* Categories */}
          <section className="space-y-6">
            <div className="text-center space-y-4 page-header">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E6F1FF] drop-shadow-lg">
                Explora Categorías
              </h2>
              <p className="text-[#B4C7E7] text-lg max-w-2xl mx-auto leading-relaxed">
                Descubre productos increíbles organizados por categorías
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] rounded-full mx-auto"></div>
            </div>

            <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-xl p-6 sm:p-8">
              <Categories categoryList={categories} />
            </div>
          </section>

          {/* Latest Items */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                <span>Recién Agregados</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent drop-shadow-lg">
                Artículos Recientes
              </h2>

              <p className="text-[#B4C7E7] text-lg max-w-3xl mx-auto">
                Los productos más nuevos y emocionantes de nuestra comunidad
              </p>
            </div>

            {products.length > 0 ? (
              <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-xl p-6 sm:p-8">
                <ProductList products={products} />
              </div>
            ) : (
              <div className="bg-[#112240]/95 border-2 border-[#233554] rounded-3xl shadow-xl">
                <div className="text-center py-16 sm:py-24 px-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] rounded-full flex items-center justify-center mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#E6F1FF]">
                      ¡Próximamente contenido increíble!
                    </h3>

                    <p className="text-[#B4C7E7] text-lg leading-relaxed">
                      Aún no se ha subido ningún artículo, pero estamos emocionados por ver lo que nuestra comunidad
                      compartirá.
                    </p>

                    <div className="pt-4">
                      <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#fcf326] to-[#91f2b3] text-gray-900 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span>🚀</span>
                        <span>Sé el primero en publicar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
