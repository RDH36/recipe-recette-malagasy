import { completeOnboarding } from "@/services/onboardingService";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, SafeAreaView } from "react-native";

// Importer les composants
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { onboardingData } from "@/components/onboarding/OnboardingData";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import PaginationDots from "@/components/onboarding/PaginationDots";
import PremiumSlide from "@/components/onboarding/PremiumSlide";

// Define the width of the screen
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  // Reference for the FlatList
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleComplete();
    }
  }, [currentIndex]);

  // Function to handle skip button press
  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleComplete();
  }, []);

  // Function to handle the end of onboarding
  const handleComplete = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await completeOnboarding();
    // Redirect to the login page instead of the main screen
    router.replace("/login");
  }, []);

  // La fonction handleComplete remplace handleCompleteOnboarding

  // Gérer l'abonnement premium
  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Compléter l'onboarding et rediriger vers la page de login
    completeOnboarding().then(() => {
      router.replace("/login");
    });
  };

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    if (item.isPremium) {
      return (
        <PremiumSlide
          image={item.image}
          title={item.title}
          description={item.description}
          onSubscribe={handleSubscribe}
        />
      );
    }

    return (
      <OnboardingSlide
        image={item.image}
        title={item.title}
        description={item.description}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NavigationButtons
        currentIndex={currentIndex}
        totalSlides={onboardingData.length}
        onNext={handleNext}
        onSkip={handleSkip}
        onPrevious={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            flatListRef.current?.scrollToIndex({
              index: prevIndex,
              animated: true,
            });
            setCurrentIndex(prevIndex);
          }
        }}
      />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(index);
        }}
        className="flex-1"
      />

      {/* Masquer les points de pagination sur l'écran de paywall */}
      {!onboardingData[currentIndex].isPremium && (
        <PaginationDots
          currentIndex={currentIndex}
          /* Ne pas compter le slide premium dans les dots */
          totalSlides={onboardingData.length - 1}
        />
      )}
    </SafeAreaView>
  );
}
