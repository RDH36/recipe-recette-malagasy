import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RecipeCard } from "../RecipeCard/RecipeCard";

interface CategoryViewProps {
  recipes: Recipe[];
  title: string;
  allRecipes: Recipe[];
}

export default function CategoryView({
  recipes,
  title,
  allRecipes,
}: CategoryViewProps) {
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);

  const handleViewAll = () => {
    setSelectedCategory(title);
    router.push("/search/Search");
  };

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="px-4">
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
          <Text className="text-gray-500 text-sm mt-1">
            {title === "Populaires"
              ? "Les recettes les plus populaires"
              : "Decouvrez les recettes iconiques"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleViewAll}
          className="flex-row items-center bg-orange-50 px-3 py-2 rounded-full"
        >
          <Text className="text-orange-600 font-medium text-sm">Voir tout</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#EA580C"
            className="ml-1"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4"
      >
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            style="plate"
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            allRecipes={allRecipes}
          />
        ))}
      </ScrollView>
    </View>
  );
}
