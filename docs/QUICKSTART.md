# Snabbguide: Komma igång med Onboarding Wizard

## Steg 1: Logga in
1. Gå till: http://localhost:3000/login
2. Ange din email (den du har tillgång till)
3. Kolla din inbox för magic link från Supabase
4. Klicka på länken → redirectas till `/projects`

## Steg 2: Seeda testdata
Efter du loggat in, gå till Supabase SQL Editor och kör:

```sql
-- Hämta ditt user_id först
SELECT id, email FROM auth.users;
```

Kopiera ditt `id` och kör sedan hela `supabase/seed-test-data.sql` filen.

Alternativt, från terminalen:
```powershell
# Om du har Supabase CLI installerat
supabase db reset

# Eller kör seed-filen direkt
Get-Content supabase\seed-test-data.sql | supabase db execute
```

## Vad händer efter seedning?

Du får testdata:
- ✅ 1 organisation (ACME Corp)
- ✅ 1 projekt (ACME Onboarding - January 2026)
- ✅ 1 wizard (Sales to PM Handover Wizard)
- ✅ 1 wizard instance med 5 steg
- ✅ Alla step types (text, textarea, select, checkbox, country_specific)

## Därefter kan du:

1. **Se projektet** på `/projects`
2. **Klicka "View Wizards"** → ser wizard instances
3. **Klicka "View Details"** → ser wizard med alla steg
4. **Fylla i stegen** och spara
5. **Se progress** uppdateras automatiskt

## Felsökning

**Ser inga projekt efter login?**
- Kör seed-scriptet i Supabase SQL Editor
- Kontrollera att ditt user_id finns i `user_orgs` tabellen

**Fortfarande "You must be logged in"?**
- Cookies kanske inte fungerar lokalt
- Öppna Network tab i DevTools
- Kolla att Supabase cookies sätts efter magic link

**Magic link fungerar inte?**
- Kolla Supabase email settings
- Verifiera att redirect URL är http://localhost:3000/projects
- Kolla spam-mappen
