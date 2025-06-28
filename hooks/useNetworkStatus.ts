import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  handleRetry: () => void;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: "unknown",
    handleRetry: () => {},
  });

  const checkConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      updateNetworkStatus(state);
    } catch (error) {
      console.error("Erreur lors de la vérification réseau initiale:", error);
    }
  };

  useEffect(() => {
    checkConnection();
    const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  const updateNetworkStatus = (state: NetInfoState) => {
    setNetworkStatus({
      isConnected: !!state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      handleRetry,
    });
  };

  const handleRetry = async () => {
    checkConnection();
  };

  return networkStatus;
};

export default useNetworkStatus;
