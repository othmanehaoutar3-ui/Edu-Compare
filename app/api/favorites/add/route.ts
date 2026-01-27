import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const FREE_FAVORITES_LIMIT = 5

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { schoolId } = await request.json()

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID required' }, { status: 400 })
    }

    // Check subscription status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    const isPremium = profile?.subscription_status === 'premium'

    // Check favorites limit for free users
    if (!isPremium) {
      const { count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count !== null && count >= FREE_FAVORITES_LIMIT) {
        return NextResponse.json({
          error: 'Favorites limit reached',
          limit: FREE_FAVORITES_LIMIT,
          isPremium: false,
          message: `Vous avez atteint la limite de ${FREE_FAVORITES_LIMIT} favoris. Passez Premium pour des favoris illimités !`
        }, { status: 403 })
      }
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, school_id: schoolId })
      .select()
      .single()

    if (error) {
      // Check if already exists
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already in favorites' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true, favorite: data })
  } catch (error: any) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
