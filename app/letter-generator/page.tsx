'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Wand2, Download, Copy, Check, Sparkles, FileText, Eye, History, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

// Template options for user selection
const TEMPLATE_OPTIONS = [
    {
        id: 'default',
        name: 'Standard',
        description: 'Ton professionnel et motivé, adapté à toutes les formations',
        tone: 'professionnel et motivé',
    },
    {
        id: 'universite',
        name: 'Université',
        description: 'Ton académique et rigoureux, axé sur la recherche',
        tone: 'académique et rigoureux',
    },
    {
        id: 'grande-ecole',
        name: 'Grande École',
        description: 'Ton ambitieux et professionnel, axé sur le leadership',
        tone: 'professionnel et ambitieux',
    },
    {
        id: 'iut',
        name: 'IUT / BTS',
        description: 'Ton pratique et concret, axé sur les compétences techniques',
        tone: 'pratique et concret',
    },
    {
        id: 'cpge',
        name: 'Prépa (CPGE)',
        description: 'Ton sérieux et déterminé, axé sur la rigueur intellectuelle',
        tone: 'sérieux et motivé',
    },
]

function LetterGeneratorContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { currentTheme } = useTheme()
    const [, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form state
    const [schoolName, setSchoolName] = useState('')
    const [program, setProgram] = useState('')
    const [motivation, setMotivation] = useState('')
    const [strengths, setStrengths] = useState('')
    const [experience, setExperience] = useState('')
    const [anecdote, setAnecdote] = useState('')
    const [challenge, setChallenge] = useState('')
    const [uniqueTrait, setUniqueTrait] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('default')
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

    // Generation state
    const [letter, setLetter] = useState('')
    const [generating, setGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

    // Preview state
    const [showPreview, setShowPreview] = useState(false)
    const [previewData, setPreviewData] = useState<any>(null)

    // Export dropdown
    const [showExportDropdown, setShowExportDropdown] = useState(false)

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

            // Pre-fill school name from URL params
            const schoolParam = searchParams.get('school')
            if (schoolParam) {
                setSchoolName(decodeURIComponent(schoolParam))
            }
        }

        checkUser()
    }, [router, searchParams])

    const getSelectedTemplateInfo = () => {
        return TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate) || TEMPLATE_OPTIONS[0]
    }

    const handlePreview = () => {
        setPreviewData({
            schoolName,
            program,
            motivation,
            strengths,
            experience,
            anecdote,
            challenge,
            uniqueTrait,
            template: getSelectedTemplateInfo(),
        })
        setShowPreview(true)
    }

    const generateLetter = async () => {
        if (!isPremium) {
            return
        }

        setGenerating(true)
        setShowPreview(false)

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
                    anecdote,
                    challenge,
                    uniqueTrait,
                    schoolType: selectedTemplate,
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

    const downloadAsTxt = () => {
        const blob = new Blob([letter], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lettre-motivation-${schoolName.replace(/\s/g, '-')}.txt`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportDropdown(false)
    }

    const downloadAsPdf = async () => {
        const jsPDF = (await import('jspdf')).default
        const pdf = new jsPDF()
        const pageWidth = pdf.internal.pageSize.getWidth()
        const margin = 20
        const maxWidth = pageWidth - margin * 2

        // Title
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Lettre de Motivation', pageWidth / 2, 20, { align: 'center' })

        // School name
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(schoolName, pageWidth / 2, 30, { align: 'center' })

        // Date
        pdf.setFontSize(10)
        pdf.setTextColor(100)
        const date = new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        pdf.text(date, pageWidth - margin, 45, { align: 'right' })

        // Letter content
        pdf.setTextColor(0)
        pdf.setFontSize(11)
        const lines = pdf.splitTextToSize(letter, maxWidth)
        let y = 60

        lines.forEach((line: string) => {
            if (y > 270) {
                pdf.addPage()
                y = 20
            }
            pdf.text(line, margin, y)
            y += 6
        })

        pdf.save(`lettre-motivation-${schoolName.replace(/\s/g, '-')}.pdf`)
        setShowExportDropdown(false)
    }

    const downloadAsDocx = async () => {
        const { Document, Packer, Paragraph, TextRun } = await import('docx')

        const paragraphs = letter.split('\n\n').map(para =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: para,
                        size: 24,
                    }),
                ],
                spacing: { after: 200 },
            })
        )

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Lettre de Motivation',
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: schoolName,
                                    size: 28,
                                }),
                            ],
                            spacing: { after: 400 },
                        }),
                        ...paragraphs,
                    ],
                },
            ],
        })

        const blob = await Packer.toBlob(doc)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lettre-motivation-${schoolName.replace(/\s/g, '-')}.docx`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportDropdown(false)
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
                            Sup Advisor
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/letter-history"
                                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                            >
                                <History className="w-5 h-5" />
                                <span className="hidden sm:inline">Historique</span>
                            </Link>
                            {isPremium && (
                                <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-400/30 px-6 py-3 rounded-full mb-6">
                            <Wand2 className="w-6 h-6 text-blue-300" />
                            <span className="text-blue-200 font-semibold">IA Letter Generator</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Générez votre lettre de motivation
                        </h1>
                        <p className="text-blue-200 text-lg">
                            Lettre personnalisée et professionnelle en 30 secondes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Informations</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        École / Formation
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="Ex: HEC Paris - Programme Grande École"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Domaine d'études
                                    </label>
                                    <input
                                        type="text"
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}
                                        placeholder="Ex: Management, Finance, Marketing"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all"
                                    />
                                </div>

                                {/* Template Selector */}
                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Type de lettre
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                                            className="w-full bg-white/10 border border-white/20 text-white
                        px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all
                        flex items-center justify-between"
                                        >
                                            <div className="text-left">
                                                <div className="font-medium">{getSelectedTemplateInfo().name}</div>
                                                <div className="text-sm text-blue-300">{getSelectedTemplateInfo().description}</div>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showTemplateDropdown && (
                                            <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl overflow-hidden shadow-xl">
                                                {TEMPLATE_OPTIONS.map((template) => (
                                                    <button
                                                        key={template.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedTemplate(template.id)
                                                            setShowTemplateDropdown(false)
                                                        }}
                                                        className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors
                              ${selectedTemplate === template.id ? 'bg-blue-500/20 border-l-4 border-blue-400' : ''}`}
                                                    >
                                                        <div className="font-medium text-white">{template.name}</div>
                                                        <div className="text-sm text-blue-300">{template.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Pourquoi cette école ?
                                    </label>
                                    <textarea
                                        value={motivation}
                                        onChange={(e) => setMotivation(e.target.value)}
                                        placeholder="Expliquez ce qui vous attire dans cette école..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Vos points forts
                                    </label>
                                    <textarea
                                        value={strengths}
                                        onChange={(e) => setStrengths(e.target.value)}
                                        placeholder="Compétences, qualités, réussites..."
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                                        Expérience pertinente
                                    </label>
                                    <textarea
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="Stages, projets, associations..."
                                        rows={2}
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                      px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                    />
                                </div>

                                {/* Section personnalisation - pour lettres uniques */}
                                <div className="border-t border-white/10 pt-6 mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                        Rendez votre lettre unique
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-blue-200 text-sm font-semibold mb-2">
                                                Votre moment déclic
                                            </label>
                                            <textarea
                                                value={anecdote}
                                                onChange={(e) => setAnecdote(e.target.value)}
                                                placeholder="Racontez le moment précis où vous avez su que ce domaine était fait pour vous..."
                                                rows={2}
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                          px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-200 text-sm font-semibold mb-2">
                                                Un défi que vous avez surmonté
                                            </label>
                                            <textarea
                                                value={challenge}
                                                onChange={(e) => setChallenge(e.target.value)}
                                                placeholder="Une difficulté, un échec transformé en apprentissage..."
                                                rows={2}
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                          px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-200 text-sm font-semibold mb-2">
                                                Ce qui vous rend unique
                                            </label>
                                            <textarea
                                                value={uniqueTrait}
                                                onChange={(e) => setUniqueTrait(e.target.value)}
                                                placeholder="Une passion originale, un talent caché, une perspective différente..."
                                                rows={2}
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300
                          px-4 py-3 rounded-xl outline-none focus:border-blue-400 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isPremium ? (
                                    <div className="flex gap-3">
                                        {/* Preview Button */}
                                        <button
                                            onClick={handlePreview}
                                            disabled={!schoolName || !motivation}
                                            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-4 rounded-xl
                        font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-5 h-5" />
                                            Prévisualiser
                                        </button>

                                        {/* Generate Button */}
                                        <button
                                            onClick={generateLetter}
                                            disabled={generating || !schoolName || !motivation}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl
                        font-bold hover:from-purple-600 hover:to-pink-600 transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {generating ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Wand2 className="w-5 h-5" />
                                                    Générer
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/pricing"
                                        className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 py-4 rounded-xl
                      font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all
                      flex items-center justify-center gap-2"
                                    >
                                        Passer Premium pour débloquer
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Result / Preview */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                            {/* Preview Mode */}
                            {showPreview && previewData && !letter && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Eye className="w-6 h-6" />
                                            Prévisualisation
                                        </h2>
                                        <button
                                            onClick={() => setShowPreview(false)}
                                            className="text-blue-300 hover:text-white transition-colors"
                                        >
                                            Fermer
                                        </button>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                        <div>
                                            <span className="text-blue-300 text-sm">École / Formation</span>
                                            <p className="text-white font-medium">{previewData.schoolName}</p>
                                        </div>
                                        <div>
                                            <span className="text-blue-300 text-sm">Domaine</span>
                                            <p className="text-white font-medium">{previewData.program || 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <span className="text-blue-300 text-sm">Type de lettre</span>
                                            <p className="text-white font-medium">{previewData.template.name}</p>
                                            <p className="text-blue-200 text-sm">Ton : {previewData.template.tone}</p>
                                        </div>
                                        <div>
                                            <span className="text-blue-300 text-sm">Motivation</span>
                                            <p className="text-white">{previewData.motivation}</p>
                                        </div>
                                        {previewData.strengths && (
                                            <div>
                                                <span className="text-blue-300 text-sm">Points forts</span>
                                                <p className="text-white">{previewData.strengths}</p>
                                            </div>
                                        )}
                                        {previewData.experience && (
                                            <div>
                                                <span className="text-blue-300 text-sm">Expérience</span>
                                                <p className="text-white">{previewData.experience}</p>
                                            </div>
                                        )}
                                        {previewData.anecdote && (
                                            <div>
                                                <span className="text-blue-300 text-sm">Moment déclic</span>
                                                <p className="text-white">{previewData.anecdote}</p>
                                            </div>
                                        )}
                                        {previewData.challenge && (
                                            <div>
                                                <span className="text-blue-300 text-sm">Défi surmonté</span>
                                                <p className="text-white">{previewData.challenge}</p>
                                            </div>
                                        )}
                                        {previewData.uniqueTrait && (
                                            <div>
                                                <span className="text-blue-300 text-sm">Ce qui vous rend unique</span>
                                                <p className="text-white">{previewData.uniqueTrait}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4">
                                        <p className="text-amber-200 text-sm">
                                            <strong>Prêt à générer ?</strong> Vérifiez vos informations ci-dessus, puis cliquez sur "Générer" pour créer votre lettre.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Letter Result */}
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

                                            {/* Export Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all flex items-center gap-1"
                                                    title="Télécharger"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>

                                                {showExportDropdown && (
                                                    <div className="absolute right-0 z-10 mt-2 bg-slate-800 border border-white/20 rounded-xl overflow-hidden shadow-xl min-w-[160px]">
                                                        <button
                                                            onClick={downloadAsTxt}
                                                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white flex items-center gap-3"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            Texte (.txt)
                                                        </button>
                                                        <button
                                                            onClick={downloadAsPdf}
                                                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white flex items-center gap-3"
                                                        >
                                                            <FileText className="w-4 h-4 text-red-400" />
                                                            PDF (.pdf)
                                                        </button>
                                                        <button
                                                            onClick={downloadAsDocx}
                                                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white flex items-center gap-3"
                                                        >
                                                            <FileText className="w-4 h-4 text-blue-400" />
                                                            Word (.docx)
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[600px] overflow-y-auto">
                                        <p className="text-blue-100 whitespace-pre-wrap leading-relaxed">
                                            {letter}
                                        </p>
                                    </div>

                                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                                        <p className="text-blue-200 text-sm">
                                            <strong>Conseil :</strong> Personnalisez davantage cette lettre avec vos propres mots et anecdotes !
                                        </p>
                                    </div>
                                </div>
                            ) : !showPreview && (
                                <div className="flex flex-col items-center justify-center h-full py-12">
                                    <Wand2 className="w-24 h-24 text-blue-300 mb-6 opacity-50" />
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        Créez votre lettre magique
                                    </h3>
                                    <p className="text-blue-200 text-center max-w-md">
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

export default function LetterGeneratorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <LetterGeneratorContent />
        </Suspense>
    )
}
