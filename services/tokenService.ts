import { supabase } from "@/config/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const AUTH_TOKEN_KEY = "supabase-auth-token";
const REFRESH_TOKEN_ATTEMPTED_KEY = "refresh-token-attempted";

/**
 * Vérifie si un token existe et est valide
 * @returns {Promise<boolean>} true si le token est valide, false sinon
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Erreur de validation du token:", error.message);
      return false;
    }

    return !!data.session;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return false;
  }
};

/**
 * Rafraîchit le token d'authentification
 * @returns {Promise<boolean>} true si le token a été rafraîchi avec succès, false sinon
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    // Vérifier si nous avons déjà tenté de rafraîchir le token récemment
    const lastAttempt = await AsyncStorage.getItem(REFRESH_TOKEN_ATTEMPTED_KEY);
    const now = Date.now();

    if (lastAttempt) {
      const lastAttemptTime = parseInt(lastAttempt, 10);
      // Éviter de tenter un rafraîchissement plus d'une fois par minute
      if (now - lastAttemptTime < 60000) {
        console.log(
          "Tentative de rafraîchissement trop récente, attente nécessaire"
        );
        return false;
      }
    }

    // Marquer cette tentative
    await AsyncStorage.setItem(REFRESH_TOKEN_ATTEMPTED_KEY, now.toString());

    // Vérifier d'abord si une session existe
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log(
        "Aucune session active trouvée, impossible de rafraîchir le token"
      );
      await clearAuthData(); // Nettoyer les données pour éviter des tentatives futures
      return false;
    }

    // Tenter de rafraîchir explicitement le token
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Échec du rafraîchissement du token:", error.message);

      // Si l'erreur est liée à un token invalide/manquant, nettoyer la session
      if (
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Refresh Token Not Found") ||
        error.message.includes("JWT expired") ||
        error.message.includes("Auth session missing")
      ) {
        await clearAuthData();
      }

      return false;
    }

    console.log("Token rafraîchi avec succès");
    return !!data.session;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    // En cas d'erreur inattendue, nettoyer les données d'authentification
    await clearAuthData();
    return false;
  }
};

/**
 * Supprime toutes les données d'authentification
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    // Nettoyer les données stockées dans AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(
      (key) =>
        key.startsWith("sb-") ||
        key === AUTH_TOKEN_KEY ||
        key === REFRESH_TOKEN_ATTEMPTED_KEY
    );

    if (authKeys.length > 0) {
      console.log(
        `Nettoyage de ${authKeys.length} clés d'authentification en cache`
      );
      await AsyncStorage.multiRemove(authKeys);
    }

    // Tenter la déconnexion de Supabase (en cas d'échec, continuer)
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.log("Erreur lors de la déconnexion Supabase (ignorée):", error);
    }

    console.log("Données d'authentification effacées avec succès");
  } catch (error) {
    console.error(
      "Erreur lors du nettoyage des données d'authentification:",
      error
    );

    // Tenter une approche alternative en cas d'échec
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_ATTEMPTED_KEY);

      // Supprimer les clés Supabase connues
      await AsyncStorage.removeItem("sb-refresh-token");
      await AsyncStorage.removeItem("sb-access-token");
      await AsyncStorage.removeItem("supabase-auth-token");
    } catch (e) {
      console.error("Échec de la méthode alternative de nettoyage:", e);
    }
  }
};

/**
 * Tente de récupérer une session valide, avec rafraîchissement automatique si nécessaire
 * @returns La session si valide, null sinon
 */
export const getValidSession = async () => {
  try {
    // Vérifier d'abord la session actuelle
    const { data, error } = await supabase.auth.getSession();

    // Si la session est valide, la retourner
    if (data?.session && !error) {
      // Vérifier si le token d'accès est proche de l'expiration (moins de 5 minutes)
      const expiresAt = data.session.expires_at;
      const now = Math.floor(Date.now() / 1000); // Convertir en secondes

      // Si le token expire bientôt, tenter de le rafraîchir proactivement
      if (expiresAt && expiresAt - now < 300) {
        console.log("Token proche de l'expiration, rafraîchissement proactif");
        const refreshed = await refreshAuthToken();

        if (refreshed) {
          // Récupérer la nouvelle session après rafraîchissement
          const { data: refreshedData } = await supabase.auth.getSession();
          return refreshedData.session;
        }
        // Si le rafraîchissement échoue, retourner quand même la session actuelle
        return data.session;
      }

      return data.session;
    }

    // Si erreur de token expiré ou invalide, tenter un rafraîchissement
    if (error) {
      console.log("Erreur de session détectée:", error.message);

      if (
        error.message.includes("JWT expired") ||
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Refresh Token Not Found") ||
        error.message.includes("Auth session missing")
      ) {
        console.log("Tentative de rafraîchissement du token");
        const refreshed = await refreshAuthToken();

        if (refreshed) {
          // Récupérer la nouvelle session après rafraîchissement
          const { data: refreshedData } = await supabase.auth.getSession();
          if (refreshedData?.session) {
            return refreshedData.session;
          }
        }
      }
    }

    // Si la session est toujours inexistante après tentative de rafraîchissement
    if (!data?.session) {
      console.log(
        "Aucune session valide trouvée après tentative de rafraîchissement"
      );
      // En cas d'échec, nettoyer les données d'authentification
      await clearAuthData();
      return null;
    }

    return null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération d'une session valide:",
      error
    );
    // En cas d'erreur inattendue, nettoyer les données d'authentification
    await clearAuthData();
    return null;
  }
};
