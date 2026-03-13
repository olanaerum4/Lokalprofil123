import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, sms, fmtTime } from '@/lib/sms'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = adminClient()
  const now = new Date()
  let sent = 0, errors = 0

  try {
    // 24h reminders
    const w24s = new Date(now.getTime() + 23.5 * 3600000)
    const w24e = new Date(now.getTime() + 24.5 * 3600000)
    const { data: r24 } = await sb.from('customers')
      .select('*, businesses(name)').eq('reminded_24h', false)
      .gte('appointment_time', w24s.toISOString()).lte('appointment_time', w24e.toISOString())

    for (const c of r24 ?? []) {
      const ok = await sendSMS(c.phone, sms.reminder24h(c.name, (c.businesses as any).name, fmtTime(c.appointment_time)))
      if (ok) { await sb.from('customers').update({ reminded_24h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // 2h reminders
    const w2s = new Date(now.getTime() + 1.5 * 3600000)
    const w2e = new Date(now.getTime() + 2.5 * 3600000)
    const { data: r2 } = await sb.from('customers')
      .select('*, businesses(name)').eq('reminded_2h', false)
      .gte('appointment_time', w2s.toISOString()).lte('appointment_time', w2e.toISOString())

    for (const c of r2 ?? []) {
      const ok = await sendSMS(c.phone, sms.reminder2h(c.name, (c.businesses as any).name, fmtTime(c.appointment_time)))
      if (ok) { await sb.from('customers').update({ reminded_2h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // Post-appointment review
    const wrs = new Date(now.getTime() - 1.5 * 3600000)
    const wre = new Date(now.getTime() - 0.5 * 3600000)
    const { data: rr } = await sb.from('customers')
      .select('*, businesses(name)').eq('review_requested', false)
      .gte('appointment_time', wrs.toISOString()).lte('appointment_time', wre.toISOString())

    for (const c of rr ?? []) {
      const ok = await sendSMS(c.phone, sms.reviewRequest(c.name, (c.businesses as any).name))
      if (ok) { await sb.from('customers').update({ review_requested: true }).eq('id', c.id); sent++ }
      else errors++
    }

    return NextResponse.json({ ok: true, sent, errors })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
