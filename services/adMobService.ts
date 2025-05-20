import { Platform } from "react-native";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  RequestOptions,
  AdsConsent,
  AdsConsentStatus,
  AdsConsentDebugGeography,
  MaxAdContentRating,
  MobileAds,
} from "react-native-google-mobile-ads";

// Définir si nous sommes en mode développement ou production
// En développement, utilisez toujours les IDs de test pour éviter de violer les règles AdMob
const isDevelopment = __DEV__;

// IDs des unités publicitaires
export const adUnitIds = {
  banner: isDevelopment 
    ? TestIds.BANNER 
    : "ca-app-pub-8114482764700286/7754577336",
  interstitial: isDevelopment 
    ? TestIds.INTERSTITIAL 
    : "ca-app-pub-8114482764700286/1683158856",
  rewarded: isDevelopment 
    ? TestIds.REWARDED 
    : "ca-app-pub-8114482764700286/7016210730",
};

// Initialiser AdMob
export const initializeAdMob = async () => {
  // Initialiser la bibliothèque
  await MobileAds().initialize();
  
  // Configuration du consentement RGPD si nécessaire
  if (!isDevelopment) {
    const consentInfo = await AdsConsent.requestInfoUpdate({
      debugGeography: AdsConsentDebugGeography.EEA,
      testDeviceIdentifiers: ["EMULATOR"],
    });
    
    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
      await AdsConsent.showForm();
    }
  }
  
  // Configuration des paramètres de contenu
  await MobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
    testDeviceIdentifiers: ["EMULATOR"],
  });
  
  return true;
};

// Options de requête pour les publicités
export const adRequestOptions: RequestOptions = {
  requestNonPersonalizedAdsOnly: true,
};

// Fonction pour charger et afficher une publicité interstitielle
export const showInterstitialAd = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const interstitialAd = InterstitialAd.createForAdRequest(
      adUnitIds.interstitial
    );

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        unsubscribeLoaded();
        interstitialAd.show();
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeClosed();
        resolve(true);
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      () => {
        unsubscribeError();
        resolve(false);
      }
    );

    interstitialAd.load();

    // Timeout de sécurité pour éviter de bloquer l'utilisateur si la pub ne charge pas
    setTimeout(() => {
      resolve(false);
    }, 10000);
  });
};

// Fonction pour charger et afficher une publicité récompensée
export const showRewardedAd = (): Promise<{ rewarded: boolean }> => {
  return new Promise((resolve) => {
    const rewardedAd = RewardedAd.createForAdRequest(adUnitIds.rewarded);
    let earned = false;

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        unsubscribeLoaded();
        rewardedAd.show();
      }
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earned = true;
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeEarned();
        unsubscribeClosed();
        resolve({ rewarded: earned });
      }
    );

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      () => {
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
        resolve({ rewarded: false });
      }
    );

    rewardedAd.load();

    // Timeout de sécurité
    setTimeout(() => {
      resolve({ rewarded: false });
    }, 10000);
  });
};
