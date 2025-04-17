import { Recipe } from "@/Types/RecipeType"
import { Clock, Heart, Crown, Sparkles } from "lucide-react-native"
import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { isNewRecipe } from "@/utils/utilis"

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onPress?: () => void
  style?: "horizontal" | "vertical"
  allRecipes: Recipe[]
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  isFavorite,
  style = "vertical",
  allRecipes,
}) => {
  const renderBadges = () => (
    <View className="absolute top-2 left-2 flex-row gap-1">
      {recipe.isPremium && (
        <View className="bg-secondary-light rounded-full px-2 py-1 flex-row items-center">
          <Crown size={14} className="text-neutral-white mr-1" />
          <Text className="text-neutral-white text-xs font-medium">
            Premium
          </Text>
        </View>
      )}
    </View>
  )

  if (style === "horizontal") {
    return (
      <TouchableOpacity onPress={onPress} className="w-[280px] mr-4">
        <View className="bg-neutral-white rounded-2xl shadow-sm border border-neutral-light">
          <View className="relative">
            <Image
              source={recipe.image}
              className="w-full h-[180px] rounded-t-2xl"
              resizeMode="cover"
            />
            {renderBadges()}
            <TouchableOpacity className="absolute top-2 right-2 bg-primary-light/20 rounded-full p-1.5">
              <Heart
                size={20}
                className="text-primary-light"
                fill={isFavorite ? "#212121" : "none"}
              />
            </TouchableOpacity>
          </View>

          <View className="p-3">
            <Text
              className="text-text-primary font-semibold text-lg mb-1"
              numberOfLines={1}
            >
              {recipe.title}
            </Text>

            <View className="flex-row items-center gap-1">
              <Clock size={14} className="text-text-secondary" />
              <Text className="text-text-secondary text-sm">
                {recipe.time} min
              </Text>
              <Text className="text-text-secondary mx-1">•</Text>
              <Text className="text-text-secondary text-sm">
                {recipe.difficulty}
              </Text>
            </View>

            <Text
              className="text-text-secondary text-sm mt-1"
              numberOfLines={2}
            >
              {recipe.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} className="w-full mb-4">
      <View className="flex-row bg-neutral-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden">
        <View className="relative">
          <Image
            source={recipe.image}
            className="w-[120px] h-[120px]"
            resizeMode="cover"
          />
          {renderBadges()}
        </View>

        <View className="flex-1 p-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text
                className="text-text-primary font-semibold text-lg mb-1"
                numberOfLines={1}
              >
                {recipe.title}
              </Text>
              <View className="flex-row items-center gap-1">
                <Clock size={14} className="text-text-secondary" />
                <Text className="text-text-secondary text-sm">
                  {recipe.time} min
                </Text>
                <Text className="text-text-secondary mx-1">•</Text>
                <Text className="text-text-secondary text-sm">
                  {recipe.difficulty}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-primary-light/20 rounded-full p-1.5">
              <Heart
                size={20}
                className="text-primary-light"
                fill={isFavorite ? "#212121" : "none"}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-text-secondary text-sm mt-1" numberOfLines={2}>
            {recipe.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
