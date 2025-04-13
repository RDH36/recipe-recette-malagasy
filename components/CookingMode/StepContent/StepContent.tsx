import { CheckIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TimerButtons } from "../Timer/Timer";

interface StepContentProps {
  currentStep: number;
  totalSteps: number;
  stepText: string;
  isCompleted: boolean;
  isTimerActive: boolean;
  onToggleComplete: () => void;
  onStartTimer: (minutes: number) => void;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  totalSteps,
  stepText,
  isCompleted,
  isTimerActive,
  onToggleComplete,
  onStartTimer,
}) => {
  return (
    <View className="flex-1 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-text-primary">
          Étape {currentStep + 1} de {totalSteps}
        </Text>
        <TouchableOpacity
          onPress={onToggleComplete}
          className={`px-4 py-2 rounded-full ${
            isCompleted ? "bg-primary" : "bg-primary-light/20"
          }`}
        >
          <View className="flex-row items-center">
            {isCompleted && (
              <CheckIcon size={16} className="text-neutral-white mr-2" />
            )}
            <Text
              className={`${
                isCompleted ? "text-neutral-white" : "text-neutral-dark"
              }`}
            >
              {isCompleted ? "Terminé" : "Marquer comme terminé"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text className="text-base leading-6 mb-6 text-text-primary">
        {stepText}
      </Text>

      <TimerButtons
        onStartTimer={onStartTimer}
        isTimerActive={isTimerActive}
        isStepCompleted={isCompleted}
      />
    </View>
  );
};

export default StepContent;
