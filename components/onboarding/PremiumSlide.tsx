import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";

// Définir la largeur de l'écran
const { width: SCREEN_WIDTH } = Dimensions.get("window");

type PremiumSlideProps = {
  image: any;
  title: string;
  description: string;
  onSubscribe: () => void;
};

/**
 * Composant pour afficher un slide premium (paywall) attrayant
 */
export default function PremiumSlide({
  image,
  title,
  description,
  onSubscribe,
}: PremiumSlideProps) {
  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="justify-center items-center"
    >
      <LinearGradient
        colors={["rgba(255,167,38,0.2)", "rgba(255,255,255,0)"]}
        className="rounded-full p-4 mb-6"
      >
        <Image
          source={image}
          style={{
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            maxHeight: 300,
          }}
          resizeMode="contain"
        />
      </LinearGradient>

      <Text
        className="text-2xl text-center text-orange-500 mb-3"
        font="Pacifico"
      >
        {title}
      </Text>

      <Text className="text-sm text-center text-gray-700 px-8 mb-6">
        {description}
      </Text>

      <View className="w-full px-8 space-y-3">
        <TouchableOpacity
          onPress={onSubscribe}
          className="bg-orange-500 py-4 rounded-xl w-full items-center"
        >
          <Text className="text-white font-bold text-base">
            Essayer gratuitement pendant 3 jours
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-xs text-gray-500 text-center">
            Puis 4,99€/mois. Annulez à tout moment.
          </Text>
        </View>

        <View className="mt-4 space-y-2">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
            <Text className="text-xs text-gray-700">Recettes exclusives</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
            <Text className="text-xs text-gray-700">
              Authentique de Madagascar
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
            <Text className="text-xs text-gray-700">Pour nous soutenir</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
