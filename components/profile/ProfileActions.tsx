import { supabase } from "@/lib/supabase";
import { articleService } from "@/services/articleService";
import { useStore } from "@/store/useStore";
import { router } from "expo-router";
import { LogOut, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileActions() {
  const { setUser, setIsPremium } = useStore();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleLogout = () => {
    supabase.auth.signOut();
    setUser(null);
    setIsPremium(false);
    // Le hook useAuthSync se charge automatiquement de mettre à jour le state
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action supprimera toutes vos publications, likes et commentaires. Elle est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: isDeletingAccount ? "Suppression..." : "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingAccount(true);
              await articleService.deleteCurrentUserData();
              // Optionnel: supprimer le compte auth via une Edge Function côté serveur
              await supabase.auth.signOut();
              // Le hook useAuthSync se charge automatiquement de mettre à jour le state
              Alert.alert("Compte supprimé", "Vos données ont été supprimées.");
              router.replace("/(tabs)/community");
            } catch (e) {
              Alert.alert(
                "Erreur",
                "Impossible de supprimer votre compte pour le moment."
              );
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="px-6 mb-6">
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center bg-white border border-red-500 p-2 rounded-2xl shadow-sm"
      >
        <LogOut size={20} className="text-red-500 mr-2" />
        <Text className="text-red-500 font-medium">Se déconnecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={isDeletingAccount}
        onPress={handleDeleteAccount}
        className="flex-row items-center justify-center bg-red-50 border border-red-200 p-2 rounded-2xl shadow-sm mt-3"
      >
        <Trash2 size={20} className="text-red-600 mr-2" />
        <Text className="text-red-600 font-semibold">
          {isDeletingAccount ? "Suppression..." : "Supprimer mon compte"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
