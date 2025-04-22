import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowRight, Crown, Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Congratulation() {
  const insets = useSafeAreaInsets();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#FF7A29", "#FFD54F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Crown size={64} color="#FFFFFF" />
          <Sparkles size={32} color="#FFFFFF" style={styles.sparkles} />
        </View>

        <Text
          className="text-neutral-white text-3xl font-bold mb-4"
          font="Pacifico"
        >
          Félicitations !
        </Text>

        <Text className="text-neutral-white text-center text-lg mb-2">
          Vous êtes maintenant un membre premium
        </Text>

        <Text className="text-neutral-white text-center mb-8">
          Profitez de tous les avantages exclusifs
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/search/Search")}
        >
          <Text className="text-neutral-white text-lg font-semibold">
            Voir toutes les recettes
          </Text>
          <ArrowRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  sparkles: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
