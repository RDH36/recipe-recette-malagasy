import { Recipe } from "@/Types/RecipeType"
import { useStore } from "@/store/useStore"
import { useRouter } from "expo-router"
import { UtensilsCrossedIcon } from "lucide-react-native"
import React, { useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import ViewShot from "react-native-view-shot"
import Header from "./Header"
import RecipeInfo from "./RecipeInfo"
import Ingredients from "./Ingredients"
import IngredientSubstitutes from "./IngredientSubstitutes"
import { handleShare } from "@/utils/utilis"

interface RecipeDetailProps {
  recipe: Recipe
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const router = useRouter()
  const viewShotRef = useRef<ViewShot>(null)
  const { isPremium } = useStore()

  const handleStartCooking = () => {
    if (recipe.isPremium && !isPremium) {
      router.push("/premium/premium")
      return
    }
    router.push(`/recipe/${recipe.id}/cooking`)
  }

  return (
    <View className="relative flex-1 bg-neutral-white w-full">
      <ViewShot ref={viewShotRef}>
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
      </ViewShot>

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
  )
}

export default RecipeDetail
