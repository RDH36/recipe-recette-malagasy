import { useStore } from "@/store/useStore";
import { View } from "react-native";
import PremiumBadge from "./PremiumBadge";
import PremiumCTA from "./PremiumCTA";

export default function PremiumSection() {
  const { isPremium } = useStore();

  return (
    <View className="mt-4 mb-6">
      {isPremium ? <PremiumBadge /> : <PremiumCTA />}
    </View>
  );
}
