import { Recipe } from "@/Types/RecipeType";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

interface FavoriteButtonProps {
  recipe: Recipe;
  size?: number;
  color?: string;
  fillColor?: string;
  className?: string;
  onToggleFavorite?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  recipe,
  size = 24,
  color = "#FF5F5F",
  fillColor = "#FF5F5F",
  className = "",
  onToggleFavorite,
}: FavoriteButtonProps) {
  const {
    user,
    favorites,
    addToFavorites,
    removeFromFavorites,
    hasReachedFreeLimit,
    isPremium,
  } = useStore();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const isInFavorites = favorites.some((fav) => fav.id === recipe.id);
    setIsFavorite(isInFavorites);
  }, [favorites, recipe.id]);

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter des recettes à vos favoris.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!isPremium && !isFavorite && hasReachedFreeLimit()) {
      Alert.alert(
        "Limite atteinte",
        "Vous avez atteint la limite de 10 favoris avec un compte gratuit. Passez à Premium pour en ajouter davantage.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Passer à Premium", onPress: () => navigateToPremium() },
        ]
      );
      return;
    }

    try {
      if (isFavorite) {
        const success = await removeFavoriteRecipe(user.id, recipe.id);

        if (success) {
          removeFromFavorites(recipe.id);
          setIsFavorite(false);
          if (onToggleFavorite) onToggleFavorite(false);
        } else {
          Alert.alert(
            "Erreur",
            "Impossible de supprimer cette recette des favoris."
          );
        }
      } else {
        const success = await addFavoriteRecipe(user.id, recipe.id);

        if (success) {
          addToFavorites(recipe);
          setIsFavorite(true);
          if (onToggleFavorite) onToggleFavorite(true);
        } else {
          Alert.alert(
            "Erreur",
            "Impossible d'ajouter cette recette aux favoris."
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const navigateToPremium = () => {
    // Rediriger vers la page premium
    router.push("/premium/premium");
  };

  return (
    <TouchableOpacity
      onPress={toggleFavorite}
      className={`p-2 ${className}`}
      activeOpacity={0.7}
    >
      <Heart
        size={size}
        color={color}
        fill={isFavorite ? fillColor : "transparent"}
      />
    </TouchableOpacity>
  );
}
