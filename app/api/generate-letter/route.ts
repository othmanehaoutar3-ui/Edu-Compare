import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Température adaptée par type d'école pour varier le style
const TEMPERATURE_BY_TYPE: Record<string, number> = {
  'art-design': 0.92,      // Maximum créativité
  'grande-ecole': 0.88,    // Confiant, audacieux
  'ecole-commerce': 0.88,
  'universite': 0.85,      // Intellectuel, nuancé
  'default': 0.85,
  'ecole-ingenieur': 0.82,
  'iut': 0.8,              // Concret mais personnel
  'cpge': 0.8,             // Rigoureux mais humain
}

// Voix narratives pour varier les lettres
const NARRATIVE_VOICES = [
  {
    name: 'Le storyteller',
    style: 'Commence par une scène vivante, utilise des détails sensoriels, crée du suspense',
    example: 'Ce jour-là, face à mon écran, j\'ai compris. Trois heures du matin, les yeux fatigués mais l\'esprit en ébullition...'
  },
  {
    name: 'Le réflexif',
    style: 'Pose des questions, explore ses doutes, montre une introspection sincère',
    example: 'Qu\'est-ce qui nous pousse à choisir une voie plutôt qu\'une autre ? Pour ma part, la réponse est venue d\'une rencontre inattendue...'
  },
  {
    name: 'Le pragmatique passionné',
    style: 'Alterne entre faits concrets et élans d\'enthousiasme, ancré mais inspiré',
    example: 'Les chiffres parlent d\'eux-mêmes : trois projets menés, deux prix remportés. Mais derrière ces résultats, une conviction...'
  },
]

// Structures narratives variées
const NARRATIVE_STRUCTURES = [
  {
    name: 'Anecdote → Réalisation → Adéquation → Vision',
    description: 'Partir d\'un moment vécu pour construire le récit'
  },
  {
    name: 'Défi → Transformation → Choix éclairé → Ambition',
    description: 'Montrer comment un obstacle est devenu une force'
  },
  {
    name: 'Curiosité → Exploration → Découverte → Engagement',
    description: 'Raconter un cheminement intellectuel ou personnel'
  },
]

// Critères détaillés par type d'établissement
const SCHOOL_CRITERIA: Record<string, {
  tone: string
  focus: string
  criteria: string[]
  keywords: string[]
}> = {
  'default': {
    tone: 'authentique, personnel et engagé',
    focus: 'votre parcours unique et votre vision',
    criteria: [
      'Raconter une histoire personnelle, pas un CV',
      'Montrer ce qui vous distingue vraiment',
      'Créer une connexion émotionnelle avec le lecteur',
    ],
    keywords: ['parcours', 'vision', 'engagement', 'singularité'],
  },
  'universite': {
    tone: 'intellectuellement curieux et réfléchi',
    focus: 'votre démarche de pensée et votre soif de comprendre',
    criteria: [
      'Partager un questionnement intellectuel sincère',
      'Montrer comment vous pensez, pas juste ce que vous savez',
      'Évoquer des lectures ou idées qui vous ont transformé',
    ],
    keywords: ['questionnement', 'réflexion', 'savoir', 'comprendre'],
  },
  'grande-ecole': {
    tone: 'ambitieux mais humble, leader mais collaboratif',
    focus: 'vos réalisations concrètes et votre potentiel de leadership',
    criteria: [
      'Illustrer votre leadership par des actions, pas des mots',
      'Montrer votre capacité à fédérer et inspirer',
      'Démontrer votre ouverture internationale par des expériences vécues',
    ],
    keywords: ['impact', 'leadership', 'initiative', 'international'],
  },
  'iut': {
    tone: 'concret, enthousiaste et orienté terrain',
    focus: 'vos compétences pratiques et votre goût du concret',
    criteria: [
      'Mettre en avant des projets où vous avez mis les mains dans le cambouis',
      'Montrer votre compréhension du métier visé',
      'Exprimer votre envie d\'apprendre en faisant',
    ],
    keywords: ['pratique', 'projet', 'terrain', 'concret'],
  },
  'cpge': {
    tone: 'déterminé, rigoureux mais pas robotique',
    focus: 'votre capacité de travail et votre goût du défi intellectuel',
    criteria: [
      'Montrer que vous savez pourquoi vous voulez souffrir',
      'Illustrer votre rigueur par des exemples, pas des affirmations',
      'Exprimer une ambition réaliste et réfléchie',
    ],
    keywords: ['rigueur', 'défi', 'méthode', 'ambition'],
  },
  'ecole-ingenieur': {
    tone: 'innovant, curieux et orienté solutions',
    focus: 'votre capacité à résoudre des problèmes et innover',
    criteria: [
      'Raconter un problème technique que vous avez adoré résoudre',
      'Montrer comment vous pensez face à un défi',
      'Exprimer votre fascination pour la technologie de façon authentique',
    ],
    keywords: ['innovation', 'solution', 'technique', 'curiosité'],
  },
  'ecole-commerce': {
    tone: 'entrepreneurial, dynamique et ouvert sur le monde',
    focus: 'votre sens du business et votre dimension internationale',
    criteria: [
      'Illustrer votre esprit entrepreneurial par des actions concrètes',
      'Montrer une vraie ouverture culturelle, pas du tourisme',
      'Démontrer votre compréhension des enjeux business',
    ],
    keywords: ['entrepreneuriat', 'international', 'business', 'impact'],
  },
  'art-design': {
    tone: 'créatif, sensible et singulier',
    focus: 'votre univers artistique et votre démarche personnelle',
    criteria: [
      'Laisser transparaître votre sensibilité unique',
      'Parler de vos influences de façon personnelle',
      'Montrer que vous avez une vision, pas juste des compétences',
    ],
    keywords: ['création', 'sensibilité', 'vision', 'expression'],
  },
}

