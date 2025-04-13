import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function Banner() {
  return (
    <View className="relative w-full h-[200px] overflow-hidden p-2">
      <ImageBackground
        source={require("../../assets/images/banner.png")}
        className="w-full h-full rounded-2xl overflow-hidden"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
        />

        <View className="absolute bottom-4 left-4 right-4">
          <Text
            className="text-neutral-white mb-2"
            font="Pacifico"
            style={styles.title}
          >
            Les saveurs de Madagascar
          </Text>

          <View className="flex-row gap-2">
            <View className="bg-accent-red/90 px-3 py-1 rounded-full">
              <Text className="text-neutral-white text-sm">Authentique</Text>
            </View>
            <View className="bg-primary/90 px-3 py-1 rounded-full">
              <Text className="text-neutral-white text-sm">Traditionnel</Text>
            </View>
            <View className="bg-accent-blue/90 px-3 py-1 rounded-full">
              <Text className="text-neutral-white text-sm">Délicieux</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
  },
});
