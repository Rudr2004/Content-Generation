import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Globe, Edit, Plus, Trash2, Save, X } from "lucide-react";

interface SEOPageData {
  id: number;
  pageType: string;
  referenceId: number;
  metaTitle: string | null;
  metaDescription: string | null;
  primaryKeyword: string | null;
  seoScore: number | null;
  canonicalUrl: string | null;
  lastOptimized: string | null;
}

export function SEOPageData() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPageData, setNewPageData] = useState({
    pageType: "",
    referenceId: "",
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pagesResponse, isLoading } = useQuery<{success: boolean, pages: SEOPageData[]}>({
    queryKey: ["/api/seo/pages"],
  });

  const pages = pagesResponse?.pages || [];

  const createPageMutation = useMutation({
    mutationFn: async (pageData: typeof newPageData) => {
      const response = await apiRequest("POST", "/api/seo/pages", {
        ...pageData,
        referenceId: Number(pageData.referenceId)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/pages"] });
      setIsCreating(false);
      setNewPageData({ pageType: "", referenceId: "", metaTitle: "", metaDescription: "", primaryKeyword: "" });
      toast({
        title: "Success",
        description: "Page tracking started successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start page tracking",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return { variant: "outline" as const, label: "No Score" };
    if (score >= 80) return { variant: "default" as const, label: "Excellent" };
    if (score >= 60) return { variant: "secondary" as const, label: "Good" };
    return { variant: "destructive" as const, label: "Needs Work" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">SEO Page Data</h3>
          <p className="text-sm text-muted-foreground">
            Manage SEO optimization for individual pages
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-track-new-page">
          <Plus className="h-4 w-4 mr-2" />
          Track New Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Pages Tracked</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking pages to monitor their SEO performance
            </p>
            <Button onClick={() => setIsCreating(true)} data-testid="button-add-first-page">
              <Plus className="h-4 w-4 mr-2" />
              Add First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{page.pageType}</Badge>
                      <Badge variant="outline">ID: {page.referenceId}</Badge>
                      <Badge {...getScoreBadge(page.seoScore)}>
                        {getScoreBadge(page.seoScore).label}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium mb-2">
                      {page.metaTitle || `${page.pageType} Page ${page.referenceId}`}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {page.metaDescription || "No meta description set"}
                    </p>
                    
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="font-medium">Primary Keyword:</span>{" "}
                        {page.primaryKeyword || "Not set"}
                      </div>
                      <div className={getScoreColor(page.seoScore)}>
                        <span className="font-medium">SEO Score:</span>{" "}
                        {page.seoScore ? `${page.seoScore}/100` : "Not scored"}
                      </div>
                      {page.canonicalUrl && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Canonical URL:</span>{" "}
                          <span className="text-blue-600">{page.canonicalUrl}</span>
                        </div>
                      )}
                    </div>
                    
                    {page.lastOptimized && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last optimized: {new Date(page.lastOptimized).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create New Page Form */}
      {isCreating && (
        <Card data-testid="card-track-new-page">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Track New Page for SEO</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsCreating(false);
                  setNewPageData({ pageType: "", referenceId: "", metaTitle: "", metaDescription: "", primaryKeyword: "" });
                }}
                data-testid="button-close-track-page"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="pageType">Page Type</Label>
                <Select
                  value={newPageData.pageType}
                  onValueChange={(value) => setNewPageData({ ...newPageData, pageType: value })}
                >
                  <SelectTrigger data-testid="select-page-type">
                    <SelectValue placeholder="Select page type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="hire">Hire Developer</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="referenceId">Reference ID</Label>
                <Input
                  id="referenceId"
                  type="number"
                  value={newPageData.referenceId}
                  onChange={(e) => setNewPageData({ ...newPageData, referenceId: e.target.value })}
                  placeholder="Enter page ID"
                  data-testid="input-reference-id"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={newPageData.metaTitle}
                onChange={(e) => setNewPageData({ ...newPageData, metaTitle: e.target.value })}
                placeholder="Enter SEO title for this page"
                data-testid="input-meta-title"
              />
            </div>
            
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={newPageData.metaDescription}
                onChange={(e) => setNewPageData({ ...newPageData, metaDescription: e.target.value })}
                placeholder="Enter meta description for SEO"
                className="h-20"
                data-testid="textarea-meta-description"
              />
            </div>
            
            <div>
              <Label htmlFor="primaryKeyword">Primary Keyword</Label>
              <Input
                id="primaryKeyword"
                value={newPageData.primaryKeyword}
                onChange={(e) => setNewPageData({ ...newPageData, primaryKeyword: e.target.value })}
                placeholder="Enter primary keyword"
                data-testid="input-primary-keyword"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewPageData({ pageType: "", referenceId: "", metaTitle: "", metaDescription: "", primaryKeyword: "" });
                }}
                data-testid="button-cancel-track-page"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => createPageMutation.mutate(newPageData)}
                disabled={!newPageData.pageType || !newPageData.referenceId || createPageMutation.isPending}
                data-testid="button-save-track-page"
              >
                <Save className="h-4 w-4 mr-2" />
                {createPageMutation.isPending ? "Starting..." : "Start Tracking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}