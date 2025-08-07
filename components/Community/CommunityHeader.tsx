import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CommunityHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: "all" | "recent" | "popular";
  onFilterChange: (filter: "all" | "recent" | "popular") => void;
}

export default function CommunityHeader({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: CommunityHeaderProps) {
  const filters = [
    { key: "all" as const, label: "Tous" },
    { key: "recent" as const, label: "Récents" },
    { key: "popular" as const, label: "Populaires" },
  ];

  return (
    <View className="px-4 pt-4 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">Communauté</Text>
        <TouchableOpacity
          onPress={() => router.push("/community/create")}
          className="bg-orange-500 px-4 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-1">Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Rechercher des expériences..."
          value={searchQuery}
          onChangeText={onSearchChange}
          className="flex-1 ml-2 text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filtres */}
      <View className="flex-row space-x-2">
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-full ${
              selectedFilter === filter.key ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-medium ${
                selectedFilter === filter.key ? "text-white" : "text-gray-600"
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
