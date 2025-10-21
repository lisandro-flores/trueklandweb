"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  Loader2,
  Package,
  Clock,
  AlertCircle,
  Filter
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

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Verificar si el usuario es admin (puedes agregar tu lógica aquí)
  const isAdmin = user?.email === "admin@truekland.com" // Ajusta según tu lógica de admin

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
  }, [user, isAdmin, router, toast])

  useEffect(() => {
    if (!user || !isAdmin) return

    const unsubscribe = onSnapshot(
      collection(db, "UserPost"),
      (querySnapshot) => {
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }))
        setPosts(postsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error loading posts:", error)
        toast({
          title: "Error",
          description: "Error al cargar las publicaciones",
          variant: "destructive",
        })
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user, isAdmin, toast])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "authorized") {
        filtered = filtered.filter((post) => post.isAuthorized)
      } else {
        filtered = filtered.filter((post) => !post.isAuthorized)
      }
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, selectedStatus])

  const authorizePost = async (postId: string) => {
    try {
      await updateDoc(doc(db, "UserPost", postId), { isAuthorized: true })
      toast({
        title: "Éxito",
        description: "Publicación autorizada correctamente",
      })
    } catch (error) {
      console.error("Error authorizing post:", error)
      toast({
        title: "Error",
        description: "Error al autorizar la publicación",
        variant: "destructive",
      })
    }
  }

  const rejectPost = async (postId: string) => {
    try {
      await updateDoc(doc(db, "UserPost", postId), { isAuthorized: false })
      toast({
        title: "Éxito",
        description: "Publicación rechazada correctamente",
      })
    } catch (error) {
      console.error("Error rejecting post:", error)
      toast({
        title: "Error",
        description: "Error al rechazar la publicación",
        variant: "destructive",
      })
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return

    try {
      await deleteDoc(doc(db, "UserPost", postId))
      toast({
        title: "Éxito",
        description: "Publicación eliminada correctamente",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Error al eliminar la publicación",
        variant: "destructive",
      })
    }
  }

  if (!user || !isAdmin) {
    return null
  }

  const pendingPosts = posts.filter((p) => !p.isAuthorized)
  const authorizedPosts = posts.filter((p) => p.isAuthorized)
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#91f2b3] mx-auto" />
          <p className="text-[#B4C7E7]">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#112240]/95 backdrop-blur-xl border-b border-[#233554] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#91f2b3] to-[#fcf326] bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-[#B4C7E7] mt-1">Gestiona las publicaciones de TruekLand</p>
            </div>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F]"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#112240]/95 border-2 border-[#233554]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#B4C7E7]">Total Posts</CardTitle>
              <Package className="h-4 w-4 text-[#91f2b3]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E6F1FF]">{posts.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#112240]/95 border-2 border-[#233554]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#B4C7E7]">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-[#fcf326]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E6F1FF]">{pendingPosts.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#112240]/95 border-2 border-[#233554]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#B4C7E7]">Autorizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#10B981]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E6F1FF]">{authorizedPosts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#112240]/95 border-2 border-[#233554] mb-8">
          <CardHeader>
            <CardTitle className="text-[#E6F1FF] flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8FA3C4] h-5 w-5" />
              <Input
                placeholder="Buscar por título, descripción o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0A1628] border-[#233554] text-[#E6F1FF] placeholder:text-[#8FA3C4]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#B4C7E7] mb-2 block">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md bg-[#0A1628] border-[#233554] text-[#E6F1FF] px-3 py-2"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#B4C7E7] mb-2 block">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-md bg-[#0A1628] border-[#233554] text-[#E6F1FF] px-3 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="authorized">Autorizados</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-[#112240] border border-[#233554]">
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fcf326] data-[state=active]:to-[#91f2b3] data-[state=active]:text-[#0A1628]"
            >
              <Clock className="h-4 w-4 mr-2" />
              Pendientes ({filteredPosts.filter(p => !p.isAuthorized).length})
            </TabsTrigger>
            <TabsTrigger 
              value="authorized"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#91f2b3] data-[state=active]:to-[#fcf326] data-[state=active]:text-[#0A1628]"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Autorizados ({filteredPosts.filter(p => p.isAuthorized).length})
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#91f2b3] data-[state=active]:to-[#fcf326] data-[state=active]:text-[#0A1628]"
            >
              <Package className="h-4 w-4 mr-2" />
              Todos ({filteredPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.filter(p => !p.isAuthorized).map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onAuthorize={authorizePost}
                  onReject={rejectPost}
                  onDelete={deletePost}
                  onView={(id) => router.push(`/admin/post/${id}`)}
                />
              ))}
            </div>
            {filteredPosts.filter(p => !p.isAuthorized).length === 0 && (
              <div className="text-center py-12 bg-[#112240]/50 rounded-lg border-2 border-dashed border-[#233554]">
                <AlertCircle className="h-12 w-12 text-[#8FA3C4] mx-auto mb-4" />
                <p className="text-[#B4C7E7]">No hay publicaciones pendientes</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="authorized">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.filter(p => p.isAuthorized).map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onAuthorize={authorizePost}
                  onReject={rejectPost}
                  onDelete={deletePost}
                  onView={(id) => router.push(`/admin/post/${id}`)}
                />
              ))}
            </div>
            {filteredPosts.filter(p => p.isAuthorized).length === 0 && (
              <div className="text-center py-12 bg-[#112240]/50 rounded-lg border-2 border-dashed border-[#233554]">
                <AlertCircle className="h-12 w-12 text-[#8FA3C4] mx-auto mb-4" />
                <p className="text-[#B4C7E7]">No hay publicaciones autorizadas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onAuthorize={authorizePost}
                  onReject={rejectPost}
                  onDelete={deletePost}
                  onView={(id) => router.push(`/admin/post/${id}`)}
                />
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 bg-[#112240]/50 rounded-lg border-2 border-dashed border-[#233554]">
                <AlertCircle className="h-12 w-12 text-[#8FA3C4] mx-auto mb-4" />
                <p className="text-[#B4C7E7]">No se encontraron publicaciones</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PostCard({ 
  post, 
  onAuthorize, 
  onReject, 
  onDelete, 
  onView 
}: { 
  post: Post
  onAuthorize: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}) {
  return (
    <Card className="bg-[#112240]/95 border-2 border-[#233554] hover:border-[#00D8E8] transition-all group">
      <CardContent className="p-0">
        {/* Image */}
        {post.images && post.images.length > 0 && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              unoptimized
            />
            <Badge 
              className={`absolute top-2 right-2 ${
                post.isAuthorized 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-[#F59E0B] text-[#0A1628]'
              }`}
            >
              {post.isAuthorized ? 'Autorizado' : 'Pendiente'}
            </Badge>
          </div>
        )}

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-[#E6F1FF] mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-sm text-[#8FA3C4] line-clamp-2">{post.desc}</p>
          </div>

          {post.category && (
            <Badge className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-[#0A1628]">
              {post.category}
            </Badge>
          )}

          <div className="flex items-center gap-2 text-xs text-[#8FA3C4]">
            <div className="w-6 h-6 rounded-full bg-[#1A2F4F] flex items-center justify-center">
              {post.userName?.[0] || 'U'}
            </div>
            <span className="truncate">{post.userName || 'Usuario'}</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onView(post.id)}
              size="sm"
              variant="outline"
              className="flex-1 border-[#233554] text-[#E6F1FF] hover:bg-[#1A2F4F]"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            {!post.isAuthorized ? (
              <Button
                onClick={() => onAuthorize(post.id)}
                size="sm"
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Autorizar
              </Button>
            ) : (
              <Button
                onClick={() => onReject(post.id)}
                size="sm"
                variant="outline"
                className="flex-1 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rechazar
              </Button>
            )}
            <Button
              onClick={() => onDelete(post.id)}
              size="sm"
              variant="outline"
              className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
