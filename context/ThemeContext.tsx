'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ThemeName = 'electric' | 'purple' | 'emerald' | 'sunset' | 'monochrome'

export type Theme = {
    name: ThemeName
    displayName: string
    primary: string
    secondary: string
    accent: string
    gradient: string
    emoji: string
}

export const themes: Record<ThemeName, Theme> = {
    electric: {
        name: 'electric',
        displayName: 'Electric Blue',
        primary: '#06b6d4', // cyan-500
        secondary: '#0ea5e9', // sky-500
        accent: '#2dd4bf', // teal-400
        gradient: 'from-slate-900 via-blue-900 to-cyan-900',
        emoji: '⚡'
    },
    purple: {
        name: 'purple',
        displayName: 'Purple Galaxy',
        primary: '#a855f7', // purple-500
        secondary: '#8b5cf6', // violet-500
        accent: '#c084fc', // purple-400
        gradient: 'from-purple-900 via-purple-800 to-indigo-900',
        emoji: '🌌'
    },
    emerald: {
        name: 'emerald',
        displayName: 'Emerald Forest',
        primary: '#10b981', // emerald-500
        secondary: '#14b8a6', // teal-500
        accent: '#34d399', // emerald-400
        gradient: 'from-gray-900 via-emerald-900 to-teal-900',
        emoji: '🌲'
    },
    sunset: {
        name: 'sunset',
        displayName: 'Sunset Glow',
        primary: '#f97316', // orange-500
        secondary: '#ec4899', // pink-500
        accent: '#fb923c', // orange-400
        gradient: 'from-gray-900 via-orange-900 to-pink-900',
        emoji: '🌅'
    },
    monochrome: {
        name: 'monochrome',
        displayName: 'Monochrome',
        primary: '#6b7280', // gray-500
        secondary: '#9ca3af', // gray-400
        accent: '#d1d5db', // gray-300
        gradient: 'from-gray-900 via-gray-800 to-slate-900',
        emoji: '🎨'
    }
}

type ThemeContextType = {
    currentTheme: Theme
    setTheme: (theme: ThemeName) => void
    themeName: ThemeName
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeName>('electric')

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('anti-parcoursup-theme') as ThemeName
        if (savedTheme && themes[savedTheme]) {
            setThemeName(savedTheme)
        }
    }, [])

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', themeName)

        // Save to localStorage
        localStorage.setItem('anti-parcoursup-theme', themeName)
    }, [themeName])

    const setTheme = (newTheme: ThemeName) => {
        setThemeName(newTheme)
    }

    const value: ThemeContextType = {
        currentTheme: themes[themeName],
        setTheme,
        themeName
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
