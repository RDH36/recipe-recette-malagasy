import SplashScreenAnimated from "@/components/SplashScreen/SplashScreen";

import NetworkErrorScreen from "@/components/NetworkStatus/NetworkErrorScreen";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { supabase } from "@/lib/supabase";
import { initAppData } from "@/services/appInitService";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);
  const { isConnected, isInternetReachable, handleRetry } = useNetworkStatus();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        if (!loaded && error) {
          console.warn("Erreur lors du chargement des polices:", error);
        }
        if (session) {
          await initAppData(session);
        }
        setIsReady(true);
      } catch (e) {
        console.warn("Erreur lors de la préparation de l'application:", e);
        setIsReady(true);
      }
    }

    prepare();
  }, [loaded]);

  if (!isReady) {
    return <SplashScreenAnimated />;
  }

  if (!isConnected || !isInternetReachable) {
    return <NetworkErrorScreen onRetry={handleRetry} />;
  }

  return (
    <View style={{ flex: 1 }}>
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
        <Stack.Screen name="premium/payment" options={{ headerShown: false }} />
        <Stack.Screen
          name="premium/congratulation"
          options={{ headerShown: false }}
        />
      </Stack>
    </View>
  );
}
