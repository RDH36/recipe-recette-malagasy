import { Recipe } from "@/Types/RecipeType";
import { ChefHatIcon, Clock, Heart, TagIcon } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onPress?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  isFavorite,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-md w-full max-w-sm">
      <View className="relative">
        <View className="relative">
          <Image
            source={require("@/assets/images/placeholder.png")}
            className="w-full h-40 opacity-75 rounded-t-2xl"
            resizeMode="cover"
            style={{ tintColor: "black" }}
          />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20 rounded-t-2xl" />
        </View>
        <TouchableOpacity className="absolute top-2 right-2 p-2 z-50 bg-white rounded-full shadow-md">
          <Heart
            className="text-black"
            size={24}
            fill={isFavorite ? "red" : "none"}
          />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-xl font-semibold mb-2">{recipe.title}</Text>

        <View className="flex-row space-x-4 mb-2 gap-4 mt-2">
          <View className="flex-row items-center gap-2">
            <Clock className="text-gray-600 " size={16} />
            <Text className="text-sm text-gray-600 border border-gray-200 rounded-xl px-2 py-1 font-bold">
              {recipe.time} min
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ChefHatIcon size={16} color="gray" />
            <Text className="text-sm text-gray-600 border border-gray-200 rounded-xl px-2 py-1 font-bold">
              {recipe.difficulty}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TagIcon size={16} color="gray" />
            <Text className="text-sm text-gray-600 border border-gray-200 rounded-xl px-2 py-1 font-bold">
              {recipe.category}
            </Text>
          </View>
        </View>

        <Text className="text-gray-600 text-sm" numberOfLines={2}>
          {recipe.description}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="mt-4 bg-black py-2 rounded-lg"
        >
          <Text className="text-white text-center font-medium">
            View Recipe
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
