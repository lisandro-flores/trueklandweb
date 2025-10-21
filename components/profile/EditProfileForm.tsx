"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Camera, Save, ArrowLeft, MapPin, Phone, Mail, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import LoadingSpinner from "../ui/loading-spinner"

interface UserProfileData {
  displayName: string
  bio: string
  phone: string
  location: string
}

export default function EditProfileForm() {
  const [profileData, setProfileData] = useState<UserProfileData>({
    displayName: "",
    bio: "",
    phone: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        bio: "",
        phone: "",
        location: "",
      })
      setInitialLoading(false)
    }
  }, [user])

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await updateProfile(user, {
        displayName: profileData.displayName,
      })

      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        displayName: profileData.displayName,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente",
      })

      router.push("/profile")
    } catch (error: unknown) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el perfil'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-[#0A1628] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[#E6F1FF]/70 hover:text-[#91f2b3] hover:bg-[#1A2F4F]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
        </div>

        <Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554] shadow-xl">
          <CardHeader className="text-center border-b border-[#233554]">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent flex items-center justify-center space-x-2">
              <Edit2 className="w-6 h-6 text-[#91f2b3]" />
              <span>Editar Perfil</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-[#233554] shadow-lg">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-[#91f2b3] to-[#fcf326] text-[#0A1628] text-xl font-bold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-[#E6F1FF]/60">
                Haz clic en el ícono de cámara para cambiar tu foto
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium text-[#E6F1FF]">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E6F1FF]/60 w-4 h-4" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={profileData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="pl-10 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#E6F1FF]">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E6F1FF]/60 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    className="pl-10 bg-[#1A2F4F]/50 border-2 border-[#233554] text-[#E6F1FF]/70 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-[#E6F1FF]/50">
                  El correo electrónico no se puede cambiar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[#E6F1FF]">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E6F1FF]/60 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Tu número de teléfono"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-[#E6F1FF]">
                  Ubicación
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E6F1FF]/60 w-4 h-4" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="Tu ciudad, país"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-[#E6F1FF]">
                  Biografía
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Cuéntanos un poco sobre ti..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="resize-none bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
                />
                <p className="text-xs text-[#E6F1FF]/50">
                  Máximo 500 caracteres
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A1628] mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
