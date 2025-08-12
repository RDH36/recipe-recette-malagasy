import CookingLoader from "@/components/Loading/CookingLoader";
import NetworkErrorScreen from "@/components/NetworkStatus/NetworkErrorScreen";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { supabase } from "@/lib/supabase";
import { initAppData } from "@/services/appInitService";
import { checkOnboardingStatus } from "@/services/onboardingService";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);
  const { isConnected, isInternetReachable, handleRetry } = useNetworkStatus();
  const [session, setSession] = useState<Session | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);

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

        const onboardingStatus = await checkOnboardingStatus();
        setOnboardingCompleted(onboardingStatus);

        if (session && isConnected && isInternetReachable) {
          await initAppData(session);
        }

        setIsReady(true);
      } catch (e) {
        console.warn("Erreur lors de la préparation de l'application:", e);
        setIsReady(true);
      }
    }

    prepare();
  }, [loaded, error, session, isConnected, isInternetReachable]);

  useEffect(() => {
    if (isReady && onboardingCompleted === false) {
      router.replace("/onboarding");
    }
  }, [isReady, onboardingCompleted]);

  if ((!isConnected || !isInternetReachable) && isReady) {
    return <NetworkErrorScreen onRetry={handleRetry} />;
  }

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center">
        <CookingLoader message="Is cooking..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
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
    </SafeAreaView>
  );
}
