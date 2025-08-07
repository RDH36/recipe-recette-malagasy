import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { Article } from "../../Types/ArticleType";

interface ArticleActionsProps {
  article: Article;
  onLike: () => void;
}

export default function ArticleActions({ article, onLike }: ArticleActionsProps) {
  return (
    <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-100">
      <TouchableOpacity
        onPress={onLike}
        className="flex-row items-center"
      >
        <Ionicons
          name={article.isLikedByUser ? "heart" : "heart-outline"}
          size={24}
          color={article.isLikedByUser ? "#EF4444" : "#9CA3AF"}
        />
        <Text className="text-gray-700 ml-2 font-semibold">
          {article.likes} {article.likes === 1 ? "like" : "likes"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center">
        <Ionicons name="chatbubble-outline" size={22} color="#9CA3AF" />
        <Text className="text-gray-700 ml-2 font-semibold">
          {article.comments.length}{" "}
          {article.comments.length === 1 ? "commentaire" : "commentaires"}
        </Text>
      </View>
    </View>
  );
}
