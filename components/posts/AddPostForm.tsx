"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import { Upload, Plus, X, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useMobile, supportsCamera } from "@/hooks/use-mobile"
import { app } from "@/lib/firebase"
import { DEFAULT_CATEGORIES, APP_LIMITS, ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants"
import LoadingSpinner from "../ui/loading-spinner"
import MobileCamera from "../ui/mobile-camera"

interface Category {
  name: string
  icon: string
  color?: string
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
  const [showCamera, setShowCamera] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const isMobile = useMobile()
  const hasCameraSupport = supportsCamera()
  const db = getFirestore(app)
  const storage = getStorage(app)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Category"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data()) as Category[]
        setCategories(
          categoriesData.length > 0 ? categoriesData : DEFAULT_CATEGORIES,
        )
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories(DEFAULT_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [db])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > APP_LIMITS.MAX_IMAGE_SIZE) {
        toast({
          title: "Error",
          description: ERROR_MESSAGES.IMAGE_TOO_LARGE,
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.onerror = () => {
        setSelectedImage(null)
        setImagePreview("")
        toast({
          title: "Error",
          description: "No se pudo cargar la imagen",
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setShowCamera(false)
    
    toast({
      title: "¡Foto capturada! 📸",
      description: "La imagen se ha agregado exitosamente.",
    })
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.REQUIRED_FIELD,
        variant: "destructive",
      })
      return false
    }

    if (!formData.desc.trim()) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.REQUIRED_FIELD,
        variant: "destructive",
      })
      return false
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Debes seleccionar una categoría",
        variant: "destructive",
      })
      return false
    }

    if (!selectedImage) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.IMAGE_REQUIRED,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) return

    setSubmitting(true)

    try {
      let imageUrl = ""

      if (selectedImage) {
        const imageRef = ref(storage, `products/${Date.now()}_${selectedImage.name}`)
        const uploadResult = await uploadBytes(imageRef, selectedImage)
        imageUrl = await getDownloadURL(uploadResult.ref)
      }

      await addDoc(collection(db, "UserPost"), {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        category: formData.category,
        price: formData.price || "0",
        image: imageUrl,
        userName: user.displayName || user.email || "Usuario",
        userEmail: user.email,
        userImage: user.photoURL || "",
        postedOn: new Date().toISOString(),
        isAuthorized: true, // Auto-approve for now
      })

      toast({
        title: "¡Éxito!",
        description: SUCCESS_MESSAGES.PRODUCT_CREATED,
      })

      // Limpiar formulario tras publicar
      setFormData({
        title: "",
        desc: "",
        category: "",
        price: "",
      })
      setSelectedImage(null)
      setImagePreview("")

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
          <CardTitle className="gradient-text text-2xl">
            Publicar Nuevo Producto
          </CardTitle>
          <p className="text-gray-600">Completa los detalles de tu producto para publicarlo</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen del producto <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden glass-effect">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="btn-secondary cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {imagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
                      </span>
                    </Button>
                  </label>
                  
                  {/* Camera Button - Only show on mobile devices with camera support */}
                  {isMobile && hasCameraSupport && (
                    <Button
                      type="button"
                      variant="outline"
                      className="btn-secondary"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Tomar Foto
                    </Button>
                  )}
                </div>
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
                placeholder="Título del producto"
                className="input-modern h-12"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Describe tu producto..."
                rows={4}
                className="input-modern"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="input-modern h-12">
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
              <label className="block text-sm font-medium mb-2">
                Precio (opcional)
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Precio en USD"
                className="input-modern h-12"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-12"
            >
              <Plus className="h-5 w-5 mr-2" />
              {submitting ? "Publicando..." : "Publicar Producto"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mobile Camera Modal */}
      <MobileCamera
        isOpen={showCamera}
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    </div>
  )
}
