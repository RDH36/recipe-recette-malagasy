import { LinearGradient } from "expo-linear-gradient";
import { Bell, LogOut, UserCircle2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-neutral-white">
        <ImageBackground
          source={require("@/assets/images/banner.png")}
          className="flex-1"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="flex-1 justify-end pb-16 px-6"
          >
            <View className="items-center mb-12">
              <Text className="text-neutral-white text-3xl font-bold mt-4 text-center">
                Découvrez des Recettes{"\n"}Malgaches Authentiques
              </Text>
              <Text className="text-neutral-white/80 text-center mt-3">
                Connectez-vous pour sauvegarder vos recettes préférées
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="bg-neutral-white py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
            >
              <Image
                source={require("@/assets/icons/google.png")}
                className="w-5 h-5 mr-3"
              />
              <Text className="text-text-primary font-semibold text-base">
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            <Text className="text-neutral-white/60 text-center mt-6 text-sm">
              En continuant, vous acceptez nos conditions d'utilisation
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="h-64">
        <ImageBackground
          source={require("@/assets/images/banner.png")}
          className="h-full w-full"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
            className="h-full w-full px-4 pt-12"
          ></LinearGradient>
        </ImageBackground>
      </View>
      <View className="px-4 -mt-20">
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <View className="items-center -mt-14">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center border-4 border-white shadow-xl">
              <UserCircle2 size={60} className="text-primary" />
            </View>
            <Text className="text-xl font-bold text-text-primary mt-3">
              John Doe
            </Text>
            <Text className="text-text-secondary">john.doe@example.com</Text>
          </View>
        </View>
        <View className="mt-6 bg-primary/5 rounded-3xl p-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold text-text-primary">
                Passez à Premium
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Accédez à toutes nos recettes exclusives
              </Text>
            </View>
            <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl">
              <Text className="text-white font-semibold">Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className=" flex gap-4 mt-6 space-y-4">
          <View className="bg-white rounded-2xl shadow-sm">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-t border-neutral-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Bell size={20} className="text-primary" />
                </View>
                <Text className="text-text-primary font-medium ml-3">
                  Notifications
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#E0E0E0", true: "#FF5F5F" }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-white border border-red-500 p-2 rounded-2xl shadow-sm"
          >
            <LogOut size={20} className="text-red-500 mr-2" />
            <Text className="text-red-500 font-medium">Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
