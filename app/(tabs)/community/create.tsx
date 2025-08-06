import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { articleService } from "../../../services/articleService";

const SUGGESTED_TAGS = [
  "romazava",
  "vary amin'anana",
  "henakisoa",
  "akoho",
  "ravitoto",
  "cuisine traditionnelle",
  "voyage culinaire",
  "recette familiale",
  "marché local",
  "épices malgaches",
  "riz",
  "brèdes",
  "zébu",
  "antananarivo",
  "fianarantsoa",
  "toamasina",
  "mahajanga",
  "tradition",
  "famille",
  "découverte",
  "restaurant",
  "street food",
];

export default function CreateArticleScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setCustomTag("");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un titre");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Erreur", "Veuillez saisir le contenu de votre expérience");
      return;
    }

    if (content.trim().length < 50) {
      Alert.alert(
        "Erreur",
        "Votre expérience doit contenir au moins 50 caractères"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await articleService.createArticle({
        title: title.trim(),
        content: content.trim(),
        location: location.trim() || undefined,
        tags,
      });

      Alert.alert("Succès", "Votre expérience a été partagée avec succès !", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de publier votre expérience. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="px-4 pt-8 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900">
            Partager une expérience
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-full ${
              isSubmitting ? "bg-gray-300" : "bg-orange-500"
            }`}
          >
            <Text className="text-white font-semibold">
              {isSubmitting ? "Publication..." : "Publier"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Titre de votre expérience *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Mon voyage culinaire à Antananarivo"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
            placeholderTextColor="#9CA3AF"
            maxLength={100}
          />
          <Text className="text-gray-400 text-sm mt-1">
            {title.length}/100 caractères
          </Text>
        </View>

        {/* Localisation */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Lieu (optionnel)
          </Text>
          <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Antananarivo, Fianarantsoa..."
              className="flex-1 ml-2 text-gray-900"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
            />
          </View>
        </View>

        {/* Contenu */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Racontez votre expérience *
          </Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Partagez votre aventure culinaire malgache : découvertes, recettes, anecdotes, conseils... Soyez créatif !"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50 min-h-[120px]"
            placeholderTextColor="#9CA3AF"
            maxLength={2000}
          />
          <Text className="text-gray-400 text-sm mt-1">
            {content.length}/2000 caractères (minimum 50)
          </Text>
        </View>

        {/* Tags sélectionnés */}
        {tags.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Tags sélectionnés ({tags.length}/10)
            </Text>
            <View className="flex-row flex-wrap">
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRemoveTag(tag)}
                  className="bg-orange-500 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-white font-medium">#{tag}</Text>
                  <Ionicons
                    name="close"
                    size={16}
                    color="white"
                    className="ml-1"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Ajouter un tag personnalisé */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Ajouter un tag personnalisé
          </Text>
          <View className="flex-row items-center">
            <TextInput
              value={customTag}
              onChangeText={setCustomTag}
              placeholder="Tapez votre tag..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              placeholderTextColor="#9CA3AF"
              maxLength={20}
              onSubmitEditing={handleAddCustomTag}
            />
            <TouchableOpacity
              onPress={handleAddCustomTag}
              disabled={!customTag.trim() || tags.length >= 10}
              className={`ml-2 px-4 py-3 rounded-lg ${
                customTag.trim() && tags.length < 10
                  ? "bg-orange-500"
                  : "bg-gray-300"
              }`}
            >
              <Ionicons
                name="add"
                size={20}
                color={
                  customTag.trim() && tags.length < 10 ? "white" : "#9CA3AF"
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags suggérés */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Tags suggérés
          </Text>
          <View className="flex-row flex-wrap">
            {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag))
              .slice(0, 15)
              .map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAddTag(tag)}
                  disabled={tags.length >= 10}
                  className={`border border-gray-200 px-3 py-1 rounded-full mr-2 mb-2 ${
                    tags.length >= 10 ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-gray-600">#{tag}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Conseils */}
        <View className="bg-orange-50 rounded-lg p-4 mb-6">
          <View className="flex-row items-start">
            <Ionicons name="bulb-outline" size={20} color="#EA580C" />
            <View className="flex-1 ml-2">
              <Text className="font-semibold text-orange-800 mb-1">
                Conseils pour une belle expérience
              </Text>
              <Text className="text-orange-700 text-sm leading-5">
                • Décrivez les saveurs, les odeurs, les textures{"\n"}• Partagez
                le contexte culturel ou familial{"\n"}• Mentionnez les
                ingrédients spéciaux ou techniques{"\n"}• Ajoutez des anecdotes
                personnelles{"\n"}• Utilisez des tags pertinents pour être
                trouvé
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
