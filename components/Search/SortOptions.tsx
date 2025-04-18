import { ChevronDown } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"

const sortOptions = [
  "Découvertes",
  "Populaires",
  "Temps de préparation",
  "Premium",
]

interface SortOptionsProps {
  selectedSort: string
  showSortOptions: boolean
  onSortChange: (option: string) => void
  onToggleSortOptions: () => void
}

export const SortOptions: React.FC<SortOptionsProps> = ({
  selectedSort,
  showSortOptions,
  onSortChange,
  onToggleSortOptions,
}) => {
  return (
    <View className="px-4 mb-3">
      <TouchableOpacity
        onPress={onToggleSortOptions}
        className="flex-row justify-between items-center gap-2 bg-text-secondary/10 px-4 py-2 rounded-lg"
      >
        <Text className="text-text-primary font-medium">
          Trier par:{" "}
          <Text className="text-primary-dark font-normal">{selectedSort}</Text>
        </Text>
        <ChevronDown
          size={20}
          className={`text-text-primary transition-transform ${
            showSortOptions ? "rotate-180" : "rotate-0"
          }`}
        />
      </TouchableOpacity>

      {showSortOptions && (
        <View className="mt-2 bg-neutral-white rounded-lg shadow-sm border border-neutral-light">
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => onSortChange(option)}
              className="px-4 py-3 border-b border-neutral-light last:border-b-0"
            >
              <Text
                className={`${
                  selectedSort === option
                    ? "text-primary font-medium"
                    : "text-text-secondary"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
