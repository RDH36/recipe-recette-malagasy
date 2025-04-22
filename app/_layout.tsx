import SplashScreenAnimated from "@/components/SplashScreen/SplashScreen";
import { initAppData, setupAuthStateListener } from "@/services/appInitService";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import "../global.css";

// Empêcher le splash screen natif de se fermer automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          // Initialiser les données de l'application
          await initAppData();

          // Cacher le splash screen natif
          await SplashScreen.hideAsync();

          // Afficher l'écran de chargement personnalisé pendant 2 secondes
          setTimeout(() => {
            setIsReady(true);
          }, 2000);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loaded]);

  // Configurer l'écouteur d'état d'authentification
  useEffect(() => {
    const unsubscribe = setupAuthStateListener();

    // Nettoyer l'abonnement quand le composant est démonté
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
