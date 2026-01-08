import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
