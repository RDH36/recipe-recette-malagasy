import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
import { handleShare } from "@/utils/utilis";
import { Text } from "expo-dynamic-fonts";
import { useRouter } from "expo-router";
import { UtensilsCrossedIcon } from "lucide-react-native";
import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Header from "./Header";
import Ingredients from "./Ingredients";
import IngredientSubstitutes from "./IngredientSubstitutes";
import RecipeInfo from "./RecipeInfo";

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const router = useRouter();
  const viewShotRef = useRef<ViewShot>(null);
  const { isPremium } = useStore();

  const handleStartCooking = () => {
    if (recipe.isPremium && !isPremium) {
      router.push("/premium/premium");
      return;
    }
    router.push(`/recipe/${recipe.id}/cooking`);
  };

  const ShareContent = () => (
    <View className="items-center bg-neutral-white">
      <Header
        recipe={recipe}
        viewShotRef={viewShotRef}
        onShare={() => handleShare(viewShotRef, recipe)}
      />
      <RecipeInfo recipe={recipe} isPremium={isPremium} />
      <View className="mt-4 flex-1 px-4">
        <Ingredients recipe={recipe} />
        {recipe.substitutes && (
          <IngredientSubstitutes substitutes={recipe.substitutes} />
        )}
      </View>
    </View>
  );
  return (
    <View className="relative flex-1 bg-neutral-white w-full">
      <Header
        recipe={recipe}
        viewShotRef={viewShotRef}
        onShare={() => handleShare(viewShotRef, recipe)}
      />
      <RecipeInfo recipe={recipe} isPremium={isPremium} />
      <View className="mt-4 flex-1 px-4">
        <Ingredients recipe={recipe} />
        {recipe.substitutes && (
          <IngredientSubstitutes substitutes={recipe.substitutes} />
        )}
      </View>

      <View>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1 }}
          style={{ position: "absolute", opacity: 0 }}
        >
          <ShareContent />
        </ViewShot>
      </View>

      <View className=" px-4 bg-white pb-4 mt-4">
        <TouchableOpacity
          onPress={handleStartCooking}
          className="bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <UtensilsCrossedIcon size={24} className="text-neutral-white" />
          <Text className="text-neutral-white font-semibold text-lg">
            {recipe.isPremium && !isPremium
              ? "Débloquer cette recette"
              : "Commencer à cuisiner"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecipeDetail;
