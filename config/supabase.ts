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

checkExistingAuthSessions();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "pkce",
    storageKey: "supabase-auth-token-v2",
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

if (__DEV__) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(
      `Auth event: ${event}`,
      session ? "Session trouvée" : "Pas de session"
    );
  });
}

let refreshInterval: NodeJS.Timeout | null = null;

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();

    if (!refreshInterval) {
      refreshInterval = setInterval(async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const expiresAt = new Date((data.session.expires_at || 0) * 1000);
          const now = new Date();
          const hoursUntilExpiry =
            (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);

          if (hoursUntilExpiry < 12) {
            console.log(
              "Session proche de l'expiration, rafraîchissement proactif"
            );
            await supabase.auth.refreshSession();
          }
        }
      }, 10 * 60 * 1000); // 10 minutes
    }
  } else {
    supabase.auth.stopAutoRefresh();

    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
});

export const getSessionWithRefresh = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "Erreur lors de la récupération de la session:",
        error.message
      );

      if (
        error.message.includes("JWT expired") ||
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Refresh Token Not Found") ||
        error.message.includes("token is expired")
      ) {
        console.log("Tentative de rafraîchissement manuel du token");

        try {
          const sessionData = await AsyncStorage.getItem(
            "supabase-auth-token-v2"
          );
          if (sessionData) {
            console.log("Données de session trouvées dans le stockage local");
          }
        } catch (storageError) {
          console.error(
            "Erreur lors de la vérification du stockage local:",
            storageError
          );
        }

        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error(
            "Échec du rafraîchissement manuel:",
            refreshError.message
          );

          try {
            const lastSession = await AsyncStorage.getItem(
              "last-valid-session"
            );
            if (lastSession) {
              const parsedSession = JSON.parse(lastSession);
              const sessionTime = new Date(
                parsedSession.created_at || 0
              ).getTime();
              const now = new Date().getTime();
              const daysSinceCreation =
                (now - sessionTime) / (1000 * 60 * 60 * 24);

              if (daysSinceCreation < 30) {
                console.log(
                  "Utilisation de la dernière session valide en cache"
                );
                return { session: parsedSession, error: null };
              }
            }
          } catch (cacheError) {
            console.error(
              "Erreur lors de la récupération de la session en cache:",
              cacheError
            );
          }

          return { session: null, error: refreshError };
        }

        if (refreshData.session) {
          try {
            await AsyncStorage.setItem(
              "last-valid-session",
              JSON.stringify(refreshData.session)
            );
          } catch (saveError) {
            console.error(
              "Erreur lors de la sauvegarde de la session:",
              saveError
            );
          }
        }

        return { session: refreshData.session, error: null };
      }

      return { session: null, error };
    }

    if (data.session) {
      try {
        await AsyncStorage.setItem(
          "last-valid-session",
          JSON.stringify(data.session)
        );
      } catch (saveError) {
        console.error("Erreur lors de la sauvegarde de la session:", saveError);
      }
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);

    try {
      const lastSession = await AsyncStorage.getItem("last-valid-session");
      if (lastSession) {
        const parsedSession = JSON.parse(lastSession);
        console.log(
          "Utilisation de la dernière session valide en cache suite à une erreur"
        );
        return { session: parsedSession, error: null };
      }
    } catch (cacheError) {
      console.error(
        "Erreur lors de la récupération de la session en cache:",
        cacheError
      );
    }

    return { session: null, error };
  }
};
