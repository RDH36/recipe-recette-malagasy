import { Recipe } from "@/Types/RecipeType"
import { ChefHatIcon, Clock, Heart, TagIcon } from "lucide-react-native"
import { StyleSheet } from "nativewind"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onPress?: () => void
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  isFavorite,
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="w-full">
      <View className="flex bg-white rounded-3xl shadow-sm w-full border border-ocre-miel/20">
        <View className="relative">
          <View className="relative h-[250px]">
            <Image
              source={recipe.image}
              className="w-full h-full rounded-t-3xl"
              resizeMode="cover"
            />
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-ocre-miel/20 rounded-t-2xl" />
          </View>
          <View className="absolute top-4 right-4 flex-row gap-2 bg-white rounded-full p-2 items-center justify-center">
            <TouchableOpacity>
              <Heart
                size={24}
                className="text-brun-cacao"
                fill={isFavorite ? "#3E3E3E" : "none"}
              />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={styles.gradientOverlay}
          >
            <Text className="text-white font-bold text-3xl">
              {recipe.title}
            </Text>
          </LinearGradient>
        </View>

        <View className="p-4">
          <View className="flex-row gap-2 mb-2">
            <View className="bg-beige-amande rounded-full px-3 py-1 flex-row items-center gap-2">
              <Clock className="text-brun-cacao" size={16} />
              <Text className="text-sm text-brun-cacao">{recipe.time} min</Text>
            </View>
            <View className="bg-beige-amande rounded-full px-3 py-1 flex-row items-center gap-2">
              <ChefHatIcon size={16} color="#3E3E3E" />
              <Text className="text-sm text-brun-cacao">
                {recipe.difficulty}
              </Text>
            </View>
            <View className="bg-beige-amande rounded-full px-3 py-1 flex-row items-center gap-2">
              <TagIcon size={16} color="#3E3E3E" />
              <Text className="text-sm text-brun-cacao">{recipe.category}</Text>
            </View>
          </View>

          <Text className="text-brun-cacao text-sm mb-4" numberOfLines={2}>
            {recipe.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
})
