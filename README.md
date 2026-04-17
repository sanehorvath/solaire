# SOLAIRE DASHBOARD — Guide d'intégration

## Structure des fichiers
```
/
├── index.html                  → Page de connexion
├── dashboard-founder.html      → Dashboard Founder (accès total)
├── dashboard-commercial.html   → Dashboard Commercial (accès limité)
├── netlify.toml                → Config déploiement Netlify
├── css/
│   └── style.css               → Styles globaux
├── js/
│   ├── supabase.js             → Config + données démo
│   ├── tasks.js                → Module tâches
│   ├── calendar.js             → Module calendrier RDV
│   ├── contacts.js             → Module CRM prospects
│   ├── calculator.js           → Module calculateur financier + objectifs
│   └── mail.js                 → Module mail (stub M365)
└── supabase_setup.sql          → Script SQL complet avec données démo
```

---

## ÉTAPE 1 — GitHub

1. Crée un repo GitHub (ex: `solaire-dashboard`)
2. Upload tous les fichiers en gardant la structure exacte
3. Commit et push

---

## ÉTAPE 2 — Supabase

1. Va sur https://supabase.com → Créer un nouveau projet
2. Choisis un nom (ex: `solaire-dashboard`) et un mot de passe fort
3. Une fois créé, va dans **SQL Editor**
4. Copie-colle le contenu de `supabase_setup.sql` et exécute-le
5. Vérifie que les tables apparaissent dans **Table Editor**
6. Récupère tes clés dans **Settings > API** :
   - `Project URL` → remplace `VOTRE_PROJECT_ID.supabase.co` dans `js/supabase.js`
   - `anon public key` → remplace `VOTRE_ANON_KEY` dans `js/supabase.js`

---

## ÉTAPE 3 — Netlify

1. Va sur https://netlify.com
2. New site → Import from Git → GitHub
3. Sélectionne ton repo `solaire-dashboard`
4. Build settings :
   - Build command : (laisser vide)
   - Publish directory : `.`
5. Deploy site
6. Ton site sera dispo sur une URL type `solaire-xxx.netlify.app`
7. Tu peux configurer un domaine custom dans Site Settings > Domain

---

## COMPTES DÉMO (version bêta)

Tous les mots de passe démo : `demo123`

| Email | Rôle | Nom |
|---|---|---|
| sane@solaire.com | Founder | Sane |
| matheo@solaire.com | Founder | Mathéo |
| clement@solaire.com | Founder | Clément |
| hugo@solaire.com | Founder | Hugo |
| commercial1@solaire.com | Commercial | Thomas Dubois |
| commercial2@solaire.com | Commercial | Léa Martin |

---

## ÉTAPE 4 — Connexion Supabase (après test démo)

Quand tu veux passer de la démo au vrai Supabase :
1. Dans `js/supabase.js`, change `const IS_DEMO = true;` en `const IS_DEMO = false;`
2. Remplace les clés Supabase
3. Adapte les fonctions `DB.*` pour appeler l'API Supabase au lieu des données locales
4. Active le Row Level Security (les commandes SQL sont déjà dans `supabase_setup.sql`, en commentaire)

---

## ÉTAPE 5 — Auth Supabase (après test démo)

Remplace le système de login démo par Supabase Auth :
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// Logout
await supabase.auth.signOut();

// Get user
const { data: { user } } = await supabase.auth.getUser();
```

---

## ÉTAPE 6 — Mail Microsoft 365

1. Achète le domaine via Microsoft 365 Business
2. Crée les boîtes mail
3. Va sur https://portal.azure.com → App registrations → New registration
4. Ajoute les permissions `Mail.Read` et `Mail.Send`
5. Récupère le `client_id` et configure OAuth
6. Dans `js/mail.js`, remplace le stub par les vrais appels API Graph

---

## Notes importantes

- En version démo, les données sont stockées en **localStorage** (persistent sur le même navigateur)
- Chaque module JS est indépendant → pour modifier le calculateur, touche seulement `js/calculator.js`
- Le fichier `js/supabase.js` contient TOUTES les données démo et peut être modifié facilement
- Les accès par rôle sont gérés dans chaque module (founder voit tout, commercial voit seulement ses données)
