import Auth from "@/components/auth/Auth";
import { supabase } from "@/config/supabase";
import { useStore } from "@/store/useStore";
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { CreditCard, Crown, Diamond, Heart, LogOut } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Récupérer les états globaux
  const { user, isPremium, isLifetime } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
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
            <Auth />
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
              <Image
                source={{ uri: session?.user?.user_metadata?.avatar_url }}
                className="w-24 h-24 rounded-full"
              />
            </View>
            <Text className="text-xl font-bold text-text-primary mt-3">
              {session?.user?.user_metadata?.full_name}
            </Text>
            <Text className="text-text-secondary"> {session?.user?.email}</Text>

            {isLifetime && (
              <LinearGradient
                colors={["#FF5F5F", "#CB69C1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  marginTop: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Diamond size={14} color="white" style={{ marginRight: 4 }} />
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Premium à Vie
                  </Text>
                </View>
              </LinearGradient>
            )}

            {isPremium && !isLifetime && (
              <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
                <View className="flex-row items-center">
                  <Crown size={14} className="text-primary mr-1" />
                  <Text className="text-primary font-medium">
                    Premium Mensuel
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {!isPremium && (
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
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-xl"
                onPress={() => router.push("/premium/premium")}
              >
                <Text className="text-white font-semibold">Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className=" flex gap-4 mt-6 space-y-4">
          <View className="bg-white rounded-2xl shadow-sm">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-neutral-100"
              onPress={() => router.push("/(tabs)/bookmarks/bookmarks")}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Heart size={20} className="text-primary" />
                </View>
                <Text className="text-text-primary font-medium ml-3">
                  Mes favoris
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-neutral-100"
              onPress={() => router.push("/premium/premium")}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <CreditCard size={20} className="text-primary" />
                </View>
                <Text className="text-text-primary font-medium ml-3">
                  Mon abonnement
                </Text>
              </View>
              {isPremium && (
                <View
                  className={`${
                    isLifetime ? "bg-secondary" : "bg-primary"
                  } px-2 py-1 rounded-full`}
                >
                  <Text className="text-white text-xs font-medium">
                    {isLifetime ? "À vie" : "Mensuel"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
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
