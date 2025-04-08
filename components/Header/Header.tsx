import { router } from "expo-router"
import { SearchIcon } from "lucide-react-native"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "expo-dynamic-fonts"

export default function Header() {
  return (
    <View className="flex flex-row justify-between items-center px-1 mb-2 relative">
      <View className="flex flex-col items-center gap-2">
        <Text className="text-brun-cacao" font="Pacifico" style={styles.header}>
          Tsikonina
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/search/Search")}
        className="top-2 right-0"
      >
        <SearchIcon className="text-gris-ardoise" size={26} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
  },
})
