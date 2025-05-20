import { useStore } from "@/store/useStore";
import {
  SubscriptionType,
  getSubscriptionPrice,
} from "@/services/stripeServices";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const params = useLocalSearchParams<{ type: SubscriptionType }>();
  const subscriptionType = (params.type as SubscriptionType) || "monthly";
  const amount = getSubscriptionPrice(subscriptionType);
  const { user, setIsPremium, setIsLifetime } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les champs de la carte
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

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
  
  // Formater le numéro de carte pendant la saisie
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.substring(i, i + 4));
    }
    
    return groups.join(' ').trim().substring(0, 19);
  };
  
  // Formater la date d'expiration pendant la saisie
  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    } else if (cleaned.length === 2) {
      return `${cleaned}/`;
    }
    
    return cleaned;
  };
  
  // Simuler un paiement
  const handlePayment = () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour effectuer un paiement');
      return;
    }
    
    if (cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3) {
      Alert.alert('Erreur', 'Veuillez remplir correctement tous les champs de la carte');
      return;
    }
    
    setIsLoading(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      setIsLoading(false);
      
      // Mettre à jour le statut premium
      setIsPremium(true);
      
      if (subscriptionType === 'lifetime') {
        setIsLifetime(true);
      }
      
      // Rediriger vers la page de félicitations
      router.push('/premium/congratulation');
    }, 2000);
  };

  return (
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
        <View className="mt-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
          <Text className="text-lg font-bold mb-2 text-center">Paiement sécurisé</Text>
          <Text className="text-2xl font-bold text-primary text-center mb-6">{amount.toFixed(2)} €</Text>
          
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Numéro de carte</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
              <CreditCard size={20} color="#999" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                maxLength={19}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              />
            </View>
          </View>
          
          <View className="flex-row mb-6">
            <View className="flex-1 mr-2">
              <Text className="text-sm text-gray-600 mb-1">Date d'expiration</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-600 mb-1">CVC</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                placeholder="123"
                keyboardType="number-pad"
                maxLength={3}
                value={cvc}
                onChangeText={setCvc}
                secureTextEntry
              />
            </View>
          </View>
          
          <TouchableOpacity
            className={`py-4 rounded-xl items-center ${isLoading ? 'bg-primary/50' : 'bg-primary'}`}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-semibold text-base">Payer maintenant</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 items-center" onPress={() => router.back()}>
            <Text className="text-gray-500 text-sm">Annuler</Text>
          </TouchableOpacity>
          
          <View className="mt-4 items-center">
            <Text className="text-gray-400 text-xs">
              🔒 Paiement sécurisé
            </Text>
          </View>
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
  );
}
