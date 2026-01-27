import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { schools } from '@/lib/schools'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Fallback calculation algorithm when AI is unavailable
function calculateFallback(average: number, bacType: string, fieldOfStudy: string, school: any, extracurriculars: string) {
  // Base probability from average (0-80 points)
  let baseProb = (average / 20) * 60

  // Bac type bonus (0-15 points)
  if (bacType === 'Général') baseProb += 15
  else if (bacType === 'Technologique') baseProb += 10
  else baseProb += 5

  // School selectivity factor
  if (school.acceptanceRate) {
    baseProb = baseProb * (school.acceptanceRate / 100 + 0.5)
  }

  // Field alignment bonus
  const schoolType = school.type?.toLowerCase() || ''
  if (fieldOfStudy.toLowerCase().includes('commerce') && schoolType.includes('commerce')) baseProb += 10
  if (fieldOfStudy.toLowerCase().includes('ingénieur') && schoolType.includes('ingénieur')) baseProb += 10

  // Extra-curricular bonus
  if (extracurriculars && extracurriculars.length > 20) baseProb += 5

  const probability = Math.min(Math.max(Math.round(baseProb), 5), 95)

  // Determine category
  let category = 'Faibles'
  if (probability >= 75) category = 'Excellentes'
  else if (probability >= 55) category = 'Bonnes'
  else if (probability >= 35) category = 'Moyennes'

  // Generate contextual feedback
  const strengths = []
  const weaknesses = []
  const recommendations = []

  if (average >= 16) strengths.push('Excellente moyenne générale')
  else if (average >= 14) strengths.push('Bonne moyenne générale')
  else weaknesses.push('Moyenne à améliorer')

  if (bacType === 'Général') strengths.push('Bac général valorisé')
  else recommendations.push('Mettre en avant vos compétences pratiques')

  if (extracurriculars) strengths.push('Activités extrascolaires diversifiées')
  else recommendations.push('Développer des activités extrascolaires')

  if (school.sector === 'Public') strengths.push('Formation accessible financièrement')

  recommendations.push('Préparer soigneusement votre lettre de motivation')
  recommendations.push('Vous renseigner sur les spécificités de l\'école')

  return {
    probability,
    category,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 2),
    recommendations: recommendations.slice(0, 3),
    insights: `Avec une moyenne de ${average}/20 et un Bac ${bacType}, vos chances d'admission à ${school.name} sont estimées à ${probability}%. ${category === 'Excellentes' || category === 'Bonnes' ? 'Votre profil correspond bien aux attentes de cette formation.' : 'Il est recommandé de renforcer votre dossier pour maximiser vos chances.'}`
  }
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

    let aiData

    // Try AI first, fallback to algorithm if it fails
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

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
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (aiError: any) {
      console.log('AI unavailable, using fallback algorithm:', aiError.message)
      // Use fallback algorithm
      aiData = calculateFallback(average, bacType, fieldOfStudy, school, extracurriculars)
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
    return NextResponse.json(
      { error: error.message || 'Failed to calculate chances' },
      { status: 500 }
    )
  }
}

