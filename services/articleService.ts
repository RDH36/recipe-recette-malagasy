import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, CreateArticleData, Comment } from '../Types/ArticleType';

const ARTICLES_STORAGE_KEY = 'malagasy_articles';
const LIKED_ARTICLES_STORAGE_KEY = 'liked_articles';

// Données d'exemple pour commencer
const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Mon voyage culinaire à Antananarivo',
    content: 'Lors de mon séjour dans la capitale malgache, j\'ai découvert des saveurs incroyables. Le romazava que j\'ai goûté chez une famille locale était absolument délicieux. La combinaison des brèdes mafana et de la viande de zébu créait une harmonie parfaite...',
    author: {
      name: 'Miora Rakoto',
    },
    location: 'Antananarivo',
    tags: ['romazava', 'cuisine traditionnelle', 'voyage'],
    likes: 15,
    comments: [
      {
        id: '1',
        author: { name: 'Hery Andry' },
        content: 'Merci pour ce partage ! J\'ai envie d\'essayer cette recette.',
        createdAt: '2024-01-15T10:30:00Z'
      }
    ],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '2',
    title: 'La préparation du vary amin\'anana en famille',
    content: 'Hier, j\'ai participé à la préparation du vary amin\'anana avec ma grand-mère. C\'était un moment magique où elle m\'a transmis tous ses secrets. Le choix des brèdes, la cuisson du riz, tout a son importance...',
    author: {
      name: 'Faly Razafy',
    },
    location: 'Fianarantsoa',
    tags: ['vary amin\'anana', 'tradition familiale', 'brèdes'],
    likes: 23,
    comments: [],
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
  }
];

class ArticleService {
  // Récupérer tous les articles
  async getAllArticles(): Promise<Article[]> {
    try {
      const articlesJson = await AsyncStorage.getItem(ARTICLES_STORAGE_KEY);
      if (articlesJson) {
        const articles = JSON.parse(articlesJson);
        return await this.addLikeStatus(articles);
      }
      // Si pas d'articles stockés, utiliser les exemples
      await this.saveArticles(SAMPLE_ARTICLES);
      return await this.addLikeStatus(SAMPLE_ARTICLES);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Ajouter le statut "aimé" aux articles
  private async addLikeStatus(articles: Article[]): Promise<Article[]> {
    try {
      const likedArticlesJson = await AsyncStorage.getItem(LIKED_ARTICLES_STORAGE_KEY);
      const likedArticles = likedArticlesJson ? JSON.parse(likedArticlesJson) : [];
      
      return articles.map(article => ({
        ...article,
        isLikedByUser: likedArticles.includes(article.id)
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du statut like:', error);
      return articles;
    }
  }

  // Créer un nouvel article
  async createArticle(articleData: CreateArticleData): Promise<Article> {
    try {
      const articles = await this.getAllArticles();
      
      const newArticle: Article = {
        id: Date.now().toString(),
        title: articleData.title,
        content: articleData.content,
        author: {
          name: 'Utilisateur', // À remplacer par les vraies données utilisateur
        },
        location: articleData.location,
        tags: articleData.tags,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLikedByUser: false,
      };

      const updatedArticles = [newArticle, ...articles];
      await this.saveArticles(updatedArticles);
      
      return newArticle;
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      throw error;
    }
  }

  // Liker/unliker un article
  async toggleLike(articleId: string): Promise<void> {
    try {
      const articles = await this.getAllArticles();
      const likedArticlesJson = await AsyncStorage.getItem(LIKED_ARTICLES_STORAGE_KEY);
      let likedArticles = likedArticlesJson ? JSON.parse(likedArticlesJson) : [];

      const articleIndex = articles.findIndex(a => a.id === articleId);
      if (articleIndex === -1) return;

      const isLiked = likedArticles.includes(articleId);
      
      if (isLiked) {
        // Retirer le like
        likedArticles = likedArticles.filter((id: string) => id !== articleId);
        articles[articleIndex].likes = Math.max(0, articles[articleIndex].likes - 1);
      } else {
        // Ajouter le like
        likedArticles.push(articleId);
        articles[articleIndex].likes += 1;
      }

      await AsyncStorage.setItem(LIKED_ARTICLES_STORAGE_KEY, JSON.stringify(likedArticles));
      await this.saveArticles(articles);
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
    }
  }

  // Ajouter un commentaire
  async addComment(articleId: string, content: string): Promise<void> {
    try {
      const articles = await this.getAllArticles();
      const articleIndex = articles.findIndex(a => a.id === articleId);
      
      if (articleIndex === -1) return;

      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'Utilisateur', // À remplacer par les vraies données utilisateur
        },
        content,
        createdAt: new Date().toISOString(),
      };

      articles[articleIndex].comments.push(newComment);
      articles[articleIndex].updatedAt = new Date().toISOString();
      
      await this.saveArticles(articles);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  }

  // Rechercher des articles
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const articles = await this.getAllArticles();
      const lowercaseQuery = query.toLowerCase();
      
      return articles.filter(article =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        (article.location && article.location.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  }

  // Sauvegarder les articles
  private async saveArticles(articles: Article[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des articles:', error);
    }
  }
}

export const articleService = new ArticleService();
