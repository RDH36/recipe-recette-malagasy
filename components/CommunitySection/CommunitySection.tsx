import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRealtimeArticles } from "../../hooks/useRealtimeArticles";
import { Article } from "../../Types/ArticleType";

export default function CommunitySection() {
  const { articles: allArticles, loading } = useRealtimeArticles();

  // Calculer les 3 articles les plus récents
  const recentArticles = useMemo(() => {
    return allArticles
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }, [allArticles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading || recentArticles.length === 0) {
    return null;
  }

  return (
    <View className="px-4 py-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            Expériences de la communauté
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Découvrez les aventures culinaires partagées
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/community")}
          className="flex-row items-center bg-orange-50 px-3 py-2 rounded-full"
        >
          <Text className="text-orange-600 font-medium text-sm">Voir tout</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#EA580C"
            className="ml-1"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-3"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {recentArticles.map((article: Article, index: number) => (
          <TouchableOpacity
            key={article.id}
            onPress={() =>
              router.push(`/(tabs)/community/article/${article.id}`)
            }
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm w-72 mr-3"
          >
            {/* Header de l'article */}
            <View className="flex-row items-center mb-3">
              {article.author.avatar ? (
                <Image
                  source={typeof article.author.avatar === 'string' ? { uri: article.author.avatar } : article.author.avatar}
                  className="w-8 h-8 rounded-full"
                  style={{ resizeMode: 'cover' }}
                />
              ) : (
                <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                  <Text className="text-orange-600 font-bold text-sm">
                    {article.author.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1 ml-2">
                <Text className="font-semibold text-gray-900 text-sm">
                  {article.author.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-xs">
                    {formatDate(article.createdAt)}
                  </Text>
                  {article.location && (
                    <>
                      <Text className="text-gray-400 mx-1 text-xs">•</Text>
                      <Ionicons
                        name="location-outline"
                        size={10}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-500 text-xs ml-1">
                        {article.location}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Contenu */}
            <Text className="font-bold text-base text-gray-900 mb-2 leading-5">
              {article.title}
            </Text>
            <Text className="text-gray-600 text-sm leading-4 mb-3">
              {truncateContent(article.content)}
            </Text>

            {/* Tags (max 2) */}
            {article.tags.length > 0 && (
              <View className="flex-row flex-wrap mb-3">
                {article.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                  <View
                    key={tagIndex}
                    className="bg-orange-50 px-2 py-1 rounded-full mr-1 mb-1"
                  >
                    <Text className="text-orange-600 text-xs font-medium">
                      #{tag}
                    </Text>
                  </View>
                ))}
                {article.tags.length > 2 && (
                  <Text className="text-gray-400 text-xs self-center">
                    +{article.tags.length - 2}
                  </Text>
                )}
              </View>
            )}

            {/* Stats */}
            <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
              <View className="flex-row items-center">
                <Ionicons
                  name={article.isLikedByUser ? "heart" : "heart-outline"}
                  size={16}
                  color={article.isLikedByUser ? "#EF4444" : "#9CA3AF"}
                />
                <Text className="text-gray-600 ml-1 text-xs font-medium">
                  {article.likes}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
                <Text className="text-gray-600 ml-1 text-xs font-medium">
                  {article.comments.length}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-orange-600 text-xs font-medium">
                  Lire plus
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color="#EA580C"
                  className="ml-1"
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Call to Action */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/community")}
        className="mt-4 bg-orange-500 rounded-xl p-4 flex-row items-center justify-center"
      >
        <Ionicons name="people" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">
          Rejoindre la communauté
        </Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color="white"
          className="ml-2"
        />
      </TouchableOpacity>

      {/* Encouragement à partager */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/community/create")}
        className="mt-3 bg-gray-50 rounded-xl p-4 flex-row items-center justify-center border border-gray-100"
      >
        <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
        <Text className="text-gray-700 font-medium ml-2">
          Partager votre expérience culinaire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
