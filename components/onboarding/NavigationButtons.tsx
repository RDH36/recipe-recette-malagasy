import { Text, TouchableOpacity, View } from "react-native";

type NavigationButtonsProps = {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  onPrevious: () => void;
};

/**
 * Composant pour les boutons de navigation d'onboarding
 */
export default function NavigationButtons({
  currentIndex,
  totalSlides,
  onNext,
  onSkip,
  onPrevious,
}: NavigationButtonsProps) {
  const isLastSlide = currentIndex === totalSlides - 1;
  const showPreviousButton = currentIndex >= 1;

  return (
    <>
      {!isLastSlide && (
        <TouchableOpacity
          onPress={onSkip}
          className="absolute top-10 right-5 z-10 py-2 px-4"
        >
          <Text className="text-gray-500/40 font-bold">Passer</Text>
        </TouchableOpacity>
      )}

      <View className="absolute bottom-8 left-0 right-0 flex-row justify-between px-5 z-10">
        {showPreviousButton ? (
          <TouchableOpacity
            onPress={onPrevious}
            className="py-3 px-6 rounded-full"
          >
            <Text className="text-gray-500/40 font-bold">Précédent</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={onNext}
          className="bg-primary py-3 px-6 rounded-full"
        >
          <Text className="text-white font-bold">
            {isLastSlide ? "Commencer" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
