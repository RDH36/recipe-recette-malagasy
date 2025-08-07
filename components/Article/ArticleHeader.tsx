import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Article } from "../../Types/ArticleType";

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Header avec bouton retour */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-50"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Article</Text>
        <View className="w-10" />
      </View>

      {/* Image principale */}
      {article.images && article.images.length > 0 && (
        <Image
          source={
            typeof article.images[0] === "string"
              ? { uri: article.images[0] }
              : article.images[0]
          }
          className="w-full h-64"
          resizeMode="cover"
        />
      )}

      {/* Contenu de l'article */}
      <View className="p-4">
        {/* Titre */}
        <Text className="text-2xl font-bold text-gray-800 mb-3">
          {article.title}
        </Text>

        {/* Auteur et date */}
        <View className="flex-row items-center mb-4">
          {article.author.avatar ? (
            <Image
              source={
                typeof article.author.avatar === "string"
                  ? { uri: article.author.avatar }
                  : article.author.avatar
              }
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
              <Text className="text-orange-600 font-semibold text-lg">
                {article.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text className="font-semibold text-gray-800">
              {article.author.name}
            </Text>
            <Text className="text-gray-500 text-sm">
              {formatDate(article.createdAt)}
            </Text>
          </View>
        </View>

        {/* Localisation */}
        {article.location && (
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-600 ml-2">{article.location}</Text>
          </View>
        )}

        {/* Contenu */}
        <Text className="text-gray-700 text-base leading-6 mb-4">
          {article.content}
        </Text>

        {/* Tags */}
        {article.tags.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {article.tags.map((tag: string, index: number) => (
              <View
                key={index}
                className="bg-orange-50 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-orange-600 font-medium">#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
}
