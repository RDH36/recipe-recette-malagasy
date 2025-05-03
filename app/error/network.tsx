import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useRouter } from "expo-router";
import { ChevronLeft, RefreshCw, WifiOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NetworkErrorScreen() {
  const router = useRouter();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Vérifier automatiquement si la connexion revient
  useEffect(() => {
    if (isConnected && isInternetReachable) {
      // La connexion est de retour, retourner à la page précédente
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [isConnected, isInternetReachable, router]);

  // Gérer la tentative de reconnexion manuelle
  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Simuler une vérification
    setTimeout(() => {
      setIsRetrying(false);
      // Si la connexion est revenue, retourner à la page précédente
      if (isConnected && isInternetReachable) {
        router.back();
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <WifiOff size={80} color="#f44336" style={styles.icon} />

        <Text style={styles.title}>Pas de connexion internet</Text>

        <Text style={styles.description}>
          Cette fonctionnalité nécessite une connexion internet active. Veuillez
          vérifier votre connexion et réessayer.
        </Text>

        <Image
          source={require("@/assets/images/no-connection.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.retryButton, isRetrying && styles.retryingButton]}
          onPress={handleRetry}
          disabled={isRetrying}
        >
          <RefreshCw
            size={20}
            color="#fff"
            style={[isRetrying && styles.spinningIcon]}
          />
          <Text style={styles.retryText}>
            {isRetrying ? "Vérification..." : "Réessayer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryingButton: {
    backgroundColor: "#888",
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  spinningIcon: {
    transform: [{ rotate: "45deg" }],
  },
});
