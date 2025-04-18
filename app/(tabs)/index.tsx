import type { Recipe } from "@/Types/RecipeType"
import Banner from "@/components/Banner/Banner"
import CategoryView from "@/components/CategoryView/CategoryView"
import Header from "@/components/Header/Header"
import PremiumCTA from "@/components/PremiumCTA/PremiumCTA"
import { getRecipes } from "@/services/recipeService"
import { useState, useCallback, useEffect } from "react"
import {
  ScrollView,
  View,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native"

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes()
      setRecipes(data)
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchRecipes()
    setRefreshing(false)
  }, [])

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8050" />
        <Text className="mt-4 text-text-primary">
          Chargement des recettes...
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="flex-1">
        <View className="w-full flex-col mb-2">
          <Header />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF8050"
              colors={["#FF8050"]}
              progressBackgroundColor="#FFFFFF"
            />
          }
        >
          <Banner />
          <CategoryView
            recipes={recipes}
            title="Populaires"
            allRecipes={recipes}
          />
          <CategoryView
            recipes={recipes}
            title="Découvertes"
            allRecipes={recipes}
          />

          <View className="mt-6 px-4 mb-4">
            <PremiumCTA />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