function getSchoolCriteria(schoolType: string, schoolName: string) {
  // Essayer de matcher le type exact
  if (SCHOOL_CRITERIA[schoolType]) {
    return { criteria: SCHOOL_CRITERIA[schoolType], temperature: TEMPERATURE_BY_TYPE[schoolType] || 0.85 }
  }

  // Recherche par mots-clés dans le nom de l'école
  const lowerName = schoolName.toLowerCase()
  const lowerType = schoolType.toLowerCase()
  const combined = `${lowerName} ${lowerType}`

  if (combined.includes('ingénieur') || combined.includes('ingenieur') || combined.includes('polytech') || combined.includes('insa')) {
    return { criteria: SCHOOL_CRITERIA['ecole-ingenieur'], temperature: TEMPERATURE_BY_TYPE['ecole-ingenieur'] }
  }
  if (combined.includes('commerce') || combined.includes('business') || combined.includes('management') || combined.includes('hec') || combined.includes('essec') || combined.includes('edhec') || combined.includes('em ')) {
    return { criteria: SCHOOL_CRITERIA['ecole-commerce'], temperature: TEMPERATURE_BY_TYPE['ecole-commerce'] }
  }
  if (combined.includes('art') || combined.includes('design') || combined.includes('beaux') || combined.includes('gobelins')) {
    return { criteria: SCHOOL_CRITERIA['art-design'], temperature: TEMPERATURE_BY_TYPE['art-design'] }
  }
  if (combined.includes('prépa') || combined.includes('cpge') || combined.includes('classe préparatoire')) {
    return { criteria: SCHOOL_CRITERIA['cpge'], temperature: TEMPERATURE_BY_TYPE['cpge'] }
  }
  if (combined.includes('iut') || combined.includes('but') || combined.includes('bts')) {
    return { criteria: SCHOOL_CRITERIA['iut'], temperature: TEMPERATURE_BY_TYPE['iut'] }
  }
  if (combined.includes('université') || combined.includes('universite') || combined.includes('licence') || combined.includes('master') || combined.includes('fac')) {
    return { criteria: SCHOOL_CRITERIA['universite'], temperature: TEMPERATURE_BY_TYPE['universite'] }
  }
  if (combined.includes('grande école') || combined.includes('grande ecole') || combined.includes('sciences po')) {
    return { criteria: SCHOOL_CRITERIA['grande-ecole'], temperature: TEMPERATURE_BY_TYPE['grande-ecole'] }
  }

  return { criteria: SCHOOL_CRITERIA['default'], temperature: TEMPERATURE_BY_TYPE['default'] }
}

