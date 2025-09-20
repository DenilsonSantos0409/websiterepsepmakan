export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number; // in minutes
  servings: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;