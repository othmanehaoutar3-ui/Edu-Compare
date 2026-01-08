'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

const steps = [
    {
        id: 1,
        title: "Où es-tu actuellement ?",
        description: "Indique ton niveau d'études actuel",
        options: [
            { value: 'terminale', label: 'Terminale' },
            { value: 'bac_1', label: 'Bac+1' },
            { value: 'bac_2', label: 'Bac+2' },
            { value: 'autre', label: 'Autre' },
        ]
    },
    {
        id: 2,
        title: "Quel bac prépares-tu ?",
        description: "Type de baccalauréat",
        options: [
            { value: 'general', label: 'Général' },
            { value: 'techno', label: 'Technologique' },
            { value: 'pro', label: 'Professionnel' },
        ]
    },
    {
        id: 3,
        title: "Quelle est ta moyenne générale ?",
        description: "Indique ta moyenne actuelle",
        type: 'slider'
    },
    {
        id: 4,
        title: "Que veux-tu faire ?",
        description: "Choisis ton domaine d'intérêt",
        options: [
            { value: 'informatique', label: '💻 Informatique' },
            { value: 'commerce', label: '💼 Commerce' },
            { value: 'ingenieur', label: '⚙️ Ingénieur' },
            { value: 'sante', label: '⚕️ Santé' },
            { value: 'art', label: '🎨 Art & Design' },
            { value: 'droit', label: '⚖️ Droit' },
            { value: 'autre', label: '🔍 Autre' },
        ]
    },
    {
        id: 5,
        title: "Où veux-tu étudier ?",
        description: "Zone géographique souhaitée",
        options: [
            { value: 'paris', label: '📍 Paris et Île-de-France' },
            { value: 'lyon', label: '📍 Lyon' },
            { value: 'marseille', label: '📍 Marseille' },
            { value: 'toulouse', label: '📍 Toulouse' },
            { value: 'france', label: '🗺️ Toute la France' },
        ]
    }
]

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string | number>>({})
    const [isCompleting, setIsCompleting] = useState(false)

    const currentStepData = steps[currentStep]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            completeOnboarding()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleAnswer = (value: string | number) => {
        setAnswers(prev => ({ ...prev, [currentStep]: value }))
    }

    const completeOnboarding = async () => {
        setIsCompleting(true)
        // TODO: Envoyer les réponses au backend/Supabase
        // TODO: Exécuter l'IA pour filtrer les formations
        setTimeout(() => {
            window.location.href = '/schools'
        }, 2000)
    }

    const canProceed = answers[currentStep] !== undefined

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`w-full h-2 rounded-full mx-1 transition-all ${idx <= currentStep ? 'bg-purple-400' : 'bg-purple-900/50'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-purple-300 text-sm text-center">
                        Étape {currentStep + 1} sur {steps.length}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Title */}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {currentStepData.title}
                            </h2>
                            <p className="text-purple-200 mb-8">{currentStepData.description}</p>

                            {/* Options or Slider */}
                            {currentStepData.type === 'slider' ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between text-purple-200 text-sm">
                                        <span>0</span>
                                        <span className="text-2xl font-bold text-white">
                                            {answers[currentStep] || 10}/20
                                        </span>
                                        <span>20</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        step="0.5"
                                        value={answers[currentStep] || 10}
                                        onChange={(e) => handleAnswer(parseFloat(e.target.value))}
                                        className="w-full h-3 bg-purple-900/50 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                      [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-purple-300">
                                        <span>Faible</span>
                                        <span>Moyen</span>
                                        <span>Bon</span>
                                        <span>Excellent</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentStepData.options?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(option.value)}
                                            className={`p-6 rounded-2xl border-2 transition-all text-left ${answers[currentStep] === option.value
                                                    ? 'bg-purple-500/30 border-purple-400'
                                                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-semibold text-lg">
                                                    {option.label}
                                                </span>
                                                {answers[currentStep] === option.value && (
                                                    <Check className="w-6 h-6 text-purple-400" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-12">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-full font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canProceed || isCompleting}
                            className="flex-1 bg-white text-purple-900 px-6 py-4 rounded-full font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-all 
                flex items-center justify-center gap-2 group"
                        >
                            {isCompleting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-purple-900/20 border-t-purple-900 rounded-full animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    {currentStep === steps.length - 1 ? 'Voir mes résultats' : 'Suivant'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Skip */}
                <p className="text-purple-300 text-center mt-6 text-sm">
                    Ou{' '}
                    <button className="underline hover:text-white transition-colors">
                        sauter cette étape
                    </button>
                </p>
            </div>
        </div>
    )
}
