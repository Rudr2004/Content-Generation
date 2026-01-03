import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Eye, FileText, Settings, Users, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { HireDeveloperPageFormSimple } from './hire-developer-page-form-simple';
import { HireDeveloperPageView } from './hire-developer-page-view';
import { HireDeveloperGuidelineModal } from './HireDeveloperGuidelineModal';
import type { HirePage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function HireDeveloperManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<HirePage | null>(null);
  const [formPage, setFormPage] = useState<HirePage | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all hire developer pages
  const { data: pages = [], isLoading, error } = useQuery({
    queryKey: ['/api/hire-developer-pages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/hire-developer-pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      return response.json();
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/hire-developer-pages/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete page');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter pages based on search query with safe property access
  const filteredPages = pages.filter((page: HirePage) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      page.title?.toLowerCase().includes(searchLower) ||
      page.slug?.toLowerCase().includes(searchLower) ||
      (page.metaTitle && page.metaTitle.toLowerCase().includes(searchLower)) ||
      (page.metaKeywords && page.metaKeywords.toLowerCase().includes(searchLower))
    );
  });

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (page: HirePage) => {
    setSelectedPage(page);
    setShowViewDialog(true);
  };

  const handleEdit = (page: HirePage) => {
    setFormPage(page);
    setShowEditDialog(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] });
    toast({
      title: "Success",
      description: "Page created successfully.",
    });
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setFormPage(null);
    queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] });
    toast({
      title: "Success",
      description: "Page updated successfully.",
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Archived</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status || 'Unknown'}</Badge>;
    }
  };

  const publishedCount = pages.filter((p: HirePage) => p.status === 'published').length;
  const draftCount = pages.filter((p: HirePage) => p.status === 'draft').length;
  const featuredCount = pages.filter((p: HirePage) => p.featured === true).length;

  // Handle loading and error states
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Pages</h3>
              <p className="text-gray-500 mb-4">
                There was an error loading the hire developer pages. Please try again.
              </p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] })}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hire Developer Pages</h1>
          <p className="text-gray-600">Create professional hire developer pages following the comprehensive 10-section CMS template structure</p>
        </div>
        <div className="flex gap-3">
          <HireDeveloperGuidelineModal />
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Hire Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Create New Hire Developer Page
                </DialogTitle>
                <DialogDescription>
                  Generate professional hire developer pages with AI-powered content following the comprehensive 10-section CMS template structure. All pages maintain consistency while allowing for technology-specific customization.
                </DialogDescription>
              </DialogHeader>
              <HireDeveloperPageFormSimple
                onSuccess={handleCreateSuccess}
                onClose={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search pages by title, slug, meta title, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Hire Developer Pages ({filteredPages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'No pages match your search criteria.' : 'Get started by creating your first hire developer page.'}
              </p>
              {!searchQuery && (
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Page
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page: HirePage) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{page.title || 'Untitled'}</h3>
                      {getStatusBadge(page.status)}
                      {page.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">/{page.slug || 'no-slug'}</p>
                    {page.metaTitle && (
                      <p className="text-sm text-gray-500 line-clamp-1">{page.metaTitle}</p>
                    )}
                    {page.metaKeywords && (
                      <p className="text-xs text-gray-400 mt-1">Keywords: {page.metaKeywords}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {page.createdAt && (
                        <span>Created: {new Date(page.createdAt).toLocaleDateString()}</span>
                      )}
                      {page.updatedAt && (
                        <span>Updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(page)}
                      title="View page"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                      title="Edit page"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id, page.title || 'this page')}
                      disabled={deleteMutation.isPending}
                      title="Delete page"
                      className="hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Hire Developer Page</DialogTitle>
            <DialogDescription>
              Preview and review the hire developer page content
            </DialogDescription>
          </DialogHeader>
          {selectedPage && (
            <HireDeveloperPageView
              page={selectedPage}
              onEdit={() => {
                setShowViewDialog(false);
                handleEdit(selectedPage);
              }}

            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hire Developer Page</DialogTitle>
            <DialogDescription>
              Update the hire developer page content and settings
            </DialogDescription>
          </DialogHeader>
          {formPage && (
            <HireDeveloperPageFormSimple
              page={formPage}
              onSuccess={handleEditSuccess}
              onClose={() => {
                setShowEditDialog(false);
                setFormPage(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}