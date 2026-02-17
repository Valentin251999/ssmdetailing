# 🔐 Configurare Admin - Instrucțiuni

## Creare Cont Admin

Pentru a crea primul cont de administrator, urmează acești pași:

### Pasul 1: Accesează Supabase Dashboard

1. Accesează [supabase.com](https://supabase.com) și loghează-te
2. Selectează proiectul tău
3. Navighează la secțiunea **Authentication** din meniul lateral

### Pasul 2: Creează Utilizatorul Admin

1. Click pe **"Add user"** sau **"Create user"**
2. Selectează **"Create new user"**
3. Completează:
   - **Email**: emailul tău de administrator (ex: `admin@detailingsite.com`)
   - **Password**: o parolă puternică (minim 8 caractere)
4. **IMPORTANT**: Bifează opțiunea **"Auto Confirm User"** pentru a evita necesitatea confirmării prin email
5. Click pe **"Create user"**

### Pasul 3: Testează Autentificarea

1. Accesează site-ul tău și navighează la `/admin-panel` sau `/admin`
2. Vei fi redirecționat automat către pagina de login
3. Introdu emailul și parola create în Pasul 2
4. Dacă totul este configurat corect, vei avea acces la Admin Panel

## Schimbarea Parolei

Pentru a schimba parola unui utilizator existent:

1. Mergi în Supabase Dashboard → **Authentication** → **Users**
2. Click pe utilizatorul dorit
3. Click pe **"Reset password"**
4. Setează noua parolă
5. Salvează modificările

## Securitate

✅ **CE ESTE PROTEJAT:**
- Toate rutele `/admin` și `/admin-panel` necesită autentificare
- După logout, ești automat redirecționat către pagina de login
- Sesiunile sunt gestionate automat de Supabase

✅ **BEST PRACTICES:**
- Folosește o parolă puternică (minim 12 caractere, litere mari/mici, cifre, simboluri)
- NU împărtăși credențialele admin cu nimeni
- Schimbă parola periodic (la 3-6 luni)

## Logout

Pentru a te deconecta din Admin Panel:
- Click pe butonul **"Ieșire"** din colțul dreapta-sus al Admin Panel-ului

## Probleme Comune

### Nu pot să mă logheze
- Verifică că emailul și parola sunt corecte
- Verifică că utilizatorul este confirmat în Supabase (coloana `confirmed_at` nu trebuie să fie null)

### Am uitat parola
- Accesează Supabase Dashboard și resetează parola manual pentru utilizatorul tău

### Primesc eroare la login
- Verifică că variabilele de mediu din `.env` sunt configurate corect
- Verifică că `VITE_SUPABASE_URL` și `VITE_SUPABASE_ANON_KEY` sunt setate
