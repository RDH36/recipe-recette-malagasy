import { TimerIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TimerProps {
  seconds: number;
  onCancel: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ seconds, onCancel }) => {
  return (
    <View className="absolute top-1/3 left-4 right-4 bg-neutral-white rounded-xl p-4 shadow-lg border border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <TimerIcon size={24} className="text-primary mr-2" />
          <Text className="text-lg font-semibold text-primary">
            Timer: {formatTime(seconds)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200"
        >
          <Text className="text-text-primary">Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Timer;

export const TimerButtons: React.FC<{
  onStartTimer: (minutes: number) => void;
  isTimerActive: boolean;
  isStepCompleted: boolean;
}> = ({ onStartTimer, isTimerActive, isStepCompleted }) => {
  if (isTimerActive || isStepCompleted) return null;

  return (
    <View className="flex-row flex-wrap justify-center gap-2 bg-neutral-white py-2">
      {[1, 5, 10, 20, 30].map((min) => (
        <TouchableOpacity
          key={min}
          onPress={() => onStartTimer(min)}
          className="border border-primary px-4 py-3 rounded-lg"
        >
          <Text className="text-text-primary text-base">{min} min</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
