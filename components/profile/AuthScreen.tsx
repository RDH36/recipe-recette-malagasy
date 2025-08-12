import Auth from "@/components/auth/Auth";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AuthScreen() {
  return (
    <View className="flex-1 bg-neutral-white">
      <ImageBackground
        source={require("@/assets/images/banner.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="flex-1"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
                paddingBottom: 64,
                paddingHorizontal: 24,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="items-center mb-12">
                <Text className="text-neutral-white text-3xl font-bold mt-4 text-center">
                  Découvrez des Recettes{"\n"}Malgaches Authentiques
                </Text>
                <Text className="text-neutral-white/80 text-center mt-3">
                  Connectez-vous pour sauvegarder vos recettes préférées
                </Text>
              </View>
              <Auth />
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
