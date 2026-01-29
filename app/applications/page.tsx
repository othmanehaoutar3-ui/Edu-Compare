'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'
import { schools } from '@/lib/schools'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    ClipboardList, Plus, Trash2, Edit2, Save, X, Calendar,
    Clock, CheckCircle, XCircle, AlertCircle, Send, Loader2,
    GraduationCap, Lock
} from 'lucide-react'

type Application = {
    id: string
    school_id: number
    school_name: string
    status: 'pending' | 'sent' | 'interview' | 'accepted' | 'rejected' | 'waitlisted'
    notes: string | null
    deadline: string | null
    applied_at: string | null
    created_at: string
}

const STATUS_CONFIG = {
    pending: { label: 'En attente', color: 'bg-gray-500', icon: Clock },
    sent: { label: 'Envoyé', color: 'bg-blue-500', icon: Send },
    interview: { label: 'Entretien', color: 'bg-blue-500', icon: AlertCircle },
    accepted: { label: 'Accepté', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: 'Refusé', color: 'bg-red-500', icon: XCircle },
    waitlisted: { label: 'Liste d\'attente', color: 'bg-yellow-500', icon: Clock },
}

export default function ApplicationsPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(true)
    const [applications, setApplications] = useState<Application[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Form state
    const [selectedSchool, setSelectedSchool] = useState<number | null>(null)
    const [status, setStatus] = useState<Application['status']>('pending')
    const [notes, setNotes] = useState('')
    const [deadline, setDeadline] = useState('')

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
            await fetchApplications()
        }

        setLoading(false)
    }

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/applications')
            const data = await response.json()
            if (data.applications) {
                setApplications(data.applications)
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
        }
    }

    const handleAddApplication = async () => {
        if (!selectedSchool) return

        const school = schools.find(s => s.id === selectedSchool)
        if (!school) return

        setSaving(true)
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school_id: selectedSchool,
                    school_name: school.name,
                    status,
                    notes: notes || null,
                    deadline: deadline || null,
                }),
            })

            if (response.ok) {
                await fetchApplications()
                resetForm()
            }
        } catch (error) {
            console.error('Error adding application:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateApplication = async (id: string) => {
        setSaving(true)
        try {
            const response = await fetch('/api/applications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, notes, deadline }),
            })

            if (response.ok) {
                await fetchApplications()
                setEditingId(null)
            }
        } catch (error) {
            console.error('Error updating application:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteApplication = async (id: string) => {
        if (!confirm('Supprimer cette candidature ?')) return

        try {
            const response = await fetch(`/api/applications?id=${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setApplications(applications.filter(a => a.id !== id))
            }
        } catch (error) {
            console.error('Error deleting application:', error)
        }
    }

    const resetForm = () => {
        setShowAddForm(false)
        setSelectedSchool(null)
        setStatus('pending')
        setNotes('')
        setDeadline('')
    }

    const startEditing = (app: Application) => {
        setEditingId(app.id)
        setStatus(app.status)
        setNotes(app.notes || '')
        setDeadline(app.deadline || '')
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
                                Fonctionnalité Premium
                            </h1>
                            <p className="text-white/70 text-lg mb-8">
                                Le suivi de candidatures est réservé aux membres Premium.
                                Gérez toutes vos candidatures en un seul endroit !
                            </p>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all"
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
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-400/30 px-6 py-3 rounded-full mb-6">
                            <ClipboardList className="w-6 h-6 text-blue-300" />
                            <span className="text-blue-200 font-semibold">Suivi de candidatures</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Mes Candidatures
                        </h1>
                        <p className="text-white/60 text-lg">
                            Suivez l'avancement de toutes vos candidatures
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {Object.entries(STATUS_CONFIG).slice(0, 4).map(([key, config]) => {
                            const count = applications.filter(a => a.status === key).length
                            const Icon = config.icon
                            return (
                                <div key={key} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                                    <Icon className={`w-8 h-8 mx-auto mb-2 ${config.color.replace('bg-', 'text-')}`} />
                                    <div className="text-2xl font-bold text-white">{count}</div>
                                    <div className="text-white/60 text-sm">{config.label}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Add Button */}
                    {!showAddForm && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAddForm(true)}
                            className="w-full bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 rounded-2xl p-6 text-white/70 hover:text-white hover:border-white/50 transition-all flex items-center justify-center gap-3 mb-8"
                        >
                            <Plus className="w-6 h-6" />
                            Ajouter une candidature
                        </motion.button>
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Nouvelle candidature</h3>
                                <button onClick={resetForm} className="text-white/60 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">École</label>
                                    <select
                                        value={selectedSchool || ''}
                                        onChange={(e) => setSelectedSchool(Number(e.target.value))}
                                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl"
                                    >
                                        <option value="">Sélectionner une école</option>
                                        {schools.map((school) => (
                                            <option key={school.id} value={school.id}>
                                                {school.name} - {school.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Statut</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as Application['status'])}
                                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl"
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key}>{config.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Date limite</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Notes</label>
                                    <input
                                        type="text"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Notes personnelles..."
                                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl placeholder-white/40"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddApplication}
                                disabled={!selectedSchool || saving}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                Ajouter
                            </button>
                        </motion.div>
                    )}

                    {/* Applications List */}
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
                                <GraduationCap className="w-16 h-16 text-white/30 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Aucune candidature</h3>
                                <p className="text-white/60">Commencez par ajouter votre première candidature</p>
                            </div>
                        ) : (
                            applications.map((app, index) => {
                                const StatusIcon = STATUS_CONFIG[app.status].icon
                                const isEditing = editingId === app.id

                                return (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl ${STATUS_CONFIG[app.status].color} flex items-center justify-center`}>
                                                    <StatusIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{app.school_name}</h3>
                                                    <div className="flex items-center gap-4 text-white/60 text-sm">
                                                        <span className={`px-2 py-0.5 rounded ${STATUS_CONFIG[app.status].color} text-white text-xs`}>
                                                            {STATUS_CONFIG[app.status].label}
                                                        </span>
                                                        {app.deadline && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(app.deadline).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <select
                                                            value={status}
                                                            onChange={(e) => setStatus(e.target.value as Application['status'])}
                                                            className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm"
                                                        >
                                                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                                <option key={key} value={key}>{config.label}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleUpdateApplication(app.id)}
                                                            disabled={saving}
                                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                                        >
                                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 bg-white/10 text-white/60 rounded-lg hover:bg-white/20"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(app)}
                                                            className="p-2 bg-white/10 text-white/60 rounded-lg hover:bg-white/20 hover:text-white"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteApplication(app.id)}
                                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {app.notes && (
                                            <p className="mt-4 text-white/60 text-sm border-t border-white/10 pt-4">
                                                {app.notes}
                                            </p>
                                        )}
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
