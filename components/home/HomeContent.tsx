"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"
import Header from "./Header"
import Slider from "./Slider"
import Categories from "./Categories"
import ProductList from "../products/ProductList"
import LoadingSpinner from "../ui/loading-spinner"

export default function HomeContent() {
  const [sliderList, setSliderList] = useState<any[]>([])
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [latestItemList, setLatestItemList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const db = getFirestore(app)

  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categories = categoriesSnapshot.docs.map((doc) => doc.data())
        setCategoryList(categories)

        const postsQuery = query(
          collection(db, "UserPost"),
          where("isAuthorized", "==", true),
          orderBy("createdAt", "desc"),
        )
        const postsSnapshot = await getDocs(postsQuery)
        const items = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setLatestItemList(items)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [db])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">Cargando contenido</h3>
            <p className="text-gray-500">Preparando la mejor experiencia para ti...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <Header />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
        
          {/* Categories */}
          <section className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
                Explora Categorías
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Descubre productos increíbles organizados por categorías
              </p>
              <div className="w-24 h-1 bg-[#fcf326] rounded-full mx-auto"></div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
              <Categories categoryList={categoryList} />
            </div>
          </section>

          {/* Latest Items */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#91f2b3] text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                <span>Recién Agregados</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#91f2b3]">
                Artículos Recientes
              </h2>

              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Los productos más nuevos y emocionantes de nuestra comunidad
              </p>
            </div>

            {latestItemList.length > 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
                <ProductList products={latestItemList} />
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg">
                <div className="text-center py-16 sm:py-24 px-6">
                  <div className="mx-auto w-24 h-24 bg-[#91f2b3] rounded-full flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      ¡Próximamente contenido increíble!
                    </h3>

                    <p className="text-gray-600 text-lg leading-relaxed">
                      Aún no se ha subido ningún artículo, pero estamos emocionados por ver lo que nuestra comunidad
                      compartirá.
                    </p>

                    <div className="pt-4">
                      <div className="inline-flex items-center space-x-2 bg-[#fcf326] text-gray-800 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span>🚀</span>
                        <span>Sé el primero en publicar</span>
                      </div>
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
