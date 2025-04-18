import React, { useEffect } from "react"
import { View, Animated, Easing, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { UtensilsCrossed } from "lucide-react-native"
import { Text } from "expo-dynamic-fonts"

export default function SplashScreenAnimated() {
  // Animation pour le rebond
  const bounceAnim = new Animated.Value(0)
  // Animation pour les points de chargement
  const dotsAnim = new Animated.Value(0)

  useEffect(() => {
    // Animation de rebond
    const bounce = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ])

    // Animation des points
    const dots = Animated.sequence([
      Animated.timing(dotsAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(dotsAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ])

    Animated.loop(bounce, {
      iterations: -1,
    }).start()

    Animated.loop(dots, {
      iterations: -1,
    }).start()
  }, [])

  const dotsOpacity = dotsAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  })

  return (
    <LinearGradient
      colors={["#FF7A29", "#FFD54F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center">
        <Animated.View
          style={{
            transform: [{ translateY: bounceAnim }],
          }}
        >
          <UtensilsCrossed size={48} className="text-neutral-50" />
        </Animated.View>

        <Text
          className="text-neutral-white mb-2"
          font="Pacifico"
          style={styles.logo}
        >
          Tsikonina
        </Text>
        <Text className="text-neutral-white text-base">
          La cuisine malgache authentique
        </Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 items-center pb-8">
        <View className="flex-row items-center">
          <Text className="text-neutral-white text-base">Loading</Text>
          <Animated.View style={{ opacity: dotsOpacity }}>
            <Text className="text-neutral-white text-base">...</Text>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 32,
  },
})
