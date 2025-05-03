import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Contrôle si les sessions d'authentification existent déjà dans AsyncStorage
 * et les nettoie si elles sont corrompues
 */
const checkExistingAuthSessions = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(
      (key) => key.startsWith("sb-") || key.includes("supabase-auth")
    );

    if (authKeys.length > 0) {
      console.log(
        `${authKeys.length} clés d'authentification trouvées au démarrage`
      );

      // Vérifier la validité des données stockées
      for (const key of authKeys) {
        try {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            // Tenter de parser les données pour vérifier si elles sont valides
            JSON.parse(data);
          }
        } catch (e) {
          // Si les données sont corrompues, supprimer cette clé
          console.log(
            `Données corrompues détectées pour ${key}, suppression...`
          );
          await AsyncStorage.removeItem(key);
        }
      }
    } else {
      console.log("Aucune clé d'authentification existante");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des sessions existantes:",
      error
    );
  }
};

// Vérifier les sessions d'authentification existantes au démarrage
checkExistingAuthSessions();

// Activer le mode debug en développement
if (__DEV__) {
  console.log("Mode debug activé pour Supabase Auth");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "pkce",
    debug: __DEV__, // Activer le débogage en développement
  },
  global: {
    fetch: (url, options) => {
      const timeout = 15000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      return fetch(url, {
        ...options,
        signal: controller.signal,
      })
        .then((response) => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          throw error;
        });
    },
  },
});

// Configurer les événements d'authentification une fois le client créé
if (__DEV__) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(
      `Auth event: ${event}`,
      session ? "Session trouvée" : "Pas de session"
    );
  });
}

// Démarre le rafraîchissement automatique des tokens quand l'app est active
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Fonction utilitaire pour récupérer une session valide avec rafraîchissement
export const getSessionWithRefresh = async () => {
  try {
    // Récupérer la session actuelle
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "Erreur lors de la récupération de la session:",
        error.message
      );

      // Si le token est expiré, tenter un rafraîchissement manuel
      if (
        error.message.includes("JWT expired") ||
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Refresh Token Not Found")
      ) {
        console.log("Tentative de rafraîchissement manuel du token");
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error(
            "Échec du rafraîchissement manuel:",
            refreshError.message
          );
          return { session: null, error: refreshError };
        }

        return { session: refreshData.session, error: null };
      }

      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return { session: null, error };
  }
};
