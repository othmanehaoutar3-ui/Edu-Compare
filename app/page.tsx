'use client'

import Link from 'next/link'
import { ArrowRight, GraduationCap, Target, TrendingUp } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function Home() {
  const { currentTheme } = useTheme()

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
            style={{
              backgroundColor: `${currentTheme.primary}20`,
              borderColor: `${currentTheme.primary}50`,
              borderWidth: '1px'
            }}>
            <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accent }} />
            <span className="text-sm font-medium" style={{ color: `${currentTheme.accent}ee` }}>
              L'Anti-Parcoursup - Prédisez votre avenir
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Trouvez l'école <br />
            <span className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.secondary})`
              }}>
              qui vous correspond
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
            Ne perdez plus de temps à chercher. Notre IA analyse vos chances d'admission
            et vous recommande les meilleures écoles selon votre profil.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="group text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.secondary})`,
                boxShadow: `0 10px 40px ${currentTheme.primary}50`
              }}
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/schools"
              className="border-2 text-white px-8 py-4 rounded-full hover:scale-105 transition-all"
              style={{
                borderColor: `${currentTheme.primary}80`,
                backgroundColor: `${currentTheme.primary}10`
              }}
            >
              Explorer les écoles
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-all border"
            style={{ borderColor: `${currentTheme.primary}30` }}>
            <GraduationCap className="w-12 h-12 mb-4" style={{ color: currentTheme.accent }} />
            <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
            <p className="text-blue-200">Écoles référencées</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-all border"
            style={{ borderColor: `${currentTheme.primary}30` }}>
            <Target className="w-12 h-12 mb-4" style={{ color: currentTheme.accent }} />
            <h3 className="text-3xl font-bold text-white mb-2">92%</h3>
            <p className="text-blue-200">De précision IA</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-all border"
            style={{ borderColor: `${currentTheme.primary}30` }}>
            <TrendingUp className="w-12 h-12 mb-4" style={{ color: currentTheme.accent }} />
            <h3 className="text-3xl font-bold text-white mb-2">10k+</h3>
            <p className="text-blue-200">Étudiants aidés</p>
          </div>
        </div>
      </div>
    </div>
  )
}
