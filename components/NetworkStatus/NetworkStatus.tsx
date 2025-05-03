import { WifiOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface NetworkStatusProps {
  isConnected: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ isConnected }) => {
  const [animation] = useState(new Animated.Value(0));
  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (!isConnected) {
      // Afficher la notification
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Cacher la notification
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, animation]);

  // Ne rien afficher si l'utilisateur est connecté
  if (isConnected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <View style={styles.content}>
        <WifiOff color="#FFF" size={24} />
        <Text style={styles.text}>Pas de connexion internet</Text>
      </View>
      <Text style={styles.subText}>
        Certaines fonctionnalités peuvent être limitées
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f44336",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
    marginLeft: 34,
  },
});

export default NetworkStatus;
