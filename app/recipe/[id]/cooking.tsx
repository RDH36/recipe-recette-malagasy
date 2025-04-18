import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import CookingMode from "../../../components/CookingMode/CookingMode"
import { sampleRecipes } from "@/data/sample-data"
import { Recipe } from "@/Types/RecipeType"

const CookingPage = () => {
  const { id } = useLocalSearchParams()
  const [recipe, setRecipe] = useState<Recipe>()

  useEffect(() => {
    const recipe = sampleRecipes.find((recipe) => recipe.id === id)
    if (recipe) {
      setRecipe(recipe)
    }
  }, [id])

  return <CookingMode recipes={recipe!} />
}

export default CookingPage
