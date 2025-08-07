import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function ArticleSkeleton() {
  return (
    <View className="flex-1 bg-white">
      {/* Header avec bouton retour */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-50"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
        <View className="w-10" />
      </View>

      {/* Image skeleton */}
      <View className="w-full h-64 bg-gray-200 animate-pulse" />

      {/* Contenu skeleton */}
      <View className="p-4">
        {/* Titre skeleton */}
        <View className="w-4/5 h-8 bg-gray-200 rounded mb-3 animate-pulse" />
        <View className="w-3/5 h-6 bg-gray-200 rounded mb-4 animate-pulse" />

        {/* Auteur skeleton */}
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-gray-200 rounded-full mr-3 animate-pulse" />
          <View className="flex-1">
            <View className="w-32 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
            <View className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
          </View>
        </View>

        {/* Localisation skeleton */}
        <View className="flex-row items-center mb-4">
          <View className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
          <View className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
        </View>

        {/* Contenu skeleton */}
        <View className="space-y-2 mb-4">
          <View className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <View className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <View className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
          <View className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
        </View>

        {/* Tags skeleton */}
        <View className="flex-row flex-wrap mb-4">
          <View className="w-16 h-6 bg-gray-200 rounded-full mr-2 mb-2 animate-pulse" />
          <View className="w-20 h-6 bg-gray-200 rounded-full mr-2 mb-2 animate-pulse" />
          <View className="w-18 h-6 bg-gray-200 rounded-full animate-pulse" />
        </View>
      </View>

      {/* Actions skeleton */}
      <View className="px-4">
        <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-gray-200 rounded mr-2 animate-pulse" />
            <View className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </View>
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-gray-200 rounded mr-2 animate-pulse" />
            <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </View>
        </View>
      </View>

      {/* Commentaires skeleton */}
      <View className="px-4 py-6 flex-1">
        <View className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
        
        {/* Commentaires items skeleton */}
        <View className="space-y-4">
          {[1, 2, 3].map((index) => (
            <View key={index} className="flex-row">
              <View className="w-8 h-8 bg-gray-200 rounded-full mr-3 animate-pulse" />
              <View className="flex-1">
                <View className="bg-gray-100 rounded-lg p-3 mb-1">
                  <View className="w-24 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                  <View className="w-full h-3 bg-gray-200 rounded mb-1 animate-pulse" />
                  <View className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
                </View>
                <View className="w-16 h-2 bg-gray-200 rounded ml-3 animate-pulse" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Formulaire commentaire skeleton */}
      <View className="bg-white border-t border-gray-100">
        <View className="flex-row items-center p-4 space-x-3">
          <View className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <View className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        </View>
      </View>
    </View>
  );
}
