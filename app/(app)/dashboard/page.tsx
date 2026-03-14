import { serverClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: biz } = await sb.from('businesses').select('*').eq('id', user.id).single()
  if (!biz) redirect('/innstillinger')
  
  // Redirect to settings if business name is not set
  if (!biz.name) redirect('/innstillinger')

  const today = new Date()
  const todayStart = new Date(today); todayStart.setHours(0,0,0,0)
  const todayEnd = new Date(today); todayEnd.setHours(23,59,59,999)

  const [{ data: todayC }, { count: totalC }, { data: feedback }] = await Promise.all([
    sb.from('customers').select('*').eq('business_id', user.id)
      .gte('appointment_time', todayStart.toISOString())
      .lte('appointment_time', todayEnd.toISOString())
      .order('appointment_time'),
    sb.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', user.id),
    sb.from('feedback').select('*, customers(name)').eq('business_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const avg = feedback?.length ? (feedback.reduce((s,f) => s + f.rating, 0) / feedback.length).toFixed(1) : null
  const now = new Date()

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hei, {biz.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">{now.toLocaleDateString('nb-NO', { weekday:'long', day:'numeric', month:'long' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Timer i dag', value: todayC?.length ?? 0 },
          { label: 'Totale kunder', value: totalC ?? 0 },
          { label: 'Tilbakemeldinger', value: feedback?.length ?? 0 },
          { label: 'Snittkarakter', value: avg ? `${avg} ★` : '–' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Timer i dag</h2>
            <Link href="/kunder" className="text-xs text-green-600 font-semibold">+ Legg til</Link>
          </div>
          {!todayC?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen timer i dag</p>
          ) : todayC.map(c => (
            <div key={c.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 ${new Date(c.appointment_time) >= now ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${new Date(c.appointment_time) >= now ? 'bg-green-500' : 'bg-gray-300'}`}/>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${new Date(c.appointment_time) < now ? 'text-gray-400' : ''}`}>{c.name}</p>
                <p className="text-xs text-gray-400">{c.phone}</p>
              </div>
              <span className={`text-xs font-mono font-semibold ${new Date(c.appointment_time) >= now ? 'text-green-700' : 'text-gray-400'}`}>
                {new Date(c.appointment_time).toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'})}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Siste tilbakemeldinger</h2>
            <Link href="/tilbakemeldinger" className="text-xs text-green-600 font-semibold">Se alle</Link>
          </div>
          {!feedback?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen tilbakemeldinger ennå</p>
          ) : feedback.map((f:any) => (
            <div key={f.id} className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                {f.customers?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{f.customers?.name}</span>
                  <span className="text-xs text-amber-500">{'★'.repeat(f.rating)}{'☆'.repeat(5-f.rating)}</span>
                </div>
                {f.message && <p className="text-xs text-gray-400 truncate">{f.message}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!biz.google_review_link && (
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-amber-500 text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Legg til Google-anmeldelseslenke</p>
            <p className="text-xs text-amber-600">Sendes automatisk til fornøyde kunder.</p>
          </div>
          <Link href="/innstillinger" className="text-sm font-semibold text-amber-700 hover:underline">Sett opp →</Link>
        </div>
      )}
    </div>
  )
}
