import RecipeDetail from "@/components/RecipeDetail/RecipeDetail"
import { useAdMob } from "@/contexts/AdMobContext"
import { showInterstitialAd } from "@/services/adMobService"
import { getRecipeById } from "@/services/recipeService"
import { Recipe } from "@/Types/RecipeType"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"

export default function RecipeDetails() {
  const { id } = useLocalSearchParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showAds } = useAdMob()
  const [adShown, setAdShown] = useState(false)

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
  
  // Afficher une publicité interstitielle lorsque l'écran est chargé
  // Mais seulement pour les utilisateurs non premium et une fois par session
  useEffect(() => {
    const showAd = async () => {
      if (showAds && !loading && !adShown && recipe) {
        // Attendre un court délai pour que l'utilisateur puisse voir la recette d'abord
        setTimeout(async () => {
          await showInterstitialAd()
          setAdShown(true)
        }, 2000) // Délai de 2 secondes
      }
    }
    
    showAd()
  }, [showAds, loading, adShown, recipe])

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
        <Text className="text-text-primary text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-light rounded-lg px-4 py-2"
        >
          <Text className="text-neutral-white">Retour</Text>
        </TouchableOpacity>
      </View>
    )
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
    )
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <ScrollView className="flex-1">
        <RecipeDetail recipe={recipe} />
      </ScrollView>
    </View>
  )
}
