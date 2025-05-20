import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAdMob } from '@/contexts/AdMobContext';
import { showRewardedAd } from '@/services/adMobService';

type AdRewardedButtonProps = {
  onRewarded?: (rewarded: boolean) => void;
  buttonText?: string;
  style?: any;
  textStyle?: any;
};

export default function AdRewardedButton({ 
  onRewarded, 
  buttonText = 'Obtenir une récompense', 
  style,
  textStyle
}: AdRewardedButtonProps) {
  const { showAds, adsInitialized } = useAdMob();
  
  // Ne pas afficher le bouton pour les utilisateurs premium
  if (!showAds || !adsInitialized) {
    return null;
  }
  
  const handlePress = async () => {
    const { rewarded } = await showRewardedAd();
    if (onRewarded) {
      onRewarded(rewarded);
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
    backgroundColor: '#4CAF50',
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
