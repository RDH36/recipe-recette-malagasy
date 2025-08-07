import CookingLoader from "@/components/Loading/CookingLoader";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import ArticleCard from "../../../components/Community/ArticleCard";
import CommunityHeader from "../../../components/Community/CommunityHeader";
import EmptyState from "../../../components/Community/EmptyState";
import { useRealtimeArticles } from "../../../hooks/useRealtimeArticles";
import { articleService } from "../../../services/articleService";
import { Article } from "../../../Types/ArticleType";

export default function CommunityScreen() {
  const { articles, loading, loadArticles } = useRealtimeArticles();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "recent" | "popular"
  >("all");

  useEffect(() => {
    filterArticles();
  }, [articles, selectedFilter, searchQuery]);

  const filterArticles = () => {
    let filtered = [...articles];

    // Appliquer la recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.author.name.toLowerCase().includes(query) ||
          article.location?.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Appliquer le filtre
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
        // "all" - pas de tri particulier, garder l'ordre par défaut
        break;
    }

    setFilteredArticles(filtered);
  };

  const handleLike = async (articleId: string) => {
    try {
      await articleService.toggleLike(articleId);
      // Les mises à jour se feront automatiquement via useRealtimeArticles
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le like");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <CommunityHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <CookingLoader message="Préparation des articles..." />
        </View>
      ) : filteredArticles.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-3">
              <ArticleCard article={item} onLike={handleLike} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadArticles}
              tintColor="#FF8050"
              colors={["#FF8050"]}
              progressBackgroundColor="#FFFFFF"
            />
          }
        />
      )}
    </View>
  );
}
