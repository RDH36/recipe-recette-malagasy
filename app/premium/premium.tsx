import { View, Text, ScrollView } from "react-native"
import React from "react"
import PricingCard from "@/components/PremiumCTA/PricingCard"
import { useStore } from "@/store/useStore"
import { router } from "expo-router"
const PremiumScreen = () => {
  const setIsPremium = useStore((state) => state.setIsPremium)
  const isPremium = useStore((state) => state.isPremium)

  const handleSubscribe = (plan: "free" | "premium") => {
    if (isPremium) {
      router.push("/search/Search")
    } else {
      setIsPremium(true)
      console.log(`Subscribing to ${plan} plan`)
      router.back()
    }
  }

  return (
    <ScrollView className="flex-1 bg-neutral-white">
      <View className="p-4 pb-8">
        <Text className="text-3xl font-bold text-center text-text-primary mb-2">
          Tarification Simple
        </Text>
        <Text className="text-base text-center text-text-disabled mb-8">
          Choisissez le forfait qui vous convient le mieux
        </Text>

        <View className="space-y-6">
          <PricingCard
            title="Premium"
            price="4,99"
            features={[
              "Accès à TOUTES les recettes authentiques",
              "Collections de recettes régionales",
              "Contexte culturel et historique",
              "Sans publicités",
              "Guides de substitution d'ingrédients",
            ]}
            buttonText={
              isPremium ? "Vous êtes déjà Premium" : "Obtenir Premium"
            }
            onPress={() => handleSubscribe("premium")}
            isPopular
            isPrimary
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default PremiumScreen
