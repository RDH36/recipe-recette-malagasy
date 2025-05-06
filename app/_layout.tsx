import NetworkStatus from "@/components/NetworkStatus/NetworkStatus"
import SplashScreenAnimated from "@/components/SplashScreen/SplashScreen"
import { supabase } from "@/config/supabase"
import useNetworkStatus from "@/hooks/useNetworkStatus"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { initAppData, setupAuthStateListener } from "@/services/appInitService"
import { refreshAuthToken } from "@/services/tokenService"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { AppState, AppStateStatus, View } from "react-native"
import "../global.css"

const MAX_INIT_TIME = 5000
const INACTIVE_THRESHOLD = 30000 // 30 secondes d'inactivité

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  })
  const [isReady, setIsReady] = useState(false)
  const [initAttempt, setInitAttempt] = useState(0)
  const lastActiveTimestamp = useRef<number>(Date.now())
  const initializationInProgress = useRef<boolean>(false)
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)
  const { isConnected, isInternetReachable } = useNetworkStatus()
  const { expoPushToken } = usePushNotifications()

  useEffect(() => {
    const cleanupInvalidSessions = async () => {
      try {
        const { error } = await supabase.auth.getSession()

        if (
          error &&
          (error.message.includes("Invalid Refresh Token") ||
            error.message.includes("Refresh Token Not Found") ||
            error.message.includes("JWT expired"))
        ) {
          console.log(
            "Session invalide détectée, tentative de rafraîchissement"
          )

          // Tenter de rafraîchir le token avant de déconnecter l'utilisateur
          const refreshed = await refreshAuthToken()

          if (!refreshed) {
            console.log(
              "Échec du rafraîchissement, déconnexion de l'utilisateur"
            )
            await supabase.auth.signOut()
          } else {
            console.log("Token rafraîchi avec succès")
          }
        }
      } catch (err) {
        console.warn("Erreur lors de la vérification de session:", err)
      }
    }

    cleanupInvalidSessions()
  }, [initAttempt])

  useEffect(() => {
    const handleTokenRefreshOnForeground = (state: AppStateStatus) => {
      if (state === "active") {
        refreshAuthToken().catch((error) => {
          console.warn("Erreur lors du rafraîchissement du token:", error)
        })
      }
    }

    const subscription = AppState.addEventListener(
      "change",
      handleTokenRefreshOnForeground
    )

    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    )
    return () => {
      subscription.remove()
    }
  }, [])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const currentTimestamp = Date.now()
    const inactiveTime = currentTimestamp - lastActiveTimestamp.current
    const wasInactive = inactiveTime > INACTIVE_THRESHOLD
    const becameActive =
      appStateRef.current !== "active" && nextAppState === "active"

    appStateRef.current = nextAppState

    if (nextAppState === "active") {
      lastActiveTimestamp.current = currentTimestamp

      if (wasInactive && becameActive) {
        console.log(
          `L'app était inactive pendant ${inactiveTime}ms, redémarrage du processus d'initialisation`
        )
        if (isReady) {
          initAppData().catch((e) => {
            console.warn(
              "Erreur lors de la réinitialisation après inactivité:",
              e
            )
          })
        } else if (!isReady || initializationInProgress.current) {
          console.log("Redémarrage forcé de l'initialisation après inactivité")
          initializationInProgress.current = false
          setInitAttempt((prev) => prev + 1)
        }
      }
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined

    async function prepare() {
      initializationInProgress.current = true

      try {
        if (!loaded && error) {
          console.warn("Erreur lors du chargement des polices:", error)
        }

        timeoutId = setTimeout(() => {
          if (!isReady) {
            console.warn(
              "Délai d'initialisation dépassé, démarrage forcé de l'application"
            )
            initializationInProgress.current = false
            setIsReady(true)
          }
        }, MAX_INIT_TIME)

        await initAppData().catch((e) => {
          console.warn("Erreur lors de l'initialisation des données:", e)
        })

        if (loaded) {
          setTimeout(() => {
            initializationInProgress.current = false
            setIsReady(true)
            if (timeoutId) clearTimeout(timeoutId)
          }, 2000)
        }
      } catch (e) {
        console.warn("Erreur lors de la préparation de l'application:", e)
        setTimeout(() => {
          initializationInProgress.current = false
          setIsReady(true)
        }, 1000)
      }
    }

    prepare()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      initializationInProgress.current = false
    }
  }, [loaded, initAttempt])

  useEffect(() => {
    const unsubscribe = setupAuthStateListener()
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    console.log(expoPushToken)
  }, [])

  if (!isReady) {
    return <SplashScreenAnimated />
  }

  return (
    <View style={{ flex: 1 }}>
      <NetworkStatus isConnected={!!(isConnected && isInternetReachable)} />
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
        <Stack.Screen name="error/network" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}
