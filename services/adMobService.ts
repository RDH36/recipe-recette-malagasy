import {
  AdEventType,
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
  InterstitialAd,
  MaxAdContentRating,
  MobileAds,
  RequestOptions,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const isDevelopment = process.env.EXPO_PUBLIC_ENV === "development";

export const adUnitIds = {
  banner: isDevelopment
    ? TestIds.BANNER
    : process.env.EXPO_PUBLIC_AD_UNIT_IDS_BANNER || TestIds.BANNER,
  interstitial: isDevelopment
    ? TestIds.INTERSTITIAL
    : process.env.EXPO_PUBLIC_AD_UNIT_IDS_INTERSTITIAL || TestIds.INTERSTITIAL,
  rewarded: isDevelopment
    ? TestIds.REWARDED
    : process.env.EXPO_PUBLIC_AD_UNIT_IDS_REWARDED || TestIds.REWARDED,
};

export const initializeAdMob = async () => {
  try {
    console.log('Initializing AdMob...');
    await MobileAds().initialize();
    console.log('MobileAds initialized');
    
    // Toujours demander le consentement en preview build
    const consentInfo = await AdsConsent.requestInfoUpdate({
      debugGeography: AdsConsentDebugGeography.EEA,
      testDeviceIdentifiers: ["EMULATOR"],
    });
    console.log('Consent info:', consentInfo);

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdsConsentStatus.REQUIRED
    ) {
      await AdsConsent.showForm();
      console.log('Consent form shown');
    }

    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: ["EMULATOR"],
    });
    console.log('AdMob configuration set');
    
    // Log les IDs utilisés
    console.log('Using ad unit IDs:', adUnitIds);
    
    return true;
  } catch (error) {
    console.error('Error initializing AdMob:', error);
    // Retourner true quand même pour ne pas bloquer l'affichage des publicités
    return true;
  }
};

export const adRequestOptions: RequestOptions = {
  requestNonPersonalizedAdsOnly: true,
};

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

    setTimeout(() => {
      resolve(false);
    }, 10000);
  });
};

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

    setTimeout(() => {
      resolve({ rewarded: false });
    }, 10000);
  });
};
