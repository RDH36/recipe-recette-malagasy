import { router } from "expo-router";
import { ChefHat, Lock, Sparkles, Star } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function PremiumSection() {
  const handleUpgrade = () => {
    router.push("/premium/premium" as any);
  };

  return (
    <View className="mx-4 my-6">
      <View className="rounded-2xl overflow-hidden bg-primary shadow-lg shadow-primary/30">
        <View className="absolute top-0 right-0">
          <Sparkles
            size={120}
            color="#FFFFFF"
            opacity={0.1}
            style={{ transform: [{ rotate: "15deg" }] }}
          />
        </View>

        <View className="p-5">
          <View className="flex-row items-center mb-2">
            <ChefHat size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-lg ml-2">
              Recette Premium
            </Text>
            <View className="bg-white/20 rounded-full px-3 py-1 ml-2">
              <Text className="text-white text-xs font-medium">PRO</Text>
            </View>
          </View>

          <Text className="text-white text-xl font-bold mb-3">
            Débloquez toutes les recettes exclusives
          </Text>

          <Text className="text-white/90 mb-4">
            Accédez à nos recettes authentiques malgaches et à des
            fonctionnalités exclusives.
          </Text>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text className="text-white ml-2">Recettes exclusives</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text className="text-white ml-2">Nous soutenir en payant</Text>
            </View>
            <View className="flex-row items-center">
              <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text className="text-white ml-2">
                Nouvelles recettes chaque semaine
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpgrade}
            className="bg-white rounded-xl py-3 flex-row justify-center items-center"
            activeOpacity={0.8}
          >
            <Lock size={18} color="#FF8050" />
            <Text className="text-primary font-bold ml-2">
              Débloquer Premium
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
