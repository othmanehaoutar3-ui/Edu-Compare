'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function CGUPage() {
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
            <FileText className="w-6 h-6 text-purple-400" />
            <span className="text-white/80 font-semibold">Conditions d'Utilisation</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-white/60 text-lg">Dernière mise à jour : 29 janvier 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 space-y-8">
          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 1 - Objet</h2>
            <p className="text-white/80">
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation de la plateforme Sup Advisor, ainsi que les droits et obligations des utilisateurs dans ce cadre.
            </p>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 2 - Acceptation des CGU</h2>
            <div className="text-white/80 space-y-3">
              <p>
                L'utilisation de la plateforme Sup Advisor implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
              <p>
                En créant un compte, vous confirmez avoir lu, compris et accepté l'intégralité des présentes CGU.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 3 - Description des services</h2>
            <div className="text-white/80 space-y-3">
              <p>Sup Advisor est une plateforme d'aide à l'orientation qui propose :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Un catalogue de 500+ écoles supérieures vérifiées</li>
                <li>Un calculateur IA pour estimer vos chances d'admission</li>
                <li>Un générateur de lettres de motivation assisté par IA</li>
                <li>Un système de favoris pour sauvegarder vos écoles préférées</li>
                <li>Une carte interactive des établissements</li>
                <li>Des statistiques et recommandations personnalisées (abonnement Premium)</li>
              </ul>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 4 - Création de compte</h2>
            <div className="text-white/80 space-y-3">
              <p><strong className="text-white">4.1 Inscription</strong></p>
              <p>Pour accéder à certaines fonctionnalités, vous devez créer un compte en fournissant des informations exactes et à jour.</p>

              <p className="mt-4"><strong className="text-white">4.2 Sécurité du compte</strong></p>
              <p>Vous êtes responsable de la confidentialité de vos identifiants. Toute activité sur votre compte est sous votre responsabilité.</p>

              <p className="mt-4"><strong className="text-white">4.3 Âge minimum</strong></p>
              <p>Vous devez avoir au moins 16 ans pour créer un compte. Les mineurs doivent obtenir l'autorisation parentale.</p>
            </div>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 5 - Abonnements et paiements</h2>
            <div className="text-white/80 space-y-3">
              <p><strong className="text-white">5.1 Formules d'abonnement</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Gratuit :</strong> accès limité aux fonctionnalités de base</li>
                <li><strong className="text-white">Premium Mensuel :</strong> 9,99€/mois - accès complet</li>
                <li><strong className="text-white">Premium Annuel :</strong> 79,99€/an - accès complet avec 33% de réduction</li>
              </ul>

              <p className="mt-4"><strong className="text-white">5.2 Paiement</strong></p>
              <p>Les paiements sont traités de manière sécurisée par Stripe. Nous ne conservons pas vos informations bancaires.</p>

              <p className="mt-4"><strong className="text-white">5.3 Renouvellement automatique</strong></p>
              <p>Les abonnements se renouvellent automatiquement. Vous pouvez annuler à tout moment depuis votre tableau de bord.</p>

              <p className="mt-4"><strong className="text-white">5.4 Remboursement</strong></p>
              <p>Conformément au droit de rétractation (14 jours), vous pouvez demander un remboursement si vous n'avez pas utilisé les services Premium.</p>
            </div>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 6 - Utilisation du service</h2>
            <div className="text-white/80 space-y-3">
              <p>Vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utiliser le service de manière légale et éthique</li>
                <li>Ne pas tenter de contourner les limitations techniques</li>
                <li>Ne pas partager votre compte avec d'autres personnes</li>
                <li>Ne pas utiliser de scripts automatisés (scraping, bots)</li>
                <li>Ne pas diffuser de contenu illégal ou offensant</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>
            </div>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 7 - Responsabilité et garanties</h2>
            <div className="text-white/80 space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-2">Avertissement important</p>
                  <p>
                    Les estimations fournies par notre calculateur IA sont données à titre indicatif uniquement. Elles ne constituent en aucun cas une garantie d'admission.
                  </p>
                </div>
              </div>

              <p className="mt-4"><strong className="text-white">7.1 Limitation de responsabilité</strong></p>
              <p>Sup Advisor ne saurait être tenu responsable :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Des décisions d'admission des établissements</li>
                <li>De l'exactitude des informations tierces</li>
                <li>Des interruptions temporaires du service</li>
                <li>Des erreurs ou omissions dans les données</li>
              </ul>

              <p className="mt-4"><strong className="text-white">7.2 Vérification</strong></p>
              <p>Nous vous encourageons fortement à vérifier toutes les informations directement auprès des établissements concernés.</p>
            </div>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 8 - Propriété intellectuelle</h2>
            <div className="text-white/80 space-y-3">
              <p>
                Tous les contenus présents sur Sup Advisor (textes, images, logos, base de données, code source) sont protégés par le droit d'auteur et appartiennent à Sup Advisor ou à ses partenaires.
              </p>
              <p>
                Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 9 - Résiliation</h2>
            <div className="text-white/80 space-y-3">
              <p><strong className="text-white">9.1 Par l'utilisateur</strong></p>
              <p>Vous pouvez supprimer votre compte à tout moment depuis les paramètres.</p>

              <p className="mt-4"><strong className="text-white">9.2 Par Sup Advisor</strong></p>
              <p>Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation des présentes CGU</li>
                <li>Utilisation frauduleuse du service</li>
                <li>Comportement abusif ou nuisible</li>
                <li>Impayé</li>
              </ul>
            </div>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 10 - Modification des CGU</h2>
            <p className="text-white/80">
              Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications entreront en vigueur dès leur publication. Votre utilisation continue du service après modification vaut acceptation.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 11 - Loi applicable et juridiction</h2>
            <div className="text-white/80 space-y-3">
              <p>
                Les présentes CGU sont régies par le droit français.
              </p>
              <p>
                En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera porté devant les tribunaux compétents.
              </p>
            </div>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Article 12 - Contact</h2>
            <p className="text-white/80">
              Pour toute question concernant les présentes CGU, vous pouvez nous contacter à : <a href="mailto:contact@yourdomain.com" className="text-purple-400 hover:underline">contact@yourdomain.com</a>
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
            <Link href="/legal/politique-confidentialite" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
