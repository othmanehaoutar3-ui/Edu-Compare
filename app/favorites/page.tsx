'use client'

import { useEffect, useState } from 'react'
import { schools } from '@/lib/schools'
import Link from 'next/link'
import { Heart, MapPin, Euro, Star, TrendingUp, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import FavoriteButton from '@/components/FavoriteButton'

interface Favorite {
    school_id: number
    created_at: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            const response = await fetch('/api/favorites/list')
            const data = await response.json()
            setFavorites(data.favorites || [])
        } catch (error) {
            console.error('Error fetching favorites:', error)
        } finally {
            setLoading(false)
        }
    }

    const favoriteSchools = schools.filter((school) =>
        favorites.some((fav) => fav.school_id === school.id)
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">Anti-Parcoursup</h1>
                        <div className="flex items-center gap-4">
                            <Link href="/schools" className="text-cyan-200 hover:text-white transition-colors">
                                Écoles
                            </Link>
                            <Link href="/map" className="text-cyan-200 hover:text-white transition-colors">
                                Carte
                            </Link>
                            <Link href="/dashboard" className="text-cyan-200 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 bg-pink-500/20 border border-pink-400/30 px-6 py-3 rounded-full mb-6">
                        <Heart className="w-6 h-6 text-pink-300 fill-current" />
                        <span className="text-pink-200 font-semibold">Mes Favoris</span>
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-4">
                        {favoriteSchools.length} école{favoriteSchools.length > 1 ? 's' : ''} favorite{favoriteSchools.length > 1 ? 's' : ''}
                    </h1>
                    <p className="text-blue-200 text-xl">
                        Vos écoles sauvegardées pour une comparaison facile
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                        <p className="text-cyan-200 mt-4">Chargement...</p>
                    </div>
                ) : favoriteSchools.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Heart className="w-24 h-24 text-white/20 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Aucun favori pour le moment</h2>
                        <p className="text-blue-200 mb-8">
                            Ajoutez des écoles à vos favoris pour les retrouver facilement
                        </p>
                        <Link
                            href="/schools"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50"
                        >
                            <Sparkles className="w-5 h-5" />
                            Explorer les écoles
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteSchools.map((school, index) => (
                            <motion.div
                                key={school.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/schools/${school.id}`}>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-cyan-400/50 transition-all group cursor-pointer relative">
                                        {/* Favorite Button */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <FavoriteButton schoolId={school.id} initialIsFavorite={true} />
                                        </div>

                                        {/* School Info */}
                                        <div className="mb-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${school.sector === 'Public'
                                                        ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                                        : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                                    }`}
                                            >
                                                {school.sector}
                                            </span>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                                {school.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {school.city}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-blue-200 flex items-center gap-2">
                                                    <Euro className="w-4 h-4" />
                                                    Prix
                                                </span>
                                                <span className="text-white font-semibold">{school.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-blue-200 flex items-center gap-2">
                                                    <Star className="w-4 h-4" />
                                                    Satisfaction
                                                </span>
                                                <span className="text-white font-semibold">{school.rate}/5</span>
                                            </div>
                                            {school.salary && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-200 flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4" />
                                                        Salaire
                                                    </span>
                                                    <span className="text-white font-semibold">{school.salary}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {favoriteSchools.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href="/schools"
                            className="inline-flex items-center gap-2 border-2 border-cyan-400/50 text-white px-8 py-4 rounded-full hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
                        >
                            Découvrir plus d'écoles
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
