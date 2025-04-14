import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { HeartIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function BookmarksScreen() {
  // Simuler un état non connecté
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-neutral-white px-4">
        <View className="flex-1 items-center justify-center">
          <View className="items-center px-6">
            <HeartIcon size={80} className="text-primary-light/30" />
            <Text className="text-xl font-semibold text-text-primary mt-6 text-center">
              Connectez-vous pour voir vos favoris
            </Text>
            <Text className="text-text-secondary text-center mt-2 mb-8">
              Gardez vos recettes préférées à portée de main en les ajoutant à
              vos favoris
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/Profile")}
              className="bg-primary px-8 py-3 rounded-xl"
            >
              <Text className="text-neutral-white font-medium text-base">
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // État connecté mais sans favoris
  return (
    <View className="flex-1 bg-neutral-white px-4">
      <View className="flex-1 items-center justify-center">
        <View className="items-center px-6">
          <Ionicons name="heart" size={80} color="#E0E0E0" />
          <Text className="text-xl font-semibold text-text-primary mt-6 text-center">
            Aucun favori pour le moment
          </Text>
          <Text className="text-text-secondary text-center mt-2 mb-8">
            Explorez nos recettes et ajoutez-les à vos favoris pour les
            retrouver facilement
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/search/Search")}
            className="bg-primary px-8 py-3 rounded-xl"
          >
            <Text className="text-neutral-white font-medium text-base">
              Explorer les recettes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
