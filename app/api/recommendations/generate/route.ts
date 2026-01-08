import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
      .select('subscription_status, preferences')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status !== 'premium') {
      return NextResponse.json({ error: 'Premium required' }, { status: 403 })
    }

    const { limit = 5 } = await request.json()

    // Get user preferences (if available)
    const userPrefs = profile.preferences || {}

    // Build a profile for recommendations
    const userProfile = {
      preferences: userPrefs,
      // You can add more data like past searches, favorites, etc.
    }

    // Get user's favorites to avoid recommending them
    const { data: favorites } = await supabase
      .from('favorites')
      .select('school_id')
      .eq('user_id', user.id)

    const favoriteIds = favorites?.map((f) => f.school_id) || []

    // Generate recommendations with AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Tu es un conseiller d'orientation expert. Analyse ce profil utilisateur et recommande les MEILLEURS types d'écoles/formations qui correspondent :

Profil utilisateur :
${JSON.stringify(userProfile, null, 2)}

Critères à considérer :
- Domaine d'étude préféré
- Budget
- Localisation souhaitée
- Type d'établissement (public/privé)
- Niveau académique
- Objectifs de carrière

Réponds UNIQUEMENT avec un objet JSON dans ce format exact :
{
  "recommendations": [
    {
      "type": "Type d'école (ex: Grande École, Université, IUT)",
      "reason": "Raison principale (max 100 chars)",
      "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"]
    }
  ],
  "matchCriteria": {
    "sector": "Public ou Privé (optionnel)",
    "cities": ["ville1", "ville2"],
    "types": ["type1", "type2"]
  }
}

Limite à ${limit} recommandations maximum. Sois précis et pertinent.`

    const result = await model.generateContent(prompt)
    let aiResponse = result.response.text()

    // Clean the response to extract JSON
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let recommendations
    try {
      recommendations = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback to simple recommendations
      recommendations = {
        recommendations: [
          {
            type: 'Université',
            reason: 'Formation académique solide et accessible',
            keywords: ['recherche', 'théorie', 'public'],
          },
          {
            type: 'Grande École',
            reason: 'Excellence et réseau professionnel',
            keywords: ['prestige', 'sélectif', 'carrière'],
          },
        ],
        matchCriteria: {},
      }
    }

    // Save recommendation request to analytics
    try {
      await supabase.from('recommendations_log').insert({
        user_id: user.id,
        ai_response: recommendations,
      })
    } catch (error) {
      console.error('Error logging recommendation:', error)
    }

    return NextResponse.json({
      recommendations: recommendations.recommendations || [],
      matchCriteria: recommendations.matchCriteria || {},
      excludedFavorites: favoriteIds,
    })
  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
