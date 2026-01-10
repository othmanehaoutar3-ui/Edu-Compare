'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { GraduationCap, Menu, X, User, LogIn, Heart, Calculator, MapPin, FileText, Crown } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header() {
  const { currentTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/schools', label: 'Écoles', icon: GraduationCap },
    { href: '/map', label: 'Carte', icon: MapPin },
    { href: '/calculator', label: 'Calculateur', icon: Calculator },
    { href: '/favorites', label: 'Favoris', icon: Heart },
    { href: '/letter-generator', label: 'Lettres', icon: FileText },
    { href: '/pricing', label: 'Abonnements', icon: Crown },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${currentTheme.primary}15`,
        borderColor: `${currentTheme.primary}30`
      }}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.primary})`,
                boxShadow: `0 8px 32px ${currentTheme.primary}50, inset 0 1px 0 rgba(255,255,255,0.2)`
              }}>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <GraduationCap className="w-7 h-7 text-white drop-shadow-lg relative z-10" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">
                Sup Advisor
              </span>
              <span className="text-[10px] font-medium text-white/50 tracking-widest uppercase -mt-1">
                Trouve ton école
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white transition-all hover:bg-white/10"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons + Theme Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/10"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Connexion</span>
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                boxShadow: `0 4px 15px ${currentTheme.primary}40`
              }}
            >
              <User className="w-4 h-4" />
              <span className="text-sm">S'inscrire</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: `${currentTheme.primary}30` }}>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all hover:bg-white/10"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="border-t my-2" style={{ borderColor: `${currentTheme.primary}30` }} />
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all hover:bg-white/10"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Connexion</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-all"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                }}
              >
                <User className="w-5 h-5" />
                <span>S'inscrire</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
