"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Check, 
  X, 
  Trash2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Package,
  Loader2
} from "lucide-react"
import Image from "next/image"

interface Post {
  id: string
  title: string
  desc: string
  createdAt: string
  isAuthorized: boolean
  images?: string[]
  category?: string
  location?: string
  status?: string
  telefono?: string
  userEmail?: string
  userName?: string
  userImage?: string
  userId?: string
  cambio?: string
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const isAdmin = user?.email === "admin@truekland.com" // Ajusta según tu lógica

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (!isAdmin) {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "UserPost", params.id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as Post)
        } else {
          toast({
            title: "Error",
            description: "Publicación no encontrada",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } catch {
        toast({
          title: "Error",
          description: "Error al cargar la publicación",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id, user, isAdmin, toast, router])

  const authorizePost = async () => {
    if (!post) return
    try {
      await updateDoc(doc(db, "UserPost", post.id), { isAuthorized: true })
      setPost({ ...post, isAuthorized: true })
      toast({
        title: "Éxito",
        description: "Publicación autorizada correctamente",
      })
    } catch {
      toast({
        title: "Error",
        description: "Error al autorizar la publicación",
        variant: "destructive",
      })
    }
  }

  const rejectPost = async () => {
    if (!post) return
    try {
      await updateDoc(doc(db, "UserPost", post.id), { isAuthorized: false })
      setPost({ ...post, isAuthorized: false })
      toast({
        title: "Éxito",
        description: "Publicación rechazada correctamente",
      })
    } catch {
      toast({
        title: "Error",
        description: "Error al rechazar la publicación",
        variant: "destructive",
      })
    }
  }

  const deletePost = async () => {
    if (!post || !confirm("¿Estás seguro de eliminar esta publicación?")) return
    
    try {
      await deleteDoc(doc(db, "UserPost", post.id))
      toast({
        title: "Éxito",
        description: "Publicación eliminada correctamente",
      })
      router.push("/admin")
    } catch {
      toast({
        title: "Error",
        description: "Error al eliminar la publicación",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#91f2b3] mx-auto" />
          <p className="text-[#B4C7E7]">Cargando publicación...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#112240]/95 backdrop-blur-xl border-b border-[#233554] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              className="text-[#E6F1FF] hover:bg-[#1A2F4F]"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al panel
            </Button>
            
            <div className="flex gap-2">
              {!post.isAuthorized ? (
                <Button
                  onClick={authorizePost}
                  className="bg-[#10B981] hover:bg-[#059669]"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Autorizar
                </Button>
              ) : (
                <Button
                  onClick={rejectPost}
                  variant="outline"
                  className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10"
                >
                  <X className="h-5 w-5 mr-2" />
                  Rechazar
                </Button>
              )}
              <Button
                onClick={deletePost}
                variant="outline"
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {post.images && post.images.length > 0 && (
              <Card className="bg-[#112240]/95 border-2 border-[#233554] overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {post.images.length > 1 && (
                    <div className="p-4 grid grid-cols-4 gap-2">
                      {post.images.slice(1).map((img, idx) => (
                        <div key={idx} className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`${post.title} ${idx + 2}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card className="bg-[#112240]/95 border-2 border-[#233554]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-[#E6F1FF] mb-2">{post.title}</CardTitle>
                    <div className="flex gap-2">
                      {post.category && (
                        <Badge className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-[#0A1628]">
                          {post.category}
                        </Badge>
                      )}
                      <Badge 
                        className={post.isAuthorized 
                          ? 'bg-[#10B981] text-white' 
                          : 'bg-[#F59E0B] text-[#0A1628]'
                        }
                      >
                        {post.isAuthorized ? 'Autorizado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#B4C7E7] mb-2">Descripción</h3>
                  <p className="text-[#E6F1FF] leading-relaxed whitespace-pre-wrap">{post.desc}</p>
                </div>

                {post.cambio && (
                  <div>
                    <h3 className="text-sm font-medium text-[#B4C7E7] mb-2">Intercambio por</h3>
                    <p className="text-[#E6F1FF]">{post.cambio}</p>
                  </div>
                )}

                {post.location && (
                  <div className="flex items-center gap-2 text-[#E6F1FF]">
                    <MapPin className="h-4 w-4 text-[#91f2b3]" />
                    <span>{post.location}</span>
                  </div>
                )}

                {post.createdAt && (
                  <div className="flex items-center gap-2 text-[#8FA3C4] text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Publicado el {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="bg-[#112240]/95 border-2 border-[#233554]">
              <CardHeader>
                <CardTitle className="text-[#E6F1FF] flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#91f2b3] to-[#fcf326] flex items-center justify-center text-[#0A1628] font-bold text-lg">
                    {post.userName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-[#E6F1FF]">{post.userName || 'Usuario'}</p>
                    {post.userEmail && (
                      <p className="text-sm text-[#8FA3C4]">{post.userEmail}</p>
                    )}
                  </div>
                </div>

                {post.telefono && (
                  <div className="flex items-center gap-2 text-[#E6F1FF]">
                    <Phone className="h-4 w-4 text-[#91f2b3]" />
                    <span>{post.telefono}</span>
                  </div>
                )}

                {post.userEmail && (
                  <div className="flex items-center gap-2 text-[#E6F1FF]">
                    <Mail className="h-4 w-4 text-[#91f2b3]" />
                    <span className="truncate">{post.userEmail}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card className="bg-[#112240]/95 border-2 border-[#233554]">
              <CardHeader>
                <CardTitle className="text-[#E6F1FF] flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Estado de la Publicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#B4C7E7]">Estado:</span>
                  <Badge 
                    className={post.isAuthorized 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-[#F59E0B] text-[#0A1628]'
                    }
                  >
                    {post.isAuthorized ? 'Autorizado' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#B4C7E7]">ID:</span>
                  <span className="text-[#E6F1FF] text-sm font-mono">{post.id.slice(0, 8)}...</span>
                </div>
                {post.userId && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B4C7E7]">Usuario ID:</span>
                    <span className="text-[#E6F1FF] text-sm font-mono">{post.userId.slice(0, 8)}...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-[#112240]/95 border-2 border-[#233554]">
              <CardHeader>
                <CardTitle className="text-[#E6F1FF]">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!post.isAuthorized ? (
                  <Button
                    onClick={authorizePost}
                    className="w-full bg-[#10B981] hover:bg-[#059669]"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Autorizar Publicación
                  </Button>
                ) : (
                  <Button
                    onClick={rejectPost}
                    variant="outline"
                    className="w-full border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Rechazar Publicación
                  </Button>
                )}
                <Button
                  onClick={deletePost}
                  variant="outline"
                  className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Eliminar Publicación
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
