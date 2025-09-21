import { useState, useEffect } from "react";
import { Recipe, RecipeFormData } from "@/types/recipe";

const API_URL = "http://localhost:5001/api/resep";

export const useResep = () => {
  const [resep, setResep] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const transformed = data.map((r: any) => ({
            ...r,
            ingredients: typeof r.ingredients === "string" 
              ? r.ingredients.split(",").map((i: string) => i.trim()) 
              : r.ingredients,
            instructions: typeof r.instructions === "string"
              ? r.instructions.split(",").map((i: string) => i.trim())
              : r.instructions
          }));
          setResep(transformed);
        } else setResep([]);
      })
      .catch(err => setResep([]));
  }, []);

  const addResep = async (data: RecipeFormData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        ingredients: data.ingredients.join(", "),
        instructions: data.instructions.join(", ")
      }),
    });
    const newResep = await res.json();
    setResep(prev => [...prev, {
      ...newResep,
      ingredients: data.ingredients,
      instructions: data.instructions
    }]);
  };

  const updateResep = async (id: string, data: RecipeFormData) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        ingredients: data.ingredients.join(", "),
        instructions: data.instructions.join(", ")
      }),
    });
    setResep(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteResep = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setResep(prev => prev.filter(r => r.id !== id));
  };

  const getResepById = (id: string) => resep.find(r => r.id === id);

  const filteredResep = resep.filter(
    r =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { resep: filteredResep, searchTerm, setSearchTerm, addResep, updateResep, deleteResep, getResepById };
};
