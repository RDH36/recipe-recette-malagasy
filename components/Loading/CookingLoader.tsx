import { Text } from "expo-dynamic-fonts";
import { Image } from "react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

/**
 * Cartoon-style page loader with a bouncing chef hat & rotating utensils.
 * Drop in place of ActivityIndicator to give a playful cooking vibe.
 */
export default function CookingLoader({ message = "Préparation en cours..." }) {
  // Rotation animation for utensils
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Bounce animation for hat
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
      ])
    ).start();
  }, [scaleAnim, bounceAnim]);

  const scale = scaleAnim;

  return (
    <View className="items-center justify-center">
      <Animated.Image
        source={require("../../assets/images/mascote.png")}
        style={{ width: 120, height: 120, transform: [{ translateY: bounceAnim }, { scale }] }}
        resizeMode="contain"
      />
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Text className="text-primary font-semibold mt-2" font="Pacifico">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}
