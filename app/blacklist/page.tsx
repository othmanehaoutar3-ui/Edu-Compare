'use client'

import { AlertTriangle, XCircle, DollarSign, FileX, Shield, ArrowLeft, Search, Building2, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useState } from 'react'

type ScamSchool = {
    name: string
    city: string
    reasons: string[]
    severity: 'high' | 'medium' | 'low'
    details: string
    type: string
    price: string
}

const scamSchools: ScamSchool[] = [
    {
        name: "Golden Gate International Business School",
        city: "Paris & Lyon",
        severity: "high",
        type: "Commerce",
        price: "12 000€/an",
        reasons: [
            "Confusion volontaire Master / 'Mastre'",
            "Diplôme non visé par l'État",
            "Frais de scolarité abusifs",
            "Locaux inexistants (cours dans un coworking)"
        ],
        details: "Joue sur l'ambiguïté avec des termes anglophones ('MBA', 'BBA') qui n'ont aucune valeur académique en France. Les 'partenariats internationaux' sont souvent de simples voyages touristiques payants."
    },
    {
        name: "Institut Supérieur du Luxe et de la Mode",
        city: "Paris",
        severity: "high",
        type: "Mode / Luxe",
        price: "15 000€/an",
        reasons: [
            "Pas de certification RNCP active",
            "Taux d'insertion déclaré faux (100% vs 15% réel)",
            "Enseignants sans qualifications",
            "Aucun matériel technique disponible"
        ],
        details: "Vend du rêve avec des influenceurs mais l'école n'a aucun lien avec les maisons de luxe. Le 'diplôme' est une simple attestation de fin de stage imprimée en interne."
    },
    {
        name: "Sup'Avenir Numérique France",
        city: "En ligne / Marseille",
        severity: "medium",
        type: "Informatique",
        price: "6 500€/an",
        reasons: [
            "Vend un titre RNCP Niveau 5 (Bac+2) pour un Bac+5",
            "Contrats d'alternance douteux",
            "Plateforme de cours obsolète (PDFs de 2015)",
            "Impossible de joindre l'administration"
        ],
        details: "Promet un titre d'Ingénieur Maître (grade qui n'existe plus) alors que la certification réelle est niveau technicien. Beaucoup d'étudiants se retrouvent bloqués pour poursuivre en Master."
    },
    {
        name: "Bordeaux Management & Tech (BMT)",
        city: "Bordeaux",
        severity: "high",
        type: "Hybride",
        price: "9 800€/an",
        reasons: [
            "Établissement hors contrat sans contrôle",
            "Diplôme interne 'reconnu par les entreprises' (faux)",
            "Acompte illégal demandé avant admission",
            "Refus de remboursement si désistement"
        ],
        details: "Une coquille vide créée par un fonds d'investissement. Les cours sont des vidéos YouTube et les 'projets réels' n'existent pas. Plusieurs plaintes déposées pour pratiques commerciales trompeuses."
    },
    {
        name: "École Européenne des Hautes Finances",
        city: "Lille",
        severity: "medium",
        type: "Finance",
        price: "11 000€/an",
        reasons: [
            "Perte d'accréditation en 2023",
            "Cours annulés sans préavis",
            "Classes surchargées (60+ étudiants)",
            "Promesses de stages non tenues"
        ],
        details: "Anciennement correcte, cette école a été rachetée et la qualité s'est effondrée. Elle continue d'afficher des accréditations qu'elle a perdues. Les étudiants sont en procès."
    },
    {
        name: "DigiSchool Academy Grand-Est",
        city: "Strasbourg",
        severity: "low",
        type: "Digital",
        price: "8 000€/an",
        reasons: [
            "Formation validante mais très faible niveau",
            "Supports pédagogiques copiés de Wikipédia",
            "Aucun réseau entreprise",
            "Prix très élevé pour le contenu"
        ],
        details: "Ce n'est pas une arnaque légale (titre RNCP valide), mais une 'coquille vide' pédagogique. Vous payez très cher pour apprendre ce qui est gratuit en ligne. Aucun suivi."
    },
    {
        name: "International Start-Up Campus",
        city: "Nantes",
        severity: "high",
        type: "Entrepreneuriat",
        price: "14 000€/an",
        reasons: [
            "Faux incubateur, vrais frais cachés",
            "Diplôme non reconnu internationalement",
            "Partenariats fantômes",
            "Pressions pour signer rapidement"
        ],
        details: "Utilise des techniques de vente agressives ('plus que 2 places') pour forcer la signature. Le campus 'à la Silicon Valley' est un étage loué en banlieue."
    },
    {
        name: "Design & Art Concept School",
        city: "Montpellier",
        severity: "medium",
        type: "Art / Design",
        price: "9 500€/an",
        reasons: [
            "Confusion Grade de Licence vs Bachelor maison",
            "Matériel informatique à la charge de l'étudiant",
            "Pas de reconnaissance du Ministère de la Culture",
            "Débouchés quasi nuls"
        ],
        details: "Se vend comme une école d'art prestigieuse mais n'est reconnue ni par le Ministère de l'Enseignement Supérieur ni par celui de la Culture. Impossible de passer les concours publics ensuite."
    },
    {
        name: "Institut des Métiers de la Santé (IMS-Privé)",
        city: "Toulouse / Lyon",
        severity: "high",
        type: "Santé",
        price: "7 500€/an",
        reasons: [
            "Prépare à des concours qui n'existent plus",
            "Diplôme non reconnu par l'ARS",
            "Partenariats hôpitaux inexistants",
            "Refus de délivrer les conventions de stage"
        ],
        details: "Attire les étudiants recalés en médecine avec des promesses de passerelles qui n'existent pas légalement. Les étudiants ressortent sans rien."
    },
    {
        name: "Global World Language Institute",
        city: "Nice",
        severity: "medium",
        type: "Langues",
        price: "10 000€/an",
        reasons: [
            "Professeurs non natifs et non qualifiés",
            "Voyages d'études annulés sans remboursement",
            "Locaux insalubres",
            "Diplôme interne sans valeur"
        ],
        details: "Promet le bilinguisme en 6 mois pour justifier des frais exorbitants. En réalité, c'est une agence de voyage déguisée avec quelques cours de grammaire basiques."
    },
    {
        name: "E-Sport Business School",
        city: "Paris (La Défense)",
        severity: "low",
        type: "Sport / Gaming",
        price: "9 000€/an",
        reasons: [
            "Surf sur la vague E-Sport sans expertise",
            "Intervenants 'célèbres' qui ne viennent jamais",
            "Matériel informatique daté",
            "Débouchés extrêmement limités"
        ],
        details: "Une école opportuniste qui profite de la passion des jeunes pour le jeu vidéo. Le diplôme 'Manager E-sport' n'est reconnu par aucun éditeur ni ligue professionnelle."
    },
    {
        name: "Academy of Future Leaders",
        city: "Geneva (Campus France)",
        severity: "high",
        type: "Management",
        price: "25 000€/an",
        reasons: [
            "Fausse domiciliation en Suisse",
            "Diplôme non reconnu en France ni en Suisse",
            "Système pyramidal (MLM) caché",
            "Cours de développement personnel uniquement"
        ],
        details: "Une structure sectaire qui recrute sous couvert d'école de commerce d'élite. Les étudiants sont poussés à recruter d'autres élèves pour payer leur scolarité."
    },
    {
        name: "Green Tech Sustainability School",
        city: "Bordeaux",
        severity: "medium",
        type: "Écologie",
        price: "8 500€/an",
        reasons: [
            "Greenwashing éducatif total",
            "Aucun laboratoire ni terrain d'expérimentation",
            "Cours copiés sur des rapports du GIEC publics",
            "Pas de reconnaissance CTI (Ingénieur)"
        ],
        details: "Utilise l'anxiété écologique pour vendre des formations vides. Se dit 'école d'ingénieurs' mais ne délivre qu'un 'Bachelor d'établissement' sans valeur technique."
    },
    {
        name: "Luxury Hospitality & Butler Academy",
        city: "Cannes",
        severity: "medium",
        type: "Hôtellerie",
        price: "18 000€/an",
        reasons: [
            "Uniformes obligatoires et payants (2000€)",
            "Stages non rémunérés servant de main d'œuvre gratuite",
            "Harcèlement moral signalé",
            "Diplôme non enregistré au RNCP"
        ],
        details: "Joue sur le prestige de la Côte d'Azur. Les étudiants sont utilisés comme personnel de service gratuit pour les événements privés de la direction."
    },
    {
        name: "Cyber Defense Institute",
        city: "Lille",
        severity: "high",
        type: "Cybersécurité",
        price: "13 000€/an",
        reasons: [
            "Logiciels piratés utilisés en cours",
            "Pas de certification ANSSI",
            "Enseignants anonymes",
            "Fermeture administrative en cours"
        ],
        details: "Une arnaque dangereuse qui enseigne des techniques limites légales. Les diplômés sont parfois grillés auprès des vraies entreprises de cybersécurité."
    },
    // ===== NOUVELLES ÉCOLES BASÉES SUR LES RECHERCHES 2024-2025 =====
    {
        name: "SHG Lyon - School of Hotel & Gastronomy",
        city: "Lyon",
        severity: "high",
        type: "Hôtellerie",
        price: "11 000€/an",
        reasons: [
            "Liquidation judiciaire en 2022",
            "Diplômes jamais délivrés",
            "Professeurs démissionnaires en masse",
            "Plaintes pour escroquerie déposées"
        ],
        details: "Cas réel : des étudiants ont payé jusqu'à 11 000€/an et n'ont jamais reçu leur diplôme. L'école a été placée en liquidation judiciaire, laissant des centaines d'étudiants sans recours."
    },
    {
        name: "Campus Academy Network",
        city: "Paris / Bordeaux",
        severity: "high",
        type: "Commerce",
        price: "8 500€/an",
        reasons: [
            "Fermeture brutale sans préavis",
            "Aucun remboursement des frais",
            "Direction volatilisée",
            "Locaux fermés du jour au lendemain"
        ],
        details: "Témoignages multiples d'étudiants ayant perdu 6500€+ lors de la fermeture soudaine. La direction a disparu sans rembourser les étudiants."
    },
    {
        name: "ENACO Online Business School",
        city: "En ligne / Lille",
        severity: "medium",
        type: "Commerce en ligne",
        price: "5 000€/an",
        reasons: [
            "Bachelor non reconnu par l'État",
            "Impossible de s'inscrire en Master public",
            "Support pédagogique quasi inexistant",
            "Taux de réussite artificiellement gonflé"
        ],
        details: "Cas documenté : une étudiante a découvert que son bachelor à 5000€ n'était pas reconnu et ne permettait pas l'inscription en Master universitaire."
    },
    {
        name: "Prépa Privée Médecine Excellence",
        city: "Toute la France",
        severity: "high",
        type: "Prépa Médecine",
        price: "4 500€/an",
        reasons: [
            "Directeur volatilisé avec la caisse",
            "200+ étudiants victimes",
            "Fausses classes préparatoires",
            "Procès en cours pour escroquerie"
        ],
        details: "Scandale de 2024 : plus de 200 étudiants victimes de fausses prépas. Le directeur s'est volatilisé après avoir encaissé des milliers d'euros."
    },
    {
        name: "École Supérieure Occitane (ESO)",
        city: "Toulouse",
        severity: "high",
        type: "Commerce",
        price: "9 000€/an",
        reasons: [
            "Diplômes non certifiés délivrés",
            "Enquête officielle lancée",
            "Publicité mensongère avérée",
            "Recrutement d'étudiants étrangers pour visas"
        ],
        details: "Épinglée par les autorités pour avoir délivré des diplômes non certifiés tout en prétendant le contraire. Soupçonnée de vente de faux documents pour titres de séjour."
    },
    {
        name: "SUPINFO - École Fantôme",
        city: "Paris / Province",
        severity: "medium",
        type: "Informatique",
        price: "7 500€/an",
        reasons: [
            "Campus fermés sans préavis",
            "Formations non conformes aux présentations",
            "Étudiants réclament remboursements",
            "Turnover massif du personnel"
        ],
        details: "Ancienne école d'informatique connue, devenue 'école fantôme'. Témoignages d'étudiants dénonçant des formations vides et l'absence de professeurs."
    },
    {
        name: "Studio M Creative Arts",
        city: "Rennes / Montpellier",
        severity: "medium",
        type: "Audiovisuel / Design",
        price: "8 000€/an",
        reasons: [
            "Intervenants changeant constamment",
            "Cours non dispensés malgré paiement",
            "Taux de réussite affichés faux",
            "Manque de suivi pédagogique"
        ],
        details: "Témoignages d'étudiants dénonçant des changements fréquents d'intervenants, des cours annulés et un écart entre les taux affichés et la réalité."
    },
    {
        name: "Vatel Paris - Dérives signalées",
        city: "Paris",
        severity: "medium",
        type: "Hôtellerie",
        price: "12 000€/an",
        reasons: [
            "Accusations de harcèlement sexuel",
            "Propos homophobes de professeurs signalés",
            "Grève étudiante en 2023",
            "Inaction de la direction face aux plaintes"
        ],
        details: "En 2023, une promotion entière s'est mise en grève pour dénoncer des comportements de harcèlement. Plusieurs étudiantes ont porté plainte."
    },
    {
        name: "Groupe Galileo - Écoles Studialis",
        city: "Toute la France",
        severity: "medium",
        type: "Multi-secteur",
        price: "Variable",
        reasons: [
            "Classes surchargées (pas de places assises)",
            "Professeurs non formés",
            "Course au profit dénoncée",
            "Enquête gouvernementale lancée"
        ],
        details: "Le livre 'Le Cube' de Claire Marchal dénonce les pratiques du groupe. Enquête officielle mandatée par le gouvernement suite aux révélations."
    },
    {
        name: "Coding Factory Express",
        city: "Paris / Lyon",
        severity: "medium",
        type: "Bootcamp Dev",
        price: "8 000€ (3 mois)",
        reasons: [
            "Promesses d'emploi à 45K€ non tenues",
            "Formation survolée en 3 mois",
            "Diplôme sans valeur pour les RH",
            "Taux d'insertion réel < 30%"
        ],
        details: "Les bootcamps vendent du rêve mais le marché est saturé de juniors. Les profils bootcamp sont souvent rejetés par les entreprises au profit de formations classiques."
    },
    {
        name: "Web Academy Premium",
        city: "Marseille",
        severity: "low",
        type: "Développement Web",
        price: "6 000€ (6 mois)",
        reasons: [
            "Contenu disponible gratuitement en ligne",
            "Pas de suivi personnalisé",
            "Vidéos préenregistrées uniquement",
            "Certificat interne sans valeur"
        ],
        details: "Vous payez 6000€ pour regarder des tutoriels YouTube reconditionnés. Aucun accompagnement réel, aucun réseau professionnel."
    },
    {
        name: "Institut Privé de Journalisme (IPJ-Fake)",
        city: "Paris",
        severity: "high",
        type: "Journalisme",
        price: "10 000€/an",
        reasons: [
            "Confusion volontaire avec l'IPJ reconnu",
            "Aucune carte de presse possible",
            "Diplôme non reconnu par la profession",
            "Stages dans des médias fantômes"
        ],
        details: "Exploite la confusion avec le vrai IPJ (Institut Pratique du Journalisme). Les diplômés découvrent qu'ils ne peuvent pas obtenir de carte de presse."
    },
    {
        name: "Business School du Mans",
        city: "Le Mans",
        severity: "high",
        type: "Commerce",
        price: "8 000€/an",
        reasons: [
            "Mise en examen des responsables (2023)",
            "Vente de faux documents de scolarité",
            "Trafic de visas étudiants suspecté",
            "Escroquerie en bande organisée"
        ],
        details: "Trois responsables mis en examen en 2023 pour escroquerie. Suspectés d'avoir vendu de faux documents pour aider des étrangers à obtenir des titres de séjour."
    },
    {
        name: "AI & Data Science Institute",
        city: "Paris (100% en ligne)",
        severity: "medium",
        type: "Data Science",
        price: "12 000€/an",
        reasons: [
            "Aucun professeur expert en IA",
            "Cours copiés sur Coursera/Udemy",
            "Diplôme 'reconnu par l'industrie' (faux)",
            "Partenariats Google/Microsoft inexistants"
        ],
        details: "Surfe sur la hype de l'IA. Les cours sont des copier-coller de MOOCs gratuits. Les 'partenariats GAFAM' affichés sont totalement inventés."
    },
    {
        name: "École du Metaverse & NFT",
        city: "Paris",
        severity: "high",
        type: "Blockchain / Crypto",
        price: "15 000€/an",
        reasons: [
            "Formation sur technologie morte (NFT)",
            "Responsables liés à des arnaques crypto",
            "Diplôme sans aucune reconnaissance",
            "Incitation à investir dans des tokens"
        ],
        details: "Une arnaque qui a profité de la bulle NFT. Les responsables sont liés à des projets crypto douteux. Les étudiants sont poussés à acheter des tokens."
    }
]

