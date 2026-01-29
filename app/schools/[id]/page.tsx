'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Euro, TrendingUp, Star, Heart, BarChart3, Loader2 } from 'lucide-react'
import { getSchoolById, type School } from '@/lib/schools'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'

export default function SchoolDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [school, setSchool] = useState<School | null>(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        const id = parseInt(params.id as string)
        const foundSchool = getSchoolById(id)
        setSchool(foundSchool || null)

        // Check if user is logged in and if school is in favorites
        const checkFavorite = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user && foundSchool) {
                // Check premium status
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('subscription_status')
                    .eq('id', user.id)
                    .single()

                setIsPremium(profile?.subscription_status === 'premium')

                // Check favorites
                const { data } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('school_id', foundSchool.id)
                    .single()

                setIsFavorite(!!data)
            }
        }
        checkFavorite()
    }, [params])

    const handleToggleFavorite = async () => {
        if (!school) return

        if (!user) {
            router.push('/login')
            return
        }

        setIsLoading(true)

        try {
            if (isFavorite) {
                // Remove from favorites
                const response = await fetch('/api/favorites/remove', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schoolId: school.id }),
                })

                if (response.ok) {
                    setIsFavorite(false)
                }
            } else {
                // Add to favorites
                const response = await fetch('/api/favorites/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schoolId: school.id }),
                })

                const data = await response.json()

                if (response.ok) {
                    setIsFavorite(true)
                } else if (data.requiresUpgrade) {
                    alert('Vous avez atteint la limite de 5 favoris. Passez Premium pour des favoris illimités !')
                    router.push('/pricing')
                } else {
                    alert(data.error || 'Erreur lors de l\'ajout aux favoris')
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            alert('Erreur lors de la mise à jour des favoris')
        } finally {
            setIsLoading(false)
        }
    }

    if (!school) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">École non trouvée</h1>
                    <Link href="/schools" className="text-blue-300 hover:text-white underline">
                        Retour à la recherche
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient}`}>
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/schools"
                        className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
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
                                    <div className="flex items-center gap-4 text-blue-200">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{school.city}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{school.type}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isLoading}
                                    className={`p-3 rounded-full transition-all ${isFavorite
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30'
                                        }`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                    )}
                                </button>
                            </div>

                            <p className="text-blue-200 leading-relaxed">
                                {school.name} est {school.sector === 'Public' ? 'un établissement public' : 'une école privée'} situé à {school.city}.
                                Formation de type {school.type} reconnue pour la qualité de son enseignement.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <Euro className="w-8 h-8 text-blue-400 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">
                                    {typeof school.price === 'number'
                                        ? (school.price === 0 ? 'Gratuit' : `${school.price.toLocaleString()}€`)
                                        : school.price}
                                </div>
                                <div className="text-blue-200 text-sm">Prix annuel</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{school.rate}%</div>
                                <div className="text-blue-200 text-sm">Satisfaction</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <Star className="w-8 h-8 text-amber-400 mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{school.salary || 'N/C'}</div>
                                <div className="text-blue-200 text-sm">Salaire sortie</div>
                            </div>

                            {school.rank && (
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                    <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                                    <div className="text-2xl font-bold text-white mb-1">#{school.rank}</div>
                                    <div className="text-blue-200 text-sm">Classement</div>
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
                                        className="block w-full bg-white text-blue-900 py-3 rounded-xl font-semibold text-center hover:bg-blue-50 transition-all"
                                    >
                                        Site officiel
                                    </a>
                                )}

                                <Link
                                    href={`/calculator?school=${encodeURIComponent(school.name)}`}
                                    className="block w-full bg-blue-500/20 border border-blue-400/30 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-500/30 transition-all"
                                >
                                    Calculer mes chances
                                </Link>

                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isLoading}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isFavorite
                                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

{isPremium ? (
                            <div className="bg-gradient-to-br from-blue-600/20 to-amber-600/20 border border-blue-400/30 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Actions Premium</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={`/statistics?school=${encodeURIComponent(school.name)}`}
                                        className="block w-full bg-blue-500/20 border border-blue-400/30 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-500/30 transition-all"
                                    >
                                        📊 Statistiques détaillées
                                    </Link>
                                    <Link
                                        href={`/letter-generator?school=${encodeURIComponent(school.name)}`}
                                        className="block w-full bg-blue-500/20 border border-blue-400/30 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-500/30 transition-all"
                                    >
                                        ✍️ Générer une lettre
                                    </Link>
                                    <Link
                                        href={`/applications?school=${encodeURIComponent(school.name)}`}
                                        className="block w-full bg-blue-500/20 border border-blue-400/30 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-500/30 transition-all"
                                    >
                                        📝 Suivre ma candidature
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">Premium</h3>
                                <p className="text-blue-200 text-sm mb-4">
                                    Débloquez toutes les statistiques et calculez vos chances réelles d'admission.
                                </p>
                                <Link
                                    href="/pricing"
                                    className="block w-full bg-white text-blue-900 py-3 rounded-xl font-semibold text-center hover:bg-blue-50 transition-all"
                                >
                                    Passer Premium
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

