import { useStore } from "@/store/useStore";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck, Crown, Diamond } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function PremiumBadge() {
  // Récupérer l'état premium et l'utilisateur depuis le store
  const { isPremium, isLifetime, user } = useStore();

  // Ne pas afficher le composant si l'utilisateur n'est pas premium
  if (!isPremium) {
    return null;
  }

  // Valeur par défaut pour isLifetime si undefined
  const hasLifetime = isLifetime === true;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={hasLifetime ? ["#FF5F5F", "#CB69C1"] : ["#6C72CB", "#CB69C1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.headerRow}>
          {hasLifetime ? (
            <Diamond size={28} color="white" fill="gold" style={styles.icon} />
          ) : (
            <Crown size={28} color="white" fill="gold" style={styles.icon} />
          )}
          <Text style={styles.title}>
            {hasLifetime ? "Premium à Vie" : "Membre Premium"}
          </Text>
        </View>

        <Text style={styles.description}>
          {hasLifetime
            ? "Merci pour votre soutien ! Vous avez accès à vie à toutes les fonctionnalités premium."
            : "Merci pour votre soutien ! Vous avez accès à toutes les fonctionnalités premium."}
        </Text>

        <View style={styles.badgeRow}>
          <BadgeCheck
            size={18}
            color="white"
            fill="gold"
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText}>
            {hasLifetime
              ? "Statut Premium à Vie Actif"
              : "Statut Premium Mensuel Actif"}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    color: "white",
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.9,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: {
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
