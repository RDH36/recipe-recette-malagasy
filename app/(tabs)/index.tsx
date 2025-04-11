import type { Recipe } from "@/Types/RecipeType"
import Header from "@/components/Header/Header"
import { RecipeCard } from "@/components/RecipeCard/RecipeCard"
import Search from "@/components/Search/Search"
import Banner from "@/components/Banner/Banner"
import PremiumCTA from "@/components/PremiumCTA/PremiumCTA"
import { sampleRecipes } from "@/data/sample-data"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from "react-native"
import CategoryView from "@/components/CategoryView/CategoryView"

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="flex-1">
        <View className="w-full flex-col mb-2">
          <Header />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Banner />
          <CategoryView recipes={recipes} title="Recettes Populaires" />
          <CategoryView recipes={recipes} title="Nouvelles Recettes" />

          <View className="mt-6 px-4 mb-4">
            <PremiumCTA />
          </View>

          {/* <View className="mt-6 px-4">
            <Text className="text-text-primary text-xl font-semibold mb-4">
              Toutes les Recettes
            </Text>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={false}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </View> */}
        </ScrollView>
      </View>
    </View>
  )
}
