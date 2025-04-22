import { supabase } from "@/config/supabase";
import { getRecipeById } from "@/services/recipeService";
import { createOrUpdateUser } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
import { Session } from "@supabase/supabase-js";

/**
 * Initialise les données de l'application au démarrage
 */
export const initAppData = async (): Promise<void> => {
  try {
    // Récupérer la session actuelle
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Si aucune session, réinitialiser les états
    if (!session) {
      // Réinitialiser l'état utilisateur et premium
      useStore.getState().setUser(null);
      useStore.getState().setIsPremium(false);
      useStore.getState().setFavorites([]);
      return;
    }

    // Charger les données utilisateur
    await loadUserData(session);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'app:", error);
  }
};

/**
 * Charge les données de l'utilisateur et met à jour le store
 */
export const loadUserData = async (session: Session): Promise<void> => {
  try {
    const userId = session.user.id;
    const email = session.user.email || "";

    // Créer ou récupérer l'utilisateur
    const user = await createOrUpdateUser(userId, email);

    if (user) {
      // Mettre à jour l'état utilisateur
      useStore.getState().setUser(user);

      // Mettre à jour l'état premium
      const isPremium = user.isPremium;
      useStore.getState().setIsPremium(isPremium);

      // Charger les favoris
      await loadFavoriteRecipes(user.favorites);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données utilisateur:", error);
  }
};

/**
 * Charge les recettes favorites de l'utilisateur
 */
const loadFavoriteRecipes = async (favoriteIds: string[]): Promise<void> => {
  try {
    if (favoriteIds.length === 0) {
      useStore.getState().setFavorites([]);
      return;
    }

    // Récupérer chaque recette favorite une par une (pour gérer les erreurs individuelles)
    const favoriteRecipes: Recipe[] = [];

    // Boucle sur tous les IDs de favoris
    for (const recipeId of favoriteIds) {
      try {
        const recipe = await getRecipeById(recipeId);
        if (recipe) {
          favoriteRecipes.push(recipe);
        }
      } catch (error) {
        console.error(
          `Erreur lors de la récupération de la recette ${recipeId}:`,
          error
        );
        // Continuer avec la prochaine recette
      }
    }

    // Mettre à jour le store avec les recettes récupérées
    useStore.getState().setFavorites(favoriteRecipes);
  } catch (error) {
    console.error("Erreur lors du chargement des recettes favorites:", error);
  }
};

/**
 * Fonction pour gérer les changements d'état d'authentification
 */
export const setupAuthStateListener = (): (() => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      // Utilisateur connecté
      await loadUserData(session);
    } else {
      // Utilisateur déconnecté
      useStore.getState().setUser(null);
      useStore.getState().setIsPremium(false);
      useStore.getState().setFavorites([]);
    }
  });

  // Retourner la fonction pour nettoyer l'abonnement
  return () => {
    subscription.unsubscribe();
  };
};
