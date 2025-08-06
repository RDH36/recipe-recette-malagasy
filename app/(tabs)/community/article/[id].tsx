import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { articleService } from "../../../../services/articleService";
import { Article } from "../../../../Types/ArticleType";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const articles = await articleService.getAllArticles();
      const foundArticle = articles.find((a) => a.id === id);

      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        Alert.alert("Erreur", "Article introuvable");
        router.back();
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger l'article");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!article) return;

    try {
      await articleService.toggleLike(article.id);
      await loadArticle(); // Recharger pour mettre à jour
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le like");
    }
  };

  const handleAddComment = async () => {
    if (!article || !newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      await articleService.addComment(article.id, newComment.trim());
      setNewComment("");
      await loadArticle(); // Recharger pour afficher le nouveau commentaire
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCommentDate = (dateString: string) => {
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

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Chargement...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Article introuvable</Text>
      </View>
    );
  }

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

          <Text className="text-lg font-bold text-gray-900">Expérience</Text>

          <TouchableOpacity className="p-2 -mr-2">
            <Ionicons name="share-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Article Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
              <Text className="text-orange-600 font-bold text-xl">
                {article.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-bold text-gray-900 text-lg">
                {article.author.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm">
                  {formatDate(article.createdAt)}
                </Text>
                {article.location && (
                  <>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-500 text-sm ml-1">
                      {article.location}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Titre */}
          <Text className="text-2xl font-bold text-gray-900 mb-4 leading-8">
            {article.title}
          </Text>

          {/* Contenu */}
          <Text className="text-gray-700 leading-6 mb-4 text-base">
            {article.content}
          </Text>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {article.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-orange-50 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-orange-600 font-medium">#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-100">
            <TouchableOpacity
              onPress={handleLike}
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
        </View>

        {/* Commentaires */}
        <View className="px-4 py-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Commentaires ({article.comments.length})
          </Text>

          {/* Liste des commentaires */}
          {article.comments.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons name="chatbubbles-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-2">
                Aucun commentaire pour le moment
              </Text>
              <Text className="text-gray-400 text-center mt-1">
                Soyez le premier à commenter !
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {article.comments.map((comment) => (
                <View key={comment.id} className="flex-row">
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-gray-600 font-semibold text-sm">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <Text className="font-semibold text-gray-900 text-sm mb-1">
                        {comment.author.name}
                      </Text>
                      <Text className="text-gray-700 leading-5">
                        {comment.content}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xs mt-1 ml-3">
                      {formatCommentDate(comment.createdAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Zone de commentaire */}
      <View className="px-4 py-3 bg-white border-t border-gray-100">
        <View className="flex-row items-end">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Ajoutez un commentaire..."
            multiline
            maxLength={500}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 mr-2 max-h-20 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim() || isSubmittingComment}
            className={`p-3 rounded-lg ${
              newComment.trim() && !isSubmittingComment
                ? "bg-orange-500"
                : "bg-gray-300"
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                newComment.trim() && !isSubmittingComment ? "white" : "#9CA3AF"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
