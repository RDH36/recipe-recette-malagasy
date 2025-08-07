import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Article } from '../Types/ArticleType';
import { articleService } from '../services/articleService';

export function useRealtimeArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger tous les articles
  const loadArticles = async () => {
    try {
      const allArticles = await articleService.getAllArticles();
      setArticles(allArticles);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger les articles initial
    loadArticles();

    // Écouter les changements sur la table articles
    const articlesSubscription = supabase
      .channel('articles-list-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles',
        },
        (payload) => {
          console.log('Articles mis à jour, rechargement...', payload);
          loadArticles();
        }
      )
      .subscribe();

    // Écouter les changements sur les commentaires (pour mettre à jour le compteur)
    const commentsSubscription = supabase
      .channel('comments-list-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        (payload) => {
          console.log('Commentaires mis à jour, rechargement...', payload);
          loadArticles();
        }
      )
      .subscribe();

    // Écouter les changements sur les likes (pour mettre à jour le compteur)
    const likesSubscription = supabase
      .channel('likes-list-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'article_likes',
        },
        (payload) => {
          console.log('Likes mis à jour, rechargement...', payload);
          loadArticles();
        }
      )
      .subscribe();

    // Nettoyage des subscriptions
    return () => {
      articlesSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
      likesSubscription.unsubscribe();
    };
  }, []);

  return { articles, loading, setArticles, loadArticles };
}
