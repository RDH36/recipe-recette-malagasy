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
      <View className="flex-1 bg-neutral-white">
        <Text className="text-text-primary">Recipe not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-light rounded-lg px-4 py-2 mt-4"
        >
          <Text className="text-neutral-white">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-white">
      <View>{<RecipeDetail recipe={recipe} />}</View>
    </ScrollView>
  );
}
