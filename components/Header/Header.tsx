import { router } from "expo-router"
import { SearchIcon } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"

export default function Header() {
  return (
    <View className="flex flex-row justify-between items-center px-1">
      <Text className="text-3xl font-bold">Recipe Malagasy</Text>
      <TouchableOpacity onPress={() => router.push("/search/Search")}>
        <SearchIcon className="h-4 w-4 text-black" />
      </TouchableOpacity>
    </View>
  )
}
