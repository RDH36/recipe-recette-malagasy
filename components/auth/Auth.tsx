import { Linking, Text, TouchableOpacity, View } from "react-native";
import EmailPasswordForm from "./EmailPasswordForm";
import GoogleSignInButton from "./GoogleSignInButton";

export default function Auth() {
  const handlePrivacyPress = () => {
    Linking.openURL("https://www.tsikonina.com/privacy");
  };

  return (
    <View className="w-full">
      <EmailPasswordForm />
      <GoogleSignInButton />

      {/* Privacy Policy Link */}
      <View className="mt-6 px-4 flex-row items-center justify-center gap-2">
        <Text className="text-center text-text-secondary text-xs leading-5">
          En vous connectant, vous acceptez nos
        </Text>
        <TouchableOpacity onPress={handlePrivacyPress}>
          <Text className="text-primary text-xs underline">
            Conditions d'utilisation et Politique de confidentialité
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
