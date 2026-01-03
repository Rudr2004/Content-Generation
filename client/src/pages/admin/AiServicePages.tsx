import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sparkles, 
  Globe, 
  FileText, 
  Settings,
  Search,
  Filter,
  Save,
  Loader2,
  Link as LinkIcon,
  Tag,
  Calendar,
  Users
} from "lucide-react";
import type { AiServicePage, ServiceCategory, ServiceSubcategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AiServicePageFormData {
  title: string;
  serviceName: string;
  referenceUrl: string;
  rawData: string;
  categoryId: number | null;
  subcategoryId: number | null;
  status: 'draft' | 'published';
}

export default function AiServicePages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<AiServicePage | null>(null);
  const [viewingPage, setViewingPage] = useState<AiServicePage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AiServicePageFormData>({
    title: "",
    serviceName: "",
    referenceUrl: "",
    rawData: "",
    categoryId: null,
    subcategoryId: null,
    status: 'draft'
  });

  // Fetch AI service pages
  const { data: pages = [], isLoading } = useQuery<AiServicePage[]>({
    queryKey: ["/api/ai-service-pages"],
  });

  // Fetch categories and subcategories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/service-categories"],
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ["/api/service-subcategories"],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: AiServicePageFormData) => 
      apiRequest("POST", "/api/ai-service-pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-service-pages"] });
      resetForm();
      toast({ title: "AI service page created successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating AI service page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AiServicePageFormData> }) =>
      apiRequest("PUT", `/api/ai-service-pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-service-pages"] });
      resetForm();
      toast({ title: "AI service page updated successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating AI service page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/ai-service-pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-service-pages"] });
      toast({ title: "AI service page deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting AI service page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: (data: { serviceName: string; referenceUrl?: string; rawData?: string }) =>
      apiRequest("POST", "/api/ai-service-pages/generate-content", data),
    onSuccess: (generatedContent: any) => {
      // Update form with generated content
      setFormData(prev => ({
        ...prev,
        ...generatedContent,
        // Keep the manually entered data
        serviceName: prev.serviceName,
        referenceUrl: prev.referenceUrl,
        rawData: prev.rawData,
      }));
      setIsGenerating(false);
      toast({ title: "Content generated successfully!" });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: "Error generating content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      serviceName: "",
      referenceUrl: "",
      rawData: "",
      categoryId: null,
      subcategoryId: null,
      status: 'draft'
    });
    setEditingPage(null);
    setShowForm(false);
  };

  const handleEdit = (page: AiServicePage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      serviceName: page.serviceName,
      referenceUrl: page.referenceUrl || "",
      rawData: page.rawData || "",
      categoryId: page.categoryId,
      subcategoryId: page.subcategoryId,
      status: page.status as 'draft' | 'published'
    });
    setShowForm(true);
  };

  const handleDelete = (page: AiServicePage) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleGenerateContent = () => {
    if (!formData.serviceName.trim()) {
      toast({
        title: "Service name required",
        description: "Please enter a service name before generating content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateContentMutation.mutate({
      serviceName: formData.serviceName,
      referenceUrl: formData.referenceUrl || undefined,
      rawData: formData.rawData || undefined,
    });
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = !searchTerm || 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedSubcategories = subcategories.filter(sub => 
    !formData.categoryId || sub.categoryId === formData.categoryId
  );

  if (viewingPage) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{viewingPage.title}</h2>
            <p className="text-gray-600">AI Service Page Details</p>
          </div>
          <Button onClick={() => setViewingPage(null)} variant="outline">
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Page Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Service Name</Label>
                <p className="text-gray-900">{viewingPage.serviceName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <Badge variant={viewingPage.status === 'published' ? 'default' : 'secondary'}>
                  {viewingPage.status}
                </Badge>
              </div>
              {viewingPage.referenceUrl && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Reference URL</Label>
                  <a 
                    href={viewingPage.referenceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {viewingPage.referenceUrl}
                  </a>
                </div>
              )}
              {viewingPage.rawData && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Raw Data</Label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingPage.rawData}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingPage ? "Edit AI Service Page" : "Create AI Service Page"}
            </h2>
            <p className="text-gray-600">
              {editingPage ? "Update the AI service page details" : "Create a new AI-powered service page"}
            </p>
          </div>
          <Button onClick={resetForm} variant="outline">
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceName">Service Name *</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                    placeholder="e.g., Blockchain Development"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Will be auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="referenceUrl">Reference URL (Optional)</Label>
                <Input
                  id="referenceUrl"
                  type="url"
                  value={formData.referenceUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, referenceUrl: e.target.value }))}
                  placeholder="https://example.com/reference-page"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a reference URL for AI to scrape and analyze for better content generation
                </p>
              </div>

              <div>
                <Label htmlFor="rawData">Additional Notes/Data (Optional)</Label>
                <Textarea
                  id="rawData"
                  value={formData.rawData}
                  onChange={(e) => setFormData(prev => ({ ...prev, rawData: e.target.value }))}
                  placeholder="Any specific details, features, or requirements for this service..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    value={formData.categoryId?.toString() || ""} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      categoryId: value ? parseInt(value) : null,
                      subcategoryId: null // Reset subcategory when category changes
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategoryId">Subcategory</Label>
                  <Select 
                    value={formData.subcategoryId?.toString() || ""} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      subcategoryId: value ? parseInt(value) : null 
                    }))}
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSubcategories.map(subcategory => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGenerating || !formData.serviceName.trim()}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingPage ? "Update" : "Create"} Page
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Service Pages</h2>
          <p className="text-gray-600">Manage AI-generated service pages with comprehensive content</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create AI Page
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or service name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading AI service pages...</span>
          </CardContent>
        </Card>
      ) : filteredPages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI service pages found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first AI-generated service page."
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First AI Page
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">Service: {page.serviceName}</p>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      {page.referenceUrl && (
                        <span className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          Has reference URL
                        </span>
                      )}
                      {page.primaryKeyword && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          SEO optimized
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingPage(page)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(page)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
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