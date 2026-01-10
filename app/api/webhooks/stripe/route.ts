import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Update user subscription status
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'premium',
          subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.metadata?.user_id)

      if (error) {
        console.error('Error updating subscription:', error)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      const status = subscription.status === 'active' ? 'premium' : 'free'

      // Find user by subscription ID and update
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscription.id)

      if (error) {
        console.error('Error updating subscription:', error)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Downgrade to free
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'free',
          subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscription.id)

      if (error) {
        console.error('Error canceling subscription:', error)
      }
      break
    }

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
