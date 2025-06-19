"use client"

import ProductCard from "./ProductCard"

interface Product {
  id: string
  title: string
  desc: string
  category: string
  price: string
  images: string[]
  userName: string
  userEmail: string
  userImage: string
  createdAt: string
  isAuthorized: boolean
}

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
