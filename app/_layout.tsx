import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import "../global.css"
import SplashScreenAnimated from "@/components/SplashScreen/SplashScreen"

// Empêcher le splash screen natif de se fermer automatiquement
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          await SplashScreen.hideAsync()
          setTimeout(() => {
            setIsReady(true)
          }, 2000)
        }
      } catch (e) {
        console.warn(e)
      }
    }

    prepare()
  }, [loaded])

  if (!isReady) {
    return <SplashScreenAnimated />
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
  )
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
})
