import { supabase } from "@/lib/supabase";
import { getUserById } from "@/services/userServices";
import { useStore } from "@/store/useStore";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useAuthSync = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { setUser, user } = useStore();

  useEffect(() => {
    // Initialiser la session et synchroniser avec le store
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user && !user) {
        // Charger les données utilisateur dans le store si pas déjà présentes
        try {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.log("Erreur lors du chargement des données utilisateur:", error);
        }
      } else if (!session?.user && user) {
        // Nettoyer le store si pas de session
        setUser(null);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.log("Erreur lors du chargement des données utilisateur:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, user]);

  return { session };
};
