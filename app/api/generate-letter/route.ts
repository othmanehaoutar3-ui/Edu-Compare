import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Letter templates by school type
const TEMPLATES = {
  université: {
    tone: 'académique et rigoureux',
    focus: 'la recherche, les compétences théoriques et l\'excellence académique',
  },
  'grande école': {
    tone: 'professionnel et ambitieux',
    focus: 'le leadership, l\'innovation et les réalisations concrètes',
  },
  iut: {
    tone: 'pratique et concret',
    focus: 'les compétences techniques, les projets pratiques et l\'alternance',
  },
  cpge: {
    tone: 'sérieux et motivé',
    focus: 'la rigueur intellectuelle, le travail acharné et l\'ambition',
  },
  default: {
    tone: 'professionnel et motivé',
    focus: 'vos compétences, votre motivation et vos objectifs',
  },
}

function getTemplate(schoolType: string) {
  const normalizedType = schoolType.toLowerCase()
  for (const [key, template] of Object.entries(TEMPLATES)) {
    if (normalizedType.includes(key)) {
      return template
    }
  }
  return TEMPLATES.default
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

    const { schoolName, program, motivation, strengths, experience, schoolType } = await request.json()

    // Input validation
    if (!schoolName || !program || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields: schoolName, program, motivation' },
        { status: 400 }
      )
    }

    // Get appropriate template
    const template = getTemplate(schoolType || 'default')

    // Generate letter with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Tu es un expert en lettres de motivation pour les écoles supérieures françaises. 
Génère une lettre de motivation professionnelle et personnalisée avec ces informations :

École/Formation : ${schoolName}
Domaine : ${program}
Type d'établissement : ${schoolType || 'Non spécifié'}
Motivation principale : ${motivation}
Points forts : ${strengths || 'Non spécifié'}
Expérience pertinente : ${experience || 'Non spécifié'}

INSTRUCTIONS IMPORTANTES :
- Adopte un ton ${template.tone}
- Mets l'accent sur ${template.focus}
- La lettre doit faire environ 400-500 mots
- Structure classique : introduction (pourquoi cette école), développement (compétences et expérience), conclusion (objectifs futurs)
- Soit personnalisé et sincère, évite les clichés
- Utilise un français impeccable
- Montre une connaissance de l'école (son prestige, ses valeurs, sa pédagogie)
- Connecte les compétences du candidat aux exigences de la formation

IMPORTANT : Génère UNIQUEMENT le corps de la lettre, SANS :
- Formule d'appel ("Madame, Monsieur")
- Formule de politesse finale ("Veuillez agréer...")
- Signature
- Date ou lieu

Commence directement par l'introduction de la lettre.`

    const result = await model.generateContent(prompt)
    const letterBody = result.response.text()

    // Save to history (optional)
    try {
      await supabase.from('letter_history').insert({
        user_id: user.id,
        school_name: schoolName,
        program,
        letter_content: letterBody,
      })
    } catch (error) {
      // Non-critical error, continue
      console.error('Error saving letter history:', error)
    }

    // Return the generated letter with metadata for PDF generation
    return NextResponse.json({
      letter: letterBody,
      metadata: {
        schoolName,
        program,
        generatedAt: new Date().toISOString(),
        template: template.tone,
      },
    })
  } catch (error: any) {
    console.error('Error generating letter:', error)

    // More specific error messages
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate letter' },
      { status: 500 }
    )
  }
}
