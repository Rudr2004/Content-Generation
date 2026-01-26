import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Wand2, Eye, FileText, Users, BarChart3, Settings } from "lucide-react";
import type { CaseStudyPage, IndividualCaseStudy, CaseStudyTestimonial, CaseStudyCategory, InsertCaseStudyCategory } from "@shared/schema";
import { motion } from "framer-motion";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveRegion } from "@/lib/region-resolver";

interface CaseStudyFormData {
  title: string;
  category: string;
  referenceContent: string;
  generatedContent: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  region?: string;
  status: string;
}

export function CaseStudyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings } = useSiteSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<CaseStudyPage | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: "",
    category: "",
    referenceContent: "",
    generatedContent: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    region: "",
    status: "draft",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch case study pages
  const { data: caseStudyPages = [], isLoading } = useQuery({
    queryKey: ["/api/case-study-pages"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/case-study-pages");
      return response.json();
    }
  });

  // Fetch case study categories
  const { data: categories = [] } = useQuery<CaseStudyCategory[]>({
    queryKey: ["/api/case-study-categories"],
    queryFn: async () => {
      const response = await fetch("/api/case-study-categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    }
  });

  // Create case study page mutation
  const createMutation = useMutation({
    mutationFn: async (data: CaseStudyFormData) => {
      // Map generatedContent to problemStatement for database
      const apiData = {
        ...data,
        problemStatement: data.generatedContent,
        generatedContent: undefined // Remove from API payload
      };
      const response = await apiRequest("POST", "/api/case-study-pages", apiData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Case study page created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/case-study-pages"] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create case study page",
        variant: "destructive" 
      });
    }
  });

  // Update case study page mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CaseStudyFormData> }) => {
      // Map generatedContent to problemStatement for database
      const apiData = {
        ...data,
        problemStatement: data.generatedContent,
        generatedContent: undefined // Remove from API payload
      };
      const response = await apiRequest("PUT", `/api/case-study-pages/${id}`, apiData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Case study page updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/case-study-pages"] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update case study page",
        variant: "destructive" 
      });
    }
  });

  // Delete case study page mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/case-study-pages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Case study page deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/case-study-pages"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete case study page",
        variant: "destructive" 
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      referenceContent: "",
      generatedContent: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      region: "",
      status: "draft",
    });
    setSelectedPage(null);
  };

  const handleGenerateContent = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in Page Name and Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-case-study-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          referenceContent: formData.referenceContent || "",
          region: formData.region || resolveRegion(null, settings?.targetRegions)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.content) {
        // Update the form with generated content - use the formatted JSON content
        const contentToUse = data.content.formatted || JSON.stringify(data.content.json, null, 2) || data.content;
        setFormData(prev => ({
          ...prev,
          generatedContent: contentToUse,
          metaTitle: data.metaTitle || prev.metaTitle,
          metaDescription: data.metaDescription || prev.metaDescription,
          metaKeywords: data.metaKeywords || prev.metaKeywords
        }));

        toast({
          title: "Content Generated!",
          description: "AI has generated case study content based on your inputs.",
        });
      } else {
        throw new Error("No content generated");
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate case study content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPage) {
      updateMutation.mutate({ id: selectedPage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (page: CaseStudyPage) => {
    setSelectedPage(page);
    setFormData({
      title: page.title || "",
      category: page.category || "",
      referenceContent: page.referenceContent || "",
      generatedContent: page.problemStatement || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      metaKeywords: page.metaKeywords || "",
      region: (page as any).region || "",
      status: page.status || "draft",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this case study page?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPages = caseStudyPages.filter((page: CaseStudyPage) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parseCaseStudies = (caseStudiesJson: string): IndividualCaseStudy[] => {
    try {
      return JSON.parse(caseStudiesJson || "[]");
    } catch {
      return [];
    }
  };

  const parseTestimonials = (testimonialsJson: string): CaseStudyTestimonial[] => {
    try {
      return JSON.parse(testimonialsJson || "[]");
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Category Management Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Study Management</h1>
          <p className="text-gray-600 mt-1">Create and manage case study pages with AI-powered content generation</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCategoryManager(true)}
            variant="outline"
            className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          >
            <Settings className="w-4 h-4" />
            Manage Categories
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Case Study Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedPage ? "Edit Case Study Page" : "Create New Case Study Page"}</DialogTitle>
                <DialogDescription>
                  Create comprehensive case study pages following content structure guidelines
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Case Study Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Case Study Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Name *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter case study page name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referenceContent">Reference Content</Label>
                    <RichTextEditor
                      value={formData.referenceContent}
                      onChange={(value) => setFormData(prev => ({ ...prev, referenceContent: value }))}
                      placeholder="Paste reference content here that AI should use to generate the case study..."
                      rows={8}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-gray-600">
                      Provide any reference materials, existing content, or specific details that should guide the AI content generation.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !formData.category || !formData.title}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate Complete Case Study"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generatedContent">Generated Content</Label>
                    <RichTextEditor
                      value={formData.generatedContent}
                      onChange={(value) => setFormData(prev => ({ ...prev, generatedContent: value }))}
                      placeholder="AI-generated case study content will appear here..."
                      rows={12}
                      className="min-h-[300px]"
                    />
                    <p className="text-sm text-gray-600">
                      This field will be populated with AI-generated content based on your reference material and selected category.
                    </p>
                  </div>
                </div>

                {/* SEO Settings Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
                  
                  <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Label htmlFor="region" className="flex items-center gap-2">
                      <span>🌍 Target Regions</span>
                      {settings?.targetRegions && !formData.region && (
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                          Using Global: {settings.targetRegions}
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="region"
                      value={formData.region || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder={settings?.targetRegions || "USA, Canada, UK, Germany"}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.region ? (
                        <>Page-specific region set. Keywords will target: <strong>{formData.region}</strong></>
                      ) : settings?.targetRegions ? (
                        <>Using global default: <strong>{settings.targetRegions}</strong>. Leave empty to use global, or set a page-specific region.</>
                      ) : (
                        <>Comma-separated list of target regions. If not set, will use global default from Site Settings.</>
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="SEO meta title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="SEO meta description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : selectedPage ? "Update Case Study" : "Create Case Study"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search case study pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold">{caseStudyPages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">
                  {caseStudyPages.filter((p: CaseStudyPage) => p.status === "published").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold">
                  {caseStudyPages.filter((p: CaseStudyPage) => p.status === "draft").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Study Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Case Study Pages</CardTitle>
          <CardDescription>Manage your case study pages and content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading case study pages...</div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No case study pages found matching your search." : "No case study pages found. Create your first case study page!"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page: CaseStudyPage) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <Badge className={getStatusColor(page.status)}>
                          {page.status}
                        </Badge>
                        {page.category && (
                          <Badge variant="outline">{page.category}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(page.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Manager Dialog */}
      <CaseStudyCategoryManager 
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/case-study-categories"] })}
      />
    </div>
  );
}

// Category Manager Component
interface CaseStudyCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CaseStudyCategory[];
  onRefresh: () => void;
}

function CaseStudyCategoryManager({ isOpen, onClose, categories, onRefresh }: CaseStudyCategoryManagerProps) {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<CaseStudyCategory | null>(null);
  
  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/case-study-categories", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category created successfully!" });
      setNewCategory("");
      setNewDescription("");
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create category", variant: "destructive" });
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCaseStudyCategory> }) => {
      const response = await apiRequest("PUT", `/api/case-study-categories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category updated successfully!" });
      setEditingCategory(null);
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update category", variant: "destructive" });
    }
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/case-study-categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category deleted successfully!" });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete category", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    createMutation.mutate({
      name: newCategory.trim(),
      description: newDescription.trim() || undefined
    });
  };

  const handleUpdate = (category: CaseStudyCategory) => {
    updateMutation.mutate({
      id: category.id,
      data: {
        name: category.name,
        description: category.description
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Case Study Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or remove case study categories for better organization
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., AI & Machine Learning"
                required
              />
            </div>
            <div>
              <Label htmlFor="categoryDescription">Description (Optional)</Label>
              <Input
                id="categoryDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || !newCategory.trim()}
            className="w-full"
          >
            {createMutation.isPending ? "Creating..." : "Add Category"}
          </Button>
        </form>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-700">Existing Categories ({categories.length})</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No categories found. Create your first category above!</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingCategory?.id === category.id ? (
                    <div className="flex-1 space-y-2 mr-4">
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="text-sm"
                      />
                      <Input
                        value={editingCategory.description || ""}
                        onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                        placeholder="Description..."
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(editingCategory)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-600">{category.description}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {editingCategory?.id !== category.id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}