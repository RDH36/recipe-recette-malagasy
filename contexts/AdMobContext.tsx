import { useStore } from "@/store/useStore";
import { initializeAdMob } from "@/services/adMobService";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

type AdMobContextType = {
  showAds: boolean;
  adsInitialized: boolean;
};

const AdMobContext = createContext<AdMobContextType>({
  showAds: true,
  adsInitialized: false,
});

export const useAdMob = () => useContext(AdMobContext);

export const AdMobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isPremium, isLifetime } = useStore();
  const [adsInitialized, setAdsInitialized] = useState(false);

  // Les utilisateurs premium ne voient pas de publicités
  const showAds = !isPremium || !isLifetime;

  useEffect(() => {
    const initialize = async () => {
      try {
        const appState = AppState.currentState;

        // N'initialiser que si l'application est au premier plan
        if (appState !== "active") return;

        // Utiliser la fonction d'initialisation du service AdMob
        await initializeAdMob();
        
        setAdsInitialized(true);
        console.log("AdMob initialized successfully");
      } catch (error) {
        console.error("AdMob initialization failed:", error);
      }
    };

    // Initialiser AdMob seulement si les publicités doivent être affichées
    if (showAds && !adsInitialized) {
      initialize();
    }

    // Gérer les changements d'état de l'application
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && showAds && !adsInitialized) {
        initialize();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [showAds, adsInitialized]);

  return (
    <AdMobContext.Provider value={{ showAds, adsInitialized }}>
      {children}
    </AdMobContext.Provider>
  );
};
