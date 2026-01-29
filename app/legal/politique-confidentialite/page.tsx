'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function PolitiqueConfidentialitePage() {
  const { currentTheme } = useTheme()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} pt-24`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-full mb-6">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="text-white/80 font-semibold">RGPD</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Politique de Confidentialité</h1>
          <p className="text-white/60 text-lg">Dernière mise à jour : 29 janvier 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-white/80">
              Chez Sup Advisor, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Responsable du traitement</h2>
            <div className="text-white/80 space-y-2">
              <p><strong className="text-white">Raison sociale :</strong> [Votre Société]</p>
              <p><strong className="text-white">Adresse :</strong> [Adresse complète]</p>
              <p><strong className="text-white">Email :</strong> contact@yourdomain.com</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-400" />
              Données personnelles collectées
            </h2>
            <div className="text-white/80 space-y-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">Données d'inscription</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (chiffré)</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">Données d'utilisation</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Écoles favorites</li>
                  <li>Historique de recherches</li>
                  <li>Résultats des calculateurs d'admission</li>
                  <li>Lettres de motivation générées</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">Données de paiement</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Informations de facturation (traitées par Stripe)</li>
                  <li>Historique d'abonnement</li>
                  <li>Nous ne stockons JAMAIS vos données bancaires</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">Données techniques</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Date et heure de connexion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-400" />
              Utilisation des données
            </h2>
            <div className="text-white/80 space-y-3">
              <p>Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Fournir nos services (calculateur IA, recommandations, etc.)</li>
                <li>Traiter vos paiements et gérer votre abonnement</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Améliorer nos services et personnaliser votre expérience</li>
                <li>Assurer la sécurité de notre plateforme</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Base légale du traitement</h2>
            <div className="text-white/80 space-y-3">
              <p>Nous traitons vos données sur la base de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Contrat</strong> : exécution du contrat d'utilisation</li>
                <li><strong className="text-white">Consentement</strong> : pour les cookies et communications marketing</li>
                <li><strong className="text-white">Intérêt légitime</strong> : amélioration de nos services</li>
                <li><strong className="text-white">Obligation légale</strong> : conformité fiscale et comptable</li>
              </ul>
            </div>
          </section>

          {/* Conservation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Durée de conservation</h2>
            <div className="text-white/80 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Compte actif :</strong> pendant toute la durée de votre abonnement</li>
                <li><strong className="text-white">Compte inactif :</strong> 3 ans après la dernière connexion</li>
                <li><strong className="text-white">Données de facturation :</strong> 10 ans (obligation légale)</li>
                <li><strong className="text-white">Cookies :</strong> 13 mois maximum</li>
              </ul>
            </div>
          </section>

          {/* Partage */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Partage des données</h2>
            <div className="text-white/80 space-y-3">
              <p>Nous partageons vos données uniquement avec :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Supabase :</strong> hébergement de la base de données</li>
                <li><strong className="text-white">Stripe :</strong> traitement des paiements</li>
                <li><strong className="text-white">Google (Gemini AI) :</strong> calculs de chances d'admission</li>
                <li><strong className="text-white">Vercel :</strong> hébergement du site web</li>
              </ul>
              <p className="mt-4">
                Nous ne vendons JAMAIS vos données à des tiers.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-purple-400" />
              Cookies
            </h2>
            <div className="text-white/80 space-y-3">
              <p>Nous utilisons des cookies pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Analyser l'utilisation du site (si accepté)</li>
              </ul>
              <p className="mt-4">
                Vous pouvez gérer vos préférences de cookies à tout moment dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Droits */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-400" />
              Vos droits
            </h2>
            <div className="text-white/80 space-y-3">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong className="text-white">Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong className="text-white">Droit à l'effacement :</strong> supprimer vos données</li>
                <li><strong className="text-white">Droit à la limitation :</strong> limiter le traitement</li>
                <li><strong className="text-white">Droit à la portabilité :</strong> récupérer vos données</li>
                <li><strong className="text-white">Droit d'opposition :</strong> refuser certains traitements</li>
                <li><strong className="text-white">Droit de retrait du consentement :</strong> à tout moment</li>
              </ul>
              <p className="mt-4 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <strong className="text-white">Pour exercer vos droits :</strong><br />
                Envoyez un email à <a href="mailto:contact@yourdomain.com" className="text-purple-400 hover:underline">contact@yourdomain.com</a> avec une pièce d'identité.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Sécurité</h2>
            <div className="text-white/80 space-y-3">
              <p>Nous mettons en œuvre des mesures de sécurité appropriées :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement HTTPS sur l'ensemble du site</li>
                <li>Mots de passe hachés (bcrypt)</li>
                <li>Authentification sécurisée via Supabase</li>
                <li>Sauvegardes régulières</li>
                <li>Accès limité aux données</li>
              </ul>
            </div>
          </section>

          {/* Réclamation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Droit de réclamation</h2>
            <p className="text-white/80">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) à l'adresse <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">www.cnil.fr</a>.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Modifications</h2>
            <p className="text-white/80">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-white/60">
            <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
            <span>•</span>
            <Link href="/legal/cgu" className="hover:text-white transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
