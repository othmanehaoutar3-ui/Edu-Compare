import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all favorites for the user
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('school_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ favorites: favorites || [] })
  } catch (error: any) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
