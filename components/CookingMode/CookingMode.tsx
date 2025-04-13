import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import ProgressBar from "./ProgressBar/ProgressBar";
import StepContent from "./StepContent/StepContent";
import Timer from "./Timer/Timer";

interface CookingModeProps {
  steps: string[];
  recipeId: string;
}

const CookingMode: React.FC<CookingModeProps> = ({ steps, recipeId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const startTimer = (minutes: number) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setTimerSeconds(minutes * 60);
    setShowTimer(true);

    timerInterval.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 0) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
          }
          setShowTimer(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setTimerSeconds(null);
    setShowTimer(false);
  };

  const handleNext = () => {
    if (!completedSteps[currentStep]) {
      return;
    }

    if (currentStep === steps.length - 1) {
      router.push(`/recipe/${recipeId}/congratulations`);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStepCompletion = () => {
    const newCompletedSteps = [...completedSteps];
    const newValue = !newCompletedSteps[currentStep];
    newCompletedSteps[currentStep] = newValue;
    setCompletedSteps(newCompletedSteps);

    if (newValue && showTimer) {
      cancelTimer();
    }
  };

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="p-4">
        <Header title="Romazava" />
        <ProgressBar
          completedSteps={completedSteps}
          totalSteps={steps.length}
        />
      </View>

      <StepContent
        currentStep={currentStep}
        totalSteps={steps.length}
        stepText={steps[currentStep]}
        isCompleted={completedSteps[currentStep]}
        isTimerActive={showTimer}
        onToggleComplete={toggleStepCompletion}
        onStartTimer={startTimer}
      />

      <Navigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLastStep={currentStep === steps.length - 1}
        canGoNext={completedSteps[currentStep]}
      />

      {showTimer && timerSeconds !== null && (
        <Timer seconds={timerSeconds} onCancel={cancelTimer} />
      )}
    </View>
  );
};

export default CookingMode;
