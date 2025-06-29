// components/ui/ErrorBoundary.tsx
"use client"
import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Oops! Algo salió mal
            </h1>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar página
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
