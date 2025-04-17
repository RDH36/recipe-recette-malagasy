import { create } from "zustand"
import { Recipe } from "@/Types/RecipeType"

interface Store {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  isPremium: boolean
  setIsPremium: (status: boolean) => void
  favorites: Recipe[]
  addToFavorites: (recipe: Recipe) => void
  removeFromFavorites: (recipeId: string) => void
  hasReachedFreeLimit: () => boolean
}

export const useStore = create<Store>((set, get) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  isPremium: false,
  setIsPremium: (status) => set({ isPremium: status }),

  favorites: [],
  addToFavorites: (recipe) => {
    const { isPremium, favorites } = get()
    if (!isPremium && favorites.length >= 10) {
      return
    }
    set((state) => ({
      favorites: [...state.favorites, recipe],
    }))
  },
  removeFromFavorites: (recipeId) => {
    set((state) => ({
      favorites: state.favorites.filter((recipe) => recipe.id !== recipeId),
    }))
  },
  hasReachedFreeLimit: () => {
    const { isPremium, favorites } = get()
    return !isPremium && favorites.length >= 10
  },
}))
