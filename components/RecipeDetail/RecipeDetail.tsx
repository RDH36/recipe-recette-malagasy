import { Recipe } from "@/Types/RecipeType";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  ChefHatIcon,
  Clock,
  HeartIcon,
  Share2,
  UtensilsCrossedIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [switchTab, setSwitchTab] = useState(true);

  const handleStartCooking = () => {
    router.push(`/recipe/${recipe.id}/cooking`);
  };

  return (
    <View className=" relative flex-1 bg-neutral-white w-full">
      <View className="relative h-[400px] rounded-t-2xl overflow-hidden w-full">
        <ImageBackground
          source={recipe.image}
          className="w-full h-full rounded-t-2xl"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={[
              StyleSheet.absoluteFillObject,
              { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
            ]}
          >
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-dark/10 rounded-t-2xl" />
            <View className="absolute top-5 w-full flex-row justify-between items-center px-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-primary-light/20 rounded-full p-2"
              >
                <ArrowLeftIcon size={20} className="text-primary-light" />
              </TouchableOpacity>
              <View className="flex-row gap-4">
                <TouchableOpacity className="bg-primary-light/20 rounded-full p-2">
                  <HeartIcon size={20} className="text-primary-light" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-primary-light/20 rounded-full p-2">
                  <Share2 size={20} className="text-primary-light" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold text-text-primary">
          {recipe.title}
        </Text>

        <View className="flex-row space-x-4 mb-2 gap-4 mt-2">
          <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
            <Clock className="text-text-primary" size={16} />
            <Text className="text-sm text-text-primary">{recipe.time} min</Text>
          </View>
          <View className="bg-secondary-light rounded-full px-3 py-1 flex-row items-center gap-2">
            <ChefHatIcon size={16} className="text-text-primary" />
            <Text className="text-sm text-text-primary">
              {recipe.difficulty}
            </Text>
          </View>
        </View>

        <Text className="mt-4 text-text-primary">{recipe.description}</Text>

        <View className="flex-row mt-6 border-b border-primary-light/20">
          <TouchableOpacity
            onPress={() => setSwitchTab(true)}
            className={
              switchTab ? "pb-2 border-b-2 border-primary" : "mr-6 pb-2"
            }
          >
            <Text
              className={
                switchTab
                  ? "font-semibold text-text-primary"
                  : "text-text-disabled"
              }
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwitchTab(false)}
            className={
              switchTab ? "ml-6 pb-2" : "pb-2 border-b-2 border-primary"
            }
          >
            <Text
              className={
                switchTab
                  ? "text-text-disabled"
                  : "font-semibold text-text-primary"
              }
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {switchTab ? (
          <View className="mt-4 flex-1">
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} className="text-text-primary py-2">
                • {ingredient}
              </Text>
            ))}
          </View>
        ) : (
          <View className="mt-4 flex-1">
            {recipe.instructions.map((instruction, index) => (
              <Text key={index} className="text-text-primary py-2">
                • {instruction}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="absolute bottom-0 left-0 right-0 px-4 bg-white pb-4">
        <TouchableOpacity
          onPress={handleStartCooking}
          className="bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <UtensilsCrossedIcon size={24} className="text-neutral-white" />
          <Text className="text-neutral-white font-semibold text-lg">
            Commencer à cuisiner
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecipeDetail;
