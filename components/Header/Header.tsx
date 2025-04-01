import { Settings } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View className="flex flex-row justify-between items-center mb-3">
      <Text className="text-3xl font-bold">Recipe Malagasy</Text>
      <TouchableOpacity>
        <Settings size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
