import { ImageSourcePropType } from "react-native";

interface Substitute {
  original: string;
  substitutes: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  time: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  ingredients: string[];
  instructions: string[];
  isPremium?: boolean;
  createdAt: string;
  // Informations premium
  region?: string;
  history?: string;
  culturalContext?: string;
  substitutes?: Substitute[];
}
