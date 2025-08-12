import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthHeader() {
  return (
    <View className="items-center mb-8">
      {/* Logo/Icon */}
      <View className="relative mb-6">
        <LinearGradient
          colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Ionicons name="restaurant" size={36} color="white" />
        </LinearGradient>
        
        {/* Decorative elements */}
        <View className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-80" />
        <View className="absolute -bottom-1 -left-2 w-4 h-4 bg-pink-400 rounded-full opacity-60" />
      </View>

      {/* Welcome Text */}
      <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Recettes Malagasy
      </Text>
      <Text className="text-gray-500 text-center text-base px-4 leading-6">
        Découvrez et partagez les saveurs authentiques de Madagascar
      </Text>
      
      {/* Decorative line */}
      <View className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
    </View>
  );
}
