import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { schools } from '@/lib/schools'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

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
      average, 
      bacType, 
      fieldOfStudy, 
      extracurriculars 
    } = await request.json()

    // Input validation
    if (!schoolName || !average || !bacType || !fieldOfStudy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find school data
    const school = schools.find(s => s.name === schoolName)
    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    // Build AI prompt with school context
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Tu es un expert en orientation scolaire et admission dans l'enseignement supérieur français. 
Tu dois analyser avec précision les chances d'admission d'un candidat dans une école.

📚 **INFORMATIONS SUR L'ÉCOLE :**
- Nom : ${school.name}
- Ville : ${school.city}
- Type : ${school.type}
- Secteur : ${school.sector}
${school.ranking ? `- Classement : #${school.ranking}` : ''}
${school.acceptanceRate ? `- Taux d'acceptation moyen : ${school.acceptanceRate}%` : ''}

👤 **PROFIL DU CANDIDAT :**
- Moyenne générale : ${average}/20
- Type de Bac : ${bacType}
- Domaine d'études : ${fieldOfStudy}
- Activités extrascolaires : ${extracurriculars || 'Aucune spécifiée'}

📊 **MISSION :**
Analyse ce profil et fournis une évaluation RÉALISTE et BASÉE SUR DES DONNÉES.

**IMPORTANT : Réponds UNIQUEMENT avec un JSON valide dans ce format exact :**

{
  "probability": [nombre entre 0 et 100],
  "category": "[Excellentes|Bonnes|Moyennes|Faibles]",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "weaknesses": ["point faible 1", "point faible 2"],
  "recommendations": ["recommandation 1", "recommandation 2", "recommandation 3"],
  "insights": "Un paragraphe d'analyse détaillée expliquant le score et les facteurs déterminants"
}

**CRITÈRES D'ÉVALUATION :**
1. La moyenne générale (très important)
2. Le type de Bac (alignement avec le domaine)
3. Les activités extrascolaires (différenciation)
4. La sélectivité de l'école
5. La cohérence du profil avec le secteur de l'école

Sois HONNÊTE et PRÉCIS. Ne surestime ni ne sous-estime. Base ton évaluation sur des critères objectifs.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse AI response
    let aiData
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.log('Raw response:', response)
      
      // Fallback to simulated calculation
      const baseProb = average * 4 + (bacType === 'Général' ? 10 : 5)
      const schoolFactor = school.acceptanceRate ? (school.acceptanceRate / 100) * 20 : 0
      const probability = Math.min(Math.max(baseProb + schoolFactor, 10), 95)
      
      aiData = {
        probability: Math.round(probability),
        category: probability >= 70 ? 'Bonnes' : probability >= 50 ? 'Moyennes' : 'Faibles',
        strengths: ['Profil intéressant', 'Formation adaptée'],
        weaknesses: ['Données insuffisantes pour analyse complète'],
        recommendations: ['Renforcer le dossier', 'Préparer les entretiens'],
        insights: 'Analyse basée sur les données disponibles. Pour une évaluation plus précise, consultez directement l\'école.'
      }
    }

    // Validate and normalize the data
    const calculationResult = {
      probability: Math.min(Math.max(Number(aiData.probability) || 50, 0), 100),
      category: aiData.category || 'Moyennes',
      strengths: Array.isArray(aiData.strengths) ? aiData.strengths : [],
      weaknesses: Array.isArray(aiData.weaknesses) ? aiData.weaknesses : [],
      recommendations: Array.isArray(aiData.recommendations) ? aiData.recommendations : [],
      insights: aiData.insights || 'Analyse en cours...',
      schoolInfo: {
        name: school.name,
        type: school.type,
        city: school.city,
        sector: school.sector
      }
    }

    // Save calculation to history (optional)
    try {
      await supabase.from('calculation_history').insert({
        user_id: user.id,
        school_name: schoolName,
        probability: calculationResult.probability,
        student_data: { average, bacType, fieldOfStudy, extracurriculars }
      })
    } catch (error) {
      // Non-critical error
      console.error('Error saving calculation history:', error)
    }

    return NextResponse.json(calculationResult)
  } catch (error: any) {
    console.error('Error calculating chances:', error)

    // More specific error messages
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Service temporairement indisponible. Veuillez réessayer plus tard.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to calculate chances' },
      { status: 500 }
    )
  }
}
