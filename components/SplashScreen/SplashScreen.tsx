import React, { useEffect } from "react"
import { View, Animated, Easing, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { UtensilsCrossed } from "lucide-react-native"
import { Text } from "expo-dynamic-fonts"

export default function SplashScreen() {
  // Animation pour le rebond
  const bounceAnim = new Animated.Value(0)

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

    Animated.loop(bounce, {
      iterations: -1,
    }).start()
  }, [])

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
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  logo: {
    fontSize: 32,
  },
})
