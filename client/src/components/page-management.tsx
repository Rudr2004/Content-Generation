import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  FileText
} from "lucide-react";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  status: string;
}

interface ServicePage {
  id: number;
  title: string;
  slug: string;
  subcategoryId: number;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subcategoryId: z.number().min(1, "Subcategory is required"),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  displayOrder: z.number().default(0)
});

type PageFormData = z.infer<typeof pageFormSchema>;

interface PageFormProps {
  page?: ServicePage;
  onSuccess: () => void;
  onCancel: () => void;
}

function PageForm({ page, onSuccess, onCancel }: PageFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: page?.title || "",
      subcategoryId: page?.subcategoryId || 0,
      content: page?.content || "",
      metaTitle: page?.metaTitle || "",
      metaDescription: page?.metaDescription || "",
      keywords: page?.keywords || "",
      status: page?.status as "active" | "inactive" || "active",
      displayOrder: page?.displayOrder || 0
    }
  });

  // Load categories and subcategories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const filteredSubcategories = selectedCategoryId 
    ? subcategories.filter(sub => sub.categoryId === selectedCategoryId)
    : subcategories;

  const createMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      const response = await fetch('/api/service-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-pages'] });
      toast({ title: "Page created successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to create page", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      const response = await fetch(`/api/service-pages/${page!.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-pages'] });
      toast({ title: "Page updated successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to update page", variant: "destructive" });
    }
  });

  const handleSubmit = async (data: PageFormData) => {
    if (page) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {page ? "Edit Page" : "Create New Page"}
        </h3>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter page title"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label>Category (for filtering)</Label>
            <Select onValueChange={(value) => setSelectedCategoryId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category to filter subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Subcategory</Label>
            <Select onValueChange={(value) => form.setValue("subcategoryId", parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.subcategoryId && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.subcategoryId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={(value) => form.setValue("status", value as "active" | "inactive")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...form.register("content")}
            placeholder="Enter page content"
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...form.register("metaTitle")}
              placeholder="SEO title"
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              {...form.register("keywords")}
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            {...form.register("metaDescription")}
            placeholder="SEO description"
            className="min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            type="number"
            {...form.register("displayOrder", { valueAsNumber: true })}
            placeholder="Display order"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function PageManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<ServicePage | undefined>();

  const { data: pages = [], isLoading } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages']
  });

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/service-pages/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete page');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-pages'] });
      toast({ title: "Page deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete page", variant: "destructive" });
    }
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (page: ServicePage) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPage(undefined);
  };

  const getSubcategoryName = (subcategoryId: number) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.name || 'Unknown';
  };

  const getCategoryName = (subcategoryId: number) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory) return 'Unknown';
    const category = categories.find(cat => cat.id === subcategory.categoryId);
    return category?.name || 'Unknown';
  };

  if (showForm) {
    return (
      <PageForm
        page={editingPage}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingPage(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Page Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading pages...</div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No pages found. Create your first page!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{page.title}</h3>
                      <Badge variant={page.status === 'active' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Category:</span> {getCategoryName(page.subcategoryId)} → 
                      <span className="font-medium"> Subcategory:</span> {getSubcategoryName(page.subcategoryId)}
                    </p>
                    {page.content && (
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {page.content.substring(0, 150)}...
                      </p>
                    )}
                    {page.keywords && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Keywords:</span> {page.keywords}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}