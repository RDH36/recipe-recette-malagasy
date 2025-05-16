// Configuration Stripe
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_votreCléPubliqueDeTest';

// Remplacez cette URL par votre backend réel en production
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://votre-backend.com';

// IDs des produits Stripe (à remplacer par vos vrais IDs)
export const PRODUCTS = {
  MONTHLY_SUBSCRIPTION: 'price_monthly',
  YEARLY_SUBSCRIPTION: 'price_yearly',
  LIFETIME_SUBSCRIPTION: 'price_lifetime',
};

// Fonctions utilitaires pour Stripe
export const formatAmountForDisplay = (amount: number, currency: string = 'EUR'): string => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Convertit le montant pour Stripe (en centimes)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};
