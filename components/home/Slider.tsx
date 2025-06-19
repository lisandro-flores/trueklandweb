"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderItem {
  id?: string
  name: string
  imageUrl: string
  description?: string
}

interface SliderProps {
  sliderList: SliderItem[]
}

export default function Slider({ sliderList }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  

  useEffect(() => {
    if (sliderList.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderList.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [sliderList.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderList.length) % sliderList.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderList.length)
  }

  if (sliderList.length === 0) {
    return (
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">¡Bienvenido a TrueKland!</h3>
          <p className="text-lg opacity-90">Descubre increíbles oportunidades de intercambio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden group">
      <div className="relative w-full h-full">
        <Image
          src={sliderList[currentIndex]?.imageUrl || "/placeholder.svg?height=300&width=800"}
          alt={sliderList[currentIndex]?.name || "Slider"}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1">{sliderList[currentIndex]?.name}</h3>
          {sliderList[currentIndex]?.description && (
            <p className="text-sm md:text-base opacity-90">{sliderList[currentIndex].description}</p>
          )}
        </div>
      </div>

      {sliderList.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 right-4 flex space-x-2">
            {sliderList.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
