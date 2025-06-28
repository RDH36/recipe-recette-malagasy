import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const AUTH_TOKEN_KEY = "supabase-auth-token-v2";
const REFRESH_TOKEN_ATTEMPTED_KEY = "refresh-token-attempted";
const LAST_VALID_SESSION_KEY = "last-valid-session";
const SESSION_EXPIRY_BUFFER = 12 * 60 * 60 * 1000; // 12 heures en millisecondes

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
 * Rafraîchit le token d'authentification avec une stratégie robuste
 * @returns {Promise<boolean>} true si le token a été rafraîchi avec succès, false sinon
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    console.log("Tentative de rafraîchissement du token d'authentification");

    // Vérifier si nous avons déjà tenté de rafraîchir le token récemment
    const lastAttempt = await AsyncStorage.getItem(REFRESH_TOKEN_ATTEMPTED_KEY);
    const now = Date.now();

    if (lastAttempt) {
      const lastAttemptTime = parseInt(lastAttempt, 10);
      // Éviter de tenter un rafraîchissement plus d'une fois par 20 secondes
      // Augmenté pour éviter les problèmes de déconnexion fréquente
      if (now - lastAttemptTime < 20000) {
        console.log(
          "Tentative de rafraîchissement trop récente, attente nécessaire"
        );
        return true; // Retourner true pour éviter des déconnexions inutiles
      }
    }

    // Marquer cette tentative
    await AsyncStorage.setItem(REFRESH_TOKEN_ATTEMPTED_KEY, now.toString());

    // Vérifier d'abord si une session existe
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    // Gérer les erreurs de récupération de session de manière plus tolérante
    if (sessionError) {
      console.warn(
        "Erreur lors de la récupération de la session:",
        sessionError.message
      );

      // Si l'erreur est liée à un problème réseau, on considère que le token pourrait être valide
      if (
        sessionError.message.includes("network") ||
        sessionError.message.includes("timeout") ||
        sessionError.message.includes("connection")
      ) {
        console.log(
          "Problème réseau détecté, on considère le token comme potentiellement valide"
        );
        return true;
      }
    }

    // Si nous avons une session valide
    if (sessionData?.session) {
      // Vérifier si le token est sur le point d'expirer
      const expiresAt = new Date(
        (sessionData.session.expires_at || 0) * 1000
      ).getTime();
      const timeUntilExpiry = expiresAt - now;

      // Si le token expire bientôt ou est déjà expiré, le rafraîchir
      if (timeUntilExpiry < SESSION_EXPIRY_BUFFER) {
        console.log("Token proche de l'expiration, rafraîchissement...");

        // Sauvegarder la session actuelle comme sauvegarde
        await AsyncStorage.setItem(
          LAST_VALID_SESSION_KEY,
          JSON.stringify(sessionData.session)
        );

        // Tenter de rafraîchir explicitement le token avec gestion des erreurs améliorée
        try {
          const { data, error } = await supabase.auth.refreshSession();

          if (error) {
            console.warn(
              "\u00c9chec du rafraîchissement du token:",
              error.message
            );

            // Pour certaines erreurs, on peut considérer que la session est encore valide
            if (
              error.message.includes("network") ||
              error.message.includes("timeout") ||
              error.message.includes("connection")
            ) {
              console.log(
                "Erreur réseau lors du rafraîchissement, on garde la session actuelle"
              );
              return true;
            }

            return false;
          }

          console.log("Token rafraîchi avec succès");
          return !!data.session;
        } catch (refreshError) {
          console.warn("Exception lors du rafraîchissement:", refreshError);
          // En cas d'erreur inattendue, on considère que la session pourrait encore être valide
          return true;
        }
      } else {
        console.log(
          "Token encore valide pour",
          Math.floor(timeUntilExpiry / (60 * 1000)),
          "minutes"
        );
        return true;
      }
    } else {
      console.log("Aucune session active trouvée, tentative de récupération");

      // Essayer de récupérer la dernière session valide
      const lastSessionStr = await AsyncStorage.getItem(LAST_VALID_SESSION_KEY);
      if (lastSessionStr) {
        try {
          const lastSession = JSON.parse(lastSessionStr);
          console.log(
            "Dernière session valide trouvée, tentative de restauration"
          );

          // Tenter de rafraîchir avec le refresh token de la dernière session
          try {
            const { data, error } = await supabase.auth.refreshSession();

            if (!error && data.session) {
              console.log("Session restaurée avec succès");
              return true;
            }

            // Même en cas d'erreur, on peut décider de ne pas déconnecter l'utilisateur
            // si l'erreur est liée au réseau
            if (
              error &&
              (error.message.includes("network") ||
                error.message.includes("timeout") ||
                error.message.includes("connection"))
            ) {
              console.log(
                "Erreur réseau lors de la restauration, on garde l'utilisateur connecté"
              );
              return true;
            }
          } catch (e) {
            console.warn("Exception lors de la restauration de session:", e);
            // En cas d'erreur inattendue, on peut être plus tolérant
            return true;
          }
        } catch (e) {
          console.error("Erreur lors de la restauration de la session:", e);
        }
      }

      // Si nous n'avons pas pu récupérer une session valide
      console.log("Impossible de récupérer une session valide");
      return false;
    }
  } catch (error) {
    console.warn("Erreur lors du rafraîchissement du token:", error);
    // En cas d'erreur générale, on peut être plus tolérant pour éviter les déconnexions
    return true;
  }
};

/**
 * Supprime toutes les données d'authentification
 * @param {boolean} preserveLastSession - Si true, conserve la dernière session valide
 */
export const clearAuthData = async (
  preserveLastSession: boolean = true
): Promise<void> => {
  try {
    // Sauvegarder la dernière session valide si demandé
    let lastSessionData = null;
    if (preserveLastSession) {
      try {
        lastSessionData = await AsyncStorage.getItem(LAST_VALID_SESSION_KEY);
      } catch (e) {
        console.error(
          "Erreur lors de la récupération de la dernière session:",
          e
        );
      }
    }

    // Nettoyer les données stockées dans AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(
      (key) =>
        key.startsWith("sb-") ||
        key === AUTH_TOKEN_KEY ||
        key === REFRESH_TOKEN_ATTEMPTED_KEY ||
        (key === LAST_VALID_SESSION_KEY && !preserveLastSession)
    );

    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
      console.log(`${authKeys.length} clés d'authentification supprimées`);
    }

    // Déconnexion de Supabase
    await supabase.auth.signOut({ scope: "local" }); // Déconnexion locale uniquement

    // Restaurer la dernière session valide si demandé
    if (preserveLastSession && lastSessionData) {
      await AsyncStorage.setItem(LAST_VALID_SESSION_KEY, lastSessionData);
      console.log("Dernière session valide préservée");
    }
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
