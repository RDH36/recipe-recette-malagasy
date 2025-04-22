import { supabase } from "@/config/supabase";
import { createOrUpdateUser } from "@/services/userServices";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Image, Text, TouchableOpacity } from "react-native";

export default function Auth() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        if (response.data.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.data.idToken,
          });
          if (error) {
          }
          if (data && data.user) {
            await createOrUpdateUser(data.user.id, data.user.email || "");
          }
        }
      } else {
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        console.log("an error that's not related to google sign in occurred");
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={signIn}
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
  );
}
