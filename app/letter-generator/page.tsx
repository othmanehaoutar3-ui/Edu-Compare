'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wand2, Download, Copy, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

export default function LetterGeneratorPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form state
    const [schoolName, setSchoolName] = useState('')
    const [program, setProgram] = useState('')
    const [motivation, setMotivation] = useState('')
    const [strengths, setStrengths] = useState('')
    const [experience, setExperience] = useState('')

    // Generation state
    const [letter, setLetter] = useState('')
    const [generating, setGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

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

    const generateLetter = async () => {
        if (!isPremium) {
            return
        }

        setGenerating(true)

        try {
            const response = await fetch('/api/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    schoolName,
                    program,
                    motivation,
                    strengths,
                    experience,
                }),
            })

            const data = await response.json()
            setLetter(data.letter)
        } catch (error) {
            console.error('Error generating letter:', error)
        } finally {
            setGenerating(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(letter)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadLetter = () => {
        const blob = new Blob([letter], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lettre-motivation-${schoolName.replace(/\s/g, '-')}.txt`
        a.click()
    }

    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient}`}>
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="text-2xl font-bold text-white">
                            Anti-Parcoursup
                        </Link>
                        {isPremium && (
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Premium
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-purple-500/20 border border-purple-400/30 px-6 py-3 rounded-full mb-6">
                            <Wand2 className="w-6 h-6 text-purple-300" />
                            <span className="text-purple-200 font-semibold">IA Letter Generator</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Générez votre lettre de motivation
                        </h1>
                        <p className="text-purple-200 text-lg">
                            Lettre personnalisée et professionnelle en 30 secondes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Informations</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                                        École / Formation
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="Ex: HEC Paris - Programme Grande École"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                      px-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                                        Domaine d'études
                                    </label>
                                    <input
                                        type="text"
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}
                                        placeholder="Ex: Management, Finance, Marketing"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                      px-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                                        Pourquoi cette école ?
                                    </label>
                                    <textarea
                                        value={motivation}
                                        onChange={(e) => setMotivation(e.target.value)}
                                        placeholder="Expliquez ce qui vous attire dans cette école..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                      px-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                                        Vos points forts
                                    </label>
                                    <textarea
                                        value={strengths}
                                        onChange={(e) => setStrengths(e.target.value)}
                                        placeholder="Compétences, qualités, réussites..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                      px-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                                        Expérience pertinente
                                    </label>
                                    <textarea
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="Stages, projets, associations..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-300 
                      px-4 py-3 rounded-xl outline-none focus:border-purple-400 transition-all resize-none"
                                    />
                                </div>

                                {isPremium ? (
                                    <button
                                        onClick={generateLetter}
                                        disabled={generating || !schoolName || !motivation}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl 
                      font-bold hover:from-purple-600 hover:to-pink-600 transition-all 
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {generating ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Wand2 className="w-5 h-5" />
                                                Générer ma lettre
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href="/pricing"
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 py-4 rounded-xl 
                      font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all 
                      flex items-center justify-center gap-2"
                                    >
                                        🔒 Passer Premium pour débloquer
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Result */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            {letter ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-white">Votre lettre</h2>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={copyToClipboard}
                                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all"
                                                title="Copier"
                                            >
                                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={downloadLetter}
                                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all"
                                                title="Télécharger"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[600px] overflow-y-auto">
                                        <p className="text-purple-100 whitespace-pre-wrap leading-relaxed">
                                            {letter}
                                        </p>
                                    </div>

                                    <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                                        <p className="text-purple-200 text-sm">
                                            💡 <strong>Conseil :</strong> Personnalisez davantage cette lettre avec vos propres mots et anecdotes !
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-12">
                                    <Wand2 className="w-24 h-24 text-purple-300 mb-6 opacity-50" />
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        Créez votre lettre magique
                                    </h3>
                                    <p className="text-purple-200 text-center max-w-md">
                                        Remplissez les informations à gauche et cliquez sur "Générer" pour obtenir votre lettre personnalisée
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
