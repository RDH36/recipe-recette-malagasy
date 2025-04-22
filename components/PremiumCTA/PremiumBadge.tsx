import { useStore } from "@/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck, Crown } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function PremiumBadge() {
  // Récupérer l'état premium et l'utilisateur depuis le store
  const { isPremium, user } = useStore();

  // Ne pas afficher le composant si l'utilisateur n'est pas premium
  if (!isPremium) {
    return null;
  }

  return (
    <View className="h-[120px]">
      <LinearGradient
        colors={["#6C72CB", "#CB69C1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="p-5 rounded-2xl h-[120px]"
        style={styles.container}
      >
        <View className="flex-row items-center gap-2 mb-3">
          <Crown size={24} className="text-neutral-white" fill="gold" />
          <Text className="text-neutral-white text-xl font-bold">
            Membre Premium
          </Text>
        </View>

        <Text className="text-neutral-white text-sm mb-4">
          Merci pour votre soutien ! Vous avez accès à toutes les
          fonctionnalités premium.
        </Text>

        <View className="flex-row items-center gap-2">
          <BadgeCheck size={16} className="text-neutral-white" fill="gold" />
          <Text className="text-neutral-white font-medium">
            Statut Premium Actif
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    gap: 1,
  },
});
