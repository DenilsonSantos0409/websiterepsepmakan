import { useState } from 'react';
import { Recipe, RecipeFormData } from '@/types/recipe';
import { useResep } from '@/hooks/useRecipes';
import { RecipeList } from '@/components/RecipeList';
import { RecipeForm } from '@/components/RecipeForm';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const {
    resep,
    searchTerm,
    setSearchTerm,
    addResep,
    updateResep,
    deleteResep,
  } = useResep();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();

  const handleAddResep = (recipeData: RecipeFormData) => {
    addResep(recipeData);
    closeForm();
    toast.success('Resep berhasil ditambahkan!');
  };

  const handleUpdateResep = (recipeData: RecipeFormData) => {
    if (editingRecipe) {
      updateResep(editingRecipe.id, recipeData);
      closeForm();
      toast.success('Resep berhasil diperbarui!');
    }
  };

  const handleFormSubmit = (recipeData: RecipeFormData) => {
    if (editingRecipe) handleUpdateResep(recipeData);
    else handleAddResep(recipeData);
  };

  const handleEditResep = (recipe: Recipe) => {
  const fixedRecipe: Recipe = {
    ...recipe,
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : (recipe.ingredients as any).split(',').map((i: string) => i.trim()),
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions
      : (recipe.instructions as any).split(',').map((i: string) => i.trim()),
  };

  setEditingRecipe(fixedRecipe);
  setIsFormOpen(true);
};


  const handleDeleteResep = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      deleteResep(id);
      toast.success('Resep berhasil dihapus!');
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-10 w-10 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Recipe Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Kelola koleksi resep makanan favorit Anda
          </p>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Resep
          </Button>
        </div>

        {/* Recipe Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 overflow-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={closeForm}
              >
                <X className="h-5 w-5" />
              </Button>
              <RecipeForm
                recipe={editingRecipe}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
              />
            </div>
          </div>
        )}

        {/* Statistics */}
        {resep.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{resep.length}</div>
                <div>Total Resep</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    resep.reduce((acc, recipe) => acc + recipe.cookingTime, 0) / resep.length
                  )}
                </div>
                <div>Rata-rata Waktu (menit)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(resep.map(recipe => recipe.category)).size}
                </div>
                <div>Kategori</div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe List */}
        <RecipeList
          resep={resep}
          onEdit={handleEditResep}
          onDelete={handleDeleteResep}
        />
      </div>
    </div>
  );
}
