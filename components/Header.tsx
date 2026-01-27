'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { GraduationCap, Menu, X, User, LogIn, Heart, Calculator, MapPin, FileText, Crown, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function Header() {
  const { currentTheme } = useTheme()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    // Récupérer l'utilisateur actuel
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Check premium status
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single()
        setIsPremium(profile?.subscription_status === 'premium')
      }

      setLoading(false)
    }

    getUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsProfileOpen(false)
    router.push('/')
  }

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
  }

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

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && user ? (
              /* Profile Dropdown quand connecté */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-white transition-all hover:bg-white/10"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                      boxShadow: `0 4px 15px ${currentTheme.primary}40`
                    }}
                  >
                    {getUserInitials()}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{getUserDisplayName()}</span>
                    <span className="text-xs text-white/60">Mon compte</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl border backdrop-blur-xl shadow-2xl z-50"
                    style={{
                      backgroundColor: `${currentTheme.primary}20`,
                      borderColor: `${currentTheme.primary}40`,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.3)`
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: `${currentTheme.primary}30` }}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                        {isPremium && (
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 truncate">{user.email}</p>
                    </div>

                    {/* Links */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm">Tableau de bord</span>
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Mes favoris</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Paramètres</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t pt-2" style={{ borderColor: `${currentTheme.primary}30` }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !loading ? (
              /* Boutons Connexion/Inscription quand non connecté */
              <>
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
              </>
            ) : null}
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

              {!loading && user ? (
                /* Options de profil sur mobile */
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                      }}
                    >
                      {getUserInitials()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{getUserDisplayName()}</span>
                      <span className="text-xs text-white/60">{user.email}</span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all hover:bg-white/10"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Tableau de bord</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all hover:bg-white/10"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Paramètres</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 transition-all hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </>
              ) : !loading ? (
                /* Boutons Connexion/Inscription sur mobile */
                <>
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
                </>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
