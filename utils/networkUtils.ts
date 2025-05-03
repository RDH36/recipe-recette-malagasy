import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";

/**
 * Vérifie si l'appareil est connecté à Internet
 * @returns {Promise<boolean>} true si connecté, false sinon
 */
export const isConnectedToInternet = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion:", error);
    return false;
  }
};

/**
 * Wrapper pour les appels API qui nécessitent une connexion Internet
 * @param apiCall Fonction qui effectue l'appel API
 * @param router Objet router pour la redirection
 * @param shouldRedirect Indique si l'utilisateur doit être redirigé en cas d'erreur réseau
 * @returns Résultat de l'appel API ou null en cas d'erreur
 */
export const withNetworkCheck = async <T>(
  apiCall: () => Promise<T>,
  router?: any,
  shouldRedirect = true
): Promise<T | null> => {
  try {
    // Vérifier la connexion
    const isConnected = await isConnectedToInternet();

    if (!isConnected) {
      console.log("Pas de connexion Internet pour effectuer cette opération");

      // Rediriger vers la page d'erreur si nécessaire
      if (shouldRedirect && router) {
        router.push({
          pathname: "/error/network",
        } as any);
      }

      return null;
    }

    // Effectuer l'appel API
    return await apiCall();
  } catch (error) {
    console.error("Erreur lors de l'appel API:", error);
    return null;
  }
};

/**
 * Hook pour rediriger l'utilisateur vers la page d'erreur réseau
 * @returns Fonction pour rediriger vers la page d'erreur réseau
 */
export const useNetworkErrorRedirect = () => {
  const router = useRouter();

  return () => {
    router.push({
      pathname: "/error/network",
    } as any);
  };
};
