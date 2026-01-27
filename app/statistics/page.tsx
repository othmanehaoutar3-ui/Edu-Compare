'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    BarChart3, TrendingUp, Award, Target, Lock, Heart,
    GraduationCap, FileText, Calculator, Sparkles
} from 'lucide-react'

type Stats = {
    totalFavorites: number
    totalCalculations: number
    totalLetters: number
    avgChance: number
    topSchools: { name: string; chance: number }[]
    recentActivity: { type: string; date: string; detail: string }[]
}

export default function StatisticsPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats | null>(null)

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
            await fetchStats(user.id, supabase)
        }

        setLoading(false)
    }

    const fetchStats = async (userId: string, supabase: any) => {
        try {
            // Fetch favorites count
            const { count: favoritesCount } = await supabase
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)

            // Fetch calculations history
            const { data: calculations } = await supabase
                .from('calculation_history')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10)

            // Fetch letters history
            const { data: letters } = await supabase
                .from('letter_history')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5)

            // Calculate average chance
            let avgChance = 0
            const topSchools: { name: string; chance: number }[] = []

            if (calculations && calculations.length > 0) {
                avgChance = Math.round(
                    calculations.reduce((sum: number, c: any) => sum + (c.probability || 0), 0) / calculations.length
                )

                // Top 3 schools by chance
                const sorted = [...calculations].sort((a, b) => (b.probability || 0) - (a.probability || 0))
                sorted.slice(0, 3).forEach((c: any) => {
                    topSchools.push({ name: c.school_name, chance: c.probability })
                })
            }

            // Recent activity
            const recentActivity: Stats['recentActivity'] = []

            if (calculations) {
                calculations.slice(0, 3).forEach((c: any) => {
                    recentActivity.push({
                        type: 'calculation',
                        date: c.created_at,
                        detail: `Calcul pour ${c.school_name} - ${c.probability}%`
                    })
                })
            }

            if (letters) {
                letters.slice(0, 2).forEach((l: any) => {
                    recentActivity.push({
                        type: 'letter',
                        date: l.created_at,
                        detail: `Lettre pour ${l.school_name}`
                    })
                })
            }

            // Sort by date
            recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            setStats({
                totalFavorites: favoritesCount || 0,
                totalCalculations: calculations?.length || 0,
                totalLetters: letters?.length || 0,
                avgChance,
                topSchools,
                recentActivity: recentActivity.slice(0, 5)
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
            // Set default stats on error
            setStats({
                totalFavorites: 0,
                totalCalculations: 0,
                totalLetters: 0,
                avgChance: 0,
                topSchools: [],
                recentActivity: []
            })
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
                                Statistiques Avancées
                            </h1>
                            <p className="text-white/70 text-lg mb-8">
                                Accédez à des statistiques détaillées sur vos chances d'admission,
                                votre historique et vos performances.
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
                            <BarChart3 className="w-6 h-6 text-purple-300" />
                            <span className="text-purple-200 font-semibold">Statistiques Avancées</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Votre Tableau de Bord
                        </h1>
                        <p className="text-white/60 text-lg">
                            Visualisez vos performances et votre progression
                        </p>
                    </motion.div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                        >
                            <Heart className="w-10 h-10 text-pink-400 mb-3" />
                            <div className="text-3xl font-bold text-white">{stats?.totalFavorites || 0}</div>
                            <div className="text-white/60">Favoris</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                        >
                            <Calculator className="w-10 h-10 text-blue-400 mb-3" />
                            <div className="text-3xl font-bold text-white">{stats?.totalCalculations || 0}</div>
                            <div className="text-white/60">Calculs IA</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                        >
                            <FileText className="w-10 h-10 text-green-400 mb-3" />
                            <div className="text-3xl font-bold text-white">{stats?.totalLetters || 0}</div>
                            <div className="text-white/60">Lettres générées</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 rounded-2xl p-6"
                        >
                            <TrendingUp className="w-10 h-10 text-purple-400 mb-3" />
                            <div className="text-3xl font-bold text-white">{stats?.avgChance || 0}%</div>
                            <div className="text-white/60">Chance moyenne</div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Schools */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Award className="w-6 h-6 text-yellow-400" />
                                Meilleures Chances
                            </h3>

                            {stats?.topSchools && stats.topSchools.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.topSchools.map((school, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{school.name}</div>
                                                <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${school.chance}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-white font-bold">{school.chance}%</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Target className="w-12 h-12 text-white/30 mx-auto mb-3" />
                                    <p className="text-white/60">Utilisez le Calculator IA pour voir vos meilleures chances</p>
                                    <Link href="/calculator" className="inline-block mt-4 text-purple-300 hover:text-purple-200">
                                        Calculer mes chances →
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Activité Récente
                            </h3>

                            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'calculation' ? 'bg-blue-500/20' : 'bg-green-500/20'
                                                }`}>
                                                {activity.type === 'calculation' ? (
                                                    <Calculator className="w-5 h-5 text-blue-400" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-green-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white text-sm">{activity.detail}</div>
                                                <div className="text-white/40 text-xs mt-1">
                                                    {new Date(activity.date).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <GraduationCap className="w-12 h-12 text-white/30 mx-auto mb-3" />
                                    <p className="text-white/60">Aucune activité récente</p>
                                    <p className="text-white/40 text-sm mt-2">Commencez par explorer les écoles</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <Link href="/calculator" className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6 hover:bg-blue-500/30 transition-all group">
                            <Calculator className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-bold">Calculator IA</h4>
                            <p className="text-white/60 text-sm">Calculez vos chances</p>
                        </Link>

                        <Link href="/letter-generator" className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 hover:bg-green-500/30 transition-all group">
                            <FileText className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-bold">Générateur de Lettres</h4>
                            <p className="text-white/60 text-sm">Créez vos lettres</p>
                        </Link>

                        <Link href="/applications" className="bg-purple-500/20 border border-purple-400/30 rounded-2xl p-6 hover:bg-purple-500/30 transition-all group">
                            <Target className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-bold">Suivi Candidatures</h4>
                            <p className="text-white/60 text-sm">Gérez vos candidatures</p>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
