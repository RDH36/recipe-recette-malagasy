import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface BannerSlide {
  id: number;
  image: any;
  title: string;
  description: string;
  badges: string[];
}

const bannerData: BannerSlide[] = [
  {
    id: 1,
    image: require("../../assets/banner/1.jpg"),
    title: "Nature malgache",
    description: "Une terre sauvage où chaque saveur prend racine.",
    badges: ["🌿 Nature", "🏞️ Terre Rouge", "🐒 Faune Unique"],
  },
  {
    id: 2,
    image: require("../../assets/banner/2.jpg"),
    title: "Cuisine traditionnelle",
    description: "La tradition mijote au feu doux de nos souvenirs.",
    badges: [
      "🍲 Cuisine Authentique",
      "🔥 Foyer Malgache",
      "🧄 Épices Locales",
    ],
  },
  {
    id: 3,
    image: require("../../assets/banner/3.jpg"),
    title: "Harmonie des saveurs",
    description: "Des plats d'héritage, pour un voyage culinaire unique.",
    badges: [
      "🍽️ Saveurs Malagasy",
      "🌺 Modernité & Tradition",
      "🌍 Voyage Culinaire",
    ],
  },
];

export default function Banner() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [direction, setDirection] = useState(1);
  const directionRef = useRef(1);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex;
      let nextDirection = directionRef.current;

      if (directionRef.current === 1) {
        nextIndex = currentIndexRef.current + 1;
        if (nextIndex >= bannerData.length) {
          nextIndex = bannerData.length - 2;
          nextDirection = -1;
        }
      } else {
        nextIndex = currentIndexRef.current - 1;
        if (nextIndex < 0) {
          nextIndex = 1;
          nextDirection = 1;
        }
      }

      setDirection(nextDirection);
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (screenWidth - 16),
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.round(contentOffset.x / viewSize.width);
    if (
      pageNum !== currentIndex &&
      pageNum >= 0 &&
      pageNum < bannerData.length
    ) {
      setCurrentIndex(pageNum);
    }
  };

  return (
    <View className="relative w-full h-[200px] overflow-hidden p-2">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        className="w-full h-full"
      >
        {bannerData.map((slide) => (
          <View key={slide.id} style={{ width: screenWidth - 16 }}>
            <ImageBackground
              source={slide.image}
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
                  className="text-neutral-white mb-1"
                  font="Pacifico"
                  style={styles.title}
                >
                  {slide.title}
                </Text>

                <Text className="text-neutral-white/90 text-sm mb-3">
                  {slide.description}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-1">
                  {slide.badges.map((badge, index) => (
                    <View
                      key={index}
                      className="bg-primary/30 px-3 py-1 rounded-full"
                    >
                      <Text className="text-neutral-white text-xs">
                        {badge}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex-row gap-2">
        {bannerData.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? "bg-neutral-white"
                : "bg-neutral-white/50"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
  },
});
