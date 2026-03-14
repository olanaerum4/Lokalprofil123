import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900">LokalProfil</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Logg inn</Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition">
              Prøv gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Få flere anmeldelser fra fornøyde kunder
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Automatisk SMS-oppfølging for frisører, tannleger, håndverkere og andre service-bedrifter. 
            Reduser no-shows med 40% og få 3x flere Google-anmeldelser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition">
              Start gratis prøveperiode →
            </Link>
            <span className="text-sm text-gray-400 flex items-center justify-center">
              Ingen kort påkrevd · 14 dager gratis
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Hvordan det funker</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Legg til kunde', desc: 'Registrer kunden med navn, telefon og time i kalenderen.' },
              { step: '2', title: 'Automatisk SMS', desc: 'Vi sender påminnelse 24t og 2t før timen. Ingen glemt time!' },
              { step: '3', title: 'Få anmeldelser', desc: 'Etter timen spør vi om tilbakemelding. Fornøyde kunder får link til Google.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Dette får du</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Automatiske SMS-påminnelser',
              'Innsamling av tilbakemeldinger (1-5)',
              'Automatisk Google-review for fornøyde kunder',
              'Oversikt over alle kunder og timer',
              'Statistikk og snittkarakter',
              'Svar på SMS direkte i appen',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Priser</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Gratis', price: '0 kr', period: '/mnd', desc: 'Test i 14 dager', features: ['100 SMS/mnd', '50 kunder', 'Standard support'] },
              { name: 'Standard', price: '499 kr', period: '/mnd', desc: 'For små bedrifter', features: ['Ubegrenset SMS', 'Ubegrenset kunder', 'Prioritet support', 'Statistikk'], popular: true },
              { name: 'Pro', price: '1 999 kr', period: '/mnd', desc: 'White-label løsning', features: ['Egen branding', 'Eget domene', 'API-tilgang', 'Dedikert support'] },
            ].map((p) => (
              <div key={p.name} className={`bg-white rounded-2xl p-6 border ${p.popular ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'}`}>
                {p.popular && <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Mest populær</span>}
                <h3 className="font-bold text-gray-900 mt-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{p.price}</span>
                  <span className="text-gray-400 text-sm">{p.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center mt-6 py-2.5 rounded-lg font-semibold text-sm transition ${p.popular ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                  Kom i gang
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Klar til å få flere anmeldelser?</h2>
          <p className="text-gray-600 mb-8">Start gratis i dag. Ingen binding, kanseller når som helst.</p>
          <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition inline-block">
            Opprett gratis konto →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">LokalProfil</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 LokalProfil. Laget for norske bedrifter.</p>
        </div>
      </footer>
    </div>
  )
}
