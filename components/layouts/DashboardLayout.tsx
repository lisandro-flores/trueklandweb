import type { ReactNode } from "react"
import Navbar from "@/components/navigation/Navbar"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-6 max-w-7xl">
        <div className="relative">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ 
                 backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cg fill='%2300D8E8'%3e%3ccircle cx='16' cy='16' r='2'/%3e%3c/g%3e%3c/svg%3e\")" 
               }} 
          />
          {children}
        </div>
      </main>
    </div>
  )
}
