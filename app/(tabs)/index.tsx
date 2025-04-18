import type { Recipe } from "@/Types/RecipeType"
import Banner from "@/components/Banner/Banner"
import CategoryView from "@/components/CategoryView/CategoryView"
import Header from "@/components/Header/Header"
import PremiumCTA from "@/components/PremiumCTA/PremiumCTA"
import { sampleRecipes } from "@/data/sample-data"
import { useState, useCallback } from "react"
import { ScrollView, View, RefreshControl } from "react-native"

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRecipes(sampleRecipes)
      setRefreshing(false)
    }, 1000)
  }, [])

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
