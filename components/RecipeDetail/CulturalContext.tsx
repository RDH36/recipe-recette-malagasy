import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useStore } from "@/store/useStore"
import { useRouter } from "expo-router"
import { History, Globe } from "lucide-react-native"

interface CulturalContextProps {
  culturalContext?: string
  history?: string
  region?: string
}

const CulturalContext: React.FC<CulturalContextProps> = ({
  culturalContext,
  history,
  region,
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
            <Globe size={20} className="text-primary" />
            <Text className="text-primary font-medium">
              Contexte culturel disponible
            </Text>
          </View>
          <Text className="text-primary text-sm">Premium</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View className="mt-4 space-y-4">
      {region && (
        <View className="flex-row items-start gap-3">
          <Globe size={20} className="text-primary mt-1" />
          <View className="flex-1">
            <Text className="font-medium text-text-primary mb-1">Région</Text>
            <Text className="text-text-disabled">{region}</Text>
          </View>
        </View>
      )}

      {history && (
        <View className="flex-row items-start gap-3">
          <History size={20} className="text-primary mt-1" />
          <View className="flex-1">
            <Text className="font-medium text-text-primary mb-1">Histoire</Text>
            <Text className="text-text-disabled">{history}</Text>
          </View>
        </View>
      )}

      {culturalContext && (
        <View className="flex-row items-start gap-3">
          <Globe size={20} className="text-primary mt-1" />
          <View className="flex-1">
            <Text className="font-medium text-text-primary mb-1">
              Contexte culturel
            </Text>
            <Text className="text-text-disabled">{culturalContext}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default CulturalContext
