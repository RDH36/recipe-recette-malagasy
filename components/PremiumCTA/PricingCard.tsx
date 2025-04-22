import { Check } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  onPress: () => void;
  isPopular?: boolean;
  isPrimary?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonText,
  onPress,
  isPopular,
  isPrimary,
}) => {
  return (
    <View
      className={`p-6 rounded-2xl ${
        isPrimary ? "bg-primary" : "bg-white"
      } shadow-sm w-full`}
    >
      {isPopular && (
        <View className="absolute -top-3 right-4 bg-secondary px-4 py-1 rounded-full">
          <Text className="text-xs font-medium text-white">POPULAIRE</Text>
        </View>
      )}

      <Text
        className={`text-xl font-bold mb-2 ${
          isPrimary ? "text-white" : "text-text-primary"
        }`}
      >
        {title}
      </Text>

      <View className="flex-row items-baseline mb-6">
        <Text
          className={`text-3xl font-bold ${
            isPrimary ? "text-white" : "text-text-primary"
          }`}
        >
          {price}
        </Text>
        <Text
          className={`ml-1 ${
            isPrimary ? "text-white/80" : "text-text-disabled"
          }`}
        >
          €/mois
        </Text>
      </View>

      <View className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center space-x-3">
            <Check
              size={20}
              className={isPrimary ? "text-white" : "text-primary"}
            />
            <Text
              className={`flex-1 ${
                isPrimary ? "text-white" : "text-text-primary"
              }`}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onPress}
        className={`py-4 rounded-xl items-center ${
          isPrimary ? "bg-white" : "border border-primary bg-transparent"
        }`}
      >
        <Text
          className={isPrimary ? "text-primary font-semibold" : "text-primary"}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PricingCard;
