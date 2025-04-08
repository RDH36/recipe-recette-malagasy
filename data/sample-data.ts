import { Recipe } from "@/Types/RecipeType"

export const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Romazava",
    description:
      "A traditional Malagasy beef and vegetable stew with brèdes mafana (Malagasy greens).",
    image: require("@/assets/recipe-image/Romazava.webp"),
    time: 60,
    difficulty: "Medium",
    category: "malagasy",
    ingredients: [
      "500g beef, cut into cubes",
      "2 tomatoes, chopped",
      "1 onion, chopped",
      "2 cups brèdes mafana (or spinach)",
      "2 cloves garlic, minced",
      "1 piece ginger, minced",
      "Salt and pepper to taste",
    ],
    instructions: [
      "In a large pot, sauté onions, garlic, and ginger until fragrant.",
      "Add beef and brown on all sides.",
      "Add tomatoes and cook until softened.",
      "Pour in water to cover the meat and simmer for 30 minutes.",
      "Add the brèdes mafana and cook for another 15 minutes.",
      "Season with salt and pepper to taste.",
      "Serve hot with rice.",
    ],
  },
  {
    id: "2",
    title: "Ravitoto",
    description:
      "A classic Malagasy dish made with pounded cassava leaves and pork.",
    image: require("@/assets/images/placeholder.png"),
    time: 90,
    difficulty: "Medium",
    category: "malagasy",
    ingredients: [
      "500g pounded cassava leaves (ravitoto)",
      "400g pork, cut into pieces",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "2 cloves garlic, minced",
      "Salt and pepper to taste",
    ],
    instructions: [
      "In a pot, sauté onions and garlic until fragrant.",
      "Add pork and brown on all sides.",
      "Add tomatoes and cook until softened.",
      "Add the pounded cassava leaves and mix well.",
      "Pour in water to cover and simmer for 60-75 minutes until the pork is tender.",
      "Season with salt and pepper to taste.",
      "Serve hot with rice.",
    ],
  },
  {
    id: "3",
    title: "Mofo Gasy",
    description:
      "Traditional Malagasy rice flour pancakes, often served for breakfast or as a snack.",
    image: require("@/assets/images/placeholder.png"),
    time: 30,
    difficulty: "Easy",
    category: "malagasy",
    ingredients: [
      "2 cups rice flour",
      "1 cup all-purpose flour",
      "1 cup sugar",
      "1 tsp active dry yeast",
      "2 cups warm water",
      "1/2 tsp vanilla extract",
      "Pinch of salt",
    ],
    instructions: [
      "In a large bowl, mix rice flour, all-purpose flour, sugar, and salt.",
      "Dissolve yeast in warm water and let it sit for 5 minutes.",
      "Add the yeast mixture and vanilla to the flour mixture and stir until smooth.",
      "Cover and let the batter rest for 1-2 hours until bubbly.",
      "Heat a greased pan or special mofo gasy mold over medium heat.",
      "Pour batter into the pan or mold and cook until bubbles form on top.",
      "Cover and cook until the top is set and the bottom is golden brown.",
      "Serve warm.",
    ],
  },
  {
    id: "4",
    title: "5-Minute Microwave Mac & Cheese",
    description:
      "A super quick and easy mac and cheese recipe perfect for busy students.",
    image: require("@/assets/images/placeholder.png"),
    time: 5,
    difficulty: "Easy",
    category: "student",
    ingredients: [
      "1/2 cup elbow macaroni",
      "1/2 cup water",
      "1/4 cup milk",
      "1/2 cup shredded cheddar cheese",
      "Salt and pepper to taste",
    ],
    instructions: [
      "In a microwave-safe mug, combine macaroni and water.",
      "Microwave on high for 2-3 minutes, stirring halfway through.",
      "Check if pasta is cooked; if not, microwave in 30-second intervals.",
      "Stir in milk and cheese.",
      "Microwave for another 30 seconds until cheese is melted.",
      "Season with salt and pepper and enjoy!",
    ],
  },
  {
    id: "5",
    title: "Quick Vegetable Stir Fry",
    description:
      "A healthy and quick vegetable stir fry that can be prepared in minutes.",
    image: require("@/assets/images/placeholder.png"),
    time: 15,
    difficulty: "Easy",
    category: "quick",
    ingredients: [
      "2 cups mixed vegetables (bell peppers, broccoli, carrots, snap peas)",
      "2 cloves garlic, minced",
      "1 tbsp soy sauce",
      "1 tbsp olive oil",
      "1 tsp sesame oil",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Heat olive oil in a pan over high heat.",
      "Add garlic and stir for 30 seconds.",
      "Add vegetables and stir fry for 3-4 minutes until crisp-tender.",
      "Add soy sauce and sesame oil, toss to combine.",
      "Season with salt and pepper to taste.",
      "Serve hot, optionally over rice or noodles.",
    ],
    isPremium: true,
  },
  {
    id: "6",
    title: "Ramen Noodle Upgrade",
    description:
      "Transform instant ramen into a delicious meal with simple additions.",
    image: require("@/assets/images/placeholder.png"),
    time: 10,
    difficulty: "Easy",
    category: "student",
    ingredients: [
      "1 package instant ramen noodles",
      "1 egg",
      "1 green onion, chopped",
      "1/2 cup spinach",
      "1 tbsp soy sauce",
      "Optional: leftover cooked chicken or tofu",
    ],
    instructions: [
      "Cook ramen noodles according to package instructions, but use only half of the seasoning packet.",
      "While the noodles cook, crack an egg into the simmering water.",
      "Add spinach and any protein you're using.",
      "Once the egg is cooked and noodles are done, transfer to a bowl.",
      "Top with green onions and a dash of soy sauce.",
      "Enjoy your upgraded ramen!",
    ],
  },
  {
    id: "7",
    title: "Chickpea Salad Sandwich",
    description:
      "A protein-packed vegetarian sandwich that's quick to prepare.",
    image: require("@/assets/images/placeholder.png"),
    time: 10,
    difficulty: "Easy",
    category: "vegetarian",
    ingredients: [
      "1 can chickpeas, drained and rinsed",
      "2 tbsp mayonnaise or Greek yogurt",
      "1 tbsp Dijon mustard",
      "1/4 cup diced celery",
      "2 tbsp diced red onion",
      "Salt and pepper to taste",
      "4 slices bread",
      "Lettuce and tomato for serving",
    ],
    instructions: [
      "In a bowl, mash chickpeas with a fork, leaving some chunks for texture.",
      "Add mayonnaise, mustard, celery, and red onion. Mix well.",
      "Season with salt and pepper to taste.",
      "Toast bread if desired.",
      "Spread chickpea mixture on bread and top with lettuce and tomato.",
      "Cut in half and enjoy!",
    ],
  },
  {
    id: "8",
    title: "15-Minute Pasta Aglio e Olio",
    description:
      "A classic Italian pasta dish with garlic and olive oil that's ready in minutes.",
    image: require("@/assets/images/placeholder.png"),
    time: 15,
    difficulty: "Easy",
    category: "quick",
    ingredients: [
      "200g spaghetti",
      "4 cloves garlic, thinly sliced",
      "1/4 cup olive oil",
      "1/4 tsp red pepper flakes",
      "2 tbsp chopped parsley",
      "Salt to taste",
      "Grated Parmesan cheese (optional)",
    ],
    instructions: [
      "Cook spaghetti in salted water according to package instructions.",
      "While pasta cooks, heat olive oil in a pan over medium heat.",
      "Add sliced garlic and red pepper flakes, cook until garlic is golden (not brown).",
      "Drain pasta, reserving 1/4 cup of pasta water.",
      "Add pasta to the pan with garlic oil, toss to coat.",
      "Add a splash of pasta water to create a light sauce.",
      "Stir in chopped parsley and serve with Parmesan if desired.",
    ],
    isPremium: true,
  },
]
