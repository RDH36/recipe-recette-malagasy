import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Crown, Check, BadgeCheck } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function PremiumCTA() {
  return (
    <View className="h-[200px]">
      <LinearGradient
        colors={["#FFD54F", "#FF7A29"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="p-5 rounded-full h-[200px]"
        style={styles.container}
      >
        <View className="flex-row items-center gap-2 mb-3">
          <Crown size={24} className="text-neutral-white" fill="yellow" />
          <Text className="text-neutral-white text-xl font-bold">
            Devenez Premium
          </Text>
        </View>

        <Text className="text-neutral-white text-sm mb-4">
          Accédez à toutes nos recettes exclusives et supprimez les publicités.
        </Text>

        <View className="space-y-2 mb-6">
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={12} className="text-neutral-white" />
            <Text className="text-neutral-white">Recettes exclusives</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={12} className="text-neutral-white" />
            <Text className="text-neutral-white">Supprimez les publicités</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-neutral-white rounded-full py-3 px-6 flex justify-center items-center"
          onPress={() => {
            /* TODO: Implement subscription */
          }}
        >
          <Text className="text-primary text-center font-semibold">
            S'abonner maintenant
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
})
