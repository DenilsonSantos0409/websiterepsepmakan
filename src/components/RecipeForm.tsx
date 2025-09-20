import { useState, useEffect } from 'react';
import { Recipe, RecipeFormData } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
}

const categories = [
  'Makanan Utama',
  'Makanan Pembuka',
  'Makanan Penutup',
  'Minuman',
  'Camilan',
  'Sup',
  'Salad',
  'Lainnya'
];

export const RecipeForm = ({ recipe, onSubmit, onCancel }: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: 30,
    servings: 4,
    category: 'Makanan Utama',
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        category: recipe.category,
      });
    }
  }, [recipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(item => item.trim() !== ''),
      instructions: formData.instructions.filter(item => item.trim() !== ''),
    };

    if (cleanedData.ingredients.length === 0 || cleanedData.instructions.length === 0) {
      alert('Mohon isi minimal satu bahan dan satu langkah memasak');
      return;
    }

    onSubmit(cleanedData);
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => i === index ? value : item)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{recipe ? 'Edit Resep' : 'Tambah Resep Baru'}</CardTitle>
        <CardDescription>
          {recipe ? 'Ubah informasi resep' : 'Masukkan detail resep makanan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Resep *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Nasi Goreng Spesial"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat tentang resep ini..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Waktu Memasak (menit)</Label>
              <Input
                id="cookingTime"
                type="number"
                min="1"
                value={formData.cookingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Jumlah Porsi</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 4 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Bahan-bahan *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah Bahan
              </Button>
            </div>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="Contoh: 2 cup beras"
                    className="flex-1"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Langkah Memasak *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah Langkah
              </Button>
            </div>
            <div className="space-y-2">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Jelaskan langkah memasak..."
                    rows={2}
                    className="flex-1"
                  />
                  {formData.instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="mt-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {recipe ? 'Update Resep' : 'Simpan Resep'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};