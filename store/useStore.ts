import { Recipe } from "@/Types/RecipeType";
import { User } from "@/services/userServices";
import { create } from "zustand";

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;

  isPremium: boolean;
  setIsPremium: (status: boolean) => void;

  isLifetime: boolean;
  setIsLifetime: (status: boolean) => void;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  setFavorites: (recipes: Recipe[]) => void;
  hasReachedFreeLimit: () => boolean;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  isPremium: false,
  setIsPremium: (status) => set({ isPremium: status }),

  isLifetime: false,
  setIsLifetime: (status) => set({ isLifetime: status }),

  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

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
