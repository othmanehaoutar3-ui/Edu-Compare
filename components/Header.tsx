'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { GraduationCap, Menu, X, User, LogIn, Heart, Calculator, MapPin, FileText, Crown, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { currentTheme } = useTheme()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Détecter le scroll pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      style={{
        backgroundColor: scrolled ? `${currentTheme.primary}20` : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
        borderBottom: scrolled ? `1px solid ${currentTheme.primary}30` : 'none',
        boxShadow: scrolled ? `0 10px 40px ${currentTheme.primary}20` : 'none'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <motion.div
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                boxShadow: `0 8px 32px ${currentTheme.primary}50`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg relative z-10" />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <motion.span
                className="text-xl sm:text-2xl font-black tracking-tight text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Sup Advisor
              </motion.span>
              <motion.span
                className="text-[9px] sm:text-[10px] font-medium text-white/60 tracking-widest uppercase -mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Trouve ton école
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={link.href}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/80 hover:text-white transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
                  <link.icon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              /* Profile Dropdown */
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-white transition-all hover:bg-white/10"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    }}
                  >
                    {getUserInitials()}
                  </div>
                  <div className="hidden xl:flex flex-col items-start">
                    <span className="text-sm font-semibold text-white leading-tight">{getUserDisplayName()}</span>
                    <span className="text-xs text-white/50">Mon compte</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu avec Animation */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 py-2 rounded-2xl border backdrop-blur-xl shadow-2xl z-50"
                      style={{
                        backgroundColor: `${currentTheme.primary}20`,
                        borderColor: `${currentTheme.primary}40`,
                      }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b" style={{ borderColor: `${currentTheme.primary}30` }}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">{getUserDisplayName()}</p>
                          {isPremium && (
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60 truncate mt-1">{user.email}</p>
                      </div>

                      {/* Links */}
                      <div className="py-2">
                        {[
                          { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
                          { href: '/favorites', icon: Heart, label: 'Mes favoris' },
                          { href: '/settings', icon: Settings, label: 'Paramètres' },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t pt-2" style={{ borderColor: `${currentTheme.primary}30` }}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-lg mx-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !loading ? (
              /* Boutons Connexion/Inscription */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Connexion</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                  }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">S'inscrire</span>
                </Link>
              </motion.div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu avec Animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-2 py-4 border-t mt-4" style={{ borderColor: `${currentTheme.primary}30` }}>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/10"
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t my-2" style={{ borderColor: `${currentTheme.primary}30` }} />

                {!loading && user ? (
                  <>
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
                        <span className="text-sm font-semibold text-white">{getUserDisplayName()}</span>
                        <span className="text-xs text-white/60">{user.email}</span>
                      </div>
                    </div>

                    {[
                      { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
                      { href: '/settings', icon: Settings, label: 'Paramètres' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/10"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 transition-all hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </>
                ) : !loading ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/10"
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Connexion</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-all mx-2"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
