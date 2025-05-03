import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useRouter } from "expo-router";
import React from "react";

interface NetworkCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectToErrorPage?: boolean;
}

/**
 * Composant qui vérifie la connexion réseau avant d'afficher ses enfants.
 * Si la connexion est perdue, il peut soit afficher un contenu alternatif,
 * soit rediriger vers la page d'erreur réseau.
 */
const NetworkCheck: React.FC<NetworkCheckProps> = ({
  children,
  fallback,
  redirectToErrorPage = false,
}) => {
  const router = useRouter();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const hasNetwork = !!(isConnected && isInternetReachable);

  // Si la connexion est perdue et qu'on doit rediriger
  React.useEffect(() => {
    if (!hasNetwork && redirectToErrorPage) {
      router.push({
        pathname: "/error/network",
      } as any);
    }
  }, [hasNetwork, redirectToErrorPage, router]);

  // Si la connexion est perdue et qu'on a un fallback, l'afficher
  if (!hasNetwork) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Si pas de fallback et pas de redirection, afficher quand même les enfants
    // mais ils ne fonctionneront probablement pas correctement sans connexion
  }

  // Si la connexion est bonne ou qu'on n'a pas de fallback, afficher les enfants
  return <>{children}</>;
};

export default NetworkCheck;
