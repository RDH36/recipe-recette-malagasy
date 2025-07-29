import CookingLoader from "@/components/Loading/CookingLoader";
import { getRecipeById } from "@/services/recipeService";
import { Recipe } from "@/Types/RecipeType";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CookingMode from "../../../components/CookingMode/CookingMode";

const CookingPage = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Text className="text-text-primary text-center">{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center p-4">
        <Text className="text-text-primary text-center">
          Recette non trouvée
        </Text>
      </View>
    );
  }

  return <CookingMode recipes={recipe} />;
};

export default CookingPage;
