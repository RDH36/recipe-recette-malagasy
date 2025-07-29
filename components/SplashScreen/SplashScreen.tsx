import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function SplashScreenAnimated() {
  // Animation pour le rebond et le pulse
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Animation pour les points de chargement
  const dotsAnim = useRef(new Animated.Value(0)).current;

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
    ]);

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
    ]);

    Animated.loop(bounce).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();

    // Lancer l'animation des points en boucle
    Animated.loop(dots).start();
  }, []);

  const dotsOpacity = dotsAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <LinearGradient
      colors={["#FF8050", "#FFB36B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center">
        <Animated.Image
          source={require("../../assets/images/mascote.png")}
          style={{ width: 140, height: 140, transform: [{ translateY: bounceAnim }, { scale: scaleAnim }] }}
          resizeMode="contain"
        />

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
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 32,
  },
});
