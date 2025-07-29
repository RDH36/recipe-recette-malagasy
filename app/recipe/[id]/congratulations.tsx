import { Recipe } from "@/Types/RecipeType";
import CookingLoader from "@/components/Loading/CookingLoader";
import { getRecipeById } from "@/services/recipeService";
import { handleShare } from "@/utils/utilis";
import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, Share2, Star } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import ViewShot from "react-native-view-shot";

const Congratulations = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const confettiRef = useRef<any>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (typeof id === "string") {
          const data = await getRecipeById(id);
          setRecipe(data);
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement de la recette");
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confettiRef.current && !loading && recipe) {
        confettiRef.current.start();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, recipe]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <CookingLoader message="Chargement de la recette..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-text-primary text-center">{error}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="mt-4 flex-row gap-2 justify-center bg-primary py-4 rounded-xl items-center"
        >
          <Home size={16} className="text-neutral-white" />
          <Text className="text-neutral-white text-base font-semibold">
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-text-primary text-center">
          Recette non trouvée
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="mt-4 flex-row gap-2 justify-center bg-primary py-4 rounded-xl items-center"
        >
          <Home size={16} className="text-neutral-white" />
          <Text className="text-neutral-white text-base font-semibold">
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ShareContent = () => (
    <LinearGradient
      colors={["#FF7A29", "#FFD54F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-8 rounded-3xl"
    >
      <View className="items-center">
        <View className="bg-primary/10 p-6 rounded-full mb-6 relative">
          <Image
            source={require("../../../assets/icons/adaptive-icon.png")}
            className="w-20 h-20"
          />
        </View>

        <Text className="text-2xl font-bold mb-2 text-neutral-white">
          Félicitations !
        </Text>
        <Text className="text-base text-center mb-2 text-neutral-white">
          Vous avez réussi à préparer
        </Text>
        <Text className="text-xl font-bold mb-4 text-neutral-white">
          {recipe.title}
        </Text>

        <View className="flex-row gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={30} className="text-neutral-white" />
          ))}
        </View>

        <View className="flex-row items-center gap-2">
          <Image
            source={require("../../../assets/icons/adaptive-icon.png")}
            className="w-10 h-10"
          />
          <Text className="text-neutral-white font-bold" font="Pacifico">
            Tsikonina
          </Text>
        </View>
        <Text className="text-neutral-white text-sm">
          La cuisine malgache authentique
        </Text>
      </View>
    </LinearGradient>
  );

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

      <View className="flex-1">
        <View className="flex-1 justify-center items-center p-4">
          <View className="bg-primary/10 p-6 rounded-full mb-6 relative">
            <Image
              source={require("../../../assets/icons/adaptive-icon.png")}
              className="w-28 h-28"
            />
          </View>

          <Text className="text-2xl font-bold mb-2 text-primary">
            Félicitations !
          </Text>
          <Text className="text-base text-center mb-2 text-gray-600">
            Vous avez réussi à préparer
          </Text>
          <Text className="text-xl font-bold mb-2 text-primary">
            {recipe.title}
          </Text>

          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star}>
                <Star size={30} className="text-secondary-light" />
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-8 flex-row items-center gap-2">
            <Image
              source={require("../../../assets/icons/adaptive-icon.png")}
              className="w-10 h-10"
            />
            <Text className="text-primary font-bold" font="Pacifico">
              Tsikonina
            </Text>
          </View>
          <Text className="text-text-secondary text-sm">
            La cuisine malgache authentique
          </Text>
        </View>
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{ position: "absolute", opacity: 0 }}
      >
        <ShareContent />
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
              description: `J'ai réussi à préparer ${recipe.title} avec Tsikonina - La cuisine malgache authentique !`,
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
  );
};

export default Congratulations;
