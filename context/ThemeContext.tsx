'use client'

import React, { createContext, useContext, ReactNode } from 'react'

// Academic theme - Professional school colors
export const ACADEMIC_THEME = {
    name: 'academic',
    displayName: 'Académique',
    primary: '#1e40af', // blue-800 - Bleu académique profond
    secondary: '#3b82f6', // blue-500 - Bleu royal
    accent: '#60a5fa', // blue-400 - Bleu ciel
    gold: '#f59e0b', // amber-500 - Or académique
    gradient: 'from-slate-950 via-blue-950 to-indigo-950',
}

export type Theme = typeof ACADEMIC_THEME

type ThemeContextType = {
    currentTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const value: ThemeContextType = {
        currentTheme: ACADEMIC_THEME,
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
