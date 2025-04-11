import { Stack } from "expo-router"
import "../global.css"
import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import SplashScreen from "@/components/SplashScreen/SplashScreen"

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setIsReady(true)
      }, 2000)
    }
  }, [loaded])

  if (!loaded || !isReady) {
    return <SplashScreen />
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="search/Search" options={{ headerShown: false }} />
    </Stack>
  )
}
