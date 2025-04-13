import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isLastStep: boolean;
  canGoNext: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  onPrevious,
  onNext,
  isLastStep,
  canGoNext,
}) => {
  return (
    <View className="p-4 flex-row justify-between gap-2">
      <TouchableOpacity
        onPress={onPrevious}
        className="flex-1 py-4 items-center"
      >
        <Text className="text-text-primary text-base">Précédent</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onNext}
        disabled={!canGoNext}
        className={`flex-1 py-4 items-center rounded-xl ${
          canGoNext ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <Text
          className={`text-base ${
            canGoNext ? "text-neutral-white" : "text-gray-500"
          }`}
        >
          {isLastStep ? "Terminer" : "Suivant"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navigation;
