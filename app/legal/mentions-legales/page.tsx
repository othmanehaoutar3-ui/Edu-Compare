'use client'

import Link from 'next/link'
import { ArrowLeft, Building2, Mail, Phone, Scale } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function MentionsLegalesPage() {
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
            <Scale className="w-6 h-6 text-purple-400" />
            <span className="text-white/80 font-semibold">Informations Légales</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Mentions Légales</h1>
          <p className="text-white/60 text-lg">Dernière mise à jour : 29 janvier 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 space-y-8">
          {/* Éditeur */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              Éditeur du site
            </h2>
            <div className="text-white/80 space-y-2 ml-9">
              <p><strong className="text-white">Raison sociale :</strong> [Votre Société / Nom]</p>
              <p><strong className="text-white">Forme juridique :</strong> [SAS, SARL, Auto-entrepreneur, etc.]</p>
              <p><strong className="text-white">Capital social :</strong> [Montant] €</p>
              <p><strong className="text-white">Siège social :</strong> [Adresse complète]</p>
              <p><strong className="text-white">SIRET :</strong> [Numéro SIRET]</p>
              <p><strong className="text-white">RCS :</strong> [RCS Ville Numéro]</p>
              <p><strong className="text-white">Numéro TVA :</strong> [FR + Numéro]</p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Directeur de la publication</h2>
            <div className="text-white/80 ml-9">
              <p>[Prénom NOM], en qualité de [Fonction]</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-400" />
              Contact
            </h2>
            <div className="text-white/80 space-y-2 ml-9">
              <p><strong className="text-white">Email :</strong> contact@yourdomain.com</p>
              <p><strong className="text-white">Téléphone :</strong> +33 X XX XX XX XX</p>
            </div>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Hébergement</h2>
            <div className="text-white/80 space-y-2 ml-9">
              <p><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789, USA</p>
              <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">https://vercel.com</a></p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Propriété intellectuelle</h2>
            <div className="text-white/80 space-y-3">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
              </p>
              <p>
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </div>
          </section>

          {/* Crédits */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Crédits</h2>
            <div className="text-white/80 space-y-2 ml-9">
              <p><strong className="text-white">Conception et réalisation :</strong> [Votre nom ou agence]</p>
              <p><strong className="text-white">Framework :</strong> Next.js 16</p>
              <p><strong className="text-white">Icônes :</strong> Lucide React</p>
            </div>
          </section>

          {/* CNIL */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Données personnelles</h2>
            <div className="text-white/80 space-y-3">
              <p>
                Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@yourdomain.com" className="text-purple-400 hover:underline">contact@yourdomain.com</a>
              </p>
              <p>
                Pour plus d'informations, consultez notre <Link href="/legal/politique-confidentialite" className="text-purple-400 hover:underline">Politique de Confidentialité</Link>.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-white/60">
            <Link href="/legal/politique-confidentialite" className="hover:text-white transition-colors">
              Politique de Confidentialité
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
