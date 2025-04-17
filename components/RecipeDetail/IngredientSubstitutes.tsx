import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useStore } from "@/store/useStore"
import { useRouter } from "expo-router"
import { Replace } from "lucide-react-native"

interface Substitute {
  original: string
  substitutes: string[]
}

interface IngredientSubstitutesProps {
  substitutes: Substitute[]
}

const IngredientSubstitutes: React.FC<IngredientSubstitutesProps> = ({
  substitutes,
}) => {
  const { isPremium } = useStore()
  const router = useRouter()

  if (!isPremium) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/premium/premium")}
        className="mt-4 p-4 bg-primary/5 rounded-xl"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Replace size={20} className="text-primary" />
            <Text className="text-primary font-medium">
              Guide de substitution disponible
            </Text>
          </View>
          <Text className="text-primary text-sm">Premium</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View className="mt-4 space-y-4">
      <Text className="text-lg font-semibold text-text-primary mb-2">
        Substitutions possibles
      </Text>
      {substitutes.map((item, index) => (
        <View key={index} className="bg-secondary-light/10 p-4 rounded-xl">
          <Text className="font-medium text-text-primary mb-2">
            {item.original}
          </Text>
          <View className="space-y-1">
            {item.substitutes.map((substitute, subIndex) => (
              <View key={subIndex} className="flex-row items-center gap-2">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-text-disabled">{substitute}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

export default IngredientSubstitutes
