import { initializeAdMob } from "@/services/adMobService";
import { useStore } from "@/store/useStore";
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
  const showAds = !isLifetime && !isPremium;

  useEffect(() => {
    const initialize = async () => {
      try {
        const appState = AppState.currentState;

        if (appState !== "active") return;

        await initializeAdMob();

        setAdsInitialized(true);
        console.log("AdMob initialized successfully");
      } catch (error) {
        console.error("AdMob initialization failed:", error);
      }
    };

    if (showAds && !adsInitialized) {
      initialize();
    }
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
