import ViewShot, { captureRef } from "react-native-view-shot"
import * as Sharing from "expo-sharing"
import { Recipe } from "@/Types/RecipeType"

export const handleShare = async (
  viewShotRef: React.RefObject<ViewShot>,
  recipe: Recipe
) => {
  try {
    if (!viewShotRef.current) return

    const uri = await captureRef(viewShotRef.current, {
      format: "png",
      quality: 1,
    })

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: `Partager ${recipe.title}`,
      UTI: "public.png",
    })
  } catch (error) {
    console.error("Erreur lors du partage:", error)
  }
}

export const isNewRecipe = (recipe: Recipe, allRecipes: Recipe[]): boolean => {
  const sortedRecipes = [...allRecipes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return sortedRecipes.slice(0, 5).some((r) => r.id === recipe.id)
}
