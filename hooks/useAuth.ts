// hooks/useAuth.ts - Mejorar el contexto de autenticación
"use client"
import { useEffect, useState } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile 
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLogin: Date
  isActive: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const createUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      const { email, displayName, photoURL } = user
      const profile: UserProfile = {
        uid: user.uid,
        email,
        displayName,
        photoURL,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true
      }
      await setDoc(userRef, profile)
      setUserProfile(profile)
    } else {
      setUserProfile(userSnap.data() as UserProfile)
    }
  }

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await createUserProfile(result.user)
    return result
  }

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await createUserProfile(result.user)
    return result
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setUserProfile(null)
  }

  return {
    user,
    userProfile,
    loading,
    login,
    register,
    logout
  }
}