// Sélectionner aléatoirement une voix et une structure
function getRandomVariation() {
  const voice = NARRATIVE_VOICES[Math.floor(Math.random() * NARRATIVE_VOICES.length)]
  const structure = NARRATIVE_STRUCTURES[Math.floor(Math.random() * NARRATIVE_STRUCTURES.length)]
  return { voice, structure }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check premium status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status !== 'premium') {
      return NextResponse.json({ error: 'Premium required' }, { status: 403 })
    }

    const {
      schoolName,
      program,
      motivation,
      strengths,
      experience,
      anecdote,
      challenge,
      uniqueTrait,
      schoolType
    } = await request.json()

    // Input validation
    if (!schoolName || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get criteria and temperature
    const { criteria, temperature } = getSchoolCriteria(schoolType || 'default', schoolName)
    const { voice, structure } = getRandomVariation()

    let letterBody

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: {
          temperature,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })

      const prompt = `Tu es un écrivain talentueux qui aide les étudiants à rédiger des lettres de motivation authentiques et captivantes. Tu ne fais JAMAIS de lettres génériques ou robotiques.

## LE CANDIDAT - Apprends à le connaître

**Formation visée** : ${schoolName}
**Domaine** : ${program || 'Non précisé'}

**Ce qui le motive** : ${motivation}

${anecdote ? `**Son moment déclic** : ${anecdote}` : ''}
${challenge ? `**Un défi qu\'il a surmonté** : ${challenge}` : ''}
${uniqueTrait ? `**Ce qui le rend unique** : ${uniqueTrait}` : ''}
${strengths ? `**Ses forces** : ${strengths}` : ''}
${experience ? `**Son expérience** : ${experience}` : ''}

## TON APPROCHE POUR CETTE LETTRE

**Ton à adopter** : ${criteria.tone}
**Focus principal** : ${criteria.focus}

**Voix narrative à utiliser** : ${voice.name}
${voice.style}
Inspiration : "${voice.example}"

**Structure narrative** : ${structure.name}
${structure.description}

## RÈGLES D'ÉCRITURE NATURELLE (CRUCIAL)

### Varier les phrases
- Alterne phrases courtes (5-8 mots) et longues (20-30 mots)
- Utilise des phrases nominales occasionnellement. Comme ça.
- Pose 1-2 questions rhétoriques pour créer du dialogue intérieur

### Éviter le style robot
- JAMAIS de "De plus", "En effet", "Par ailleurs", "Ainsi" en début de phrase
- JAMAIS de listes de qualités ("Je suis rigoureux, motivé, dynamique...")
- Préfère "j'ai découvert que" à "j'ai appris que"
- Préfère "ce qui me fascine" à "ce qui m'intéresse"

### Créer de l'émotion
- Inclure au moins un moment de vulnérabilité ou de doute surmonté
- Utiliser des détails sensoriels quand c'est pertinent
- Montrer plutôt que dire (illustrer par des actions, pas des affirmations)

### Anti-clichés OBLIGATOIRE
Ces formulations sont INTERDITES, utilise les alternatives :
- "Depuis toujours" → Donne une date/moment précis
- "Passionné depuis mon plus jeune âge" → Raconte le vrai déclic
- "Cette formation me permettra de" → "[Nom école] m'attire parce que"
- "Je pense être quelqu'un de" → Montre-le par un exemple
- "J'ai toujours été attiré par" → Raconte quand et comment
- "Votre établissement jouit d'une excellente réputation" → Cite quelque chose de PRÉCIS sur l'école

## CRITÈRES DE QUALITÉ

${criteria.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Mots-clés à tisser naturellement** : ${criteria.keywords.join(', ')}

## FORMAT

Génère UNIQUEMENT le corps de la lettre (350-450 mots).

EXCLUS :
- Formule d'appel ("Madame, Monsieur")
- Formule de politesse finale
- Signature, date, lieu

Commence directement par une accroche qui capte l'attention.`

      const result = await model.generateContent(prompt)
      letterBody = result.response.text()
    } catch (aiError: any) {
      console.log('AI unavailable:', aiError.message)
      // Fallback simple
      letterBody = `Mon parcours m'a naturellement conduit vers ${schoolName}. ${motivation}

${anecdote || ''} ${challenge ? `Cette expérience m'a appris à persévérer.` : ''}

${strengths ? `Mes atouts - ${strengths} - me préparent à relever ce défi.` : ''} ${experience ? `Mon expérience en ${experience} a confirmé cette orientation.` : ''}

${uniqueTrait ? `Ce qui me distingue : ${uniqueTrait}.` : ''} Je suis convaincu que cette formation correspond parfaitement à mes aspirations.`
    }

    // Save to history
    try {
      await supabase.from('letter_history').insert({
        user_id: user.id,
        school_name: schoolName,
        program: program || '',
        letter_content: letterBody,
      })
    } catch (error) {
      console.error('Error saving letter history:', error)
    }

    return NextResponse.json({
      letter: letterBody,
      metadata: {
        schoolName,
        program,
        generatedAt: new Date().toISOString(),
        voice: voice.name,
        structure: structure.name,
      },
    })
  } catch (error: any) {
    console.error('Error generating letter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate letter' },
      { status: 500 }
    )
  }
}