export default function BlacklistPage() {
    const { currentTheme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredSchools = scamSchools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'from-red-500 to-pink-600'
            case 'medium':
                return 'from-orange-500 to-yellow-600'
            case 'low':
                return 'from-yellow-500 to-orange-500'
            default:
                return 'from-gray-500 to-gray-600'
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <XCircle className="w-6 h-6" />
            case 'medium':
                return <AlertTriangle className="w-6 h-6" />
            case 'low':
                return <AlertTriangle className="w-6 h-6" />
            default:
                return null
        }
    }

    const getSeverityLabel = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'DANGER - À ÉVITER ABSOLUMENT'
            case 'medium':
                return 'ATTENTION - RISQUES IMPORTANTS'
            case 'low':
                return 'VIGILANCE RECOMMANDÉE'
            default:
                return ''
        }
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient}`}>
            {/* Theme Switcher */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeSwitcher />
            </div>

            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-8 h-8" style={{ color: currentTheme.primary }} />
                            Anti-Parcoursup
                        </Link>
                        <Link
                            href="/schools"
                            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour aux écoles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
                            style={{
                                backgroundColor: '#ef444420',
                                borderColor: '#ef444450',
                                borderWidth: '1px'
                            }}>
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <span className="text-red-200 font-semibold">Liste Noire Officieuse</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            ⚠️ Écoles à Éviter
                        </h1>

                        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                            Ces établissements ne sont <strong>pas reconnus par l'État</strong>, délivrent des diplômes sans valeur,
                            ou utilisent des pratiques commerciales douteuses. Base de données mise à jour suite aux enquêtes.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative mb-12 group">
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full group-hover:bg-red-500/30 transition-all" />
                            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 shadow-xl">
                                <Search className="w-6 h-6 text-white/50 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une école, une ville ou un type (ex: Luxe, Informatique...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xl text-white placeholder-white/50 w-full"
                                />
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 max-w-3xl mx-auto backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-500/20 p-3 rounded-full">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        Comment repérer une arnaque ?
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ul className="text-red-100 space-y-2 text-sm">
                                            <li className="flex items-center gap-2">❌ Pas de reconnaissance RNCP / Visa</li>
                                            <li className="flex items-center gap-2">❌ Promesses de salaires mirobolants</li>
                                        </ul>
                                        <ul className="text-red-100 space-y-2 text-sm">
                                            <li className="flex items-center gap-2">❌ Frais cachés (inscription, uniforme...)</li>
                                            <li className="flex items-center gap-2">❌ Pression pour signer "tout de suite"</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6 text-white/60 font-medium">
                        {filteredSchools.length} établissement{filteredSchools.length > 1 ? 's' : ''} signalés
                    </div>

                    {/* Schools List */}
                    <div className="space-y-6">
                        {filteredSchools.length > 0 ? (
                            filteredSchools.map((school, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:border-red-400/50 hover:bg-white/15 transition-all duration-300"
                                >
                                    {/* School Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white/80 border border-white/10">
                                                    {school.type}
                                                </span>
                                                <span className="text-red-300 text-sm font-medium flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {school.price}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-200 transition-colors">
                                                {school.name}
                                            </h3>
                                            <p className="text-white/60 flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                {school.city}
                                            </p>
                                        </div>

                                        {/* Severity Badge */}
                                        <div className={`bg-gradient-to-r ${getSeverityColor(school.severity)} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg self-start`}>
                                            {getSeverityIcon(school.severity)}
                                            <span className="text-white font-bold text-sm whitespace-nowrap">
                                                {getSeverityLabel(school.severity)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <p className="text-white/90 mb-6 leading-relaxed italic border-l-4 border-red-500/50 pl-4">
                                        "{school.details}"
                                    </p>

                                    {/* Reasons */}
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-red-400" />
                                            Drapeaux Rouges identifiés :
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {school.reasons.map((reason, i) => (
                                                <div key={i} className="text-red-100 flex items-start gap-3 bg-red-500/10 p-3 rounded-xl">
                                                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm font-medium">{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                                <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">Aucune école trouvée</h3>
                                <p className="text-white/60">Essaie d'autres mots clés ou vérifie l'orthographe.</p>
                            </div>
                        )}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Ne prenez pas de risques avec votre avenir
                            </h2>
                            <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
                                Notre base de données principale ne contient QUE des écoles vérifiées, accréditées et reconnues par l'État.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/schools"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105 shadow-lg group"
                                    style={{
                                        background: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.secondary})`,
                                        boxShadow: `0 10px 40px ${currentTheme.primary}50`
                                    }}
                                >
                                    <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Trouver une école reconnue
                                </Link>
                                <Link
                                    href="/calculator"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
                                >
                                    Calculer mes chances
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
