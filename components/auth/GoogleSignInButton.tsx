import { supabase } from "@/lib/supabase";
import { createOrUpdateUser } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

export default function GoogleSignInButton({
  onSuccess,
}: GoogleSignInButtonProps) {
  const { setUser } = useStore();
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        if (response.data.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.data.idToken,
          });

          if (error) {
            Alert.alert("Erreur", "Connexion Google impossible.");
            return;
          }

          if (data && data.user) {
            await createOrUpdateUser(data.user.id, data.user.email || "");
            // Le hook useAuthSync se charge automatiquement de mettre à jour le state
            onSuccess?.();
          }
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // L'utilisateur a annulé la connexion
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("Information", "Connexion en cours...");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Erreur", "Google Play Services non disponible.");
            break;
          default:
            Alert.alert(
              "Erreur",
              "Une erreur est survenue avec Google Sign-In."
            );
        }
      } else {
        Alert.alert("Erreur", "Connexion Google échouée.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      {/* Divider */}
      <View className="flex-row items-center my-3">
        <View className="flex-1 h-px bg-neutral-200" />
        <Text className="mx-3 text-text-secondary">ou</Text>
        <View className="flex-1 h-px bg-neutral-200" />
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        disabled={loading}
        className="bg-neutral-white border border-neutral-200 py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
      >
        {loading ? (
          <ActivityIndicator color="#4285F4" size="small" />
        ) : (
          <>
            <Image
              source={require("@/assets/icons/google.png")}
              className="w-5 h-5 mr-3"
            />
            <Text className="text-text-primary font-semibold text-base">
              Continuer avec Google
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
