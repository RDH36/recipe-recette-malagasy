import { supabase } from "@/config/supabase";

// Type pour l'utilisateur
export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isLifetime: boolean;
  favorites: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Crée ou met à jour un utilisateur après authentification Google
 * @param userId ID de l'utilisateur provenant de Supabase Auth
 * @param email Email de l'utilisateur
 * @returns L'utilisateur créé ou mis à jour
 */
export const createOrUpdateUser = async (
  userId: string,
  email: string
): Promise<User | null> => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Une erreur s'est produite (autre que "pas de résultat")
      console.error(
        "Erreur lors de la recherche de l'utilisateur:",
        fetchError
      );
      return null;
    }

    if (existingUser) {
      // L'utilisateur existe déjà, retourner ses données
      return existingUser as User;
    }

    // L'utilisateur n'existe pas, le créer avec les valeurs par défaut
    const newUser: Omit<User, "created_at" | "updated_at"> = {
      id: userId,
      email,
      isPremium: false, // Par défaut, l'utilisateur n'est pas premium
      isLifetime: false, // Par défaut, l'utilisateur n'a pas d'abonnement à vie
      favorites: [], // Tableau vide pour les favoris
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select();

    if (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      return null;
    }

    return data[0] as User;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return null;
  }
};

/**
 * Met à jour le statut premium d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param isPremium Nouveau statut premium
 * @returns Succès de l'opération
 */
export const updatePremiumStatus = async (
  userId: string,
  isPremium: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("users")
      .update({ isPremium, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return !error;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut premium:", error);
    return false;
  }
};

/**
 * Met à jour le statut d'abonnement à vie d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param isLifetime Nouveau statut d'abonnement à vie
 * @returns Succès de l'opération
 */
export const updateLifetimeStatus = async (
  userId: string,
  isLifetime: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        isLifetime,
        isPremium: isLifetime ? true : undefined, // Si l'abonnement est à vie, l'utilisateur est aussi premium
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return !error;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut lifetime:", error);
    return false;
  }
};

/**
 * Ajoute une recette aux favoris d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param recipeId ID de la recette à ajouter aux favoris
 * @returns Succès de l'opération
 */
export const addFavoriteRecipe = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  try {
    // Récupérer les favoris actuels
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("favorites")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Erreur lors de la récupération des favoris:", fetchError);
      return false;
    }

    // S'assurer que favorites est un tableau
    const currentFavorites = data.favorites || [];

    // Vérifier si la recette est déjà dans les favoris
    if (currentFavorites.includes(recipeId)) {
      return true; // Déjà dans les favoris
    }

    // Ajouter la recette aux favoris
    const updatedFavorites = [...currentFavorites, recipeId];

    const { error: updateError } = await supabase
      .from("users")
      .update({
        favorites: updatedFavorites,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return !updateError;
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    return false;
  }
};

/**
 * Supprime une recette des favoris d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param recipeId ID de la recette à supprimer des favoris
 * @returns Succès de l'opération
 */
export const removeFavoriteRecipe = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  try {
    // Récupérer les favoris actuels
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("favorites")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Erreur lors de la récupération des favoris:", fetchError);
      return false;
    }

    // S'assurer que favorites est un tableau
    const currentFavorites = data.favorites || [];

    // Filtrer pour retirer la recette des favoris
    const updatedFavorites = currentFavorites.filter(
      (id: string) => id !== recipeId
    );

    const { error: updateError } = await supabase
      .from("users")
      .update({
        favorites: updatedFavorites,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return !updateError;
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    return false;
  }
};

/**
 * Récupère la liste des recettes favorites d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Tableau des IDs de recettes favorites
 */
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("favorites")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      return [];
    }

    return data.favorites || [];
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return [];
  }
};

/**
 * Vérifie si l'utilisateur est premium
 * @param userId ID de l'utilisateur
 * @returns true si l'utilisateur est premium, false sinon
 */
export const isUserPremium = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("isPremium")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erreur lors de la vérification du statut premium:", error);
      return false;
    }

    return data.isPremium || false;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return false;
  }
};

/**
 * Vérifie si l'utilisateur a un abonnement à vie
 * @param userId ID de l'utilisateur
 * @returns true si l'utilisateur a un abonnement à vie, false sinon
 */
export const isUserLifetime = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("isLifetime")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(
        "Erreur lors de la vérification du statut lifetime:",
        error
      );
      return false;
    }

    return data.isLifetime || false;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return false;
  }
};

/**
 * Annule l'abonnement premium d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Succès de l'opération
 */
export const cancelPremiumSubscription = async (
  userId: string
): Promise<boolean> => {
  try {
    // Vérifier si l'utilisateur a un abonnement à vie
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isLifetime")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error(
        "Erreur lors de la vérification du statut lifetime:",
        userError
      );
      return false;
    }

    // Si l'utilisateur a un abonnement à vie, on ne peut pas annuler son statut premium
    if (userData.isLifetime) {
      console.log("Impossible d'annuler un abonnement à vie");
      return false;
    }

    // Mettre à jour le statut premium
    const { error } = await supabase
      .from("users")
      .update({
        isPremium: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'abonnement:", error);
    return false;
  }
};
