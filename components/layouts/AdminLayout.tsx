// components/layouts/AdminLayout.tsx
"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Shield, 
  LogOut, 
  Home, 
  Users, 
  BarChart3,
  ChevronRight
} from "lucide-react"
import { getAuth, signOut } from "firebase/auth"
import { app } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function AdminLayout({ 
  children, 
  title = "Panel de Administración",
  breadcrumbs = []
}: AdminLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      const auth = getAuth(app)
      await signOut(auth)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-[#233554] bg-[#112240]/95 backdrop-blur-xl shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#91f2b3] to-[#fcf326] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-900" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold text-[#E6F1FF]">TruekLand Admin</h1>
                  <p className="text-xs text-[#8FA3C4]">Panel de control</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Volver al sitio */}
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex gap-2 border-[#233554] text-[#B4C7E7] hover:bg-[#1A2F4F] hover:text-[#91f2b3] hover:border-[#91f2b3]"
                >
                  <Home className="w-4 h-4" />
                  <span>Ir al sitio</span>
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full border-2 border-[#91f2b3]/30 hover:border-[#91f2b3]"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Admin"} />
                      <AvatarFallback className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] text-gray-900 font-semibold">
                        {user?.email?.[0].toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-[#112240] border-[#233554] text-[#E6F1FF]" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#E6F1FF]">
                        {user?.displayName || "Administrador"}
                      </p>
                      <p className="text-xs leading-none text-[#8FA3C4]">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#233554]" />
                  
                  <DropdownMenuItem 
                    asChild
                    className="cursor-pointer hover:bg-[#1A2F4F] focus:bg-[#1A2F4F] text-[#B4C7E7]"
                  >
                    <Link href="/profile" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    asChild
                    className="cursor-pointer hover:bg-[#1A2F4F] focus:bg-[#1A2F4F] text-[#B4C7E7]"
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard Usuario</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    asChild
                    className="cursor-pointer hover:bg-[#1A2F4F] focus:bg-[#1A2F4F] text-[#B4C7E7]"
                  >
                    <Link href="/" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Ir al sitio</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[#233554]" />
                  
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-[#EF4444]/10 focus:bg-[#EF4444]/10 text-[#EF4444] font-medium"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="border-b border-[#233554] bg-[#112240]/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 h-12 text-sm">
              <Link 
                href="/admin" 
                className="text-[#8FA3C4] hover:text-[#91f2b3] transition-colors"
              >
                Admin
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#8FA3C4]" />
                  {crumb.href ? (
                    <Link 
                      href={crumb.href}
                      className="text-[#8FA3C4] hover:text-[#91f2b3] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#E6F1FF] font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="border-b border-[#233554] bg-[#112240]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E6F1FF]">
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#233554] bg-[#112240]/30 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#8FA3C4]">
              © 2025 TruekLand. Panel de Administración.
            </p>
            <div className="flex items-center gap-4 text-sm text-[#8FA3C4]">
              <Link href="/admin" className="hover:text-[#91f2b3] transition-colors">
                Panel
              </Link>
              <span>•</span>
              <Link href="/admin/posts" className="hover:text-[#91f2b3] transition-colors">
                Posts
              </Link>
              <span>•</span>
              <Link href="/admin/users" className="hover:text-[#91f2b3] transition-colors">
                Usuarios
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
