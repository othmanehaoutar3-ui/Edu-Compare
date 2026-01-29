'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Search, Filter, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { schools } from '@/lib/schools'
import { useTheme } from '@/context/ThemeContext'
import './map.css'

// Dynamic import pour éviter les problèmes SSR avec Leaflet
const MapComponent = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-blue-900/20">
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
    ),
})

export default function MapPage() {
    const { currentTheme } = useTheme()
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredSchools = schools.filter((school) => {
        const matchesCity = !selectedCity || school.city === selectedCity
        const matchesType = !selectedType || school.type === selectedType
        const matchesSearch =
            !searchQuery ||
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesCity && matchesType && matchesSearch
    })

    const cities = Array.from(new Set(schools.map((s) => s.city))).sort()
    const types = Array.from(new Set(schools.map((s) => s.type))).sort()

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
            {/* Main */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 rounded-full mb-4">
                                <MapPin className="w-5 h-5 text-cyan-300" />
                                <span className="text-cyan-200 font-semibold">Carte Interactive</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Explorez les écoles
                            </h1>
                            <p className="text-cyan-200">
                                {filteredSchools.length} écoles trouvées
                            </p>
                        </div>

                        {/* Search */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                            <label className="block text-cyan-200 text-sm font-semibold mb-2">
                                <Search className="w-4 h-4 inline mr-2" />
                                Rechercher
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nom, ville..."
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-cyan-300 
                  px-4 py-3 rounded-xl outline-none focus:border-cyan-400 transition-all"
                            />
                        </div>

                        {/* City Filter */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                            <label className="block text-blue-200 text-sm font-semibold mb-3">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Ville
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                <button
                                    onClick={() => setSelectedCity(null)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${!selectedCity
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-blue-200 hover:bg-white/10'
                                        }`}
                                >
                                    Toutes les villes
                                </button>
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => setSelectedCity(city)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCity === city
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-blue-200 hover:bg-white/10'
                                            }`}
                                    >
                                        {city}
                                        <span className="float-right text-xs opacity-70">
                                            {schools.filter((s) => s.city === city).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                            <label className="block text-blue-200 text-sm font-semibold mb-3">
                                Type d'établissement
                            </label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedType(null)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${!selectedType
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-blue-200 hover:bg-white/10'
                                        }`}
                                >
                                    Tous les types
                                </button>
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedType === type
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-blue-200 hover:bg-white/10'
                                            }`}
                                    >
                                        {type}
                                        <span className="float-right text-xs opacity-70">
                                            {schools.filter((s) => s.type === type).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-blue-500/20 to-amber-500/20 border border-blue-400/30 rounded-2xl p-4">
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Statistiques
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-blue-200">
                                    <span>École la + chère</span>
                                    <span className="text-white font-semibold">
                                        {Math.max(...filteredSchools.map(s => typeof s.price === 'number' ? s.price : 0)).toLocaleString()}€
                                    </span>
                                </div>
                                <div className="flex justify-between text-blue-200">
                                    <span>Satisfaction moyenne</span>
                                    <span className="text-green-400 font-semibold">
                                        {Math.round(filteredSchools.reduce((acc, s) => acc + s.rate, 0) / filteredSchools.length)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden h-[800px] relative">
                            <MapComponent schools={filteredSchools} />

                            {/* Legend */}
                            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-[1000]">
                                <h4 className="text-white font-bold mb-2 text-sm">Légende</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-blue-200">Public (Gratuit)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-blue-200">Privé</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
