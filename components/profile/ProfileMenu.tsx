import { useStore } from "@/store/useStore";
import { router } from "expo-router";
import { CreditCard, Heart } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileMenu() {
  const { isPremium, isLifetime } = useStore();

  return (
    <View className="bg-white rounded-t-3xl -mt-8 pt-8 px-6 flex-1">
      <View className="bg-white rounded-2xl shadow-sm border border-neutral-100 mb-6">
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-neutral-100"
          onPress={() => router.push("/(tabs)/bookmarks/bookmarks")}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <Heart size={20} className="text-primary" />
            </View>
            <Text className="text-text-primary font-medium ml-3">
              Mes favoris
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-neutral-100"
          onPress={() => router.push("/premium/premium")}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <CreditCard size={20} className="text-primary" />
            </View>
            <Text className="text-text-primary font-medium ml-3">
              Mon abonnement
            </Text>
          </View>
          {isPremium && (
            <View
              className={`${
                isLifetime ? "bg-secondary" : "bg-primary"
              } px-2 py-1 rounded-full`}
            >
              <Text className="text-white text-xs font-medium">
                {isLifetime ? "À vie" : "Mensuel"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
