'use client'

import Link from 'next/link'
import { Home, Search, AlertCircle } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function NotFound() {
    const { currentTheme } = useTheme()
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center px-4`}>
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-black text-white/10 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="w-24 h-24 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page introuvable
        </h1>

        {/* Description */}
        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            href="/schools"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5" />
            Explorer les écoles
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Vous cherchiez peut-être :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link href="/schools" className="text-blue-400 hover:text-blue-300 hover:underline">
              → Catalogue des écoles
            </Link>
            <Link href="/calculator" className="text-blue-400 hover:text-blue-300 hover:underline">
              → Calculateur de chances
            </Link>
            <Link href="/map" className="text-blue-400 hover:text-blue-300 hover:underline">
              → Carte interactive
            </Link>
            <Link href="/pricing" className="text-blue-400 hover:text-blue-300 hover:underline">
              → Nos abonnements
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
