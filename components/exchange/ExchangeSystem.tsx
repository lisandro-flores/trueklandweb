// components/exchange/ExchangeSystem.tsx - Sistema de intercambio completo
"use client"
import { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, MessageCircle, Check, X, Clock, User, Package } from 'lucide-react'
import { Exchange, Product } from '@/lib/types'
import { toast } from 'sonner'
import Image from 'next/image'

interface ExchangeWithProducts extends Exchange {
  fromProduct?: Product
  toProduct?: Product
  fromUser?: { displayName: string; photoURL?: string }
  toUser?: { displayName: string; photoURL?: string }
}

export default function ExchangeSystem() {
  const [exchanges, setExchanges] = useState<ExchangeWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Escuchar intercambios donde el usuario está involucrado
    const q = query(
      collection(db, 'exchanges'),
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const exchangePromises = snapshot.docs.map(async (docSnapshot) => {
        const exchangeData = { id: docSnapshot.id, ...docSnapshot.data() } as Exchange
        
        // Obtener productos y usuarios
        const [fromProductDoc, toProductDoc] = await Promise.all([
          getDoc(doc(db, 'UserPost', exchangeData.fromProductId)),
          getDoc(doc(db, 'UserPost', exchangeData.toProductId))
        ])

        return {
          ...exchangeData,
          fromProduct: fromProductDoc.exists() ? { id: fromProductDoc.id, ...(fromProductDoc.data() || {}) } as Product : undefined,
          toProduct: toProductDoc.exists() ? { id: toProductDoc.id, ...(toProductDoc.data() || {}) } as Product : undefined
        }
      })

      const exchangesWithProducts = await Promise.all(exchangePromises)
      setExchanges(exchangesWithProducts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const respondToExchange = async (exchangeId: string, accept: boolean) => {
    if (!user) return

    try {
      const exchangeRef = doc(db, 'exchanges', exchangeId)
      await updateDoc(exchangeRef, {
        status: accept ? 'accepted' : 'rejected',
        updatedAt: new Date()
      })

      toast.success(accept ? '¡Intercambio aceptado!' : 'Intercambio rechazado')
    } catch (error) {
      console.error('Error responding to exchange:', error)
      toast.error('Error al responder')
    }
  }

  const completeExchange = async (exchangeId: string) => {
    if (!user) return

    try {
      const exchangeRef = doc(db, 'exchanges', exchangeId)
      await updateDoc(exchangeRef, {
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      })

      toast.success('¡Intercambio completado!')
    } catch (error) {
      console.error('Error completing exchange:', error)
      toast.error('Error al completar intercambio')
    }
  }

  const getStatusColor = (status: Exchange['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Exchange['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'accepted': return 'Aceptado'
      case 'rejected': return 'Rechazado'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return 'Desconocido'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Mis Intercambios</h2>
        <Badge variant="outline" className="badge-modern px-3 py-1">
          {exchanges.length} intercambios
        </Badge>
      </div>

      {exchanges.length === 0 ? (
        <Card className="glass-effect border-0 p-8 text-center">
          <ArrowLeftRight className="w-12 h-12 mx-auto text-[#91f2b3] mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No tienes intercambios aún
          </h3>
          <p className="text-gray-600">
            Encuentra productos interesantes y propón tu primer intercambio
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {exchanges.map(exchange => (
            <Card key={exchange.id} className="glass-effect border-0 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg gradient-text">
                    Intercambio #{exchange.id.slice(-6)}
                  </CardTitle>
                  <Badge className={`badge-modern ${getStatusColor(exchange.status)}`}>
                    {getStatusText(exchange.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Productos */}
                <div className="flex items-center justify-center space-x-4">
                  {/* Producto origen */}
                  <div className="flex-1 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100">
                      {exchange.fromProduct?.images?.[0] ? (
                        <Image
                          src={exchange.fromProduct.images[0]}
                          alt={exchange.fromProduct.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {exchange.fromProduct?.title || 'Producto no encontrado'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {exchange.fromUserId === user?.uid ? 'Tu producto' : 'Su producto'}
                    </p>
                  </div>

                  {/* Icono de intercambio */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#91f2b3] rounded-full flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5 text-gray-800" />
                    </div>
                  </div>

                  {/* Producto destino */}
                  <div className="flex-1 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100">
                      {exchange.toProduct?.images?.[0] ? (
                        <Image
                          src={exchange.toProduct.images[0]}
                          alt={exchange.toProduct.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {exchange.toProduct?.title || 'Producto no encontrado'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {exchange.toUserId === user?.uid ? 'Tu producto' : 'Su producto'}
                    </p>
                  </div>
                </div>

                {/* Mensaje */}
                {exchange.message && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{exchange.message}</p>
                  </div>
                )}

                {/* Información adicional */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(exchange.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>
                      {exchange.fromUserId === user?.uid 
                        ? `Enviado a ${exchange.toProduct?.userName || 'Usuario'}` 
                        : `Recibido de ${exchange.fromProduct?.userName || 'Usuario'}`
                      }
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  {exchange.status === 'pending' && exchange.toUserId === user?.uid && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => respondToExchange(exchange.id, true)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => respondToExchange(exchange.id, false)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  
                  {exchange.status === 'accepted' && (
                    <Button
                      size="sm"
                      onClick={() => completeExchange(exchange.id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Marcar como completado
                    </Button>
                  )}

                  {exchange.status !== 'rejected' && (
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook para usar el sistema de intercambios
export const useExchangeSystem = () => {
  const { user } = useAuth()

  const proposeExchange = async (fromProductId: string, toProductId: string, message?: string) => {
    if (!user) {
      toast.error('Debes estar logueado para proponer un intercambio')
      return false
    }

    try {
      const toProductDoc = await getDoc(doc(db, 'UserPost', toProductId))
      if (!toProductDoc.exists()) {
        toast.error('Producto no encontrado')
        return false
      }

      const toProduct = toProductDoc.data() as Product
      
      const newExchange: Omit<Exchange, 'id'> = {
        fromUserId: user.uid,
        toUserId: toProduct.userId,
        fromProductId,
        toProductId,
        message: message || '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addDoc(collection(db, 'exchanges'), {
        ...newExchange,
        participants: [user.uid, toProduct.userId]
      })

      toast.success('¡Propuesta de intercambio enviada!')
      return true
    } catch (error) {
      console.error('Error proposing exchange:', error)
      toast.error('Error al enviar propuesta')
      return false
    }
  }

  return { proposeExchange }
}
