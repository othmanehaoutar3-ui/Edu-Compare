# 🎓 Sup Advisor - Trouvez l'école parfaite

Sup Advisor est une plateforme d'aide à l'orientation utilisant l'intelligence artificielle pour aider les étudiants à trouver l'école qui leur correspond et à estimer leurs chances d'admission.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=flat&logo=stripe)

## ✨ Fonctionnalités

### 🆓 Plan Gratuit
- **Catalogue de 500+ écoles** vérifiées et reconnues par l'État
- **Recherche et filtres** avancés (ville, domaine, niveau)
- **Fiches détaillées** des écoles avec toutes les informations importantes
- **Carte interactive** pour visualiser géographiquement les écoles
- **Système de favoris** (max 5 écoles)
- **Liste noire** des écoles à éviter

### 💎 Plan Premium
- Toutes les fonctionnalités gratuites
- **Calculateur IA illimité** - Estimez vos chances d'admission
- **Générateur de lettres** - Lettres de motivation personnalisées par IA
- **Statistiques avancées** - Taux d'admission, salaires moyens, etc.
- **Favoris illimités**
- **Recommandations personnalisées** basées sur votre profil
- **Suivi de candidatures**
- **Support prioritaire**

## 🚀 Stack Technique

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Langage**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de données**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Paiements**: [Stripe](https://stripe.com/)
- **IA**: [Google Gemini AI](https://ai.google.dev/)
- **Cartes**: [Leaflet](https://leafletjs.com/) + React Leaflet
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icônes**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📋 Prérequis

- **Node.js** 18.17 ou supérieur
- **npm** ou **yarn**
- **Compte Supabase** (gratuit)
- **Compte Stripe** (mode test gratuit)
- **Clé API Gemini** (gratuite)

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/your-username/edu-compare.git
cd edu-compare
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configurer les variables d'environnement

Copiez le fichier `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Puis remplissez les valeurs dans `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Configurer Supabase

#### A. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et la clé API dans les paramètres

#### B. Exécuter les migrations

Connectez-vous à votre projet Supabase et exécutez les fichiers SQL dans l'ordre :

```bash
supabase/migrations/create_user_profiles_table.sql
supabase/migrations/create_favorites_table.sql
supabase/migrations/create_letter_history_table.sql
supabase/migrations/create_recommendations_log_table.sql
```

Ou via le CLI Supabase :

```bash
supabase db push
```

### 5. Configurer Stripe

#### A. Créer les produits

1. Allez dans votre [Dashboard Stripe](https://dashboard.stripe.com/test/products)
2. Créez un produit "Premium Mensuel" à 9,99€/mois
3. Créez un produit "Premium Annuel" à 79,99€/an
4. Copiez les Price IDs dans `.env.local`

#### B. Configurer le webhook

1. Allez dans [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Ajoutez un endpoint : `https://yourdomain.com/api/webhooks/stripe`
3. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copiez le signing secret dans `STRIPE_WEBHOOK_SECRET`

### 6. Obtenir une clé Gemini AI

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une clé API
3. Copiez-la dans `GEMINI_API_KEY`

### 7. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Structure du projet

```
├── app/                      # Pages Next.js (App Router)
│   ├── api/                  # Routes API
│   │   ├── calculate-chances/
│   │   ├── create-checkout-session/
│   │   ├── favorites/
│   │   ├── generate-letter/
│   │   ├── recommendations/
│   │   └── webhooks/
│   ├── auth/                 # Authentification
│   ├── calculator/           # Calculateur de chances
│   ├── dashboard/            # Tableau de bord utilisateur
│   ├── favorites/            # Favoris
│   ├── legal/                # Pages légales
│   ├── letter-generator/     # Générateur de lettres
│   ├── login/                # Connexion
│   ├── map/                  # Carte interactive
│   ├── pricing/              # Abonnements
│   ├── schools/              # Catalogue d'écoles
│   └── signup/               # Inscription
├── components/               # Composants réutilisables
├── context/                  # Contextes React
├── lib/                      # Utilitaires et configurations
│   ├── supabase/
│   ├── stripe/
│   └── data.json             # Base de données des écoles
├── public/                   # Assets statiques
└── supabase/                 # Migrations SQL
    └── migrations/
```

## 📦 Build de production

### Build local

```bash
npm run build
npm start
```

### Déploiement sur Vercel

1. Installez la CLI Vercel :

```bash
npm i -g vercel
```

2. Déployez :

```bash
vercel
```

3. Configurez les variables d'environnement dans le dashboard Vercel

4. Mettez à jour `NEXT_PUBLIC_APP_URL` avec votre URL de production

5. Configurez le webhook Stripe avec votre URL de production

### Déploiement manuel

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- [Vercel](https://vercel.com/) (recommandé)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Digital Ocean](https://www.digitalocean.com/)

## 🧪 Tests

```bash
# Lancer les tests (à implémenter)
npm test

# Build de production
npm run build

# Linter
npm run lint
```

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Créer un build de production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint

## 🔒 Sécurité

- Authentification via Supabase Auth (OAuth + Email)
- Row Level Security (RLS) activé sur toutes les tables
- Mots de passe hachés (bcrypt)
- HTTPS forcé en production
- Validation des entrées utilisateur
- Protection CSRF
- Paiements sécurisés via Stripe

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

## 🤝 Support

Pour toute question ou problème :

- **Email**: contact@yourdomain.com
- **Issues GitHub**: [https://github.com/your-username/edu-compare/issues](https://github.com/your-username/edu-compare/issues)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [Lucide Icons](https://lucide.dev/)

---

Développé avec ❤️ par l'équipe Sup Advisor
