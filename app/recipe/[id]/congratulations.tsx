import { handleShare } from "@/utils/utilis"
import { useRouter } from "expo-router"
import { Home, Share2, Star, Trophy } from "lucide-react-native"
import React, { useEffect, useRef } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import ConfettiCannon from "react-native-confetti-cannon"
import ViewShot from "react-native-view-shot"

const Congratulations = () => {
  const router = useRouter()
  const confettiRef = useRef<any>(null)
  const viewShotRef = useRef<ViewShot>(null)
  const { width } = Dimensions.get("window")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 h-full">
        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: 0, y: 0 }}
          autoStart={false}
          explosionSpeed={350}
          fadeOut={true}
          fallSpeed={3000}
          colors={["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#FF8B94"]}
        />
        <ConfettiCannon
          count={50}
          origin={{ x: width, y: 0 }}
          autoStart={false}
          explosionSpeed={350}
          fadeOut={true}
          fallSpeed={3000}
          colors={["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#FF8B94"]}
        />
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-1">
          <View className="flex-1 justify-center items-center p-4">
            <View className="bg-primary/10 p-6 rounded-full mb-6 relative">
              <Trophy size={80} className="text-primary" />
            </View>

            <Text className="text-2xl font-bold mb-2 text-primary">
              Félicitations !
            </Text>
            <Text className="text-base text-center mb-6 text-gray-600">
              Vous avez réussi à préparer cette recette
            </Text>

            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star}>
                  <Star size={30} className="text-secondary-light" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ViewShot>

      <View className="p-4 gap-2">
        <TouchableOpacity
          className="flex-row gap-2 justify-center bg-gray-200 py-4 rounded-xl items-center"
          onPress={() => router.push("/(tabs)")}
        >
          <Home size={16} className="text-primary" />
          <Text className="text-primary text-base font-semibold">
            Retour à l'accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleShare(viewShotRef, {
              title: "Félicitations !",
              description: "J'ai réussi à préparer cette recette !",
            } as any)
          }
          className="flex-row gap-2 justify-center bg-primary py-4 rounded-xl items-center"
        >
          <Share2 size={16} className="text-neutral-white" />
          <Text className="text-neutral-white text-base font-semibold">
            Partager
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Congratulations
