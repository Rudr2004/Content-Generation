import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Search, Globe, Building, Eye, Calendar, Users } from "lucide-react";
import { IndustryPageForm } from './industry-page-form';
import type { IndustryPage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export function IndustryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<IndustryPage | null>(null);
  const [formPage, setFormPage] = useState<IndustryPage | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all industry pages
  const { data: pages = [], isLoading, error } = useQuery({
    queryKey: ['/api/industry-pages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/industry-pages');
      if (!response.ok) {
        throw new Error('Failed to fetch industry pages');
      }
      return response.json();
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/industry-pages/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete industry page');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-pages'] });
      toast({
        title: "Success",
        description: "Industry page deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete industry page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter pages based on search query with safe property access
  const filteredPages = pages.filter((page: IndustryPage) => {
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

  const handleView = (page: IndustryPage) => {
    setSelectedPage(page);
    setShowViewDialog(true);
  };

  const handleEdit = (page: IndustryPage) => {
    setFormPage(page);
    setShowEditDialog(true);
  };

  const handleCreate = () => {
    setFormPage(null);
    setShowCreateDialog(true);
  };

  const handleFormSuccess = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setFormPage(null);
    queryClient.invalidateQueries({ queryKey: ['/api/industry-pages'] });
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowViewDialog(false);
    setFormPage(null);
    setSelectedPage(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-500" data-testid={`badge-status-published`}>Published</Badge>;
      case 'draft':
        return <Badge variant="secondary" data-testid={`badge-status-draft`}>Draft</Badge>;
      default:
        return <Badge variant="outline" data-testid={`badge-status-unknown`}>{status}</Badge>;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error loading industry pages</div>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/industry-pages'] })}
              className="mt-4"
              data-testid="button-retry-loading"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" data-testid="text-industry-management-title">Industry Pages Management</h2>
          <p className="text-muted-foreground" data-testid="text-industry-management-description">
            Create and manage industry-specific landing pages with AI-powered content generation
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create-industry-page">
          <Plus className="h-4 w-4 mr-2" />
          Create Industry Page
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search industry pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            data-testid="input-search-industry-pages"
          />
        </div>
        <div className="text-sm text-muted-foreground" data-testid="text-pages-count">
          {filteredPages.length} of {pages.length} pages
        </div>
      </div>

      {/* Industry Pages Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredPages.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="text-no-pages-title">
                    {searchQuery ? 'No matching industry pages found' : 'No industry pages yet'}
                  </h3>
                  <p className="text-gray-500 mb-4" data-testid="text-no-pages-description">
                    {searchQuery 
                      ? `No industry pages match your search for "${searchQuery}"`
                      : 'Get started by creating your first industry page'
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreate} data-testid="button-create-first-industry-page">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Industry Page
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page: IndustryPage) => (
                <Card key={page.id} className="hover:shadow-md transition-shadow" data-testid={`card-industry-page-${page.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2" data-testid={`text-page-title-${page.id}`}>
                        {page.title}
                      </CardTitle>
                      <div className="flex items-center space-x-1 ml-2">
                        {getStatusBadge(page.status || 'draft')}
                        {page.featured && (
                          <Badge variant="outline" className="text-xs" data-testid={`badge-featured-${page.id}`}>
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2" data-testid={`text-page-slug-${page.id}`}>
                      /{page.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {page.heroHeadline && (
                        <div className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-hero-headline-${page.id}`}>
                          {page.heroHeadline}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1" data-testid={`text-created-date-${page.id}`}>
                          <Calendar className="h-3 w-3" />
                          <span>Created {formatDate(page.createdAt)}</span>
                        </div>
                        {page.status === 'published' && (
                          <div className="flex items-center space-x-1" data-testid={`text-published-date-${page.id}`}>
                            <Globe className="h-3 w-3" />
                            <span>Published {formatDate(page.publishedAt)}</span>
                          </div>
                        )}
                      </div>

                      {page.primaryKeyword && (
                        <div className="text-xs" data-testid={`text-primary-keyword-${page.id}`}>
                          <span className="font-medium">SEO:</span> {page.primaryKeyword}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(page)}
                            data-testid={`button-view-${page.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(page)}
                            data-testid={`button-edit-${page.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(page.id, page.title)}
                            className="text-red-500 hover:text-red-700"
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${page.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {page.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/industries/${page.slug}`, '_blank')}
                            data-testid={`button-preview-${page.id}`}
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-create-dialog-title">Create Industry Page</DialogTitle>
          </DialogHeader>
          <IndustryPageForm
            onSuccess={handleFormSuccess}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-edit-dialog-title">Edit Industry Page</DialogTitle>
          </DialogHeader>
          {formPage && (
            <IndustryPageForm
              page={formPage}
              onSuccess={handleFormSuccess}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-view-dialog-title">View Industry Page Details</DialogTitle>
          </DialogHeader>
          {selectedPage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {selectedPage.title}</div>
                    <div><strong>Slug:</strong> {selectedPage.slug}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedPage.status || 'draft')}</div>
                    <div><strong>Featured:</strong> {selectedPage.featured ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">SEO Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Meta Title:</strong> {selectedPage.metaTitle || 'Not set'}</div>
                    <div><strong>Primary Keyword:</strong> {selectedPage.primaryKeyword || 'Not set'}</div>
                    <div><strong>Secondary Keywords:</strong> {selectedPage.secondaryKeywords || 'Not set'}</div>
                  </div>
                </div>
              </div>

              {selectedPage.metaDescription && (
                <div>
                  <h3 className="font-medium mb-2">Meta Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedPage.metaDescription}</p>
                </div>
              )}

              {selectedPage.heroHeadline && (
                <div>
                  <h3 className="font-medium mb-2">Hero Section</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Headline:</strong> {selectedPage.heroHeadline}</div>
                    {selectedPage.heroSubheading && <div><strong>Subheading:</strong> {selectedPage.heroSubheading}</div>}
                    {selectedPage.heroCtaText && <div><strong>CTA Text:</strong> {selectedPage.heroCtaText}</div>}
                    {selectedPage.heroCtaLink && <div><strong>CTA Link:</strong> {selectedPage.heroCtaLink}</div>}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Section Visibility</h3>
                  <div className="space-y-1 text-sm">
                    <div>Overview: {selectedPage.showOverview ? '✅' : '❌'}</div>
                    <div>Industries Detail: {selectedPage.showIndustriesDetail ? '✅' : '❌'}</div>
                    <div>Technology Stack: {selectedPage.showTechnologyStack ? '✅' : '❌'}</div>
                    <div>Engagement Process: {selectedPage.showEngagementProcess ? '✅' : '❌'}</div>
                    <div>Value Propositions: {selectedPage.showUniqueValuePropositions ? '✅' : '❌'}</div>
                    <div>Testimonials: {selectedPage.showTestimonials ? '✅' : '❌'}</div>
                    <div>FAQs: {selectedPage.showFaqs ? '✅' : '❌'}</div>
                    <div>CTA: {selectedPage.showCta ? '✅' : '❌'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Timestamps</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Created:</strong> {formatDate(selectedPage.createdAt)}</div>
                    <div><strong>Updated:</strong> {formatDate(selectedPage.updatedAt)}</div>
                    {selectedPage.publishedAt && (
                      <div><strong>Published:</strong> {formatDate(selectedPage.publishedAt)}</div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPage.referenceContent && (
                <div>
                  <h3 className="font-medium mb-2">Reference Content</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                    {selectedPage.referenceContent}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(selectedPage)}
                  data-testid="button-edit-from-view"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Page
                </Button>
                {selectedPage.status === 'published' && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/industries/${selectedPage.slug}`, '_blank')}
                    data-testid="button-preview-from-view"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    View Live Page
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}