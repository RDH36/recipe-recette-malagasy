import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAdMob } from '@/contexts/AdMobContext';
import { showInterstitialAd } from '@/services/adMobService';

type AdInterstitialButtonProps = {
  onAdClosed?: (success: boolean) => void;
  buttonText?: string;
  style?: any;
  textStyle?: any;
};

export default function AdInterstitialButton({ 
  onAdClosed, 
  buttonText = 'Voir une publicité', 
  style,
  textStyle
}: AdInterstitialButtonProps) {
  const { showAds, adsInitialized } = useAdMob();
  
  // Ne pas afficher le bouton pour les utilisateurs premium
  if (!showAds || !adsInitialized) {
    return null;
  }
  
  const handlePress = async () => {
    const success = await showInterstitialAd();
    if (onAdClosed) {
      onAdClosed(success);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handlePress}
    >
      <Text style={[styles.text, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF8050',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
