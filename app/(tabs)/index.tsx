import type { Recipe } from "@/Types/RecipeType"
import Header from "@/components/Header/Header"
import { RecipeCard } from "@/components/RecipeCard/RecipeCard"
import Search from "@/components/Search/Search"
import { sampleRecipes } from "@/data/sample-data"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMoreRecipes = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newRecipes = [...sampleRecipes].map((recipe) => ({
        ...recipe,
        id: `${recipe.id}-${page}`,
      }))

      setRecipes((prev) => [...prev, ...newRecipes])
      setPage((prev) => prev + 1)

      if (page >= 5) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des recettes:", error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent
      const paddingToBottom = 100
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom

      if (isCloseToBottom) {
        loadMoreRecipes()
      }
    },
    [loadMoreRecipes]
  )

  return (
    <View className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <View className="flex flex-col h-full w-full gap-4">
        <View className="flex flex-col p-4 border-b border-gray-200 w-screen -mx-4 gap-3">
          <Header />
        </View>
        <ScrollView
          className="flex flex-col w-full"
          contentContainerStyle={{
            alignItems: "center",
            gap: 16,
            paddingBottom: 100,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={false}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            />
          ))}
          {loading && (
            <View className="py-4">
              <ActivityIndicator size="large" color="#000000" />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}
