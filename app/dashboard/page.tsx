'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
    GraduationCap, Heart, TrendingUp, LogOut, Crown, Sparkles,
    BarChart3, ClipboardList, Target, FileText, Calculator, Mail, Headphones
} from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

export default function DashboardPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<User | null>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
            } else {
                setUser(user)

                // Check premium status
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('subscription_status')
                    .eq('id', user.id)
                    .single()

                setIsPremium(profile?.subscription_status === 'premium')
                setLoading(false)
            }
        }

        checkUser()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
            {/* Main */}
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-white">
                                Tableau de bord
                            </h1>
                            {isPremium && (
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <Crown className="w-4 h-4" />
                                    Premium
                                </span>
                            )}
                        </div>
                        <p className="text-white/60">
                            Bienvenue, {user?.user_metadata?.full_name || user?.email?.split('@')[0]} !
                        </p>
                    </div>
                    {!isPremium && (
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Passer Premium
                        </Link>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                        <Heart className="w-12 h-12 text-pink-400 mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-2">0</h3>
                        <p className="text-purple-200">Écoles favorites</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                        <GraduationCap className="w-12 h-12 text-purple-300 mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-2">0</h3>
                        <p className="text-purple-200">Formations suivies</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                        <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-2">--</h3>
                        <p className="text-purple-200">Chances moyennes</p>
                    </div>
                </div>

                {/* Premium Features */}
                {isPremium && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Crown className="w-6 h-6 text-yellow-400" />
                            Fonctionnalités Premium
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/calculator"
                                className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group"
                            >
                                <Calculator className="w-10 h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold mb-1">Calculator IA</h3>
                                <p className="text-purple-200 text-sm">Calculez vos chances</p>
                            </Link>

                            <Link
                                href="/letter-generator"
                                className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group"
                            >
                                <FileText className="w-10 h-10 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold mb-1">Générateur de Lettres</h3>
                                <p className="text-purple-200 text-sm">Créez vos lettres IA</p>
                            </Link>

                            <Link
                                href="/statistics"
                                className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group"
                            >
                                <BarChart3 className="w-10 h-10 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold mb-1">Statistiques</h3>
                                <p className="text-purple-200 text-sm">Visualisez vos données</p>
                            </Link>

                            <Link
                                href="/applications"
                                className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group"
                            >
                                <ClipboardList className="w-10 h-10 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold mb-1">Suivi Candidatures</h3>
                                <p className="text-purple-200 text-sm">Gérez vos candidatures</p>
                            </Link>

                            <Link
                                href="/recommendations"
                                className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group"
                            >
                                <Target className="w-10 h-10 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold mb-1">Recommandations IA</h3>
                                <p className="text-purple-200 text-sm">Écoles personnalisées</p>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/onboarding"
                            className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all"
                        >
                            <h3 className="font-semibold mb-2">Compléter mon profil</h3>
                            <p className="text-purple-200 text-sm">5 minutes • Requis pour l'IA</p>
                        </Link>

                        <Link
                            href="/schools"
                            className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all"
                        >
                            <h3 className="font-semibold mb-2">Explorer les écoles</h3>
                            <p className="text-purple-200 text-sm">500+ formations disponibles</p>
                        </Link>

                        <Link
                            href="/favorites"
                            className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all"
                        >
                            <h3 className="font-semibold mb-2">Mes favoris</h3>
                            <p className="text-purple-200 text-sm">{isPremium ? 'Illimité' : 'Max 5 écoles'}</p>
                        </Link>

                        <Link
                            href="/settings"
                            className="bg-white/10 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all"
                        >
                            <h3 className="font-semibold mb-2">Paramètres</h3>
                            <p className="text-purple-200 text-sm">Gérer votre compte</p>
                        </Link>
                    </div>
                </div>

                {/* Premium Support Section */}
                {isPremium && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Headphones className="w-6 h-6 text-green-400" />
                            Support Prioritaire
                        </h2>
                        <p className="text-white/70 mb-6">
                            En tant que membre Premium, vous bénéficiez d'un support prioritaire.
                            Notre équipe répond à vos questions sous 24h.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="mailto:premium-support@supadvisor.fr"
                                className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-white px-6 py-3 rounded-xl hover:bg-green-500/30 transition-all"
                            >
                                <Mail className="w-5 h-5" />
                                premium-support@supadvisor.fr
                            </a>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Temps de réponse moyen : 4h
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

