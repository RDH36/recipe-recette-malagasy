import { Recipe } from "@/Types/RecipeType"
import { useNavigation } from "@react-navigation/native"
import {
  ArrowLeftIcon,
  ChefHatIcon,
  Clock,
  HeartIcon,
  ShareIcon,
  TagIcon,
} from "lucide-react-native"
import React, { useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

interface RecipeDetailProps {
  recipe: Recipe
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const navigation = useNavigation()
  const [switchTab, setSwitchTab] = useState(true)

  return (
    <View className="flex-1 bg-neutral-white">
      {/* Header avec image */}
      <View className="relative h-[400px]">
        <Image
          source={recipe.image}
          className="w-full h-full opacity-75 rounded-t-2xl"
          resizeMode="cover"
        />
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary-light/20 rounded-t-2xl" />

        <View className="absolute top-5 w-full flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-neutral-white rounded-full p-2"
          >
            <ArrowLeftIcon size={20} className="text-text-primary" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity className="bg-neutral-white rounded-full p-2">
              <HeartIcon size={20} className="text-text-primary" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-neutral-white rounded-full p-2">
              <ShareIcon size={20} className="text-text-primary" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contenu */}
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold text-text-primary">
          {recipe.title}
        </Text>

        {/* Métadonnées */}
        <View className="flex-row space-x-4 mb-2 gap-4 mt-2">
          <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
            <Clock className="text-text-primary" size={16} />
            <Text className="text-sm text-text-primary">{recipe.time} min</Text>
          </View>
          <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
            <ChefHatIcon size={16} className="text-text-primary" />
            <Text className="text-sm text-text-primary">
              {recipe.difficulty}
            </Text>
          </View>
          <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
            <TagIcon size={16} className="text-text-primary" />
            <Text className="text-sm text-text-primary">{recipe.category}</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="mt-4 text-text-primary">{recipe.description}</Text>

        {/* Onglets */}
        <View className="flex-row mt-6 border-b border-primary-light/20">
          <TouchableOpacity
            onPress={() => setSwitchTab(true)}
            className={
              switchTab ? "pb-2 border-b-2 border-primary" : "mr-6 pb-2"
            }
          >
            <Text
              className={
                switchTab
                  ? "font-semibold text-text-primary"
                  : "text-text-disabled"
              }
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwitchTab(false)}
            className={
              switchTab ? "ml-6 pb-2" : "pb-2 border-b-2 border-primary"
            }
          >
            <Text
              className={
                switchTab
                  ? "text-text-disabled"
                  : "font-semibold text-text-primary"
              }
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {switchTab ? (
          <View className="mt-4">
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} className="text-text-primary py-2">
                • {ingredient}
              </Text>
            ))}
          </View>
        ) : (
          <View className="mt-4">
            {recipe.instructions.map((instruction, index) => (
              <Text key={index} className="text-text-primary py-2">
                • {instruction}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default RecipeDetail
