import SplashScreenAnimated from "@/components/SplashScreen/SplashScreen";
import { supabase } from "@/config/supabase";
import { initAppData, setupAuthStateListener } from "@/services/appInitService";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn(
    "Erreur lors de la prévention de la fermeture du splash screen:",
    error
  );
});

const MAX_INIT_TIME = 5000;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);

  // Nettoyer les sessions invalides au lancement de l'application
  useEffect(() => {
    const cleanupInvalidSessions = async () => {
      try {
        const { error } = await supabase.auth.getSession();

        if (
          error &&
          (error.message.includes("Invalid Refresh Token") ||
            error.message.includes("Refresh Token Not Found") ||
            error.message.includes("JWT expired"))
        ) {
          console.log("Session invalide détectée au démarrage, nettoyage...");
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.warn("Erreur lors de la vérification de session:", err);
      }
    };

    cleanupInvalidSessions();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active" && !isReady) {
      setInitAttempt((prev) => prev + 1);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        if (!loaded && error) {
          console.warn("Erreur lors du chargement des polices:", error);
        }

        await initAppData().catch((e) => {
          console.warn("Erreur lors de l'initialisation des données:", e);
        });

        const timeoutId = setTimeout(() => {
          if (!isReady) {
            console.warn(
              "Délai d'initialisation dépassé, démarrage forcé de l'application"
            );
            SplashScreen.hideAsync().catch((e) => console.warn(e));
            setIsReady(true);
          }
        }, MAX_INIT_TIME);

        if (loaded) {
          await SplashScreen.hideAsync().catch((e) => console.warn(e));

          setTimeout(() => {
            setIsReady(true);
            clearTimeout(timeoutId);
          }, 2000);
        }

        return () => clearTimeout(timeoutId);
      } catch (e) {
        console.warn("Erreur lors de la préparation de l'application:", e);
        setTimeout(() => {
          SplashScreen.hideAsync().catch((e) => console.warn(e));
          setIsReady(true);
        }, 1000);
      }
    }

    prepare();
  }, [loaded, initAttempt]);

  useEffect(() => {
    const unsubscribe = setupAuthStateListener();

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isReady) {
    return <SplashScreenAnimated />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="recipe/[id]/cooking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recipe/[id]/congratulations"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="premium/premium" options={{ headerShown: false }} />
      <Stack.Screen
        name="premium/congratulation"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  splash: {
    width: "80%",
    height: "80%",
  },
});
