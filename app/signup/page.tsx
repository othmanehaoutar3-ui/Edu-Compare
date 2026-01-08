'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Redirect to onboarding
            router.push('/onboarding')
        }
    }

    const handleGoogleSignup = async () => {
        setLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-white">
                        Anti-Parcoursup
                    </Link>
                    <p className="text-purple-200 mt-2">Créez votre compte gratuitement</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jean Dupont"
                                    required
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                    pl-12 pr-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    required
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                    pl-12 pr-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                    pl-12 pr-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all"
                                />
                            </div>
                            <p className="text-purple-300 text-xs mt-2">Minimum 6 caractères</p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-purple-900 py-4 rounded-xl font-semibold 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 
                transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-purple-900/20 border-t-purple-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    Créer mon compte
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-purple-900/50 px-4 text-purple-200">Ou continuer avec</span>
                        </div>
                    </div>

                    {/* Google Signup */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-xl 
              font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                    >
                        <Chrome className="w-5 h-5" />
                        Google
                    </button>

                    {/* Login Link */}
                    <p className="text-purple-200 text-center mt-6 text-sm">
                        Déjà un compte ?{' '}
                        <Link href="/login" className="text-white font-semibold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
