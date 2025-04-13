import { useLocalSearchParams } from "expo-router";
import React from "react";
import CookingMode from "../../../components/CookingMode/CookingMode";

const CookingPage = () => {
  const { id } = useLocalSearchParams();

  // Note: Ces étapes sont temporaires, elles devraient venir de votre API ou state management
  const mockSteps = [
    "Dans une grande casserole, faites revenir les oignons, l'ail et le gingembre jusqu'à ce qu'ils soient parfumés.",
    "Ajoutez la viande coupée en cubes et faites-la dorer de tous les côtés.",
    "Incorporez les tomates hachées et laissez mijoter pendant 5 minutes.",
    "Ajoutez les brèdes mafana (ou épinards) et mélangez bien.",
    "Couvrez et laissez mijoter à feu doux pendant 20 minutes.",
    "Assaisonnez selon votre goût.",
    "Servez chaud avec du riz.",
  ];

  return <CookingMode steps={mockSteps} recipeId={id as string} />;
};

export default CookingPage;
