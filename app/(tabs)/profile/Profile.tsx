import AuthScreen from "@/components/profile/AuthScreen";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useStore } from "@/store/useStore";
import { View } from "react-native";

export default function Profile() {
  const { session } = useAuthSync();
  const { setIsPremium } = useStore();

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <ProfileHeader session={session} />
      <ProfileMenu />
      <ProfileActions />
    </View>
  );
}
