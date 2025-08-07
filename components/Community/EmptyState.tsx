import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface EmptyStateProps {
  searchQuery: string;
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg font-medium mt-4">
        {searchQuery ? "Aucun résultat trouvé" : "Aucune expérience partagée"}
      </Text>
      <Text className="text-gray-400 text-center mt-2 px-8">
        {searchQuery
          ? "Essayez avec d'autres mots-clés"
          : "Soyez le premier à partager votre aventure culinaire malgache !"}
      </Text>
    </View>
  );
}
