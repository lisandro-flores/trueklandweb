import type { ReactNode } from "react"
import Navbar from "@/components/navigation/Navbar"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24 pb-20 md:pb-6">{children}</main>
    </div>
  )
}
