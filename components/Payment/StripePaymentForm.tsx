import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { CardField, useStripe, CardFieldInput } from '@stripe/stripe-react-native';
import { SubscriptionType, createPaymentIntent, updateSubscriptionAfterPayment } from '@/services/stripeServices';
import { formatAmountForDisplay } from '@/config/stripe';
import { useStore } from '@/store/useStore';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';

interface StripePaymentFormProps {
  subscriptionType: SubscriptionType;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  subscriptionType,
  amount,
  onSuccess,
  onCancel,
}) => {
  const { confirmPayment } = useStripe();
  const { user, setIsPremium, setIsLifetime } = useStore();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayPress = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour effectuer un paiement');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Erreur', 'Veuillez compléter les informations de votre carte');
      return;
    }

    try {
      setIsLoading(true);
      
      // Créer une intention de paiement
      const paymentIntent = await createPaymentIntent(user.id, subscriptionType);
      
      if (!paymentIntent?.client_secret) {
        Alert.alert('Erreur', 'Impossible de créer l\'intention de paiement');
        setIsLoading(false);
        return;
      }

      // Confirmer le paiement avec Stripe
      const { error, paymentIntent: confirmedIntent } = await confirmPayment(
        paymentIntent.client_secret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (error) {
        Alert.alert('Erreur de paiement', error.message);
        setIsLoading(false);
        return;
      }

      // Mettre à jour l'abonnement dans la base de données
      const success = await updateSubscriptionAfterPayment(
        user.id,
        subscriptionType,
        confirmedIntent.id
      );

      if (success) {
        // Mettre à jour le statut premium dans le store
        setIsPremium(true);
        
        if (subscriptionType === 'lifetime') {
          setIsLifetime(true);
        }
        
        // Rediriger vers la page de félicitations
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/premium/congratulation');
        }
      } else {
        Alert.alert(
          'Erreur',
          'Le paiement a réussi mais nous n\'avons pas pu activer votre abonnement. Veuillez contacter le support.'
        );
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      Alert.alert(
        'Erreur',
        'Une erreur s\'est produite lors du traitement de votre paiement. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 bg-white rounded-xl shadow-sm">
      <Text className="text-lg font-bold mb-2 text-center">Paiement sécurisé</Text>
      <Text className="text-2xl font-bold text-primary text-center mb-6">{formatAmountForDisplay(amount)}</Text>
      
      <View className="mb-6">
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#F8F8F8',
            textColor: '#000000',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}
          style={{ height: 50, marginVertical: 8 }}
          onCardChange={setCardDetails}
        />
      </View>
      
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${!cardDetails?.complete || isLoading ? 'bg-primary/50' : 'bg-primary'}`}
        onPress={handlePayPress}
        disabled={!cardDetails?.complete || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-white font-semibold text-base">Payer maintenant</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity className="py-3 items-center" onPress={onCancel}>
        <Text className="text-gray-500 text-sm">Annuler</Text>
      </TouchableOpacity>
      
      <View className="mt-4 items-center">
        <Text className="text-gray-400 text-xs">
          🔒 Paiement sécurisé par Stripe
        </Text>
      </View>
    </View>
  );
};



export default StripePaymentForm;
