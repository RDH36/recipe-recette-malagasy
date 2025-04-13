import { Text } from "expo-dynamic-fonts";
import { router } from "expo-router";
import { SearchIcon, UtensilsCrossed } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View className="relative shadow-lg bg-white">
      <View className="flex flex-row justify-between items-center px-4 py-2">
        <View className="flex flex-row items-center gap-2 justify-center">
          <UtensilsCrossed size={24} className="text-primary-light" />
          <Text
            className="text-primary-light"
            font="Pacifico"
            style={styles.header}
          >
            Tsikonina
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/search/Search")}
          className="bg-primary-light/20 p-2 rounded-full"
        >
          <SearchIcon className="text-primary-light" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
  },
});
