import { useStore } from "@/store/useStore";
import { Session } from "@supabase/supabase-js";
import { Crown, Diamond } from "lucide-react-native";
import { Image, ImageBackground, Text, View } from "react-native";

export default function ProfileHeader({ session }: { session: Session }) {
  const { user, isPremium, isLifetime } = useStore();

  return (
    <View className="h-64">
      <ImageBackground
        source={require("@/assets/images/banner.png")}
        className="h-full flex items-center justify-center relative"
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30" />
        <View className="items-center">
          <View className="relative">
            <Image
              source={{ uri: session?.user?.user_metadata?.avatar_url }}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            {isPremium && (
              <View className="absolute -top-2 -right-2">
                {isLifetime ? (
                  <View className="bg-secondary p-2 rounded-full">
                    <Diamond size={16} className="text-white" />
                  </View>
                ) : (
                  <View className="bg-primary p-2 rounded-full">
                    <Crown size={16} className="text-white" />
                  </View>
                )}
              </View>
            )}
          </View>
          <Text className="text-white text-2xl font-bold mt-4">
            {session?.user?.user_metadata?.full_name}
          </Text>
          <Text className="text-white/80 text-sm">
            {user?.email || "email@example.com"}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
