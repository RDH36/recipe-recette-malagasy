import type { Recipe } from "@/Types/RecipeType";
import { AdBanner } from "@/components/Ads";
import Banner from "@/components/Banner/Banner";
import CategoryView from "@/components/CategoryView/CategoryView";
import Header from "@/components/Header/Header";
import PremiumSection from "@/components/PremiumCTA/PremiumSection";
import { useAdMob } from "@/contexts/AdMobContext";
import {
  getNotPopularRecipes,
  getPopularRecipes,
} from "@/services/recipeService";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [notPopularRecipes, setNotPopularRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showAds } = useAdMob();

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
        <ActivityIndicator size="large" color="#FF8050" />
        <Text className="mt-4 text-text-primary">
          Chargement des recettes...
        </Text>
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

          {showAds && <View style={{ height: 50 }} />}
        </ScrollView>

        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <AdBanner />
        </View>
      </View>
    </View>
  );
}
