import { useAdMob } from "@/contexts/AdMobContext";
import { adUnitIds } from "@/services/adMobService";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize, AdEventType } from "react-native-google-mobile-ads";
import { useEffect } from "react";

type AdBannerProps = {
  size?: BannerAdSize;
  style?: any;
};

export default function AdBanner({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
}: AdBannerProps) {
  const { showAds, adsInitialized } = useAdMob();

  useEffect(() => {
    console.log('AdBanner - showAds:', showAds, 'adsInitialized:', adsInitialized);
    console.log('AdBanner - unitId:', adUnitIds.banner);
  }, [showAds, adsInitialized]);

  if (!showAds) {
    console.log('AdBanner - Not showing ads because user is premium');
    return null;
  }

  if (!adsInitialized) {
    console.log('AdBanner - Not showing ads because AdMob is not initialized');
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
        onAdLoaded={() => console.log('Banner ad loaded successfully')}
        onAdFailedToLoad={(error) => console.error('Banner ad failed to load:', error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
