import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Article } from '../Types/ArticleType';
import { articleService } from '../services/articleService';

export function useRealtimeArticle(articleId: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger l'article
  const loadArticle = async () => {
    if (!articleId) return;
    
    try {
      const articles = await articleService.getAllArticles();
      const foundArticle = articles.find(a => a.id === articleId);
      setArticle(foundArticle || null);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!articleId) return;

    // Réinitialiser l'état quand l'ID change
    setArticle(null);
    setLoading(true);

    // Charger l'article initial
    loadArticle();

    // Écouter les changements sur la table articles
    const articlesSubscription = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles',
          filter: `id=eq.${articleId}`,
        },
        () => {
          console.log('Article mis à jour, rechargement...');
          loadArticle();
        }
      )
      .subscribe();

    // Écouter les changements sur les commentaires
    const commentsSubscription = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`,
        },
        () => {
          console.log('Commentaire mis à jour, rechargement...');
          loadArticle();
        }
      )
      .subscribe();

    // Écouter les changements sur les likes
    const likesSubscription = supabase
      .channel('likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'article_likes',
          filter: `article_id=eq.${articleId}`,
        },
        () => {
          console.log('Like mis à jour, rechargement...');
          loadArticle();
        }
      )
      .subscribe();

    // Nettoyage des subscriptions
    return () => {
      articlesSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
      likesSubscription.unsubscribe();
    };
  }, [articleId]);

  return { article, loading, setArticle, loadArticle };
}
