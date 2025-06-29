// hooks/useNotifications.ts - Sistema de notificaciones
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
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Notification } from '@/lib/types'
import { toast } from 'sonner'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    // Escuchar notificaciones en tiempo real
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Notification[]

      setNotifications(notificationsData)
      setUnreadCount(notificationsData.filter(n => !n.read).length)
      setLoading(false)

      // Mostrar toast para nuevas notificaciones
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const notification = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate() || new Date()
          } as Notification

          // Solo mostrar toast si es realmente nueva (no es la carga inicial)
          if (!loading && Date.now() - notification.createdAt.getTime() < 5000) {
            toast(notification.title, {
              description: notification.message,
              action: {
                label: "Ver",
                onClick: () => handleNotificationClick(notification)
              }
            })
          }
        }
      })
    })

    return () => unsubscribe()
  }, [user, loading])

  const createNotification = async (
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: Notification['data']
  ) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: serverTimestamp(),
        data: data || {}
      })
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      const promises = unreadNotifications.map(n => 
        updateDoc(doc(db, 'notifications', n.id), { read: true })
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    
    // Navegar según el tipo de notificación
    switch (notification.type) {
      case 'exchange_request':
        if (notification.data?.exchangeId) {
          window.location.href = `/exchanges/${notification.data.exchangeId}`
        }
        break
      case 'message':
        if (notification.data?.exchangeId) {
          window.location.href = `/chat/${notification.data.exchangeId}`
        }
        break
      default:
        break
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    handleNotificationClick
  }
}

// Funciones helper para crear notificaciones específicas
export const notificationHelpers = {
  exchangeRequest: (toUserId: string, fromUserName: string, productTitle: string, exchangeId: string) => ({
    userId: toUserId,
    type: 'exchange_request' as const,
    title: 'Nueva propuesta de intercambio',
    message: `${fromUserName} quiere intercambiar por tu ${productTitle}`,
    data: { exchangeId }
  }),

  exchangeAccepted: (toUserId: string, fromUserName: string, productTitle: string, exchangeId: string) => ({
    userId: toUserId,
    type: 'exchange_accepted' as const,
    title: '¡Intercambio aceptado!',
    message: `${fromUserName} aceptó tu propuesta para ${productTitle}`,
    data: { exchangeId }
  }),

  exchangeRejected: (toUserId: string, fromUserName: string, productTitle: string, exchangeId: string) => ({
    userId: toUserId,
    type: 'exchange_rejected' as const,
    title: 'Intercambio rechazado',
    message: `${fromUserName} rechazó tu propuesta para ${productTitle}`,
    data: { exchangeId }
  }),

  newMessage: (toUserId: string, fromUserName: string, exchangeId: string) => ({
    userId: toUserId,
    type: 'message' as const,
    title: 'Nuevo mensaje',
    message: `${fromUserName} te envió un mensaje`,
    data: { exchangeId }
  })
}
