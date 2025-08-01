import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if the onboarding process has been completed
 * @returns Promise<boolean> True if onboarding has been completed, false otherwise
 */
export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
    return onboardingStatus === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Mark the onboarding process as completed
 */
export const completeOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

/**
 * Reset the onboarding status (for testing purposes)
 */
export const resetOnboardingStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('onboardingCompleted');
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
};
