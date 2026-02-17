# Ghid SEO - SSM Detailing

## Ce am implementat

### ✅ 1. Sitemap XML (`/public/sitemap.xml`)
- Fișier XML cu toate paginile importante
- Google îl folosește pentru indexare
- **Următorii pași**: După deployment, adaugă sitemap-ul în Google Search Console

### ✅ 2. Robots.txt (`/public/robots.txt`)
- Controlează ce pot indexa motoarele de căutare
- Blochează zona admin
- Include referință către sitemap

### ✅ 3. Meta Tags Optimizate
- Title și description unice pentru fiecare pagină
- Open Graph tags pentru Facebook/LinkedIn
- Twitter Card tags
- Keywords relevante
- Canonical URLs pentru evitarea duplicate content

### ✅ 4. Schema.org Structured Data (JSON-LD)
- LocalBusiness markup în `index.html`
- Apare în Google Maps și Google Local Search
- Include adresă, rating potențial, program

### ✅ 5. Optimizări Tehnice
- `lang="ro"` în HTML pentru limba română
- `robots` meta tag: "index, follow"
- Preconnect pentru fonts (performanță)
- Theme color pentru mobile browsers
- Canonical links pe toate paginile

### ✅ 6. Securitate și Performanță Database
- Toate policy-urile RLS optimizate cu `(select auth.uid())`
- Eliminate indexurile neutilizate
- Consolidate politicile duplicate
- Validare adăugată pentru formulare publice

## Ce trebuie să faci manual

### 1. Google Search Console
1. Mergi la https://search.google.com/search-console
2. Adaugă site-ul `ssmdetailing.ro`
3. Verifică ownership (prin DNS sau file upload)
4. Adaugă sitemap: `https://ssmdetailing.ro/sitemap.xml`

### 2. Google Business Profile
1. Creează/revendică profilul de business pe Google Maps
2. Adaugă:
   - Adresa completă
   - Program de lucru
   - Poze cu lucrările
   - Categorie: "Auto detailing service"
   - Link către site: `https://ssmdetailing.ro`

### 3. Schema.org - Date Complete
Actualizează în `src/utils/seo.ts`:
```typescript
export const localBusinessSchema = {
  // Adaugă telefon, program, coordonate GPS
  telephone: '+40-XXX-XXX-XXX',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.XXXXX,  // GPS real
    longitude: 26.XXXXX
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ]
};
```

### 4. Actualizare Link-uri Social Media
În `src/utils/seo.ts`, înlocuiește:
```typescript
sameAs: [
  'https://www.facebook.com/ssmdetailing',  // Link real FB
  'https://www.instagram.com/ssmdetailing', // Link real IG
  'https://www.tiktok.com/@ssmdetailing'    // Link real TikTok
]
```

### 5. Alt Text pentru Imagini
Când adaugi imagini în Portfolio/Gallery prin admin:
- Folosește descrieri clare: "BMW Seria 5 după detailing interior complet"
- Include cuvinte cheie: "detailing", "starlight", "recondiționare"

### 6. Analytics (opțional dar recomandat)
Adaugă Google Analytics 4 în `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Verificare SEO

### Tools de verificat:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Verifică performanța
   - Obține recomandări mobile/desktop

2. **Google Search Console**
   - Monitorizează indexarea
   - Verifică erori
   - Vezi pentru ce cuvinte cheie apari

3. **Schema Markup Validator**: https://validator.schema.org/
   - Verifică structured data

4. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - Confirmă că site-ul e mobile-friendly

## Cuvinte Cheie Țintite

### Primare:
- detailing auto
- plafon starlight
- curățare auto profesională
- recondiționare faruri
- detailing Mărculești
- detailing Ialomița

### Secundare:
- detailing interior auto
- detailing exterior auto
- spălare auto premium
- curățare tapițerie auto
- polish faruri

## Următorii Pași pentru Creștere SEO

1. **Content Marketing**
   - Adaugă secțiune blog cu articole despre detailing
   - Ghiduri: "Cum să îți menții plafoanul starlight"
   - Before/after case studies

2. **Local SEO**
   - Creează landing pages pentru orașe din zonă
   - "Detailing auto în Fetești", "Detailing Slobozia", etc.

3. **Link Building**
   - Directoare locale (PaginaDeRomânia, Cylex, etc.)
   - Parteneriate cu service-uri auto
   - Guest posting pe bloguri auto

4. **Video SEO**
   - Adaugă video descriptions optimizate
   - Thumbnail-uri custom
   - Captions/subtitles în română

5. **Reviews**
   - Încurajează clienții să lase review-uri pe Google
   - Răspunde la toate review-urile (bune și rele)
   - Afișează-le prominent pe site (deja implementat)

## Monitorizare

### Săptămânal:
- Verifică poziția în Google pentru cuvinte cheie principale
- Monitorizează traficul în Analytics

### Lunar:
- Analizează rapoartele Search Console
- Verifică broken links
- Actualizează sitemap-ul cu pagini noi

### Trimestrial:
- Audit SEO complet
- Actualizează meta descriptions
- Refresh content vechi
