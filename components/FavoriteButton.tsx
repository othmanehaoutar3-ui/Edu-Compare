'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FavoriteButtonProps {
    schoolId: number
    initialIsFavorite?: boolean
}

export default function FavoriteButton({ schoolId, initialIsFavorite = false }: FavoriteButtonProps) {
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const [showUpgradeToast, setShowUpgradeToast] = useState(false)

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsLoading(true)

        try {
            if (isFavorite) {
                // Remove from favorites
                const response = await fetch('/api/favorites/remove', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schoolId }),
                })

                if (response.ok) {
                    setIsFavorite(false)
                } else {
                    const error = await response.json()
                    console.error('Error removing favorite:', error)
                }
            } else {
                // Add to favorites
                const response = await fetch('/api/favorites/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schoolId }),
                })

                if (response.ok) {
                    setIsFavorite(true)
                } else {
                    const error = await response.json()

                    // Check if limit reached
                    if (error.error === 'Favorites limit reached') {
                        setShowUpgradeToast(true)
                        setTimeout(() => setShowUpgradeToast(false), 5000)
                    } else if (error.error !== 'Already in favorites') {
                        console.error('Error adding favorite:', error)
                    }
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpgradeClick = () => {
        setShowUpgradeToast(false)
        router.push('/pricing')
    }

    return (
        <>
            <motion.button
                onClick={toggleFavorite}
                disabled={isLoading}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className={`p-2 rounded-full transition-all ${isFavorite
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Heart
                    className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`}
                />
            </motion.button>

            {/* Upgrade Toast */}
            <AnimatePresence>
                {showUpgradeToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md"
                    >
                        <Crown className="w-8 h-8 text-yellow-300 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-bold">Limite de 5 favoris atteinte !</p>
                            <p className="text-white/80 text-sm">Passez Premium pour des favoris illimités</p>
                        </div>
                        <button
                            onClick={handleUpgradeClick}
                            className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-all text-sm whitespace-nowrap"
                        >
                            Upgrade
                        </button>
                        <button
                            onClick={() => setShowUpgradeToast(false)}
                            className="text-white/60 hover:text-white p-1"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
