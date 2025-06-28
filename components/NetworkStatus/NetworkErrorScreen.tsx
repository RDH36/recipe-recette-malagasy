import { RefreshCw } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const NetworkErrorScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <View className="flex-1 justify-center items-center bg-neutral-light px-6">
      {/* <Image
        source={require("@/assets/no-connection.png")}
        className="w-48 h-48 mb-8"
        resizeMode="contain"
      /> */}

      <Text className="text-xl font-semibold text-text-primary text-center mb-2">
        Pas de connexion Internet
      </Text>
      <Text className="text-base text-text-secondary text-center mb-6">
        Vérifie ta connexion ou réessaie plus tard.
      </Text>

      <TouchableOpacity
        className="flex-row items-center gap-2 bg-primary px-6 py-3 rounded-2xl"
        onPress={onRetry}
      >
        <RefreshCw color="white" size={20} />
        <Text className="text-white font-medium text-base">Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NetworkErrorScreen;
