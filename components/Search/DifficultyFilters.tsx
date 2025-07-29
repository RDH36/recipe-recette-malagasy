import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const difficultyFilters = ["Tous", "Facile", "Moyen", "Difficile"];

interface DifficultyFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const DifficultyFilters: React.FC<DifficultyFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <View className="px-4 py-3">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {difficultyFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-lg ${
                selectedFilter === filter ? "bg-primary" : "bg-neutral-light"
              }`}
            >
              <Text
                className={`${
                  selectedFilter === filter
                    ? "text-neutral-white"
                    : "text-text-secondary"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
