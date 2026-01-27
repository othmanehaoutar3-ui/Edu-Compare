'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import FavoriteButton from '@/components/FavoriteButton'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase/client'
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Euro,
    TrendingUp,
    Star,
    Heart,
    Map,
    Grid3x3,
    X,
    Sparkles,
    List, // Added List icon
} from 'lucide-react'
import { schools, School } from '@/lib/schools'

type SortOption = 'name' | 'price' | 'rate' | 'city'
type ViewMode = 'grid' | 'list'

export default function SchoolsPage() {
    const { currentTheme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [selectedSector, setSelectedSector] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<SortOption>('name')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [userFavorites, setUserFavorites] = useState<number[]>([])

    // Load user favorites on mount
    useEffect(() => {
        const loadFavorites = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: favorites } = await supabase
                    .from('favorites')
                    .select('school_id')
                    .eq('user_id', user.id)

                if (favorites) {
                    setUserFavorites(favorites.map(f => f.school_id))
                }
            }
        }
        loadFavorites()
    }, [])

    // Filter schools
    const filteredSchools = schools
        .filter((school) => {
            const matchesSearch =
                !searchQuery ||
                school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                school.type.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCity = !selectedCity || school.city === selectedCity
            const matchesType = !selectedType || school.type === selectedType
            const matchesSector = !selectedSector || school.sector === selectedSector

            return matchesSearch && matchesCity && matchesType && matchesSector
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'price':
                    const priceA = typeof a.price === 'number' ? a.price : 0
                    const priceB = typeof b.price === 'number' ? b.price : 0
                    return priceA - priceB
                case 'rate':
                    return b.rate - a.rate
                case 'city':
                    return a.city.localeCompare(b.city)
                default:
                    return 0
            }
        })

    const cities = Array.from(new Set(schools.map((s) => s.city))).sort()
    const types = Array.from(new Set(schools.map((s) => s.type))).sort()

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCity(null)
        setSelectedType(null)
        setSelectedSector(null)
    }

    const hasActiveFilters = searchQuery || selectedCity || selectedType || selectedSector

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-400/30 px-6 py-3 rounded-full mb-6">
                        <Sparkles className="w-6 h-6 text-cyan-300" />
                        <span className="text-cyan-200 font-semibold">Explorer</span>
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-4">
                        {filteredSchools.length} écoles trouvées
                    </h1>
                    <p className="text-blue-200 text-xl">
                        Trouvez l'école parfaite pour votre avenir
                    </p>
                </motion.div>

                {/* Search & Controls */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une école, ville, type..."
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 
                  pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-400 transition-all text-lg"
                            />
                        </div>

                        {/* View Mode */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-4 rounded-xl transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <Link
                                href="/map"
                                className="p-4 rounded-xl transition-all bg-white/10 text-purple-200 hover:bg-white/20"
                            >
                                <Map className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white px-6 py-4 rounded-xl 
                hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center gap-2 font-semibold"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filtres
                            {hasActiveFilters && (
                                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    !
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                                    {/* City Filter */}
                                    <div>
                                        <label className="block text-blue-200 text-sm font-semibold mb-2">Ville</label>
                                        <select
                                            value={selectedCity || ''}
                                            onChange={(e) => setSelectedCity(e.target.value || null)}
                                            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:border-cyan-400 transition-all"
                                        >
                                            <option value="">Toutes</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city} className="bg-slate-900">
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Type Filter */}
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Type</label>
                                        <select
                                            value={selectedType || ''}
                                            onChange={(e) => setSelectedType(e.target.value || null)}
                                            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:border-cyan-400 transition-all"
                                        >
                                            <option value="">Tous</option>
                                            {types.map((type) => (
                                                <option key={type} value={type} className="bg-purple-900">
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sector Filter */}
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Secteur</label>
                                        <select
                                            value={selectedSector || ''}
                                            onChange={(e) => setSelectedSector(e.target.value || null)}
                                            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:border-cyan-400 transition-all"
                                        >
                                            <option value="">Tous</option>
                                            <option value="Public" className="bg-purple-900">
                                                Public
                                            </option>
                                            <option value="Privé" className="bg-purple-900">
                                                Privé
                                            </option>
                                        </select>
                                    </div>

                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Trier par</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:border-cyan-400 transition-all"
                                        >
                                            <option value="name" className="bg-purple-900">
                                                Nom
                                            </option>
                                            <option value="price" className="bg-purple-900">
                                                Prix
                                            </option>
                                            <option value="rate" className="bg-purple-900">
                                                Satisfaction
                                            </option>
                                            <option value="city" className="bg-purple-900">
                                                Ville
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full 
                        transition-all flex items-center gap-2 text-sm font-semibold"
                                        >
                                            <X className="w-4 h-4" />
                                            Réinitialiser
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


                {/* Schools Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSchools.map((school, index) => (
                            <motion.div
                                key={school.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.02 }}
                            >
                                <Link href={`/schools/${school.id}`}>
                                    <div
                                        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 
                      hover:bg-white/15 hover:border-cyan-400/50 hover:scale-105 
                      transition-all duration-300 cursor-pointer h-full relative"
                                    >
                                        {/* Favorite Button */}
                                        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
                                            <FavoriteButton schoolId={school.id} initialIsFavorite={userFavorites.includes(school.id)} />
                                        </div>

                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 pr-12">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${school.sector === 'Public'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-blue-500/20 text-blue-300'
                                                        }`}
                                                >
                                                    {school.sector}
                                                </span>
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                                    {school.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{school.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Type */}
                                        <div className="mb-4">
                                            <span className="text-cyan-300 text-sm">{school.type}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                    <Euro className="w-4 h-4" />
                                                    <span>Prix</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {typeof school.price === 'number'
                                                        ? school.price === 0
                                                            ? 'Gratuit'
                                                            : `${school.price.toLocaleString()}€`
                                                        : school.price}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>Satisfaction</span>
                                                </div>
                                                <span className="text-green-400 font-semibold">{school.rate}%</span>
                                            </div>

                                            {school.salary && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span>Salaire</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{school.salary}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <div className="text-purple-300 group-hover:text-white transition-colors text-sm font-semibold flex items-center justify-between">
                                                <span>Voir les détails</span>
                                                <span className="group-hover:translate-x-2 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div >
                                </Link >
                            </motion.div >
                        ))
                        }
                    </AnimatePresence >
                </motion.div >

                {/* No Results */}
                {
                    filteredSchools.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-3xl font-bold text-white mb-4">Aucune école trouvée</h3>
                            <p className="text-purple-200 mb-8">Essayez de modifier vos filtres</p>
                            <button
                                onClick={clearFilters}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all"
                            >
                                Réinitialiser les filtres
                            </button>
                        </motion.div>
                    )
                }
            </div >
        </div >
    )
}
