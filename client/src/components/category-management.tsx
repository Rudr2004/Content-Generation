import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, FolderPlus } from "lucide-react";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  displayOrder: number;
  status: string;
}

interface SubcategoryFormData {
  name: string;
  description: string;
  categoryId: number;
  displayOrder: number;
  status: string;
}

function CategoryForm({ category, onSuccess, onCancel }: {
  category?: ServiceCategory;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
    displayOrder: category?.displayOrder || 0,
    status: category?.status || "active"
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name first",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      // For now, create a simple description based on category name
      const description = `Professional ${formData.name.toLowerCase()} services and solutions for modern businesses. Our expert team delivers innovative ${formData.name.toLowerCase()} solutions that drive business growth and digital transformation.`;
      setFormData(prev => ({ ...prev, description }));
      toast({
        title: "Success",
        description: "Description generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (category) {
        const response = await fetch(`/api/service-categories/${category.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update category');
        toast({ title: "Category updated successfully" });
      } else {
        const response = await fetch('/api/service-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create category');
        toast({ title: "Category created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/service-categories'] });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Edit Category' : 'Add Category'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., AI & Machine Learning"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isGeneratingDescription || !formData.name.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {category ? 'Update Category' : 'Create Category'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SubcategoryForm({ subcategory, categories, onSuccess, onCancel }: {
  subcategory?: ServiceSubcategory;
  categories: ServiceCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: subcategory?.name || "",
    description: subcategory?.description || "",
    categoryId: subcategory?.categoryId || (categories[0]?.id || 0),
    displayOrder: subcategory?.displayOrder || 0,
    status: subcategory?.status || "active"
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const generateSubcategoryDescription = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subcategory name first",
        variant: "destructive"
      });
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = `Specialized ${formData.name.toLowerCase()} services under ${selectedCategory.name.toLowerCase()}. Our expert team provides comprehensive ${formData.name.toLowerCase()} solutions that deliver measurable business results and drive innovation.`;
      setFormData(prev => ({ ...prev, description }));
      toast({
        title: "Success",
        description: "Description generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (subcategory) {
        const response = await fetch(`/api/service-subcategories/${subcategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update subcategory');
        toast({ title: "Subcategory updated successfully" });
      } else {
        const response = await fetch('/api/service-subcategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create subcategory');
        toast({ title: "Subcategory created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/service-subcategories'] });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save subcategory",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subcategory ? 'Edit Subcategory' : 'Add Subcategory'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryId">Parent Category</Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Subcategory Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Custom AI Development"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSubcategoryDescription}
                disabled={isGeneratingDescription || !formData.name.trim() || !formData.categoryId}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this subcategory"
              className="mt-2"
            />
          </div>



          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {subcategory ? 'Update Subcategory' : 'Create Subcategory'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CategoryManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | undefined>();
  const [editingSubcategory, setEditingSubcategory] = useState<ServiceSubcategory | undefined>();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all subcategories under it.')) {
      return;
    }

    try {
      const response = await fetch(`/api/service-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete category');
      queryClient.invalidateQueries({ queryKey: ['/api/service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/service-subcategories'] });
      toast({ title: "Category deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/service-subcategories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      queryClient.invalidateQueries({ queryKey: ['/api/service-subcategories'] });
      toast({ title: "Subcategory deleted successfully" });
    } catch (error: any) {
      console.error('Delete subcategory error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete subcategory",
        variant: "destructive"
      });
    }
  };

  if (showCategoryForm) {
    return (
      <CategoryForm
        category={editingCategory}
        onSuccess={() => {
          setShowCategoryForm(false);
          setEditingCategory(undefined);
        }}
        onCancel={() => {
          setShowCategoryForm(false);
          setEditingCategory(undefined);
        }}
      />
    );
  }

  if (showSubcategoryForm) {
    return (
      <SubcategoryForm
        subcategory={editingSubcategory}
        categories={categories}
        onSuccess={() => {
          setShowSubcategoryForm(false);
          setEditingSubcategory(undefined);
        }}
        onCancel={() => {
          setShowSubcategoryForm(false);
          setEditingSubcategory(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowCategoryForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button variant="outline" onClick={() => setShowSubcategoryForm(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div>Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No categories yet. Create your first category to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${category.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                          }`}>
                          {category.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Order: {category.displayOrder}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subcategories */}
        <Card>
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            {subcategoriesLoading ? (
              <div>Loading subcategories...</div>
            ) : subcategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subcategories yet. Add subcategories to organize your services better.
              </div>
            ) : (
              <div className="space-y-2">
                {subcategories.map((subcategory) => {
                  const parentCategory = categories.find(c => c.id === subcategory.categoryId);
                  return (
                    <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{subcategory.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Parent: {parentCategory?.name || 'Unknown'}
                        </p>
                        {subcategory.description && (
                          <p className="text-sm text-muted-foreground mt-1">{subcategory.description}</p>
                        )}
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded ${subcategory.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {subcategory.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            Order: {subcategory.displayOrder}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingSubcategory(subcategory);
                            setShowSubcategoryForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}