import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ToggleLeft,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Filter,
  X
} from "lucide-react";

interface PageIndexingStatus {
  id: number;
  pageUrl: string;
  pageTitle: string | null;
  pageType: string;
  referenceId: number | null;
  isIndexable: boolean;
  metaRobotsTag: string;
  customSettings: string | null;
  lastUpdated: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SitePage {
  id: string;
  pageUrl: string;
  pageTitle: string;
  pageType: string;
  referenceId: number;
  isIndexable: boolean;
  currentStatus?: PageIndexingStatus;
}

export function PageIndexingManager() {
  const [allSitePages, setAllSitePages] = useState<SitePage[]>([]);
  const [selectedPageType, setSelectedPageType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [indexingFilter, setIndexingFilter] = useState<string>("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing indexing statuses
  const { data: statusesResponse } = useQuery<{success: boolean, statuses: PageIndexingStatus[]}>({
    queryKey: ["/api/seo/page-indexing"],
  });

  // Fetch all site pages for indexing
  const { data: servicesData } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: blogData } = useQuery({
    queryKey: ["/api/blog/public"],
  });

  const { data: hireData } = useQuery({
    queryKey: ["/api/hire-developer-pages/published"],
  });

  const statuses = statusesResponse?.statuses || [];

  // Combine all pages and add indexing status
  useEffect(() => {
    const allPages: SitePage[] = [];
    
    // Add services - handle different API response shapes
    const services = Array.isArray(servicesData) ? servicesData : servicesData?.services || servicesData?.data || [];
    if (services.length > 0) {
      services.forEach((service: any) => {
        const pageUrl = `/services/${service.slug || service.id}`;
        const currentStatus = statuses.find(s => s.pageUrl === pageUrl);
        allPages.push({
          id: `service-${service.id}`,
          pageUrl,
          pageTitle: service.title,
          pageType: "service",
          referenceId: service.id,
          isIndexable: currentStatus?.isIndexable ?? true,
          currentStatus
        });
      });
    }

    // Add blog posts - handle different API response shapes
    const blogs = Array.isArray(blogData) ? blogData : blogData?.blogs || blogData?.data || [];
    if (blogs.length > 0) {
      blogs.forEach((post: any) => {
        const pageUrl = `/blog/${post.slug}`;
        const currentStatus = statuses.find(s => s.pageUrl === pageUrl);
        allPages.push({
          id: `blog-${post.id}`,
          pageUrl,
          pageTitle: post.title,
          pageType: "blog",
          referenceId: post.id,
          isIndexable: currentStatus?.isIndexable ?? true,
          currentStatus
        });
      });
    }

    // Add hire developer pages - handle different API response shapes  
    const hirePages = Array.isArray(hireData) ? hireData : hireData?.pages || hireData?.data || [];
    if (hirePages.length > 0) {
      hirePages.forEach((page: any) => {
        const pageUrl = `/hire-developers/${page.slug}`;
        const currentStatus = statuses.find(s => s.pageUrl === pageUrl);
        allPages.push({
          id: `hire-${page.id}`,
          pageUrl,
          pageTitle: page.title,
          pageType: "hire",
          referenceId: page.id,
          isIndexable: currentStatus?.isIndexable ?? true,
          currentStatus
        });
      });
    }

    setAllSitePages(allPages);
  }, [servicesData, blogData, hireData, statuses]);

  const toggleIndexingMutation = useMutation({
    mutationFn: async ({ pageUrl, pageTitle, pageType, referenceId, isIndexable }: {
      pageUrl: string;
      pageTitle: string;
      pageType: string;
      referenceId: number;
      isIndexable: boolean;
    }) => {
      // Check if status already exists
      const existingStatus = statuses.find(s => s.pageUrl === pageUrl);
      
      if (existingStatus) {
        // Update existing status
        const response = await apiRequest("PUT", `/api/seo/page-indexing/${existingStatus.id}`, {
          isIndexable,
          metaRobotsTag: isIndexable ? "index, follow" : "noindex, nofollow"
        });
        return response.json();
      } else {
        // Create new status
        const response = await apiRequest("POST", "/api/seo/page-indexing", {
          pageUrl,
          pageTitle,
          pageType,
          referenceId,
          isIndexable,
          metaRobotsTag: isIndexable ? "index, follow" : "noindex, nofollow"
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/page-indexing"] });
      toast({
        title: "Success",
        description: "Page indexing status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to update page indexing status",
        variant: "destructive",
      });
    },
  });

  // Enhanced filtering logic with search and indexing status
  const filteredPages = allSitePages.filter(page => {
    // Filter by page type
    const pageTypeMatch = selectedPageType === "all" || page.pageType === selectedPageType;
    
    // Filter by search term (search in title and URL)
    const searchMatch = searchTerm === "" || 
      page.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      page.pageUrl.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by indexing status
    const indexingMatch = indexingFilter === "all" || 
      (indexingFilter === "indexed" && page.isIndexable) || 
      (indexingFilter === "not-indexed" && !page.isIndexable);
    
    return pageTypeMatch && searchMatch && indexingMatch;
  });

  // Clear search function
  const clearSearch = () => {
    setSearchTerm("");
    setSelectedPageType("all");
    setIndexingFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight flex items-center" data-testid="text-indexing-manager-title">
            <ToggleLeft className="h-6 w-6 mr-2" />
            Page Indexing Management
          </h3>
          <p className="text-muted-foreground" data-testid="text-indexing-manager-description">
            Control which pages search engines should index or ignore. Toggle to switch between indexed and non-indexed status.
          </p>
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by page title or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
                data-testid="input-search-pages"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {(searchTerm || selectedPageType !== "all" || indexingFilter !== "all") && (
              <button
                onClick={clearSearch}
                className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                data-testid="button-clear-all-filters"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            {/* Page Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Select value={selectedPageType} onValueChange={setSelectedPageType}>
                <SelectTrigger className="w-[150px]" data-testid="select-page-type">
                  <SelectValue placeholder="Page Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages ({allSitePages.length})</SelectItem>
                  <SelectItem value="service">Service Pages ({allSitePages.filter(p => p.pageType === 'service').length})</SelectItem>
                  <SelectItem value="blog">Blog Pages ({allSitePages.filter(p => p.pageType === 'blog').length})</SelectItem>
                  <SelectItem value="hire">Hire Pages ({allSitePages.filter(p => p.pageType === 'hire').length})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indexing Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={indexingFilter} onValueChange={setIndexingFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-indexing-status">
                  <SelectValue placeholder="Indexing Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({allSitePages.length})</SelectItem>
                  <SelectItem value="indexed">
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-green-600" />
                      Indexed ({allSitePages.filter(p => p.isIndexable).length})
                    </span>
                  </SelectItem>
                  <SelectItem value="not-indexed">
                    <span className="flex items-center gap-2">
                      <EyeOff className="h-3 w-3 text-gray-500" />
                      Not Indexed ({allSitePages.filter(p => !p.isIndexable).length})
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedPageType !== "all" || indexingFilter !== "all") && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs" data-testid="badge-search-filter">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedPageType !== "all" && (
                  <Badge variant="secondary" className="text-xs" data-testid="badge-type-filter">
                    Type: {selectedPageType.charAt(0).toUpperCase() + selectedPageType.slice(1)}
                    <button onClick={() => setSelectedPageType("all")} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {indexingFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs" data-testid="badge-status-filter">
                    Status: {indexingFilter === "indexed" ? "Indexed" : "Not Indexed"}
                    <button onClick={() => setIndexingFilter("all")} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* All Site Pages with Indexing Controls */}
      <Card data-testid="card-site-pages-indexing">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Site Pages - Indexing Control</span>
            <Badge variant="outline" data-testid="badge-pages-count">
              {filteredPages.length} pages
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Toggle the switch to control indexing status. Green = Indexed by search engines, Gray = Not indexed (noindex tag applied).
          </p>
        </CardHeader>
        <CardContent>
          {filteredPages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pages found</p>
              <p className="text-sm">Change filter to see pages of different types</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`row-site-page-${page.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium" data-testid={`text-site-page-title-${page.id}`}>
                        {page.pageTitle}
                      </h4>
                      <Badge variant="outline" data-testid={`badge-site-page-type-${page.id}`}>
                        {page.pageType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-site-page-url-${page.id}`}>
                      {page.pageUrl}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span data-testid={`text-site-meta-robots-${page.id}`}>
                        Meta Robots: {page.isIndexable ? "index, follow" : "noindex, nofollow"}
                      </span>
                      {page.currentStatus && (
                        <span data-testid={`text-site-last-updated-${page.id}`}>
                          Last Updated: {new Date(page.currentStatus.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={page.isIndexable ? "default" : "secondary"}
                      className="flex items-center gap-1"
                      data-testid={`badge-site-indexing-status-${page.id}`}
                    >
                      {page.isIndexable ? (
                        <><Eye className="h-3 w-3" /> Indexed</>
                      ) : (
                        <><EyeOff className="h-3 w-3" /> Not Indexed</>
                      )}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {page.isIndexable ? "Searchable" : "Hidden"}
                      </span>
                      <Switch
                        checked={page.isIndexable}
                        onCheckedChange={(checked) => {
                          toggleIndexingMutation.mutate({
                            pageUrl: page.pageUrl,
                            pageTitle: page.pageTitle,
                            pageType: page.pageType,
                            referenceId: page.referenceId,
                            isIndexable: checked
                          });
                        }}
                        disabled={toggleIndexingMutation.isPending}
                        data-testid={`switch-site-page-indexing-${page.id}`}
                      />
                      {toggleIndexingMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}