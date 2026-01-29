import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - List all applications for the user
export async function GET() {
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

        const { data: applications, error } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching applications:', error)
            return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
        }

        return NextResponse.json({ applications })
    } catch (error: any) {
        console.error('Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Create a new application
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

        const { school_id, school_name, status, notes, deadline } = await request.json()

        if (!school_id || !school_name) {
            return NextResponse.json(
                { error: 'school_id and school_name are required' },
                { status: 400 }
            )
        }

        const { data: application, error } = await supabase
            .from('applications')
            .insert({
                user_id: user.id,
                school_id,
                school_name,
                status: status || 'pending',
                notes,
                deadline,
                applied_at: status === 'sent' ? new Date().toISOString() : null,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating application:', error)
            return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
        }

        return NextResponse.json({ application })
    } catch (error: any) {
        console.error('Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Update an application
export async function PUT(request: Request) {
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

        const { id, status, notes, deadline } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
        }

        const updateData: any = { updated_at: new Date().toISOString() }
        if (status !== undefined) {
            updateData.status = status
            if (status === 'sent' && !updateData.applied_at) {
                updateData.applied_at = new Date().toISOString()
            }
        }
        if (notes !== undefined) updateData.notes = notes
        if (deadline !== undefined) updateData.deadline = deadline

        const { data: application, error } = await supabase
            .from('applications')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating application:', error)
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        return NextResponse.json({ application })
    } catch (error: any) {
        console.error('Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Delete an application
export async function DELETE(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error deleting application:', error)
            return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
