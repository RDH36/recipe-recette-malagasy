import { API_URL, PRODUCTS } from '@/config/stripe';
import { supabase } from '@/config/supabase';

// Types pour les paiements
export type SubscriptionType = 'monthly' | 'yearly' | 'lifetime';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

interface PaymentIntent {
  id: string;
  client_secret: string;
  status: PaymentStatus;
}

/**
 * Crée une intention de paiement pour un abonnement
 * @param userId ID de l'utilisateur
 * @param subscriptionType Type d'abonnement ('monthly', 'yearly', 'lifetime')
 * @returns L'intention de paiement avec le client_secret
 */
export const createPaymentIntent = async (
  userId: string,
  subscriptionType: SubscriptionType
): Promise<PaymentIntent | null> => {
  try {
    // En production, cette requête devrait être envoyée à votre backend sécurisé
    // qui communiquera avec l'API Stripe
    
    // Pour l'instant, nous simulons une réponse réussie
    // Dans une implémentation réelle, vous appelleriez votre backend:
    // const response = await fetch(`${API_URL}/create-payment-intent`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, subscriptionType }),
    // });
    // const data = await response.json();
    
    // Simulation d'une réponse
    const mockPaymentIntent = {
      id: `pi_${Math.random().toString(36).substring(2, 15)}`,
      client_secret: `pi_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`,
      status: 'pending' as PaymentStatus,
    };
    
    return mockPaymentIntent;
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    return null;
  }
};

/**
 * Vérifie le statut d'un paiement
 * @param paymentIntentId ID de l'intention de paiement
 * @returns Le statut du paiement
 */
export const checkPaymentStatus = async (
  paymentIntentId: string
): Promise<PaymentStatus | null> => {
  try {
    // En production, cette requête devrait être envoyée à votre backend
    // const response = await fetch(`${API_URL}/check-payment-status/${paymentIntentId}`);
    // const data = await response.json();
    
    // Simulation d'une réponse réussie
    return 'succeeded';
  } catch (error) {
    console.error('Erreur lors de la vérification du statut du paiement:', error);
    return null;
  }
};

/**
 * Met à jour l'abonnement de l'utilisateur après un paiement réussi
 * @param userId ID de l'utilisateur
 * @param subscriptionType Type d'abonnement
 * @param paymentIntentId ID de l'intention de paiement
 * @returns Succès de l'opération
 */
export const updateSubscriptionAfterPayment = async (
  userId: string,
  subscriptionType: SubscriptionType,
  paymentIntentId: string
): Promise<boolean> => {
  try {
    // Vérifier que le paiement a bien réussi
    const paymentStatus = await checkPaymentStatus(paymentIntentId);
    
    if (paymentStatus !== 'succeeded') {
      console.error('Le paiement n\'a pas réussi');
      return false;
    }
    
    // Mettre à jour l'abonnement dans la base de données
    if (subscriptionType === 'lifetime') {
      // Abonnement à vie
      const { error } = await supabase
        .from('users')
        .update({
          isPremium: true,
          isLifetime: true,
          subscriptionType,
          stripePaymentId: paymentIntentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      return !error;
    } else {
      // Abonnement mensuel ou annuel
      const { error } = await supabase
        .from('users')
        .update({
          isPremium: true,
          subscriptionType,
          stripePaymentId: paymentIntentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      return !error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    return false;
  }
};

/**
 * Obtient le prix d'un abonnement en fonction de son type
 * @param subscriptionType Type d'abonnement
 * @returns Prix de l'abonnement
 */
export const getSubscriptionPrice = (subscriptionType: SubscriptionType): number => {
  switch (subscriptionType) {
    case 'monthly':
      return 4.99;
    case 'yearly':
      return 19.99;
    case 'lifetime':
      return 24.99;
    default:
      return 0;
  }
};

/**
 * Obtient l'ID du produit Stripe en fonction du type d'abonnement
 * @param subscriptionType Type d'abonnement
 * @returns ID du produit Stripe
 */
export const getProductId = (subscriptionType: SubscriptionType): string => {
  switch (subscriptionType) {
    case 'monthly':
      return PRODUCTS.MONTHLY_SUBSCRIPTION;
    case 'yearly':
      return PRODUCTS.YEARLY_SUBSCRIPTION;
    case 'lifetime':
      return PRODUCTS.LIFETIME_SUBSCRIPTION;
    default:
      return '';
  }
};
