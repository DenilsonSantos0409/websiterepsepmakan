import { Recipe } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeList = ({ recipes, onEdit, onDelete }: RecipeListProps) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Belum ada resep</div>
        <div className="text-gray-400">Tambahkan resep pertama Anda!</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};