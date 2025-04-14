import { RecipeCard } from "@/components/RecipeCard/RecipeCard";
import Search from "@/components/Search/Search";
import { sampleRecipes } from "@/data/sample-data";
import { useStore } from "@/store/useStore";
import { router, useNavigation } from "expo-router";
import { ArrowLeftIcon, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const difficultyFilters = ["Tous", "Facile", "Moyen", "Difficile"];
const sortOptions = [
  "Nouveautés",
  "Populaires",
  "Temps de préparation",
  "Premium",
];

export default function SearchPage() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);

  const [selectedSort, setSelectedSort] = useState("Nouveautés");

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSort(selectedCategory);
    } else {
      setSelectedSort("Nouveautés");
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSort) {
      setSelectedCategory(selectedSort);
    }
  }, [selectedSort]);

  const backButton = () => {
    setSelectedCategory("Nouveautés");
    navigation.goBack();
  };

  return (
    <View className="flex gap-2 bg-neutral-white h-full">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <TouchableOpacity onPress={backButton}>
          <ArrowLeftIcon size={24} className="text-primary-light" />
        </TouchableOpacity>
        <Text className="text-primary-light text-lg font-semibold">
          Toutes les recettes - {selectedCategory}
        </Text>
      </View>

      <Search />

      <View className="px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {difficultyFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg ${
                  selectedFilter === filter ? "bg-primary" : "bg-neutral-light"
                }`}
              >
                <Text
                  className={`${
                    selectedFilter === filter
                      ? "text-neutral-white"
                      : "text-text-secondary"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="px-4 mb-3 ">
        <TouchableOpacity
          onPress={() => setShowSortOptions(!showSortOptions)}
          className="flex-row justify-between items-center gap-2 bg-text-secondary/10 px-4 py-2 rounded-lg"
        >
          <Text className="text-text-primary font-medium">
            Trier par:{" "}
            <Text className="text-primary-dark font-normal">
              {selectedSort}
            </Text>
          </Text>
          <ChevronDown
            size={20}
            className={`text-text-primary transition-transform ${
              showSortOptions ? "rotate-180" : "rotate-0"
            }`}
          />
        </TouchableOpacity>

        {showSortOptions && (
          <View className="mt-2 bg-neutral-white rounded-lg shadow-sm border border-neutral-light">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedSort(option);
                  setShowSortOptions(false);
                }}
                className="px-4 py-3 border-b border-neutral-light last:border-b-0"
              >
                <Text
                  className={`${
                    selectedSort === option
                      ? "text-primary font-medium"
                      : "text-text-secondary"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView className="px-4">
        {sampleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={false}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
