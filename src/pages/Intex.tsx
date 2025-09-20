import { useState } from 'react';
import { Recipe, RecipeFormData } from '@/types/recipe';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeList } from '@/components/RecipeList';
import { RecipeForm } from '@/components/RecipeForm';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  
  const {
    recipes,
    searchTerm,
    setSearchTerm,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();

  const handleAddRecipe = (recipeData: RecipeFormData) => {
    addRecipe(recipeData);
    setIsFormOpen(false);
    toast.success('Resep berhasil ditambahkan!');
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleUpdateRecipe = (recipeData: RecipeFormData) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipeData);
      setIsFormOpen(false);
      setEditingRecipe(undefined);
      toast.success('Resep berhasil diperbarui!');
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      deleteRecipe(id);
      toast.success('Resep berhasil dihapus!');
    }
  };

  const handleFormCancel = () => {
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

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Resep
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <RecipeForm
                recipe={editingRecipe}
                onSubmit={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Recipe Statistics */}
        {recipes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{recipes.length}</div>
                <div>Total Resep</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(recipes.reduce((acc, recipe) => acc + recipe.cookingTime, 0) / recipes.length)}
                </div>
                <div>Rata-rata Waktu (menit)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(recipes.map(recipe => recipe.category)).size}
                </div>
                <div>Kategori</div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe List */}
        <RecipeList
          recipes={recipes}
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
        />
      </div>
    </div>
  );
}