import PricingCard from "@/components/PremiumCTA/PricingCard";
import { updatePremiumStatus } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";

const PremiumScreen = () => {
  const { setIsPremium, isPremium, user } = useStore();

  const handleSubscribe = async (plan: "free" | "premium") => {
    if (isPremium) {
      router.push("/search/Search");
      return;
    }

    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour vous abonner à Premium.",
        [{ text: "OK", onPress: () => router.push("/(tabs)") }]
      );
      return;
    }

    try {
      const success = await updatePremiumStatus(user.id, true);

      if (success) {
        setIsPremium(true);
        console.log(`Abonnement réussi au forfait ${plan}`);

        router.push("/premium/congratulation");
      } else {
        Alert.alert(
          "Erreur",
          "Une erreur s'est produite lors de l'activation de votre abonnement. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite. Veuillez réessayer ultérieurement."
      );
    }
  };

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
  );
};

export default PremiumScreen;
