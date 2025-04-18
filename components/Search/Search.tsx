import { SearchIcon } from "lucide-react-native"
import React from "react"
import { TextInput, View } from "react-native"

interface SearchProps {
  onSearch?: (query: string) => void
  value?: string
}

const Search: React.FC<SearchProps> = ({ onSearch, value = "" }) => {
  return (
    <View className="relative mx-4">
      <View className="flex-row items-center bg-text-secondary/10 rounded-lg px-4">
        <SearchIcon size={20} className="text-text-secondary mr-2" />
        <TextInput
          placeholder="Rechercher une recette..."
          className="flex-1 text-text-primary text-base"
          placeholderTextColor="#757575"
          enterKeyHint="search"
          value={value}
          onChangeText={onSearch}
        />
      </View>
    </View>
  )
}

export default Search
