import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import AddCommentForm from "../../../../components/Article/AddCommentForm";
import ArticleActions from "../../../../components/Article/ArticleActions";
import ArticleHeader from "../../../../components/Article/ArticleHeader";
import ArticleSkeleton from "../../../../components/Article/ArticleSkeleton";
import CommentsList from "../../../../components/Article/CommentsList";
import { useRealtimeArticle } from "../../../../hooks/useRealtimeArticle";
import { articleService } from "../../../../services/articleService";
import { supabase } from "../../../../lib/supabase";

interface PendingComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  isPending: true;
}

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { article, loading, setArticle } = useRealtimeArticle(id);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);

  const handleLike = async () => {
    if (!article) return;

    // Mise à jour optimiste de l'UI
    const newLikedByUser = !article.isLikedByUser;
    const newLikesCount = newLikedByUser
      ? article.likes + 1
      : article.likes - 1;

    setArticle({
      ...article,
      isLikedByUser: newLikedByUser,
      likes: Math.max(0, newLikesCount),
    });

    try {
      await articleService.toggleLike(article.id);
      // Pas besoin de recharger, la mise à jour optimiste suffit
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      setArticle({
        ...article,
        isLikedByUser: article.isLikedByUser,
        likes: article.likes,
      });
      Alert.alert("Erreur", "Impossible de mettre à jour le like");
    }
  };

  const handleAddComment = async (commentContent: string) => {
    if (!article) return;

    setIsSubmittingComment(true);

    // Créer un commentaire en attente pour l'aperçu
    const { data: { user } } = await supabase.auth.getUser();
    const pendingComment: PendingComment = {
      id: `pending-${Date.now()}`,
      content: commentContent,
      createdAt: new Date().toISOString(),
      author: {
        name: user?.user_metadata?.name || user?.email || "Utilisateur",
        avatar: user?.user_metadata?.avatar_url,
      },
      isPending: true,
    };

    // Ajouter le commentaire en attente
    setPendingComments(prev => [...prev, pendingComment]);

    try {
      const newCommentData = await articleService.addComment(
        article.id,
        commentContent
      );

      // Supprimer le commentaire en attente et ajouter le vrai
      setPendingComments(prev => prev.filter(c => c.id !== pendingComment.id));
      setArticle({
        ...article,
        comments: [...article.comments, newCommentData],
      });
    } catch (error) {
      // Supprimer le commentaire en attente en cas d'erreur
      setPendingComments(prev => prev.filter(c => c.id !== pendingComment.id));
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return <ArticleSkeleton />;
  }

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg mb-4">Article introuvable</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ArticleHeader article={article} />

        <View className="px-4">
          <ArticleActions article={article} onLike={handleLike} />
        </View>

        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Commentaires
          </Text>
          <CommentsList 
            comments={article.comments} 
            pendingComments={pendingComments}
          />
        </View>
      </ScrollView>

      <AddCommentForm
        onSubmit={handleAddComment}
        isSubmitting={isSubmittingComment}
      />
    </View>
  );
}
