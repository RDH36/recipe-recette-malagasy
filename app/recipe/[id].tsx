import CookingLoader from "@/components/Loading/CookingLoader";
import RecipeDetail from "@/components/RecipeDetail/RecipeDetail";

import { getRecipeById } from "@/services/recipeService";
import { Recipe } from "@/Types/RecipeType";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adShown, setAdShown] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (typeof id === "string") {
          const data = await getRecipeById(id);
          setRecipe(data);
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement de la recette");
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center">
        <CookingLoader message="Chargement de la recette..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center p-4">
        <Text className="text-text-primary text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-light rounded-lg px-4 py-2"
        >
          <Text className="text-neutral-white">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center p-4">
        <Text className="text-text-primary text-center mb-4">
          Recette non trouvée
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-light rounded-lg px-4 py-2"
        >
          <Text className="text-neutral-white">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <ScrollView className="flex-1">
        <RecipeDetail recipe={recipe} />
      </ScrollView>
    </View>
  );
}
