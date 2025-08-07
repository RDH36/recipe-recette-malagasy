import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Article } from "../../Types/ArticleType";

interface ArticleCardProps {
  article: Article;
  onLike: (articleId: string) => void;
}

export default function ArticleCard({ article, onLike }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/community/article/${article.id}`)}
      className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm"
    >
      {/* Header de l'article */}
      <View className="flex-row items-center mb-3">
        {article.author.avatar ? (
          <Image
            source={
              typeof article.author.avatar === "string"
                ? { uri: article.author.avatar }
                : article.author.avatar
            }
            className="w-10 h-10 rounded-full"
            style={{ resizeMode: "cover" }}
          />
        ) : (
          <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
            <Text className="text-orange-600 font-bold text-lg">
              {article.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-gray-900">
            {article.author.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm">
              {formatDate(article.createdAt)}
            </Text>
            {article.location && (
              <>
                <Text className="text-gray-400 mx-1">•</Text>
                <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-1">
                  {article.location}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Contenu de l'article */}
      <Text className="font-bold text-lg text-gray-900 mb-2">
        {article.title}
      </Text>
      <Text className="text-gray-600 leading-5 mb-3">
        {truncateContent(article.content)}
      </Text>

      {/* Tags */}
      {article.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {article.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              className="bg-orange-50 px-2 py-1 rounded-full mr-2 mb-1"
            >
              <Text className="text-orange-600 text-xs font-medium">
                #{tag}
              </Text>
            </View>
          ))}
          {article.tags.length > 3 && (
            <Text className="text-gray-400 text-xs self-center">
              +{article.tags.length - 3} autres
            </Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
        <TouchableOpacity
          onPress={() => onLike(article.id)}
          className="flex-row items-center"
        >
          <Ionicons
            name={article.isLikedByUser ? "heart" : "heart-outline"}
            size={20}
            color={article.isLikedByUser ? "#EF4444" : "#9CA3AF"}
          />
          <Text className="text-gray-600 ml-1 font-medium">
            {article.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
          <Text className="text-gray-600 ml-1 font-medium">
            {article.comments.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="share-outline" size={18} color="#9CA3AF" />
          <Text className="text-gray-600 ml-1 font-medium">Partager</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
