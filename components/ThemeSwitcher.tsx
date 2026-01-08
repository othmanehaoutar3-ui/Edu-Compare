'use client'

import { useState } from 'react'
import { Palette } from 'lucide-react'
import { useTheme, themes, ThemeName } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeSwitcher() {
    const { currentTheme, setTheme, themeName } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                aria-label="Change theme"
            >
                <Palette className="w-5 h-5 text-white" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Theme Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            <div className="p-4">
                                <h3 className="text-white font-bold text-sm mb-3">Changer le thème</h3>
                                <div className="space-y-2">
                                    {Object.entries(themes).map(([key, theme]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setTheme(key as ThemeName)
                                                setIsOpen(false)
                                            }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${themeName === key
                                                    ? 'bg-white/20 border border-white/30'
                                                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            {/* Color Preview */}
                                            <div className="flex gap-1">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: theme.primary }}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: theme.secondary }}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: theme.accent }}
                                                />
                                            </div>

                                            {/* Theme Info */}
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{theme.emoji}</span>
                                                    <span className="text-white text-sm font-medium">
                                                        {theme.displayName}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Active Indicator */}
                                            {themeName === key && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
