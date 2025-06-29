"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User 
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { app, db } from "@/lib/firebase"

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLogin: Date
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
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
      const profile = userSnap.data() as UserProfile
      // Actualizar último login
      await updateDoc(userRef, { lastLogin: new Date() })
      setUserProfile({ ...profile, lastLogin: new Date() })
    }
  }

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(getAuth(app), email, password)
    await createUserProfile(result.user)
  }

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(getAuth(app), email, password)
    await updateProfile(result.user, { displayName })
    await createUserProfile(result.user)
  }

  const logout = async () => {
    await signOut(getAuth(app))
    setUser(null)
    setUserProfile(null)
  }

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await createUserProfile(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
