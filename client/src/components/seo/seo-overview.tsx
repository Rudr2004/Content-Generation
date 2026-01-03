import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Link, 
  Globe,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Save,
  X
} from "lucide-react";

interface SEOOverviewProps {
  onTabChange?: (tab: string) => void;
}

export function SEOOverview({ onTabChange }: SEOOverviewProps) {
  const [isTrackingPage, setIsTrackingPage] = useState(false);
  const [newPageData, setNewPageData] = useState({
    pageType: "",
    referenceId: 0,
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: overviewResponse, isLoading } = useQuery<{success: boolean, overview: any}>({
    queryKey: ["/api/seo/overview"],
  });

  const overview = overviewResponse?.overview;

  const trackPageMutation = useMutation({
    mutationFn: async (pageData: typeof newPageData) => {
      try {
        const response = await apiRequest("POST", "/api/seo/pages", pageData);
        return response.json();
      } catch (error: any) {
        console.error("Track page error:", error);
        
        // Handle authentication errors specifically
        if (error.message?.includes('Invalid or expired token') || error.message?.includes('403')) {
          throw new Error('Authentication required. Please log in with admin privileges to track pages.');
        }
        
        // Handle other API errors
        if (error.message?.includes('401')) {
          throw new Error('Please log in to access this feature.');
        }
        
        throw new Error(error.message || 'Failed to track page. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/pages"] });
      setIsTrackingPage(false);
      setNewPageData({ pageType: "", referenceId: 0, metaTitle: "", metaDescription: "", primaryKeyword: "" });
      toast({
        title: "Success",
        description: "Page tracking added successfully",
      });
    },
    onError: (error: any) => {
      console.error("Track page mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to track page",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, label: "Excellent" };
    if (score >= 60) return { variant: "secondary" as const, label: "Good" };
    return { variant: "destructive" as const, label: "Needs Work" };
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-pages">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-pages">
              {overview?.totalPages || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pages being tracked
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-keywords">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-keywords">
              {overview?.totalKeywords || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Keywords monitored
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-backlinks">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Backlinks</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-backlinks">
              {overview?.totalBacklinks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Quality backlinks
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-seo-score">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(overview?.averageSeoScore || 0)}`} data-testid="text-seo-score">
              {overview?.averageSeoScore || 0}/100
            </div>
            <Badge 
              variant={getScoreBadge(overview?.averageSeoScore || 0).variant}
              className="mt-2"
              data-testid="badge-seo-score"
            >
              {getScoreBadge(overview?.averageSeoScore || 0).label}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Pages and Recent Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-top-pages">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Pages</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTabChange?.("pages")}
              data-testid="button-view-all-pages"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview?.topPerformingPages?.length ? (
                overview.topPerformingPages.map((page: any, index: number) => (
                  <div key={page.id} className="flex items-center justify-between" data-testid={`item-top-page-${index}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {page.pageType} - {page.referenceId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {page.primaryKeyword || 'No primary keyword'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getScoreColor(page.seoScore)}`}>
                        {page.seoScore}/100
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Score
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-pages">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No page data available</p>
                  <p className="text-xs">Start tracking pages to see performance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-recent-analytics">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Analytics</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTabChange?.("analytics")}
              data-testid="button-view-all-analytics"
            >
              View All
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview?.recentAnalytics?.length ? (
                overview.recentAnalytics.slice(0, 5).map((analytics: any, index: number) => (
                  <div key={analytics.id} className="flex items-center justify-between" data-testid={`item-analytics-${index}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {analytics.pageTitle || analytics.pageUrl}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analytics.dateRecorded).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {analytics.clicks || 0} clicks
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {analytics.impressions || 0} views
                        {analytics.ctr ? (
                          <span className="flex items-center ml-2">
                            {analytics.ctr > 5 ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : analytics.ctr > 2 ? (
                              <Minus className="h-3 w-3 text-yellow-500" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                            )}
                            {analytics.ctr}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-analytics">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analytics data available</p>
                  <p className="text-xs">Analytics will appear as data is collected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => onTabChange?.("keywords")}
              data-testid="button-add-keyword"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsTrackingPage(true)}
              data-testid="button-add-page"
            >
              <Plus className="h-4 w-4 mr-2" />
              Track New Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onTabChange?.("backlinks")}
              data-testid="button-add-backlink"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Backlink
            </Button>
            <Button 
              variant="outline" 
              data-testid="button-view-sitemap"
              onClick={() => window.open("/sitemap.xml", "_blank")}
            >
              <Globe className="h-4 w-4 mr-2" />
              View Sitemap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Track New Page Form Modal */}
      {isTrackingPage && (
        <Card className="mt-6" data-testid="card-track-page">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Track New Page for SEO</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsTrackingPage(false)}
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
                  value={newPageData.referenceId || ""}
                  onChange={(e) => setNewPageData({ ...newPageData, referenceId: Number(e.target.value) || 0 })}
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
              <textarea 
                id="metaDescription"
                className="w-full mt-1 p-2 border rounded h-20" 
                value={newPageData.metaDescription}
                onChange={(e) => setNewPageData({ ...newPageData, metaDescription: e.target.value })}
                placeholder="Enter meta description for SEO"
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
                onClick={() => trackPageMutation.mutate(newPageData)}
                disabled={!newPageData.pageType || !newPageData.referenceId || trackPageMutation.isPending}
                data-testid="button-save-track-page"
              >
                <Save className="h-4 w-4 mr-2" />
                {trackPageMutation.isPending ? "Starting..." : "Start Tracking"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsTrackingPage(false)}
                data-testid="button-cancel-track-page"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}