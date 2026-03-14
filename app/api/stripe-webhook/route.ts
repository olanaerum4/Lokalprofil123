import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'

// Stripe sender events hit når noen betaler via Payment Link
// Sett opp webhook i Stripe Dashboard → Developers → Webhooks
// Event: checkout.session.completed

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  // Verifiser at det faktisk er fra Stripe
  // (enkel versjon uten stripe-pakken — installer med: npm i stripe)
  let event: any
  try {
    const stripe = await import('stripe').then(m => new m.default(process.env.STRIPE_SECRET_KEY!))
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email
    const stripeCustomerId = session.customer

    if (!email) return NextResponse.json({ ok: true })

    const sb = adminClient()

    // Finn bedriften på e-post og aktiver + lagre stripe_customer_id
    const { data: { users }, error: listError } = await sb.auth.admin.listUsers({
      page: 1,
      perPage: 100
    })
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ ok: false, error: 'Failed to find user' }, { status: 500 })
    }
    
    const user = users?.find((u: any) => u.email === email)
    
    if (user?.id) {
      await sb.from('businesses')
        .update({
          is_active: true,
          stripe_customer_id: stripeCustomerId,
          // Forny trial 30 dager frem (= abonnement aktivt)
          trial_ends_at: new Date(Date.now() + 365 * 24 * 3600000).toISOString(),
        })
        .eq('id', user.id)
    }
  }

  return NextResponse.json({ ok: true })
}
