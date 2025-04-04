import RecipeDetail from "@/components/RecipeDetail/RecipeDetail";
import { sampleRecipes } from "@/data/sample-data";
import { Recipe } from "@/Types/RecipeType";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);

  const recipe = recipes.find((recipe) => recipe.id === id);

  if (!recipe) {
    return (
      <View className="flex-1 bg-white">
        <Text>Recipe not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-2">{<RecipeDetail recipe={recipe} />}</View>
    </ScrollView>
  );
}
