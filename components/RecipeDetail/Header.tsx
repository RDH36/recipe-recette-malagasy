import { Recipe } from "@/Types/RecipeType";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftIcon, Share2 } from "lucide-react-native";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

interface HeaderProps {
  recipe: Recipe;
  viewShotRef: React.RefObject<ViewShot>;
  onShare: () => void;
}

const Header: React.FC<HeaderProps> = ({ recipe, viewShotRef, onShare }) => {
  const navigation = useNavigation();

  return (
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
              <FavoriteButton
                recipe={recipe}
                className="bg-primary-light/20 rounded-full"
                size={20}
                color="#FF5F5F"
              />
              <TouchableOpacity
                onPress={onShare}
                className="bg-primary-light/20 rounded-full p-2"
              >
                <Share2 size={20} className="text-primary-light" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default Header;
