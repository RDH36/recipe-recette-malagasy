import StripePaymentForm from "@/components/Payment/StripePaymentForm";
import { STRIPE_PUBLISHABLE_KEY } from "@/config/stripe";
import {
  SubscriptionType,
  getSubscriptionPrice,
} from "@/services/stripeServices";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PaymentScreen = () => {
  const params = useLocalSearchParams<{ type: SubscriptionType }>();
  const subscriptionType = (params.type as SubscriptionType) || "monthly";
  const amount = getSubscriptionPrice(subscriptionType);

  const getSubscriptionTitle = () => {
    switch (subscriptionType) {
      case "monthly":
        return "Abonnement Mensuel";
      case "yearly":
        return "Abonnement Annuel";
      case "lifetime":
        return "Accès à Vie";
      default:
        return "Abonnement";
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View className="flex-1 bg-neutral-50">
        <ImageBackground
          source={require("@/assets/images/banner.png")}
          className="h-[180px]"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
            className="h-full w-full px-4 pt-[50px]"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/20 items-center justify-center mb-4"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>

            <View className="mb-4">
              <Text className="text-2xl font-bold text-white">
                Finaliser votre achat
              </Text>
              <Text className="text-base text-white/80 mt-1">
                {getSubscriptionTitle()}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <ScrollView
          className="flex-1 -mt-5"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          <View className="mt-4 mb-6">
            <StripePaymentForm
              subscriptionType={subscriptionType}
              amount={amount}
              onCancel={() => router.back()}
            />
          </View>

          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-base font-bold mb-2 text-gray-800">
              Informations importantes
            </Text>
            {subscriptionType === "monthly" && (
              <Text className="text-sm leading-5 text-gray-600">
                Votre abonnement mensuel sera automatiquement renouvelé tous les
                mois. Vous pouvez l'annuler à tout moment depuis votre profil.
              </Text>
            )}
            {subscriptionType === "yearly" && (
              <Text className="text-sm leading-5 text-gray-600">
                Votre abonnement annuel sera automatiquement renouvelé chaque
                année. Vous bénéficiez d'une économie de plus de 65% par rapport
                à l'abonnement mensuel.
              </Text>
            )}
            {subscriptionType === "lifetime" && (
              <Text className="text-sm leading-5 text-gray-600">
                L'accès à vie est un paiement unique qui vous donne un accès
                permanent à toutes les fonctionnalités premium actuelles et
                futures.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </StripeProvider>
  );
};

export default PaymentScreen;
