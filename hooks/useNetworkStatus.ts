import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: "unknown",
  });

  useEffect(() => {
    // Vérification initiale
    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        updateNetworkStatus(state);
      } catch (error) {
        console.error("Erreur lors de la vérification réseau initiale:", error);
      }
    };

    checkConnection();

    // Abonnement aux changements d'état de la connexion
    const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  // Mise à jour de l'état de la connexion
  const updateNetworkStatus = (state: NetInfoState) => {
    setNetworkStatus({
      isConnected: !!state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
  };

  return networkStatus;
};

export default useNetworkStatus;
