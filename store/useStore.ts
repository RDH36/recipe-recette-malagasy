import { Recipe } from "@/Types/RecipeType";
import { User } from "@/services/userServices";
import { create } from "zustand";

interface Store {
  // État utilisateur
  user: User | null;
  setUser: (user: User | null) => void;

  // État premium
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;

  // État abonnement à vie
  isLifetime: boolean;
  setIsLifetime: (status: boolean) => void;

  // État catégorie
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  // État favoris
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  setFavorites: (recipes: Recipe[]) => void;
  hasReachedFreeLimit: () => boolean;
}

export const useStore = create<Store>((set, get) => ({
  // État utilisateur
  user: null,
  setUser: (user) => set({ user }),

  // État premium
  isPremium: false,
  setIsPremium: (status) => set({ isPremium: status }),

  // État abonnement à vie
  isLifetime: false,
  setIsLifetime: (status) => set({ isLifetime: status }),

  // État catégorie
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // État favoris
  favorites: [],
  setFavorites: (recipes) => set({ favorites: recipes }),
  addToFavorites: (recipe) => {
    const { isPremium, favorites } = get();
    if (!isPremium && favorites.length >= 10) {
      return;
    }
    set((state) => ({
      favorites: [...state.favorites, recipe],
    }));
  },
  removeFromFavorites: (recipeId) => {
    set((state) => ({
      favorites: state.favorites.filter((recipe) => recipe.id !== recipeId),
    }));
  },
  hasReachedFreeLimit: () => {
    const { isPremium, favorites } = get();
    return !isPremium && favorites.length >= 10;
  },
}));
