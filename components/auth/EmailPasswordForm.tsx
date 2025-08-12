import { supabase } from "@/lib/supabase";
import { createOrUpdateUser } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EmailPasswordFormProps {
  onSuccess?: () => void;
}

export default function EmailPasswordForm({
  onSuccess,
}: EmailPasswordFormProps) {
  const { setUser } = useStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateInputs = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format d'email invalide";
    }

    if (password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signInWithEmail = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setErrors({ email: error.message || "Connexion échouée" });
        return;
      }
      if (data?.session && data.user) {
        await createOrUpdateUser(data.user.id, data.user.email || "");
        onSuccess?.();
      }
    } catch (e) {
      setErrors({ email: "Une erreur est survenue lors de la connexion" });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        setErrors({ email: error.message || "Inscription échouée" });
        return;
      }
      if (data?.session && data.user) {
        await createOrUpdateUser(data.user.id, data.user.email || "");
        // Le hook useAuthSync se charge automatiquement de mettre à jour le state
        Alert.alert("Bienvenue", "Compte créé et connecté.");
        onSuccess?.();
      } else {
        Alert.alert(
          "Vérifiez votre email",
          "Un lien de confirmation vous a été envoyé."
        );
      }
    } catch (e) {
      setErrors({ email: "Une erreur est survenue lors de l'inscription" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrors({
        email: "Renseignez votre email pour réinitialiser votre mot de passe",
      });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        setErrors({
          email:
            error.message || "Échec de l'envoi du lien de réinitialisation",
        });
        return;
      }
      Alert.alert(
        "Vérifiez votre boîte mail",
        "Nous avons envoyé un lien de réinitialisation."
      );
      setErrors({});
    } catch (e) {
      setErrors({ email: "Impossible d'envoyer le lien pour le moment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-neutral-white rounded-2xl p-4 mb-3 shadow">
      <View className="mb-4">
        <Text className="text-text-primary font-bold text-xl mb-1">
          {mode === "login" ? "Bon retour !" : "Rejoignez-nous"}
        </Text>
        <Text className="text-text-secondary text-sm">
          {mode === "login"
            ? "Connectez-vous pour accéder à vos recettes favorites"
            : "Créez votre compte pour partager vos expériences sur les recettes malgaches"}
        </Text>
      </View>

      {/* Email Input */}
      <View className="mb-2">
        <View className="relative">
          <View className="absolute left-4 top-3 z-10">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            className={`pl-12 pr-4 py-3 rounded-xl text-text-primary ${
              errors.email
                ? "border-2 border-accent-red bg-red-50"
                : "border border-neutral-200"
            }`}
          />
        </View>
        {errors.email && (
          <Text className="text-accent-red text-sm mt-1 ml-2">
            {errors.email}
          </Text>
        )}
      </View>

      {/* Password Input */}
      <View className="mb-3">
        <View className="relative">
          <View className="absolute left-4 top-3 z-10">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry={!showPassword}
            placeholder="Mot de passe"
            placeholderTextColor="#9CA3AF"
            className={`pl-12 pr-12 py-3 rounded-xl text-text-primary ${
              errors.password
                ? "border-2 border-accent-red bg-red-50"
                : "border border-neutral-200"
            }`}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text className="text-accent-red text-sm mt-1 ml-2">
            {errors.password}
          </Text>
        )}
      </View>

      {/* Confirm Password Input - Only for signup */}
      {mode === "signup" && (
        <View className="mb-3">
          <View className="relative">
            <View className="absolute left-4 top-3 z-10">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            </View>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#9CA3AF"
              className={`pl-12 pr-12 py-3 rounded-xl text-text-primary ${
                errors.confirmPassword
                  ? "border-2 border-accent-red bg-red-50"
                  : "border border-neutral-200"
              }`}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3"
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="text-accent-red text-sm mt-1 ml-2">
              {errors.confirmPassword}
            </Text>
          )}
        </View>
      )}

      {/* Forgot Password */}
      {mode === "login" && (
        <TouchableOpacity
          onPress={handleResetPassword}
          className="self-end mb-1"
          disabled={loading}
        >
          <Text className="text-primary text-sm">Mot de passe oublié ?</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        disabled={loading}
        onPress={mode === "login" ? signInWithEmail : signUpWithEmail}
        className="bg-primary rounded-xl py-3 items-center justify-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-neutral-white font-semibold">
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Toggle Mode */}
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          setMode(mode === "login" ? "signup" : "login");
          setErrors({});
          setConfirmPassword("");
        }}
        className="mt-3"
      >
        <Text className="text-center text-text-secondary">
          {mode === "login" ? (
            <>
              Pas de compte ?{" "}
              <Text className="text-primary font-semibold">
                Créer un compte
              </Text>
            </>
          ) : (
            <>
              Déjà membre ?{" "}
              <Text className="text-primary font-semibold">Se connecter</Text>
            </>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
