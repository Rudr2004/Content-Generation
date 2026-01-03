import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe,
  ExternalLink,
  RefreshCw,
  FileText,
  Briefcase,
  BookOpen,
  Cpu,
  Upload,
  CheckCircle
} from "lucide-react";

interface SitemapData {
  services: any[];
  hirePages: any[];
  caseStudies: any[];
  blogPosts: any[];
  aiServicePages: any[];
}

export function SitemapManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: sitemapResponse, isLoading, refetch } = useQuery<{success: boolean, data: SitemapData}>({
    queryKey: ["/api/seo/sitemap-data"],
  });
  
  const refreshSitemapMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await apiRequest("POST", "/api/seo/sitemap/refresh", {});
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Sitemap refresh mutation error:", error);
        
        // Handle authentication errors specifically
        if (error.message?.includes('Invalid or expired token') || error.message?.includes('403')) {
          throw new Error('Authentication required. Please log in with admin privileges to refresh the sitemap.');
        }
        
        // Handle other API errors
        if (error.message?.includes('401')) {
          throw new Error('Please log in to access this feature.');
        }
        
        // Handle JSON parsing errors
        if (error.message?.includes('Unexpected token')) {
          throw new Error('Server error: Invalid response format. Please try again or contact support.');
        }
        
        throw new Error(error.message || 'Failed to refresh sitemap. Please try again.');
      }
    },
    onSuccess: (data) => {
      // Refresh the sitemap data after successful regeneration
      refetch();
      toast({
        title: "Success",
        description: data?.message || "Sitemap refreshed successfully",
      });
    },
    onError: (error: any) => {
      console.error("Sitemap refresh error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh sitemap",
        variant: "destructive",
      });
    },
  });

  const updateSitemapMutation = useMutation({
    mutationFn: async (sections: string[]) => {
      try {
        const response = await apiRequest("POST", "/api/seo/sitemap/update", { sections });
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Sitemap update mutation error:", error);
        throw new Error(error.message || 'Failed to update sitemap. Please try again.');
      }
    },
    onSuccess: (data) => {
      refetch();
      toast({
        title: "Sitemap Updated",
        description: `Updated ${data.updatedSections?.join(', ')} sections (${data.totalUpdatedPages} pages)`,
      });
    },
    onError: (error: any) => {
      console.error("Sitemap update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update sitemap",
        variant: "destructive",
      });
    },
  });
  
  const sitemapData = sitemapResponse;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data = sitemapData?.data;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "services": return <Briefcase className="h-4 w-4" />;
      case "hire": return <Cpu className="h-4 w-4" />;
      case "case-studies": return <FileText className="h-4 w-4" />;
      case "blog": return <BookOpen className="h-4 w-4" />;
      case "ai-services": return <Cpu className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const sections = [
    {
      title: "Services",
      type: "services",
      count: data?.services?.length || 0,
      items: data?.services || []
    },
    {
      title: "Hire Developer Pages",
      type: "hire",
      count: data?.hirePages?.length || 0,
      items: data?.hirePages || []
    },
    {
      title: "Case Studies",
      type: "case-studies",
      count: data?.caseStudies?.length || 0,
      items: data?.caseStudies || []
    },
    {
      title: "Blog Posts",
      type: "blog",
      count: data?.blogPosts?.length || 0,
      items: data?.blogPosts || []
    },
    {
      title: "AI Service Pages",
      type: "ai-services",
      count: data?.aiServicePages?.length || 0,
      items: data?.aiServicePages || []
    }
  ];

  const totalPages = sections.reduce((sum, section) => sum + section.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sitemap Management</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your website's sitemap structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => updateSitemapMutation.mutate([])}
            disabled={updateSitemapMutation.isPending}
            data-testid="button-update-sitemap"
          >
            <Upload className={`h-4 w-4 mr-2 ${updateSitemapMutation.isPending ? "animate-spin" : ""}`} />
            {updateSitemapMutation.isPending ? "Updating..." : "Update All"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => refreshSitemapMutation.mutate()}
            disabled={refreshSitemapMutation.isPending}
            data-testid="button-refresh-sitemap"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshSitemapMutation.isPending ? "animate-spin" : ""}`} />
            {refreshSitemapMutation.isPending ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" asChild>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Sitemap
            </a>
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sitemap Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{totalPages} Total Pages</div>
          <p className="text-sm text-muted-foreground">
            Pages included in your website sitemap
          </p>
          
          <div className="grid gap-4 md:grid-cols-5 mt-4">
            {sections.map((section) => (
              <div key={section.type} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getSectionIcon(section.type)}
                </div>
                <div className="text-lg font-semibold">{section.count}</div>
                <div className="text-xs text-muted-foreground">{section.title}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Details */}
      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.type}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getSectionIcon(section.type)}
                {section.title}
                <Badge variant="secondary">{section.count}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.count === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No {section.title.toLowerCase()} found
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {section.items.slice(0, 20).map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title || item.name || `${section.type} ${item.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {section.type === "blog" && item.slug ? `/blog/${item.slug}` :
                           section.type === "services" && item.slug ? `/services/${item.slug}` :
                           section.type === "hire" && item.slug ? `/hire/${item.slug}` :
                           section.type === "case-studies" && item.slug ? `/case-studies/${item.slug}` :
                           section.type === "ai-services" && item.slug ? `/ai-services/${item.slug}` :
                           `ID: ${item.id}`}
                        </p>
                      </div>
                      {(item.status === "published" || item.status === "active") && (
                        <Badge variant="outline" className="text-green-600">
                          Live
                        </Badge>
                      )}
                    </div>
                  ))}
                  {section.items.length > 20 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      ... and {section.items.length - 20} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}