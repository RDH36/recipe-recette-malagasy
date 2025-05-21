import PricingCard from "@/components/PremiumCTA/PricingCard";
import { cancelPremiumSubscription } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Star, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PremiumScreen = () => {
  const { setIsPremium, isPremium, setIsLifetime, isLifetime, user } =
    useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (plan: "monthly" | "yearly" | "lifetime") => {
    if (isPremium) {
      router.push("/search/Search");
      return;
    }

    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour vous abonner à Premium.",
        [{ text: "OK", onPress: () => router.push("/(tabs)/profile/Profile") }]
      );
      return;
    }

    router.push({
      pathname: "/premium/payment" as any,
      params: { type: plan },
    });
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    Alert.alert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement Premium ? Vous perdrez l'accès aux fonctionnalités premium à la fin de votre période de facturation.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const success = await cancelPremiumSubscription(user.id);

              if (success) {
                setIsPremium(false);
                Alert.alert(
                  "Abonnement annulé",
                  "Votre abonnement a été annulé avec succès. Vous aurez accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation.",
                  [
                    {
                      text: "OK",
                      onPress: () => router.push("/(tabs)"),
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Erreur",
                  "Une erreur s'est produite lors de l'annulation de votre abonnement. Veuillez réessayer."
                );
              }
            } catch (error) {
              console.error("Erreur lors de l'annulation:", error);
              Alert.alert(
                "Erreur",
                "Une erreur s'est produite. Veuillez réessayer ultérieurement."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-neutral-white">
      <ImageBackground
        source={require("@/assets/images/banner.png")}
        className="h-60"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
          className="h-full w-full px-6 pt-14"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/20 items-center justify-center mb-4"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-3xl font-bold text-white">
              Cuisine Malgache Premium
            </Text>
            <Text className="text-white/80 text-base mt-2">
              Des saveurs authentiques à portée de main
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <ScrollView
        className="flex-1 -mt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="bg-neutral-white rounded-t-3xl px-6 pt-8">
          {isLifetime && (
            <View className="mb-8 bg-green-50 rounded-xl p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-green-600 font-bold text-lg">
                  Vous avez un abonnement à vie
                </Text>
              </View>
              <Text className="text-green-500 text-sm">
                Félicitations ! Vous bénéficiez d'un accès illimité à toutes nos
                fonctionnalités premium à vie. Aucune action supplémentaire
                n'est requise.
              </Text>
            </View>
          )}

          <Text className="text-lg font-bold text-center text-text-primary mb-2">
            {isPremium ? "Votre abonnement" : "Choisissez votre formule"}
          </Text>
          <Text className="text-sm text-center text-text-disabled mb-8">
            {isPremium
              ? "Vous bénéficiez déjà de tous les avantages premium"
              : "Des expériences culinaires uniques vous attendent"}
          </Text>

          <View className="space-y-6">
            <PricingCard
              title="Premium Mensuel"
              price="4,99"
              priceUnit="€/mois"
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
              onPress={() => handleSubscribe("monthly")}
            />

            <PricingCard
              title="Premium Annuel"
              price="19,99"
              priceUnit="€/an"
              features={[
                "Accès à TOUTES les recettes authentiques",
                "Collections de recettes régionales",
                "Contexte culturel et historique",
                "Sans publicités",
                "Guides de substitution d'ingrédients",
                "Économisez plus de 65% par rapport au mensuel",
              ]}
              buttonText={
                isPremium ? "Vous êtes déjà Premium" : "Obtenir Premium"
              }
              onPress={() => handleSubscribe("yearly")}
              isPopular
            />

            <View className="flex-row items-center justify-center my-2">
              <View className="h-px bg-gray-200 flex-1" />
              <Text className="mx-4 text-text-disabled text-xs">OU</Text>
              <View className="h-px bg-gray-200 flex-1" />
            </View>

            <View className="bg-primary p-6 rounded-2xl shadow-lg">
              <View className="absolute -top-3 right-4 bg-white px-4 py-1 rounded-full">
                <Text className="text-xs font-bold text-primary">
                  PROMO LIMITÉE
                </Text>
              </View>

              <Text className="text-xl font-bold text-white mb-2">
                Premium à Vie
              </Text>

              <View className="flex-row items-baseline mb-6">
                <Text className="text-4xl font-bold text-white">24,99</Text>
                <Text className="ml-1 text-white/80">€</Text>
                <Text className="ml-2 text-white/80 line-through text-sm">
                  99,99€
                </Text>
              </View>

              <View className="space-y-3 mb-6">
                {[
                  "Tous les avantages Premium",
                  "Paiement unique",
                  "Accès à vie à toutes les fonctionnalités",
                  "Mises à jour futures incluses",
                  "Support prioritaire",
                ].map((feature, index) => (
                  <View key={index} className="flex-row items-center">
                    <Star size={18} color="white" className="mr-3" />
                    <Text className="text-white">{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleSubscribe("lifetime")}
                className="py-4 rounded-xl items-center bg-white"
              >
                <Text className="text-primary font-semibold">
                  {isPremium ? "Vous êtes déjà Premium" : "Acheter à vie"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-primary/5 mt-8 p-6 rounded-2xl">
            <Text className="text-lg font-bold text-text-primary mb-2">
              Pourquoi choisir Premium?
            </Text>
            <Text className="text-text-secondary mb-4">
              Notre abonnement Premium vous offre une expérience culinaire
              malgache complète et authentique.
            </Text>
            <Text className="text-text-secondary">
              Rejoignez notre communauté de passionnés et découvrez les secrets
              de la cuisine malgache.
            </Text>
          </View>

          {isPremium && !isLifetime && (
            <View className="mt-8 border-t border-gray-200 pt-6">
              <Text className="text-center text-text-disabled text-sm mb-4">
                Gestion de votre abonnement
              </Text>
              <TouchableOpacity
                className="py-3 flex-row justify-center items-center"
                onPress={handleCancelSubscription}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#7D7D7D"
                    className="mr-2"
                  />
                ) : (
                  <X size={14} color="#7D7D7D" className="mr-2" />
                )}
                <Text className="text-text-disabled">
                  Annuler mon abonnement
                </Text>
              </TouchableOpacity>
              <Text className="text-center text-text-disabled text-xs mt-1">
                Votre accès sera maintenu jusqu'à la fin de la période en cours
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PremiumScreen;
