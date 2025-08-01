import Auth from "@/components/auth/Auth";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Text } from "expo-dynamic-fonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        colors={["rgba(255,167,38,0.2)", "rgba(255,255,255,0)"]}
        className="flex-1 justify-between py-10"
      >
        <View className="items-center pt-10">
          <Image
            source={require("@/assets/images/mascote.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text className="text-3xl text-primary p-4" font="Pacifico">
            Tsikonina
          </Text>
          <Text className="text-gray-600 text-center mt-2 px-10">
            Connectez-vous pour accéder à toutes les recettes et fonctionnalités
          </Text>
        </View>
        <View className="px-8 mb-10 space-y-4">
          <Auth />

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="py-4"
          >
            <Text className="text-gray-500 text-xs text-center">
              Continuer sans compte
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-8">
          <Text className="text-xs text-gray-400 text-center">
            En vous connectant, vous acceptez nos Conditions d'utilisation et
            notre Politique de confidentialité
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
