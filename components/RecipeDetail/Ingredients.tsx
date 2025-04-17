import { Recipe } from "@/Types/RecipeType"
import React from "react"
import { Text, View } from "react-native"

interface IngredientsProps {
  recipe: Recipe
}

export const Ingredients: React.FC<IngredientsProps> = ({ recipe }) => {
  return (
    <View className="mt-6">
      <Text className="text-xl font-semibold text-text-primary mb-4">
        Ingrédients
      </Text>
      <View className="space-y-2">
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} className="text-text-primary">
            • {ingredient}
          </Text>
        ))}
      </View>
    </View>
  )
}

export default Ingredients
