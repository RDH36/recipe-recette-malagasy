import { useStore } from "@/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BadgeCheck, Diamond, Star } from "lucide-react-native";
import { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function PremiumCongratulationScreen() {
  const { isPremium, isLifetime } = useStore();

  const scaleValue = useSharedValue(1);
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      scaleValue.value = withDelay(
        100,
        withRepeat(
          withSequence(
            withTiming(1.1, { duration: 700 }),
            withTiming(1, { duration: 700 })
          ),
          3
        )
      );

      translateY.value = withDelay(200, withTiming(0, { duration: 800 }));

      opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, []);

  const badgeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const title = isLifetime
    ? "Félicitations pour Votre Premium à Vie!"
    : "Félicitations pour Votre Abonnement Premium!";

  const message = isLifetime
    ? "Profitez d'un accès illimité à vie à toutes nos recettes exclusives et fonctionnalités premium."
    : "Profitez d'un accès complet à toutes nos recettes exclusives et fonctionnalités premium.";

  return (
    <SafeAreaView className="flex-1 bg-neutral-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center">
          <Animated.View
            style={[badgeStyle, { alignItems: "center", marginVertical: 40 }]}
          >
            <View className="w-32 h-32 rounded-full bg-primary/5 items-center justify-center">
              <LinearGradient
                colors={
                  isLifetime ? ["#FF5F5F", "#CB69C1"] : ["#6C72CB", "#CB69C1"]
                }
                className="w-24 h-24 rounded-full items-center justify-center"
              >
                {isLifetime ? (
                  <Diamond size={48} color="white" />
                ) : (
                  <Star size={48} color="white" />
                )}
              </LinearGradient>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              contentStyle,
              { width: "100%", alignItems: "center", paddingHorizontal: 16 },
            ]}
          >
            <Text className="text-3xl font-bold text-text-primary text-center mb-4">
              {title}
            </Text>

            <Text className="text-text-secondary text-center mb-8">
              {message}
            </Text>

            <View className="w-full bg-primary/5 rounded-2xl p-6 mb-8">
              <Text className="text-lg font-bold text-text-primary mb-4">
                Ce qui vous attend:
              </Text>

              <View className="space-y-4">
                <View className="flex-row">
                  <BadgeCheck
                    size={20}
                    className="text-primary mr-3"
                    color="#FF5F5F"
                  />
                  <Text className="text-text-primary flex-1">
                    Accès à toutes les recettes authentiques
                  </Text>
                </View>

                <View className="flex-row">
                  <BadgeCheck
                    size={20}
                    className="text-primary mr-3"
                    color="#FF5F5F"
                  />
                  <Text className="text-text-primary flex-1">
                    Collections de recettes régionales
                  </Text>
                </View>

                <View className="flex-row">
                  <BadgeCheck
                    size={20}
                    className="text-primary mr-3"
                    color="#FF5F5F"
                  />
                  <Text className="text-text-primary flex-1">
                    Contexte culturel et historique
                  </Text>
                </View>

                <View className="flex-row">
                  <BadgeCheck
                    size={20}
                    className="text-primary mr-3"
                    color="#FF5F5F"
                  />
                  <Text className="text-text-primary flex-1">
                    Guides de substitution d'ingrédients
                  </Text>
                </View>

                {isLifetime && (
                  <View className="flex-row">
                    <BadgeCheck
                      size={20}
                      className="text-primary mr-3"
                      color="#FF5F5F"
                    />
                    <Text className="text-text-primary flex-1 font-bold">
                      Accès à vie à toutes les futures mises à jour
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary w-full py-4 rounded-xl mb-4"
              onPress={() => router.push("/(tabs)")}
            >
              <Text className="text-white text-center font-semibold">
                Explorer les recettes
              </Text>
            </TouchableOpacity>

            <Text className="text-text-disabled text-center text-sm">
              {isLifetime
                ? "Votre statut Premium à Vie est activé"
                : "Votre abonnement sera automatiquement renouvelé à la fin de la période"}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
