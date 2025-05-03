import { supabase } from "@/config/supabase";
import { getRecipeById } from "@/services/recipeService";
import { getValidSession, refreshAuthToken } from "@/services/tokenService";
import { createOrUpdateUser } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
import { Session } from "@supabase/supabase-js";

// Constantes pour la gestion des tentatives et timeouts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde
const API_TIMEOUT = 5000; // 5 secondes pour les appels API
const NETWORK_TIMEOUT_ERROR = "Délai d'attente de la requête dépassé";

/**
 * Fonction utilitaire pour attendre un délai spécifié
 */
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Fonction utilitaire pour ajouter un timeout à une promesse
 */
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error(errorMessage)),
      timeoutMs
    );
  });

  return Promise.race([
    promise.then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    }),
    timeoutPromise,
  ]);
};

/**
 * Réinitialise tous les états et effectue une déconnexion propre
 */
const resetAppState = async (): Promise<void> => {
  try {
    // Déconnexion explicite de Supabase pour nettoyer les tokens
    await withTimeout(
      supabase.auth.signOut(),
      API_TIMEOUT,
      "La déconnexion a pris trop de temps"
    );
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  } finally {
    // Réinitialiser tous les états, quelle que soit l'issue de la déconnexion
    useStore.getState().setUser(null);
    useStore.getState().setIsPremium(false);
    useStore.getState().setIsLifetime(false);
    useStore.getState().setFavorites([]);
  }
};

/**
 * Initialise les données de l'application au démarrage avec gestion des tentatives
 */
export const initAppData = async (): Promise<void> => {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Utiliser le nouveau service de gestion des tokens pour obtenir une session valide
      const session = await getValidSession();

      // Si aucune session valide n'a pu être obtenue (même après tentative de rafraîchissement)
      if (!session) {
        console.log("Aucune session valide, réinitialisation de l'état");
        await resetAppState();
        return;
      }

      // Charger les données utilisateur
      await loadUserData(session);
      return; // Succès, on sort de la fonction
    } catch (error) {
      // Vérifier si c'est une erreur d'authentification ou de timeout
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes("Invalid Refresh Token") ||
        errorMessage.includes("Refresh Token Not Found") ||
        errorMessage.includes("JWT expired")
      ) {
        // Tenter de rafraîchir le token
        const refreshed = await refreshAuthToken();

        if (refreshed) {
          console.log(
            "Token rafraîchi avec succès, reprise de l'initialisation"
          );
          continue; // Reprendre la boucle avec le nouveau token
        } else {
          console.log(
            "Échec du rafraîchissement du token, réinitialisation de l'état"
          );
          await resetAppState();
          return;
        }
      }

      // Si c'est une erreur de timeout, ne pas afficher l'erreur complète
      if (errorMessage === NETWORK_TIMEOUT_ERROR) {
        console.log("Délai d'attente réseau dépassé, nouvelle tentative...");
      } else {
        console.error(
          `Tentative ${retryCount + 1}/${MAX_RETRIES} échouée:`,
          error
        );
      }

      retryCount++;

      if (retryCount < MAX_RETRIES) {
        await wait(RETRY_DELAY);
      } else {
        console.error(
          "Erreur lors de l'initialisation de l'app après plusieurs tentatives"
        );
        // Réinitialiser les états en cas d'échec final
        await resetAppState();
      }
    }
  }
};

/**
 * Charge les données de l'utilisateur et met à jour le store avec gestion des tentatives
 */
export const loadUserData = async (session: Session): Promise<void> => {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const userId = session.user.id;
      const email = session.user.email || "";

      // Créer ou récupérer l'utilisateur avec timeout
      const user = await withTimeout(
        createOrUpdateUser(userId, email),
        API_TIMEOUT,
        NETWORK_TIMEOUT_ERROR
      );

      if (user) {
        // Mettre à jour l'état utilisateur
        useStore.getState().setUser(user);

        // Mettre à jour l'état premium
        const isPremium = user.isPremium;
        useStore.getState().setIsPremium(isPremium);

        // Mettre à jour l'état lifetime
        const isLifetime = user.isLifetime;
        useStore.getState().setIsLifetime(isLifetime);

        // Charger les favoris
        await loadFavoriteRecipes(user.favorites);
      }
      return; // Succès, on sort de la fonction
    } catch (error) {
      // Si c'est une erreur de timeout, ne pas afficher l'erreur complète
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage === NETWORK_TIMEOUT_ERROR) {
        console.log(
          "Délai d'attente lors du chargement des données utilisateur, nouvelle tentative..."
        );
      } else {
        console.error(
          `Tentative ${retryCount + 1}/${MAX_RETRIES} échouée:`,
          error
        );
      }

      retryCount++;

      if (retryCount < MAX_RETRIES) {
        await wait(RETRY_DELAY);
      } else {
        console.error(
          "Erreur lors du chargement des données utilisateur après plusieurs tentatives"
        );
        // En cas d'échec persistant, marquer l'utilisateur comme déconnecté
        await resetAppState();
      }
    }
  }
};

/**
 * Charge les recettes favorites de l'utilisateur avec gestion des erreurs améliorée
 */
const loadFavoriteRecipes = async (favoriteIds: string[]): Promise<void> => {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
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
    // En cas d'erreur, on définit simplement un tableau vide
    useStore.getState().setFavorites([]);
  }
};

/**
 * Fonction pour gérer les changements d'état d'authentification
 */
export const setupAuthStateListener = (): (() => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`Événement d'authentification détecté: ${event}`);

    if (event === "TOKEN_REFRESHED") {
      console.log("Token rafraîchi avec succès");

      if (session) {
        // Recharger les données utilisateur avec le nouveau token
        await loadUserData(session);
      }
    } else if (session) {
      // Utilisateur connecté
      await loadUserData(session);
    } else {
      // Utilisateur déconnecté
      useStore.getState().setUser(null);
      useStore.getState().setIsPremium(false);
      useStore.getState().setIsLifetime(false);
      useStore.getState().setFavorites([]);
    }
  });

  // Retourner la fonction pour nettoyer l'abonnement
  return () => {
    subscription.unsubscribe();
  };
};
