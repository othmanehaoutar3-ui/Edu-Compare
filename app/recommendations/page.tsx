'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'
import { schools } from '@/lib/schools'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Sparkles, Target, Lock, Loader2, GraduationCap, MapPin,
    Euro, Star, RefreshCw, ArrowRight
} from 'lucide-react'

type Recommendation = {
    type: string
    reason: string
    keywords: string[]
}

type MatchCriteria = {
    sector?: string
    cities?: string[]
    types?: string[]
}

export default function RecommendationsPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [matchCriteria, setMatchCriteria] = useState<MatchCriteria>({})
    const [matchedSchools, setMatchedSchools] = useState<typeof schools>([])

    useEffect(() => {
        checkUserAndFetch()
    }, [])

    const checkUserAndFetch = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        setUser(user)

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single()

        const isPrem = profile?.subscription_status === 'premium'
        setIsPremium(isPrem)

        if (isPrem) {
            await generateRecommendations()
        }

        setLoading(false)
    }

    const generateRecommendations = async () => {
        setGenerating(true)
        try {
            const response = await fetch('/api/recommendations/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 5 }),
            })

            if (response.ok) {
                const data = await response.json()
                setRecommendations(data.recommendations || [])
                setMatchCriteria(data.matchCriteria || {})

                // Find matching schools based on criteria
                const matched = schools.filter(school => {
                    // Match by sector
                    if (data.matchCriteria?.sector && school.sector !== data.matchCriteria.sector) {
                        return false
                    }
                    // Match by city
                    if (data.matchCriteria?.cities?.length > 0) {
                        const cityMatch = data.matchCriteria.cities.some((city: string) =>
                            school.city.toLowerCase().includes(city.toLowerCase())
                        )
                        if (!cityMatch) return false
                    }
                    // Match by type
                    if (data.matchCriteria?.types?.length > 0) {
                        const typeMatch = data.matchCriteria.types.some((type: string) =>
                            school.type.toLowerCase().includes(type.toLowerCase())
                        )
                        if (!typeMatch) return false
                    }
                    return true
                }).slice(0, 6)

                setMatchedSchools(matched.length > 0 ? matched : schools.slice(0, 6))
            }
        } catch (error) {
            console.error('Error generating recommendations:', error)
            // Fallback to random schools
            setMatchedSchools(schools.slice(0, 6))
        } finally {
            setGenerating(false)
        }
    }

    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    if (!isPremium) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
                            <Lock className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Recommandations Personnalisées
                            </h1>
                            <p className="text-white/70 text-lg mb-8">
                                Notre IA analyse votre profil pour vous recommander les écoles
                                les plus adaptées à vos objectifs.
                            </p>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                            >
                                Passer Premium
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 bg-purple-500/20 border border-purple-400/30 px-6 py-3 rounded-full mb-6">
                            <Target className="w-6 h-6 text-purple-300" />
                            <span className="text-purple-200 font-semibold">Recommandations IA</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Écoles Recommandées
                        </h1>
                        <p className="text-white/60 text-lg mb-6">
                            Basées sur votre profil et vos préférences
                        </p>

                        <button
                            onClick={generateRecommendations}
                            disabled={generating}
                            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                            {generating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <RefreshCw className="w-5 h-5" />
                            )}
                            Actualiser
                        </button>
                    </motion.div>

                    {/* AI Recommendations */}
                    {recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Analyse IA de votre profil
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recommendations.map((rec, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{rec.type}</h3>
                                                <p className="text-white/60 text-sm">{rec.reason}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.keywords.map((keyword, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Matched Schools */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <GraduationCap className="w-6 h-6 text-purple-400" />
                            Écoles correspondantes
                        </h2>

                        {generating ? (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
                                <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                                <p className="text-white/60">Génération des recommandations...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matchedSchools.map((school, index) => (
                                    <motion.div
                                        key={school.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link href={`/schools/${school.id}`}>
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-purple-400/50 transition-all group cursor-pointer h-full">
                                                <div className="mb-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${school.sector === 'Public'
                                                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                                            : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                                        }`}>
                                                        {school.sector}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                                        {school.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                                        <MapPin className="w-4 h-4" />
                                                        {school.city}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-white/60 flex items-center gap-2">
                                                            <Euro className="w-4 h-4" />
                                                            Prix
                                                        </span>
                                                        <span className="text-white font-semibold">{school.price}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-white/60 flex items-center gap-2">
                                                            <Star className="w-4 h-4" />
                                                            Note
                                                        </span>
                                                        <span className="text-white font-semibold">{school.rate}/5</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <span className="text-purple-300 text-sm font-medium group-hover:text-purple-200 flex items-center gap-1">
                                                        Voir plus
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href="/schools"
                            className="inline-flex items-center gap-2 border-2 border-purple-400/50 text-white px-8 py-4 rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all"
                        >
                            Explorer toutes les écoles
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
