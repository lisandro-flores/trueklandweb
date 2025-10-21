// hooks/useProducts.ts - Hook para gestión de productos
"use client"
import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product, LoadingState, FirebaseResponse } from '@/lib/types'
import { useAuth } from '@/context/AuthContext'

export interface UseProductsOptions {
  category?: string
  userId?: string
  limit?: number
  authorized?: boolean
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)
  
  const { user } = useAuth()

  // Usar valores por defecto para evitar cambios de referencia
  const category = options.category
  const userId = options.userId
  const productLimit = options.limit || 10
  const authorized = options.authorized !== undefined ? options.authorized : true

  const fetchProducts = useCallback(async (reset = false) => {
    if (loading === 'loading') return
    
    setLoading('loading')
    setError(null)

    try {
      let q = query(collection(db, 'UserPost'))

      // Filtros
      q = query(q, where('isAuthorized', '==', authorized))
      
      if (category) {
        q = query(q, where('category', '==', category))
      }
      
      if (userId) {
        q = query(q, where('userId', '==', userId))
      }

      // Ordenar por fecha
      q = query(q, orderBy('createdAt', 'desc'))

      // Paginación
      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      // Límite
      q = query(q, limit(productLimit))

      const snapshot = await getDocs(q)
      const newProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      if (reset) {
        setProducts(newProducts)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === productLimit)
      setLoading('success')
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error al cargar productos')
      setLoading('error')
    }
  }, [category, userId, authorized, productLimit, lastDoc, loading])

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'userId'>): Promise<FirebaseResponse<string>> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      const newProduct = {
        ...productData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        isAuthorized: false // Requiere aprobación
      }

      const docRef = await addDoc(collection(db, 'UserPost'), newProduct)
      
      // Actualizar estado local
      setProducts(prev => [{
        ...newProduct,
        id: docRef.id
      } as Product, ...prev])

      return { success: true, data: docRef.id }
    } catch (error) {
      console.error('Error adding product:', error)
      return { success: false, error: 'Error al crear producto' }
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<FirebaseResponse<void>> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      const productRef = doc(db, 'UserPost', productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })

      // Actualizar estado local
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, ...updates }
          : product
      ))

      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, error: 'Error al actualizar producto' }
    }
  }

  const deleteProduct = async (productId: string): Promise<FirebaseResponse<void>> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      await deleteDoc(doc(db, 'UserPost', productId))
      
      // Actualizar estado local
      setProducts(prev => prev.filter(product => product.id !== productId))

      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: 'Error al eliminar producto' }
    }
  }

  const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    try {
      // Por ahora búsqueda simple, luego se puede mejorar con Algolia
      const q = query(
        collection(db, 'UserPost'),
        where('isAuthorized', '==', true),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      // Filtrar por término de búsqueda
      return allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  const refetch = useCallback(() => {
    setLastDoc(null)
    setHasMore(true)
    fetchProducts(true)
  }, [fetchProducts])

  const loadMore = useCallback(() => {
    if (hasMore && loading !== 'loading') {
      fetchProducts(false)
    }
  }, [hasMore, loading, fetchProducts])

  useEffect(() => {
    fetchProducts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, userId, authorized])

  return {
    products,
    loading,
    error,
    hasMore,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refetch,
    loadMore
  }
}
