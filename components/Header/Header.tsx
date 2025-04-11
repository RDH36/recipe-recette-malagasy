import { router } from "expo-router"
import { SearchIcon, UtensilsCrossed } from "lucide-react-native"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "expo-dynamic-fonts"
import { LinearGradient } from "expo-linear-gradient"

export default function Header() {
  return (
    <View className="relative shadow-lg">
      <LinearGradient
        colors={["#FF7A29", "#FFD54F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View className="flex flex-row justify-between items-center px-4 py-2">
          <View className="flex flex-row items-center gap-2 justify-center">
            <UtensilsCrossed size={24} className="text-neutral-white" />
            <Text
              className="text-neutral-white"
              font="Pacifico"
              style={styles.header}
            >
              Tsikonina
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/search/Search")}
            className="bg-neutral-white/20 p-2 rounded-full"
          >
            <SearchIcon className="text-neutral-white" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
  },
})
