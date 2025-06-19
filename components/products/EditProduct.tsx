"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { doc, getDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import { ArrowLeft, Upload, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { app } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  image: string
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface EditProductProps {
  productId: string
}

const categories = ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros", "Juguetes", "Música", "Otros"]

export default function EditProduct({ productId }: EditProductProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "",
    price: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const db = getFirestore(app)
  const storage = getStorage(app)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "UserPost", productId))
        if (productDoc.exists()) {
          const productData = {
            id: productDoc.id,
            ...productDoc.data(),
          } as Product

          // Check if user owns this product
          if (user?.email !== productData.userEmail) {
            toast({
              title: "Acceso denegado",
              description: "No tienes permisos para editar este producto",
              variant: "destructive",
            })
            router.push("/profile")
            return
          }

          setProduct(productData)
          setFormData({
            title: productData.title,
            desc: productData.desc,
            category: productData.category,
            price: productData.price,
          })
          setImagePreview(productData.image)
        } else {
          toast({
            title: "Error",
            description: "Producto no encontrado",
            variant: "destructive",
          })
          router.push("/profile")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Error al cargar el producto",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProduct()
    }
  }, [productId, user, db, router, toast])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.desc.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      let imageUrl = product?.image || ""

      // Upload new image if selected
      if (selectedImage) {
        const imageRef = ref(storage, `products/${Date.now()}_${selectedImage.name}`)
        const snapshot = await uploadBytes(imageRef, selectedImage)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Update product
      await updateDoc(doc(db, "UserPost", productId), {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        category: formData.category,
        price: formData.price.trim(),
        image: imageUrl,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })

      router.push(`/product/${productId}`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    setDeleting(true)

    try {
      await deleteDoc(doc(db, "UserPost", productId))

      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })

      router.push("/profile/my-products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Producto no encontrado</h2>
        <Button onClick={() => router.push("/profile")}>Volver al perfil</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{deleting ? "Eliminando..." : "Eliminar"}</span>
        </Button>
      </div>

      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="gradient-text">Editar Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagen del producto</label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                <label htmlFor="image-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar Imagen
                    </span>
                  </Button>
                </label>
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
              className="h-12"
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
            />
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
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio (opcional)</label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Precio en USD"
              className="h-12"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
