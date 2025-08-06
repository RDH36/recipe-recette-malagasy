import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { articleService } from "../../../services/articleService";
import { Article } from "../../../Types/ArticleType";

export default function CommunityScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "recent" | "popular"
  >("all");

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, selectedFilter, searchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const fetchedArticles = await articleService.getAllArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les articles");
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filtrer par catégorie
    switch (selectedFilter) {
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        // Garder l'ordre par défaut (récent)
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredArticles(filtered);
  };

  const handleLike = async (articleId: string) => {
    try {
      await articleService.toggleLike(articleId);
      await loadArticles(); // Recharger pour mettre à jour les likes
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le like");
    }
  };

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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-8 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Communauté</Text>
          <TouchableOpacity
            onPress={() => router.push("/community/create")}
            className="bg-orange-500 px-4 py-2 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Partager</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 mb-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher des expériences..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filtres */}
        <View className="flex-row space-x-2">
          {[
            { key: "all", label: "Tous" },
            { key: "recent", label: "Récents" },
            { key: "popular", label: "Populaires" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter.key ? "bg-orange-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedFilter === filter.key ? "text-white" : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Liste des articles */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadArticles} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredArticles.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              {searchQuery
                ? "Aucun résultat trouvé"
                : "Aucune expérience partagée"}
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {searchQuery
                ? "Essayez avec d'autres mots-clés"
                : "Soyez le premier à partager votre aventure culinaire malgache !"}
            </Text>
          </View>
        ) : (
          <View className="px-4 py-2">
            {filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/community/article/${article.id}`)}
                className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm"
              >
                {/* Header de l'article */}
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                    <Text className="text-orange-600 font-bold text-lg">
                      {article.author.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
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
                          <Ionicons
                            name="location-outline"
                            size={12}
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
                    onPress={() => handleLike(article.id)}
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
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-600 ml-1 font-medium">
                      {article.comments.length}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="share-outline" size={18} color="#9CA3AF" />
                    <Text className="text-gray-600 ml-1 font-medium">
                      Partager
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
