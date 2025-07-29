import type { Recipe } from "@/Types/RecipeType";
import Banner from "@/components/Banner/Banner";
import CategoryView from "@/components/CategoryView/CategoryView";
import Header from "@/components/Header/Header";
import CookingLoader from "@/components/Loading/CookingLoader";
import PremiumSection from "@/components/PremiumCTA/PremiumSection";
import {
  getNotPopularRecipes,
  getPopularRecipes,
} from "@/services/recipeService";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function Index() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [notPopularRecipes, setNotPopularRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const popularData = await getPopularRecipes();
      const notPopularData = await getNotPopularRecipes();
      setPopularRecipes(popularData);
      setNotPopularRecipes(notPopularData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecipes();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-white items-center justify-center">
        <CookingLoader message="Préparation des gourmandises..." />
      </View>
    );
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
            recipes={popularRecipes}
            title="Populaires"
            allRecipes={popularRecipes}
          />
          <CategoryView
            recipes={notPopularRecipes}
            title="Découvertes"
            allRecipes={notPopularRecipes}
          />

          <View className="mt-6 px-4 mb-4">
            <PremiumSection />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
