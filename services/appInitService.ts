import { supabase } from "@/lib/supabase";
import { getRecipeById } from "@/services/recipeService";
import { useStore } from "@/store/useStore";
import { Recipe } from "@/Types/RecipeType";
import { Session } from "@supabase/supabase-js";

export const initAppData = async (session: Session): Promise<void> => {
  try {
    await loadUserData(session);
    return;
  } catch (error) {
    supabase.auth.signOut();
    return;
  }
};

export const loadUserData = async (session: Session): Promise<void> => {
  try {
    const userId = session.user.id;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (user) {
      useStore.getState().setUser(user);
      const isPremium = user.isPremium;
      useStore.getState().setIsPremium(isPremium);
      const isLifetime = user.isLifetime;
      useStore.getState().setIsLifetime(isLifetime);
      await loadFavoriteRecipes(user.favorites);
    }
    return;
  } catch (error) {
    supabase.auth.signOut();
    return;
  }
};

const loadFavoriteRecipes = async (favoriteIds: string[]): Promise<void> => {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
      useStore.getState().setFavorites([]);
      return;
    }
    const favoriteRecipes: Recipe[] = [];

    for (const recipeId of favoriteIds) {
      try {
        const recipe = await getRecipeById(recipeId);
        if (recipe) {
          favoriteRecipes.push(recipe);
        }
      } catch (error) {
        console.error(
          `Erreur lors de la récupération de la recette ${recipeId}:`,
          error
        );
      }
    }
    useStore.getState().setFavorites(favoriteRecipes);
  } catch (error) {
    console.error("Erreur lors du chargement des recettes favorites:", error);
    useStore.getState().setFavorites([]);
  }
};
