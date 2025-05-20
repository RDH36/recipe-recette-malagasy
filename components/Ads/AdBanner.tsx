import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitIds } from '@/services/adMobService';
import { useAdMob } from '@/contexts/AdMobContext';

type AdBannerProps = {
  size?: BannerAdSize;
  style?: any;
};

export default function AdBanner({ 
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER, 
  style 
}: AdBannerProps) {
  const { showAds, adsInitialized } = useAdMob();
  
  // Ne pas afficher de publicité pour les utilisateurs premium
  if (!showAds || !adsInitialized) {
    return null;
  }
  
  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitIds.banner}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
