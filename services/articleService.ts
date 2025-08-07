import { supabase } from "@/lib/supabase";
import { Article, CreateArticleData, Comment } from "../Types/ArticleType";

// Interfaces pour les données Supabase
interface SupabaseArticle {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  author_name: string;
  author_avatar: string | null;
  location: string | null;
  tags: string[];
  likes_count: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface SupabaseComment {
  id: string;
  article_id: string;
  author_id: string | null;
  author_name: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

class ArticleService {
  // Convertir un article Supabase en Article local
  private convertSupabaseArticle(
    supabaseArticle: SupabaseArticle,
    comments: SupabaseComment[] = [],
    isLikedByUser: boolean = false
  ): Article {
    return {
      id: supabaseArticle.id,
      title: supabaseArticle.title,
      content: supabaseArticle.content,
      author: {
        id: supabaseArticle.author_id || "anonymous",
        name: supabaseArticle.author_name,
        avatar: supabaseArticle.author_avatar
          ? { uri: supabaseArticle.author_avatar }
          : undefined,
      },
      location: supabaseArticle.location || undefined,
      tags: supabaseArticle.tags,
      likes: supabaseArticle.likes_count,
      images: supabaseArticle.images,
      createdAt: supabaseArticle.created_at,
      updatedAt: supabaseArticle.updated_at,
      comments: comments.map((comment) => ({
        id: comment.id,
        author: {
          id: comment.author_id || "anonymous",
          name: comment.author_name,
          avatar: comment.author_avatar
            ? { uri: comment.author_avatar }
            : undefined,
        },
        content: comment.content,
        createdAt: comment.created_at,
      })),
      isLikedByUser,
    };
  }

  // Récupérer tous les articles avec leurs commentaires
  async getAllArticles(): Promise<Article[]> {
    try {
      // Récupérer les articles
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (articlesError) {
        console.error(
          "Erreur lors de la récupération des articles:",
          articlesError
        );
        return [];
      }

      if (!articles || articles.length === 0) {
        return [];
      }

      // Récupérer tous les commentaires pour ces articles
      const articleIds = articles.map((article) => article.id);
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .in("article_id", articleIds)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          commentsError
        );
      }

      // Récupérer les likes de l'utilisateur actuel (si connecté)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let userLikes: string[] = [];

      if (user) {
        const { data: likes, error: likesError } = await supabase
          .from("article_likes")
          .select("article_id")
          .eq("user_id", user.id);

        if (!likesError && likes) {
          userLikes = likes.map((like) => like.article_id);
        }
      }

      // Grouper les commentaires par article
      const commentsByArticle = (comments || []).reduce((acc, comment) => {
        if (!acc[comment.article_id]) {
          acc[comment.article_id] = [];
        }
        acc[comment.article_id].push(comment);
        return acc;
      }, {} as Record<string, SupabaseComment[]>);

      // Convertir et retourner les articles
      return articles.map((article) =>
        this.convertSupabaseArticle(
          article,
          commentsByArticle[article.id] || [],
          userLikes.includes(article.id)
        )
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error);
      return [];
    }
  }

  // Créer un nouvel article
  async createArticle(articleData: CreateArticleData): Promise<Article> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: article, error } = await supabase
        .from("articles")
        .insert({
          title: articleData.title,
          content: articleData.content,
          author_id: user?.id || null,
          author_name:
            user?.user_metadata?.full_name ||
            user?.email ||
            "Utilisateur anonyme",
          author_avatar: user?.user_metadata?.avatar_url || null,
          location: articleData.location,
          tags: articleData.tags,
          images: articleData.images || [],
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création de l'article:", error);
        throw error;
      }

      return this.convertSupabaseArticle(article, [], false);
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
      throw error;
    }
  }

  // Liker/unliker un article
  async toggleLike(articleId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("Utilisateur non connecté, impossible de liker");
        return;
      }

      // Vérifier si l'utilisateur a déjà liké cet article
      const { data: existingLike } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // Retirer le like
        const { error: deleteError } = await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id);

        if (deleteError) {
          console.error("Erreur lors de la suppression du like:", deleteError);
          throw new Error("Impossible de retirer le like");
        }

        // Mettre à jour le compteur de likes avec la fonction SQL
        const { error: updateError } = await supabase.rpc(
          "update_article_likes_count",
          { article_id_param: articleId }
        );

        if (updateError) {
          console.error(
            "Erreur lors de la mise à jour du compteur:",
            updateError
          );
        }
      } else {
        // Ajouter le like
        const { error: insertError } = await supabase
          .from("article_likes")
          .insert({
            article_id: articleId,
            user_id: user.id,
          });

        if (insertError) {
          console.error("Erreur lors de l'ajout du like:", insertError);
          throw new Error("Impossible d'ajouter le like");
        }

        // Mettre à jour le compteur de likes avec la fonction SQL
        const { error: updateError } = await supabase.rpc(
          "update_article_likes_count",
          { article_id_param: articleId }
        );

        if (updateError) {
          console.error(
            "Erreur lors de la mise à jour du compteur:",
            updateError
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du toggle like:", error);
      throw error;
    }
  }

  // Ajouter un commentaire
  async addComment(articleId: string, content: string): Promise<Comment> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: comment, error } = await supabase
        .from("comments")
        .insert({
          article_id: articleId,
          author_id: user?.id || null,
          author_name:
            user?.user_metadata?.full_name ||
            user?.email ||
            "Utilisateur anonyme",
          author_avatar: user?.user_metadata?.avatar_url || null,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        throw error;
      }

      // Convertir le commentaire Supabase en format Article
      return {
        id: comment.id,
        author: {
          id: comment.author_id || 'anonymous',
          name: comment.author_name,
          avatar: comment.author_avatar ? { uri: comment.author_avatar } : undefined,
        },
        content: comment.content,
        createdAt: comment.created_at,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  }

  // Rechercher des articles
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const lowercaseQuery = query.toLowerCase();

      // Recherche dans les articles avec une requête PostgreSQL
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("*")
        .or(
          `title.ilike.%${query}%,content.ilike.%${query}%,location.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (articlesError) {
        console.error(
          "Erreur lors de la recherche des articles:",
          articlesError
        );
        return [];
      }

      if (!articles || articles.length === 0) {
        return [];
      }

      // Récupérer les commentaires pour ces articles
      const articleIds = articles.map((article) => article.id);
      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .in("article_id", articleIds)
        .order("created_at", { ascending: true });

      // Récupérer les likes de l'utilisateur actuel
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let userLikes: string[] = [];

      if (user) {
        const { data: likes } = await supabase
          .from("article_likes")
          .select("article_id")
          .eq("user_id", user.id);

        if (likes) {
          userLikes = likes.map((like) => like.article_id);
        }
      }

      // Grouper les commentaires par article
      const commentsByArticle = (comments || []).reduce((acc, comment) => {
        if (!acc[comment.article_id]) {
          acc[comment.article_id] = [];
        }
        acc[comment.article_id].push(comment);
        return acc;
      }, {} as Record<string, SupabaseComment[]>);

      // Convertir et retourner les articles
      return articles.map((article) =>
        this.convertSupabaseArticle(
          article,
          commentsByArticle[article.id] || [],
          userLikes.includes(article.id)
        )
      );
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  }
}

export const articleService = new ArticleService();
