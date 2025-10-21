import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth"
import { getFirestore, doc, deleteDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { env } from "./env"

// Configuración de Firebase con variables validadas
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Configuración del proveedor de Google
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Función para recuperar contraseña
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, message: "Email de recuperación enviado" }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, message: errorMessage }
  }
}

// Función para eliminar un mensaje
export const deleteMessage = async (messageId: string) => {
  try {
    await deleteDoc(doc(db, "messages", messageId))
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, message: errorMessage }
  }
}

// Función para eliminar un chat completo
export const deleteChat = async (chatId: string) => {
  try {
    // Eliminar el chat
    await deleteDoc(doc(db, "chats", chatId))
    
    // Eliminar todos los mensajes del chat
    const messagesQuery = query(collection(db, "messages"), where("chatId", "==", chatId))
    const messagesSnapshot = await getDocs(messagesQuery)
    
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, message: errorMessage }
  }
}

// Función para actualizar un producto
export const updateProduct = async (productId: string, productData: Record<string, unknown>) => {
  try {
    await updateDoc(doc(db, "UserPost", productId), {
      ...productData,
      updatedAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, message: errorMessage }
  }
}

// Función para actualizar perfil de usuario
export const updateUserProfile = async (userId: string, profileData: Record<string, unknown>) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...profileData,
      updatedAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, message: errorMessage }
  }
}
