import { Text } from "expo-dynamic-fonts";
import { Dimensions, Image, View } from "react-native";

// Définir la largeur de l'écran
const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingSlideProps = {
  image: any;
  title: string;
  description: string;
};

/**
 * Composant pour afficher un slide d'onboarding
 */
export default function OnboardingSlide({
  image,
  title,
  description,
}: OnboardingSlideProps) {
  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="justify-center items-center"
    >
      <View className="items-center justify-center mb-6">
        <Image
          source={image}
          style={{
            width: SCREEN_WIDTH * 1,
            height: SCREEN_WIDTH * 1,
            maxHeight: 280,
          }}
          resizeMode="contain"
        />
      </View>
      <Text className="text-2xl text-center text-primary mb-3" font="Pacifico">
        {title}
      </Text>
      <Text className="text-sm text-center text-gray-700 px-8">
        {description}
      </Text>
    </View>
  );
}
