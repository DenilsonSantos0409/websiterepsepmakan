import { useState, useEffect } from 'react';
import { Recipe, RecipeFormData } from '@/types/recipe';

const STORAGE_KEY = 'recipes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load recipes from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem(STORAGE_KEY);
    if (savedRecipes) {
      try {
        const parsedRecipes = JSON.parse(savedRecipes).map((recipe: Recipe) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          updatedAt: new Date(recipe.updatedAt),
        }));
        setRecipes(parsedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    }
  }, []);

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipeData: RecipeFormData) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = (id: string, recipeData: RecipeFormData) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === id
          ? { ...recipe, ...recipeData, updatedAt: new Date() }
          : recipe
      )
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    recipes: filteredRecipes,
    searchTerm,
    setSearchTerm,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };
};