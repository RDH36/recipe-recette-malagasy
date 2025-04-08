import { SplashScreen, Stack } from "expo-router"
import "../global.css"
import { useEffect } from "react"
import { useFonts } from "expo-font"

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="search/Search" options={{ headerShown: false }} />
    </Stack>
  )
}
