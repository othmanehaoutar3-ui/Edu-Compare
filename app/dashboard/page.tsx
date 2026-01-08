'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { GraduationCap, Heart, TrendingUp, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
            } else {
                setUser(user)
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-white">
                            Anti-Parcoursup
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-purple-200">
                                {user?.user_metadata?.full_name || user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Tableau de bord
                </h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

                {/* Actions */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
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
                            href="/calculator"
                            className="bg-purple-500/20 border border-purple-400/30 text-white p-6 rounded-xl hover:bg-purple-500/30 transition-all"
                        >
                            <h3 className="font-semibold mb-2">🔮 Calculator Premium</h3>
                            <p className="text-purple-200 text-sm">Calculez vos chances d'admission</p>
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
            </div>
        </div>
    )
}
