import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAdMob } from '@/contexts/AdMobContext';
import { showRewardedAd, adUnitIds } from '@/services/adMobService';

type AdRewardedButtonProps = {
  onRewarded?: (rewarded: boolean) => void;
  buttonText?: string;
  style?: any;
  textStyle?: any;
};

export const AdRewardedButton = ({ 
  onRewarded, 
  buttonText = 'Obtenir une récompense', 
  style,
  textStyle
}: AdRewardedButtonProps) => {
  const { showAds, adsInitialized } = useAdMob();
  
  useEffect(() => {
    console.log('AdRewardedButton - showAds:', showAds, 'adsInitialized:', adsInitialized);
    console.log('AdRewardedButton - unitId:', adUnitIds.rewarded);
  }, [showAds, adsInitialized]);
  
  // Ne pas afficher le bouton pour les utilisateurs premium
  if (!showAds) {
    console.log('AdRewardedButton - Not showing because user is premium');
    return null;
  }
  
  if (!adsInitialized) {
    console.log('AdRewardedButton - Not showing because AdMob is not initialized');
    return null;
  }
  
  const handlePress = async () => {
    console.log('AdRewardedButton - Button pressed, showing rewarded ad...');
    try {
      const { rewarded } = await showRewardedAd();
      console.log('AdRewardedButton - Ad result:', rewarded ? 'rewarded' : 'not rewarded');
      if (onRewarded) {
        onRewarded(rewarded);
      }
    } catch (error) {
      console.error('AdRewardedButton - Error showing rewarded ad:', error);
      if (onRewarded) {
        onRewarded(false);
      }
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
};

export default AdRewardedButton;

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
