"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import { Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface Category {
  name: string
  icon: string
}

export default function AddPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "",
    price: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)
  const storage = getStorage(app)

  const defaultCategories = ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros", "Juguetes", "Música", "Otros"]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data()) as Category[]
        setCategories(
          categoriesData.length > 0 ? categoriesData : defaultCategories.map((name) => ({ name, icon: "📦" })),
        )
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories(defaultCategories.map((name) => ({ name, icon: "📦" })))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [db])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.desc.trim() || !formData.category || !selectedImage) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios y selecciona una imagen",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Upload image
      const imageRef = ref(storage, `products/${Date.now()}_${selectedImage.name}`)
      const snapshot = await uploadBytes(imageRef, selectedImage)
      const imageUrl = await getDownloadURL(snapshot.ref)

      // Create post
      await addDoc(collection(db, "UserPost"), {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        category: formData.category,
        price: formData.price.trim(),
        image: imageUrl,
        userName: user.displayName || "Usuario",
        userEmail: user.email,
        userImage: user.photoURL || "",
        createdAt: new Date().toISOString(),
        isAuthorized: true, // Auto-approve for now
      })

      toast({
        title: "¡Éxito!",
        description: "Tu producto ha sido publicado correctamente",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Error al publicar el producto",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="gradient-text">Publicar Nuevo Producto</CardTitle>
          <p className="text-gray-600">Comparte algo increíble con la comunidad</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagen del producto <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-gray-500">PNG, JPG hasta 5MB</p>
                </div>
              )}

              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />

              {!imagePreview && (
                <label htmlFor="image-upload">
                  <Button variant="outline" className="w-full cursor-pointer" asChild>
                    <span>
                      <Plus className="h-4 w-4 mr-2" />
                      Seleccionar Imagen
                    </span>
                  </Button>
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué estás intercambiando?"
              className="h-12"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 caracteres</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Describe tu producto, su estado, por qué lo intercambias..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.desc.length}/500 caracteres</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio estimado (opcional)</label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Precio en USD (ej: 50)"
              className="h-12"
            />
            <p className="text-xs text-gray-500 mt-1">Ayuda a otros a entender el valor de tu producto</p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {submitting ? "Publicando..." : "Publicar Producto"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
