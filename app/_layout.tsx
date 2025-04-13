import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import { useEffect, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    }
  }, [loaded]);

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
    </Stack>
  );
}
