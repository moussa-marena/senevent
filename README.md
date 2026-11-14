# SénEvent

## Équipe DAWM — Master 1 RETEL

| Membre | Rôle / Implication |
|--------|---------------------|
| Moussa Marena | Développement Full-Stack & Mobile (React Native / Supabase / AsyncStorage) |
| Mansour Niasse | Git Master (Lab 12) & Propriétaire du compte Expo |
| Équipe DAWM | Architecture Monorepo, Package Partagé & Recette Finale |

## En ligne
- **Application web (Vercel) :** https://senevent-equipe-1.vercel.app
- **Application Android (APK) :** https://expo.dev/accounts/moussa-marena/projects/senevent/builds/85db0a8f-7530-4636-a83e-d0c0c5f3523b
- **Version mobile :** 1.0.0 (profil EAS "preview")

Déploiement continu : chaque merge sur `main` met la production web à jour. Chaque Pull Request reçoit une URL de prévisualisation.

## Lancer le projet en local
- **Installation :** `npm install` à la racine
- **Web :** `apps/web`, créer `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), puis `npm run dev`
- **Mobile :** `apps/mobile`, créer `.env` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`), puis `npx expo start`