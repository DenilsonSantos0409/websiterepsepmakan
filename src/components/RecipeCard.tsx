import  type{ Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Edit, Trash2 } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{recipe.title}</CardTitle>
            <CardDescription className="mt-2">{recipe.description}</CardDescription>
          </div>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime} menit</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} porsi</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Bahan-bahan:</h4>
            <ul className="text-sm space-y-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <li key={index} className="text-gray-600">• {ingredient}</li>
              ))}
              {recipe.ingredients.length > 3 && (
                <li className="text-gray-500 italic">...dan {recipe.ingredients.length - 3} bahan lainnya</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(recipe)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(recipe.id)}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Hapus
        </Button>
      </CardFooter>
    </Card>
  );
};