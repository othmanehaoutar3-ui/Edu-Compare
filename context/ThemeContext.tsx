'use client'

import React, { createContext, useContext, ReactNode } from 'react'

// Single premium theme - modern purple gradient
export const PREMIUM_THEME = {
    name: 'premium',
    displayName: 'Premium',
    primary: '#8b5cf6', // violet-500
    secondary: '#a855f7', // purple-500
    accent: '#c084fc', // purple-400
    gradient: 'from-slate-950 via-purple-950 to-indigo-950',
}

export type Theme = typeof PREMIUM_THEME

type ThemeContextType = {
    currentTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const value: ThemeContextType = {
        currentTheme: PREMIUM_THEME,
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
