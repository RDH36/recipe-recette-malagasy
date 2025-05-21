import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
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
      <View className="flex-row justify-between items-center px-4 mb-4">
        <Text className="text-text-primary text-xl font-semibold">{title}</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="text-primary">Voir tout</Text>
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
            style="horizontal"
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            allRecipes={allRecipes}
          />
        ))}
      </ScrollView>
    </View>
  );
}
