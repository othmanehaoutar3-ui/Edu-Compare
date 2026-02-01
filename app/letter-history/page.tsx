'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { History, FileText, Copy, Check, Download, Trash2, Eye, ChevronDown, ArrowLeft, Sparkles, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

interface Letter {
    id: string
    school_name: string
    program: string
    letter_content: string
    created_at: string
}

export default function LetterHistoryPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)
    const [letters, setLetters] = useState<Letter[]>([])
    const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
    const [copied, setCopied] = useState(false)
    const [showExportDropdown, setShowExportDropdown] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Check premium status
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('subscription_status')
                .eq('id', user.id)
                .single()

            setIsPremium(profile?.subscription_status === 'premium')

            // Load letter history
            const { data: letterHistory } = await supabase
                .from('letter_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            setLetters(letterHistory || [])
            setLoading(false)
        }

        loadData()
    }, [router])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const copyToClipboard = () => {
        if (!selectedLetter) return
        navigator.clipboard.writeText(selectedLetter.letter_content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const deleteLetter = async (id: string) => {
        setDeleting(id)
        const supabase = createClient()

        await supabase
            .from('letter_history')
            .delete()
            .eq('id', id)

        setLetters(letters.filter(l => l.id !== id))
        if (selectedLetter?.id === id) {
            setSelectedLetter(null)
        }
        setDeleting(null)
    }

    const downloadAsTxt = () => {
        if (!selectedLetter) return
        const blob = new Blob([selectedLetter.letter_content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lettre-motivation-${selectedLetter.school_name.replace(/\s/g, '-')}.txt`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportDropdown(false)
    }

    const downloadAsPdf = async () => {
        if (!selectedLetter) return
        const jsPDF = (await import('jspdf')).default
        const pdf = new jsPDF()
        const pageWidth = pdf.internal.pageSize.getWidth()
        const margin = 20
        const maxWidth = pageWidth - margin * 2

        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Lettre de Motivation', pageWidth / 2, 20, { align: 'center' })

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(selectedLetter.school_name, pageWidth / 2, 30, { align: 'center' })

        pdf.setFontSize(10)
        pdf.setTextColor(100)
        const date = new Date(selectedLetter.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        pdf.text(date, pageWidth - margin, 45, { align: 'right' })

        pdf.setTextColor(0)
        pdf.setFontSize(11)
        const lines = pdf.splitTextToSize(selectedLetter.letter_content, maxWidth)
        let y = 60

        lines.forEach((line: string) => {
            if (y > 270) {
                pdf.addPage()
                y = 20
            }
            pdf.text(line, margin, y)
            y += 6
        })

        pdf.save(`lettre-motivation-${selectedLetter.school_name.replace(/\s/g, '-')}.pdf`)
        setShowExportDropdown(false)
    }

    const downloadAsDocx = async () => {
        if (!selectedLetter) return
        const { Document, Packer, Paragraph, TextRun } = await import('docx')

        const paragraphs = selectedLetter.letter_content.split('\n\n').map(para =>
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
                                    text: selectedLetter.school_name,
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
        a.download = `lettre-motivation-${selectedLetter.school_name.replace(/\s/g, '-')}.docx`
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
                        <div className="flex items-center gap-4">
                            <Link
                                href="/letter-generator"
                                className="text-blue-200 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <Link href="/dashboard" className="text-2xl font-bold text-white">
                                Sup Advisor
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/letter-generator"
                                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                            >
                                <Wand2 className="w-5 h-5" />
                                <span className="hidden sm:inline">Nouvelle lettre</span>
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
                            <History className="w-6 h-6 text-blue-300" />
                            <span className="text-blue-200 font-semibold">Historique des lettres</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Vos lettres générées
                        </h1>
                        <p className="text-blue-200 text-lg">
                            Retrouvez et gérez toutes vos lettres de motivation
                        </p>
                    </div>

                    {letters.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
                            <FileText className="w-24 h-24 text-blue-300 mx-auto mb-6 opacity-50" />
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Aucune lettre générée
                            </h3>
                            <p className="text-blue-200 mb-6">
                                Vous n'avez pas encore généré de lettres de motivation.
                            </p>
                            <Link
                                href="/letter-generator"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                                <Wand2 className="w-5 h-5" />
                                Créer ma première lettre
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Letter List */}
                            <div className="lg:col-span-1 space-y-4">
                                <h2 className="text-xl font-bold text-white mb-4">
                                    {letters.length} lettre{letters.length > 1 ? 's' : ''}
                                </h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {letters.map((letter) => (
                                        <button
                                            key={letter.id}
                                            onClick={() => setSelectedLetter(letter)}
                                            className={`w-full text-left p-4 rounded-xl transition-all ${selectedLetter?.id === letter.id
                                                    ? 'bg-blue-500/30 border-2 border-blue-400'
                                                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {letter.school_name}
                                                    </h3>
                                                    <p className="text-sm text-blue-300 truncate">
                                                        {letter.program || 'Programme non spécifié'}
                                                    </p>
                                                    <p className="text-xs text-blue-400 mt-1">
                                                        {formatDate(letter.created_at)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteLetter(letter.id)
                                                    }}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    disabled={deleting === letter.id}
                                                >
                                                    {deleting === letter.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Letter Detail */}
                            <div className="lg:col-span-2">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sticky top-8">
                                    {selectedLetter ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {selectedLetter.school_name}
                                                    </h2>
                                                    <p className="text-blue-300">
                                                        {selectedLetter.program || 'Programme non spécifié'}
                                                    </p>
                                                    <p className="text-sm text-blue-400 mt-1">
                                                        Générée le {formatDate(selectedLetter.created_at)}
                                                    </p>
                                                </div>
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

                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                                                <p className="text-blue-100 whitespace-pre-wrap leading-relaxed">
                                                    {selectedLetter.letter_content}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Eye className="w-24 h-24 text-blue-300 mb-6 opacity-50" />
                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                Sélectionnez une lettre
                                            </h3>
                                            <p className="text-blue-200 text-center max-w-md">
                                                Cliquez sur une lettre dans la liste pour voir son contenu
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
