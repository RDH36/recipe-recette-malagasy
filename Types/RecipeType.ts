export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  ingredients: string[];
  instructions: string[];
  isPremium?: boolean;
}
