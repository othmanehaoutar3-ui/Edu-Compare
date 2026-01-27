'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PLANS = [
    {
        id: 'free',
        name: 'Gratuit',
        price: 0,
        period: '',
        icon: Zap,
        color: 'from-gray-500 to-gray-600',
        subtitle: 'Pour découvrir la plateforme',
        features: [
            'Accès aux 500+ écoles',
            'Recherche et filtres basiques',
            'Fiche détaillée des écoles',
            'Sauvegarde de favoris (max 5)',
            'Support email',
        ],
        limitations: [
            'Calculator IA',
            'Générateur de lettres',
            'Statistiques avancées',
            'Favoris illimités',
        ],
    },
    {
        id: 'premium_monthly',
        name: 'Premium',
        price: 9.99,
        period: '/mois',
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        popular: true,
        subtitle: 'Toutes les fonctionnalités IA',
        features: [
            'Tout du plan Gratuit',
            '🔮 Calculator IA illimité',
            '✍️ Générateur de lettres IA',
            '📊 Statistiques avancées',
            '⭐ Favoris illimités',
            '🎯 Recommandations personnalisées',
            '🚀 Support prioritaire',
            '📈 Suivi de candidatures',
        ],
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly',
    },
    {
        id: 'premium_yearly',
        name: 'Premium Annuel',
        price: 79.99,
        period: '/an',
        icon: Crown,
        color: 'from-yellow-400 to-yellow-600',
        badge: '-33%',
        subtitle: 'Le meilleur rapport qualité-prix',
        features: [
            'Tout du plan Premium',
            '💎 2 mois gratuits',
            '🎁 Accès anticipé aux nouvelles features',
            '🏆 Badge exclusif',
            '📞 Conseil orientation (1h/an)',
        ],
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly',
    },
]

export default function PricingPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processingPlan, setProcessingPlan] = useState<string | null>(null)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        checkUser()
    }, [])

    const handleSubscribe = async (planId: string, priceId?: string) => {
        if (!user) {
            router.push('/login')
            return
        }

        if (planId === 'free') {
            router.push('/dashboard')
            return
        }

        if (!priceId) {
            console.error('No price ID provided')
            return
        }

        setProcessingPlan(planId)

        try {
            // Call the checkout API
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            })

            const { url, error } = await response.json()

            if (error) {
                console.error('Checkout error:', error)
                alert('Erreur lors du paiement. Veuillez réessayer.')
                setProcessingPlan(null)
                return
            }

            // Redirect to Stripe Checkout URL
            if (url) {
                window.location.href = url
            } else {
                alert('Erreur: URL de paiement non disponible.')
            }
        } catch (err) {
            console.error('Error:', err)
            alert('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setProcessingPlan(null)
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
            <div className="container mx-auto px-4 py-16">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-full mb-6">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <span className="text-white/80 font-semibold">Abonnements</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Choisissez votre plan
                    </h1>
                    <p className="text-white/60 text-xl">
                        Démarrez gratuitement, passez Premium quand vous êtes prêt
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white/10 backdrop-blur-md border ${plan.popular ? 'border-purple-400 border-2' : 'border-white/20'
                                    } rounded-3xl p-8 ${plan.popular ? 'transform scale-105' : ''} flex flex-col h-full`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                            Le plus populaire
                                        </span>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {plan.badge && (
                                    <div className="absolute -top-4 -right-4">
                                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Header with Plan Name */}
                                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${plan.color} p-6 mb-5`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Plan</p>
                                            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm mb-5 italic">{plan.subtitle}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-5xl font-bold text-white">{plan.price}€</span>
                                    <span className="text-purple-200">{plan.period}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-purple-200">
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.limitations?.map((limitation, i) => (
                                        <li key={i} className="flex items-start gap-3 text-purple-300 opacity-50 line-through">
                                            <span className="w-5 h-5 flex-shrink-0">✗</span>
                                            <span>{limitation}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleSubscribe(plan.id, plan.priceId)}
                                    disabled={processingPlan === plan.id}
                                    className={`w-full py-4 rounded-xl font-bold transition-all mt-auto flex items-center justify-center gap-2 ${plan.popular
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        } ${processingPlan === plan.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processingPlan === plan.id ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Chargement...
                                        </>
                                    ) : (
                                        plan.id === 'free' ? 'Continuer gratuitement' : 'Passer Premium'
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-24">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Questions fréquentes
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Puis-je annuler à tout moment ?',
                                a: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Pas de frais cachés.',
                            },
                            {
                                q: 'Le Calculator IA est-il vraiment fiable ?',
                                a: 'Notre algorithme est entraîné sur 10 000+ admissions réelles et prend en compte de nombreux critères pour vous donner une estimation précise.',
                            },
                            {
                                q: 'Puis-je changer de plan plus tard ?',
                                a: 'Absolument ! Vous pouvez passer du mensuel à l\'annuel (et économiser 33%) directement depuis vos paramètres.',
                            },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                                <p className="text-purple-200">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
