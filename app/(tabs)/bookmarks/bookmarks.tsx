import { Recipe } from "@/Types/RecipeType";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import { supabase } from "@/lib/supabase";
import { initAppData } from "@/services/appInitService";
import { useStore } from "@/store/useStore";
import { Session } from "@supabase/supabase-js";
import { router, useFocusEffect } from "expo-router";
import { HeartIcon } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function BookmarksScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const { user, favorites, setFavorites, setUser } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (session) {
        initAppData(session);
      }
    }, [session])
  );

  if (!user) {
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

  if (favorites.length === 0) {
    return (
      <View className="flex-1 bg-neutral-white px-4">
        <View className="flex-1 items-center justify-center">
          <View className="items-center px-6">
            <HeartIcon size={80} color="#E0E0E0" />
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

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <View className="relative">
        <Image
          source={item.image}
          className="w-full h-40 rounded-t-2xl"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2">
          <FavoriteButton recipe={item} />
        </View>
        {item.isPremium && (
          <View className="absolute top-2 left-2 bg-primary/80 px-2 py-1 rounded-lg">
            <Text className="text-white text-xs font-medium">Premium</Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <Text className="text-text-primary font-bold text-base">
          {item.title}
        </Text>
        <Text className="text-text-secondary text-sm mt-1" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row justify-between mt-3">
          <Text className="text-text-disabled text-xs">
            {item.time} min • {item.difficulty}
          </Text>
          <Text className="text-primary text-xs">{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-text-primary">
          Vos Favoris
        </Text>
        <Text className="text-text-secondary mt-1 mb-4">
          {favorites.length} recette{favorites.length > 1 ? "s" : ""}{" "}
          sauvegardée{favorites.length > 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
