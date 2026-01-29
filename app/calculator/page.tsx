'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Lock, Sparkles, TrendingUp, Award, Calendar, MapPin, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

type CalculatorResult = {
    probability: number
    category: string
    strengths: string[]
    weaknesses: string[]
    insights: string
    recommendations: string[]
    schoolInfo?: {
        name: string
        type: string
        city: string
        sector: string
    }
}

export default function CalculatorPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form state
    const [schoolName, setSchoolName] = useState('')
    const [currentGrade, setCurrentGrade] = useState<number>(12)
    const [average, setAverage] = useState<number>(14)
    const [bacType, setBacType] = useState('Général')
    const [fieldOfStudy, setFieldOfStudy] = useState('')
    const [extracurricular, setExtracurricular] = useState('')

    // Result state
    const [result, setResult] = useState<CalculatorResult | null>(null)
    const [calculating, setCalculating] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

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

        checkUser()
    }, [router])

    const calculateProbability = async () => {
        if (!isPremium) {
            // Show paywall for free users
            return
        }

        if (!schoolName || !fieldOfStudy) {
            alert('Veuillez remplir tous les champs requis')
            return
        }

        setCalculating(true)
        setResult(null)

        try {
            const response = await fetch('/api/calculate-chances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schoolName,
                    average,
                    bacType,
                    fieldOfStudy,
                    extracurriculars: extracurricular
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erreur lors du calcul')
            }

            const data = await response.json()
            setResult(data)
        } catch (error: any) {
            console.error('Error calculating chances:', error)
            alert(error.message || 'Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setCalculating(false)
        }
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
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-400/30 px-6 py-3 rounded-full mb-6">
                            <BarChart3 className="w-6 h-6 text-blue-300" />
                            <span className="text-blue-200 font-semibold">Calculator Premium</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Calculez vos chances d'admission
                        </h1>
                        <p className="text-blue-200 text-lg">
                            Algorithme IA basé sur 10 000+ admissions réelles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Vos informations</h2>

                            <div className="space-y-6">
                                {/* School Name */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        École visée
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="Ex: HEC Paris"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    />
                                </div>

                                {/* Current Grade */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Classe actuelle
                                    </label>
                                    <select
                                        value={currentGrade}
                                        onChange={(e) => setCurrentGrade(Number(e.target.value))}
                                        className="w-full bg-white/10 border border-white/20 text-white 
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    >
                                        <option value={12}>Terminale</option>
                                        <option value={11}>Première</option>
                                        <option value={13}>Bac+1</option>
                                    </select>
                                </div>

                                {/* Average Grade */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Moyenne générale : {average}/20
                                    </label>
                                    <input
                                        type="range"
                                        min="8"
                                        max="20"
                                        step="0.1"
                                        value={average}
                                        onChange={(e) => setAverage(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-blue-300 text-xs mt-1">
                                        <span>8</span>
                                        <span>14</span>
                                        <span>20</span>
                                    </div>
                                </div>

                                {/* Bac Type */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Type de Bac
                                    </label>
                                    <select
                                        value={bacType}
                                        onChange={(e) => setBacType(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 text-white 
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    >
                                        <option value="Général">Général</option>
                                        <option value="Technologique">Technologique</option>
                                        <option value="Professionnel">Professionnel</option>
                                    </select>
                                </div>

                                {/* Field of Study */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Spécialités
                                    </label>
                                    <input
                                        type="text"
                                        value={fieldOfStudy}
                                        onChange={(e) => setFieldOfStudy(e.target.value)}
                                        placeholder="Ex: Maths, Physique"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    />
                                </div>

                                {/* Extracurricular */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Activités extra-scolaires
                                    </label>
                                    <textarea
                                        value={extracurricular}
                                        onChange={(e) => setExtracurricular(e.target.value)}
                                        placeholder="Sports, associations, bénévolat..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                    />
                                </div>

                                {/* Calculate Button */}
                                {isPremium ? (
                                    <button
                                        onClick={calculateProbability}
                                        disabled={calculating || !schoolName}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl 
                      font-bold hover:from-purple-600 hover:to-pink-600 transition-all 
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {calculating ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Calculer mes chances
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href="/pricing"
                                        className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 py-4 rounded-xl 
                      font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all 
                      flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-5 h-5" />
                                        Passer Premium pour débloquer
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Results */}
                        <div>
                            {result ? (
                                <div className="space-y-6">
                                    {/* Probability Card */}
                                    <div className={`bg-gradient-to-br ${result.category.toLowerCase().includes('excellentes') ? 'from-green-500 to-emerald-600' :
                                        result.category.toLowerCase().includes('bonnes') ? 'from-blue-500 to-cyan-600' :
                                            result.category.toLowerCase().includes('moyennes') ? 'from-yellow-500 to-orange-600' :
                                                'from-red-500 to-pink-600'
                                        } rounded-3xl p-8 text-white`}>
                                        <div className="text-center">
                                            <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                                            <div className="text-7xl font-bold mb-2">{result.probability}%</div>
                                            <div className="text-xl font-semibold opacity-90">
                                                Chances d'admission
                                            </div>
                                            {result.schoolInfo && (
                                                <div className="mt-2 text-sm opacity-80">
                                                    {result.schoolInfo.name} · {result.schoolInfo.city}
                                                </div>
                                            )}
                                            <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                                                {result.category}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insights */}
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Sparkles className="w-6 h-6 text-blue-300" />
                                            Analyse IA détaillée
                                        </h3>
                                        <p className="text-blue-100 leading-relaxed">
                                            {result.insights}
                                        </p>
                                    </div>

                                    {/* Strengths */}
                                    {result.strengths.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                <Award className="w-6 h-6 text-green-400" />
                                                Points forts
                                            </h3>
                                            <ul className="space-y-3">
                                                {result.strengths.map((strength, i) => (
                                                    <li key={i} className="text-blue-200 flex items-start gap-3">
                                                        <span className="text-green-400">✓</span>
                                                        <span>{strength}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Weaknesses */}
                                    {result.weaknesses.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-6 h-6 text-yellow-400" />
                                                Points à améliorer
                                            </h3>
                                            <ul className="space-y-3">
                                                {result.weaknesses.map((weakness, i) => (
                                                    <li key={i} className="text-blue-200 flex items-start gap-3">
                                                        <span className="text-yellow-400">→</span>
                                                        <span>{weakness}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <GraduationCap className="w-6 h-6 text-blue-300" />
                                            Recommandations
                                        </h3>
                                        <ul className="space-y-3">
                                            {result.recommendations.map((rec, i) => (
                                                <li key={i} className="text-blue-200 flex items-start gap-3">
                                                    <span className="text-green-400">✓</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
                                    <BarChart3 className="w-24 h-24 text-blue-300 mx-auto mb-6 opacity-50" />
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        Remplissez le formulaire
                                    </h3>
                                    <p className="text-blue-200">
                                        Complétez vos informations pour découvrir vos chances d'admission
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
