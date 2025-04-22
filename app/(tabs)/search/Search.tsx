import { Recipe } from "@/Types/RecipeType";
import { RecipeCard } from "@/components/RecipeCard/RecipeCard";
import { DifficultyFilters } from "@/components/Search/DifficultyFilters";
import Search from "@/components/Search/Search";
import { SortOptions } from "@/components/Search/SortOptions";
import { getRecipes } from "@/services/recipeService";
import { useStore } from "@/store/useStore";
import { router, useNavigation } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const difficultyFilters = ["Tous", "Facile", "Moyen", "Difficile"];
const sortOptions = [
  "Découvertes",
  "Populaires",
  "Temps de préparation",
  "Premium",
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const [selectedSort, setSelectedSort] = useState(
    selectedCategory || "Découvertes"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSort(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des recettes");
      console.error("Error fetching recipes:", err);
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

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setSelectedCategory(option);
    setShowSortOptions(false);
  };

  const backButton = () => {
    setSelectedCategory("Découvertes");
    navigation.goBack();
  };

  const filteredRecipes = React.useMemo(() => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== "Tous") {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === selectedFilter
      );
    }

    switch (selectedSort) {
      case "Premium":
        return filtered.filter((recipe) => recipe.isPremium);
      case "Populaires":
        return filtered;
      case "Temps de préparation":
        return filtered.sort((a, b) => a.time - b.time);
      default:
        return filtered;
    }
  }, [selectedSort, selectedFilter, recipes, searchQuery]);

  const sortedRecipes = React.useMemo(() => {
    return [...filteredRecipes].sort((a, b) => {
      switch (selectedSort) {
        case "Populaires":
          return b.category === "Populaires" ? 1 : -1;
        case "Temps de préparation":
          return a.time - b.time;
        case "Premium":
          return b.isPremium ? 1 : -1;
        default:
          return 0;
      }
    });
  }, [selectedSort, filteredRecipes]);

  return (
    <View className="flex gap-2 bg-neutral-white h-full">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <TouchableOpacity onPress={backButton}>
          <ArrowLeftIcon size={24} className="text-primary-light" />
        </TouchableOpacity>
        <Text className="text-primary-light text-lg font-semibold">
          Toutes les recettes - {selectedSort}
        </Text>
      </View>

      <Search value={searchQuery} onSearch={setSearchQuery} />

      <DifficultyFilters
        selectedFilter={selectedFilter}
        onFilterChange={(filter) => setSelectedFilter(filter)}
      />

      <SortOptions
        selectedSort={selectedSort}
        showSortOptions={showSortOptions}
        onSortChange={handleSortChange}
        onToggleSortOptions={() => setShowSortOptions(!showSortOptions)}
      />

      {loading ? (
        <View className="flex-1 bg-neutral-white items-center justify-center">
          <ActivityIndicator size="large" color="#FF8050" />
          <Text className="mt-4 text-text-primary">
            Chargement des recettes...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-text-primary text-center">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={sortedRecipes}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF8050"
              colors={["#FF8050"]}
              progressBackgroundColor="#FFFFFF"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/recipe/${item.id}`)}
              className="p-4"
            >
              <RecipeCard
                recipe={item}
                allRecipes={recipes}
                onPress={() => router.push(`/recipe/${item.id}`)}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-text-primary text-center">
                Aucune recette trouvée
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
