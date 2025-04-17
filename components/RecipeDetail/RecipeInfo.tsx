import { Recipe } from "@/Types/RecipeType"
import { Clock, ChefHatIcon, LockIcon } from "lucide-react-native"
import React from "react"
import { Text, View } from "react-native"
import CulturalContext from "./CulturalContext"

interface RecipeInfoProps {
  recipe: Recipe
  isPremium: boolean
}

const RecipeInfo: React.FC<RecipeInfoProps> = ({ recipe, isPremium }) => {
  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-start justify-between">
        <Text className="text-3xl font-bold text-text-primary flex-1 mr-2">
          {recipe.title}
        </Text>
        {recipe.isPremium && !isPremium && (
          <View className="bg-primary/10 p-2 rounded-lg">
            <LockIcon size={20} className="text-primary" />
          </View>
        )}
      </View>

      <View className="flex-row space-x-4 mb-2 gap-4 mt-2">
        <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
          <Clock className="text-text-primary" size={16} />
          <Text className="text-sm text-text-primary">{recipe.time} min</Text>
        </View>
        <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
          <ChefHatIcon size={16} className="text-text-primary" />
          <Text className="text-sm text-text-primary">{recipe.difficulty}</Text>
        </View>
      </View>

      <Text className="mt-4 text-text-primary">{recipe.description}</Text>

      {/* Contexte culturel pour les recettes premium */}
      {recipe.culturalContext && (
        <CulturalContext
          culturalContext={recipe.culturalContext}
          history={recipe.history}
          region={recipe.region}
        />
      )}
    </View>
  )
}

export default RecipeInfo
