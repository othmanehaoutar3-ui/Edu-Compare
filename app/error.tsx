'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center px-4`}>
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-black text-white/10 leading-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-24 h-24 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Une erreur est survenue
        </h1>

        {/* Description */}
        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          Nos équipes ont été notifiées et travaillent à résoudre le problème.
        </p>

        {/* Error Details (dev mode) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left max-w-lg mx-auto">
            <p className="text-red-300 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Help */}
        <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Besoin d'aide ?</h2>
          <p className="text-white/70 text-sm mb-4">
            Si le problème persiste, n'hésitez pas à nous contacter.
          </p>
          <a
            href="mailto:contact@yourdomain.com"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            contact@yourdomain.com
          </a>
        </div>
      </div>
    </div>
  )
}
