import { Recipe } from "@/Types/RecipeType";
import { supabase } from "@/lib/supabase";

interface SupabaseRecipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  time: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  ingredients: string[];
  instructions: string[];
  is_premium: boolean;
  created_at: string;
  region?: string;
  history?: string;
  cultural_context?: string;
  substitutes?: {
    original: string;
    substitutes: string[];
  }[];
}

const mapSupabaseRecipeToAppRecipe = (recipe: SupabaseRecipe): Recipe => {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    image: { uri: recipe.image_url },
    time: recipe.time,
    difficulty: recipe.difficulty,
    category: recipe.category,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    isPremium: recipe.is_premium,
    createdAt: recipe.created_at,
    region: recipe.region,
    history: recipe.history,
    culturalContext: recipe.cultural_context,
    substitutes: recipe.substitutes,
  };
};

export const getRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }

  return (data || []).map(mapSupabaseRecipeToAppRecipe);
};

export const getPopularRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("category", "populaire")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching popular recipes:", error);
    throw error;
  }

  return (data || []).map(mapSupabaseRecipeToAppRecipe);
};

export const getNotPopularRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .not("category", "eq", "populaire")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching not popular recipes:", error);
    throw error;
  }

  return (data || []).map(mapSupabaseRecipeToAppRecipe);
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }

  return data ? mapSupabaseRecipeToAppRecipe(data) : null;
};
