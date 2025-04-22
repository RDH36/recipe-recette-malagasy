# Recipe-Recette-Malagasy 🇲🇬

Bienvenue sur **Recipe-Recette-Malagasy**, une application mobile qui vous fait découvrir les recettes originales et authentiques de Madagascar.

## À propos du projet

Recipe-Recette-Malagasy est une application [Expo](https://expo.dev) qui présente la richesse culinaire malgache. Découvrez les saveurs uniques, les techniques de préparation traditionnelles et l'histoire derrière chaque plat emblématique de la Grande Île.

## Fonctionnalités

- Catalogue complet de recettes malgaches traditionnelles
- Instructions détaillées étape par étape
- Information sur les ingrédients locaux et leurs substituts
- Catégorisation par région et type de plat
- Possibilité de sauvegarder vos recettes favorites

## Configuration de la base de données

### Structure de la base de données

L'application utilise Supabase pour la gestion de la base de données et l'authentification. La structure principale inclut :

#### Table `users`

- `id` : UUID (clé primaire, référence à auth.users)
- `email` : TEXT (email de l'utilisateur)
- `isPremium` : BOOLEAN (statut premium de l'utilisateur, par défaut FALSE)
- `favorites` : TEXT[] (tableau des IDs de recettes favorites)
- `created_at` : TIMESTAMP WITH TIME ZONE
- `updated_at` : TIMESTAMP WITH TIME ZONE

### Mise en place de la base de données

1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet "SQL Editor"
3. Exécutez le script SQL situé dans `migrations/sql/001_create_users_table.sql`

Ce script crée:

- La table `users`
- Configure Row Level Security (RLS)
- Ajoute des politiques de sécurité
- Crée un trigger pour automatiquement insérer un utilisateur après inscription

### Authentification

L'application utilise l'authentification Google via Supabase. Lorsqu'un utilisateur se connecte, il est automatiquement:

1. Authentifié via Google
2. Ses informations sont stockées dans la table auth.users de Supabase
3. Un enregistrement est créé dans la table users avec les valeurs par défaut (isPremium = false, favorites = [])

### Fonctionnalités utilisateur

- Gestion des recettes favorites
- Statut premium (accès à des fonctionnalités exclusives)
- Mise à jour du profil

## Démarrage rapide

1. Installer les dépendances

   ```bash
   pnpm install
   ```

2. Lancer l'application

   ```bash
   pnpm exec expo start
   ```

Vous pouvez ensuite ouvrir l'application sur:

- Un [build de développement](https://docs.expo.dev/develop/development-builds/introduction/)
- Un [émulateur Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- Un [simulateur iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Structure du projet

L'application utilise le [routage basé sur les fichiers](https://docs.expo.dev/router/introduction/) d'Expo. Vous trouverez les principaux composants dans le répertoire **app**.

## Contribution

Nous accueillons toute contribution pour enrichir notre collection de recettes malgaches. Si vous connaissez des recettes authentiques ou des variantes régionales, n'hésitez pas à contribuer!

## Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Tutoriel Expo](https://docs.expo.dev/tutorial/introduction/)

## Contact

Pour toute question ou suggestion concernant l'application Recipe-Recette-Malagasy, rejoignez notre communauté:

- [GitHub](https://github.com/RDH36/recipe-recette-malagasy.git)
- [Discord](https://chat.expo.dev)
