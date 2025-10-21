import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-[#B4C7E7]">Cargando...</p>
      </div>
    </div>
  )
}
