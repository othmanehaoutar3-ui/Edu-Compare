'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface FavoriteButtonProps {
    schoolId: number
    initialIsFavorite?: boolean
}

export default function FavoriteButton({ schoolId, initialIsFavorite = false }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)

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
                    if (error.error !== 'Already in favorites') {
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

    return (
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
    )
}
