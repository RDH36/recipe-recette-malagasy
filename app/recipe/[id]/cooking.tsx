import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import CookingMode from "../../../components/CookingMode/CookingMode"
import { getRecipeById } from "@/services/recipeService"
import { Recipe } from "@/Types/RecipeType"
import { View, Text, ActivityIndicator } from "react-native"

const CookingPage = () => {
  const { id } = useLocalSearchParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (typeof id === "string") {
          const data = await getRecipeById(id)
          setRecipe(data)
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement de la recette")
        console.error("Error fetching recipe:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8050" />
        <Text className="mt-4 text-text-primary">
          Chargement de la recette...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center p-4">
        <Text className="text-text-primary text-center">{error}</Text>
      </View>
    )
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center p-4">
        <Text className="text-text-primary text-center">
          Recette non trouvée
        </Text>
      </View>
    )
  }

  return <CookingMode recipes={recipe} />
}

export default CookingPage
