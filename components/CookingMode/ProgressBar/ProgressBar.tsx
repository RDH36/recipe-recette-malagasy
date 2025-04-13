import React from "react";
import { Text, View } from "react-native";

interface ProgressBarProps {
  completedSteps: boolean[];
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completedSteps,
  totalSteps,
}) => {
  const completedCount = completedSteps.filter(Boolean).length;

  return (
    <View className="mb-4">
      <Text className="text-sm text-text-disabled mb-2">Progression</Text>
      <View className="flex-row items-center">
        <View className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary"
            style={{
              width: `${(completedCount / totalSteps) * 100}%`,
            }}
          />
        </View>
        <Text className="ml-2 text-sm text-text-primary">
          {completedCount}/{totalSteps} étapes
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;
