# LokalProfil - SMS Oppfølging for Lokale Bedrifter

Automatisk SMS-påminnelse og tilbakemeldings-system for service-bedrifter (frisører, tannleger, håndverkere, etc.)

## Funksjoner

- ✅ **Automatiske SMS-påminnelser** - 24t og 2t før time
- ✅ **Tilbakemeldings-innhenting** - 1t etter time, med karakter 1-5
- ✅ **Google-anmeldelses-lenke** - sendes automatisk til fornøyde kunder (4-5)
- ✅ **Dashboard** - oversikt over dagens timer og tilbakemeldinger
- ✅ **Kundebehandling** - legg til, søk, og administrer kunder

## Teknisk Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Supabase
- **Database:** PostgreSQL (Supabase)
- **SMS:** 46elks API
- **Hosting:** Vercel

## Kom i gang

### 1. Klon repoet
```bash
git clone https://github.com/olanaerum4/Lokalprofil123.git
cd Lokalprofil123
```

### 2. Installer avhengigheter
```bash
npm install
```

### 3. Sett opp miljøvariabler
Opprett `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_anon_key
SUPABASE_SERVICE_ROLE_KEY=din_service_role_key
ELKS_USERNAME=din_46elks_brukernavn
ELKS_PASSWORD=din_46elks_passord
NEXT_PUBLIC_APP_URL=https://din-app.vercel.app
CRON_SECRET=en_tilfeldig_streng_for_cron
```

### 4. Sett opp Supabase
Kjør SQL-en i `supabase-schema.sql` i Supabase SQL Editor.

### 5. Kjør lokalt
```bash
npm run dev
```

### 6. Deploy til Vercel
```bash
vercel --prod
```

## Viktig: Sett opp Cron Job

For at SMS-ene skal sendes automatisk, må du sette opp en cron job i Vercel:

1. Gå til **Settings** → **Cron Jobs** i Vercel dashboard
2. Legg til: `0 * * * *` (hver time) → `https://din-app.vercel.app/api/cron`
3. Legg til header: `Authorization: Bearer din_CRON_SECRET`

## Prising

- **Gratis prøveperiode:** 14 dager
- **Standard:** 499 kr/mnd (ubegrensete SMS)
- **White-label:** 1999 kr/mnd (egen branding)

## Kontakt

Ola Nærum - olanaerum4@gmail.com
