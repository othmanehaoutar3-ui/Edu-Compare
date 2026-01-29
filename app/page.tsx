'use client'

import Link from 'next/link'
import { ArrowRight, GraduationCap, Target, TrendingUp, Sparkles, Brain, ChartBar, Zap, Star, Shield } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'

export default function Home() {
  const { currentTheme } = useTheme()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity
      }
    }
  }

  const features = [
    {
      icon: Brain,
      title: "IA Avancée",
      description: "Algorithme entraîné sur 10 000+ admissions réelles"
    },
    {
      icon: ChartBar,
      title: "Statistiques Précises",
      description: "Données actualisées en temps réel"
    },
    {
      icon: Shield,
      title: "100% Sécurisé",
      description: "Vos données sont protégées et confidentielles"
    }
  ]

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${currentTheme.gradient} overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20 sm:py-32">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 backdrop-blur-md px-6 py-3 rounded-full mb-8 border"
            style={{
              backgroundColor: `${currentTheme.primary}15`,
              borderColor: `${currentTheme.primary}40`,
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <span className="text-sm font-semibold text-white">
              Propulsé par l'IA · 10k+ étudiants nous font confiance
            </span>
          </motion.div>

          {/* Title with Gradient Animation */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-tight"
          >
            Trouvez l'école{' '}
            <br className="hidden sm:block" />
            <span
              className="relative inline-block bg-gradient-to-r bg-clip-text text-transparent animate-gradient"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.accent}, ${currentTheme.primary})`,
                backgroundSize: '200% 100%'
              }}
            >
              parfaite pour vous
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Notre IA analyse vos chances d'admission en temps réel et vous recommande les meilleures écoles adaptées à votre profil
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/onboarding"
              className="group relative text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-2xl overflow-hidden w-full sm:w-auto justify-center"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/schools"
              className="group border-2 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all backdrop-blur-sm w-full sm:w-auto justify-center flex items-center gap-2"
              style={{
                borderColor: `${currentTheme.primary}60`,
                backgroundColor: `${currentTheme.primary}10`
              }}
            >
              Explorer les écoles
              <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards - Modern Design */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 sm:mt-32 max-w-6xl mx-auto"
        >
          {[
            { icon: GraduationCap, number: "500+", label: "Écoles référencées", color: "from-blue-600 to-blue-700" },
            { icon: Target, number: "92%", label: "De précision IA", color: "from-amber-500 to-orange-600" },
            { icon: TrendingUp, number: "10k+", label: "Étudiants aidés", color: "from-emerald-500 to-teal-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl"
            >
              {/* Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity blur-xl`} />

              <div className="relative z-10">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl sm:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text">
                  {stat.number}
                </h3>
                <p className="text-white/70 text-lg font-medium">{stat.label}</p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-32 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                Sup Advisor
              </span>
              ?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Des outils puissants pour maximiser vos chances de réussite
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />

                  <div className="relative z-10">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 mb-6 shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="relative inline-block">
            <motion.div
              animate={floatingVariants.animate}
              className="absolute -top-4 -right-4 text-4xl"
            >
              ✨
            </motion.div>
            <div className="bg-gradient-to-r from-blue-600/20 to-amber-600/20 backdrop-blur-xl rounded-3xl p-12 sm:p-16 border border-white/20 max-w-4xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
                Prêt à trouver votre école idéale ?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'étudiants qui ont déjà trouvé leur voie
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-blue-500/50"
              >
                <Star className="w-5 h-5 fill-current" />
                Créer mon compte gratuit
                <Zap className="w-5 h-5 fill-current" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
