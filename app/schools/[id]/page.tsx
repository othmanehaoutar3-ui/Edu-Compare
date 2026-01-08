'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Euro, TrendingUp, Star, Heart, BarChart3 } from 'lucide-react'
import { getSchoolById, type School } from '@/lib/schools'

export default function SchoolDetailPage() {
    const params = useParams()
    const [school, setSchool] = useState<School | null>(null)

    useEffect(() => {
        const id = parseInt(params.id as string)
        const foundSchool = getSchoolById(id)
        setSchool(foundSchool || null)
    }, [params])

    if (!school) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">École non trouvée</h1>
                    <Link href="/schools" className="text-purple-300 hover:text-white underline">
                        Retour à la recherche
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/schools"
                        className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour à la recherche
                    </Link>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${school.sector === 'Public'
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-blue-500/20 text-blue-300'
                                        }`}>
                                        {school.sector}
                                    </span>
                                    <h1 className="text-4xl font-bold text-white mb-2">{school.name}</h1>
                                    <div className="flex items-center gap-4 text-purple-200">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{school.city}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{school.type}</span>
                                    </div>
                                </div>
                                <button className="bg-pink-500/20 border border-pink-400/30 text-pink-300 p-3 rounded-full hover:bg-pink-500/30 transition-all">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-purple-200 leading-relaxed">
                                {school.name} est {school.sector === 'Public' ? 'un établissement public' : 'une école privée'} situé à {school.city}.
                                Formation de type {school.type} reconnue pour la qualité de son enseignement.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <Euro className="w-8 h-8 text-purple-300 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">
                                    {typeof school.price === 'number'
                                        ? (school.price === 0 ? 'Gratuit' : `${school.price.toLocaleString()}€`)
                                        : school.price}
                                </div>
                                <div className="text-purple-200 text-sm">Prix annuel</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{school.rate}%</div>
                                <div className="text-purple-200 text-sm">Satisfaction</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <Star className="w-8 h-8 text-yellow-400 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{school.salary || 'N/C'}</div>
                                <div className="text-purple-200 text-sm">Salaire sortie</div>
                            </div>

                            {school.rank && (
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                    <BarChart3 className="w-8 h-8 text-purple-300 mb-3" />
                                    <div className="text-2xl font-bold text-white mb-1">#{school.rank}</div>
                                    <div className="text-purple-200 text-sm">Classement</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                {school.url && (
                                    <a
                                        href={school.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white text-purple-900 py-3 rounded-xl font-semibold text-center hover:bg-purple-50 transition-all"
                                    >
                                        Site officiel
                                    </a>
                                )}

                                <button className="w-full bg-purple-500/20 border border-purple-400/30 text-white py-3 rounded-xl font-semibold hover:bg-purple-500/30 transition-all">
                                    Calculer mes chances
                                </button>

                                <button className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                                    Ajouter aux favoris
                                </button>
                            </div>
                        </div>

                        <div className="bg-purple-500/20 border border-purple-400/30 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Premium</h3>
                            <p className="text-purple-200 text-sm mb-4">
                                Débloquez toutes les statistiques et calculez vos chances réelles d'admission.
                            </p>
                            <button className="w-full bg-white text-purple-900 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all">
                                Passer Premium
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
