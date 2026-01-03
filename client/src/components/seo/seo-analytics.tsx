import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react";

interface SEOAnalytics {
  id: number;
  pageUrl: string;
  pageTitle: string | null;
  pageType: string | null;
  organicTraffic: number;
  avgPosition: number | null;
  impressions: number;
  clicks: number;
  ctr: number;
  dateRecorded: string;
}

export function SEOAnalytics() {
  const { data: analyticsResponse, isLoading } = useQuery<{success: boolean, analytics: SEOAnalytics[]}>({
    queryKey: ["/api/seo/analytics"],
  });

  const analytics = analyticsResponse?.analytics || [];

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

  const getCTRColor = (ctr: number) => {
    if (ctr >= 5) return "text-green-500";
    if (ctr >= 2) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">SEO Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Track page performance and search engine metrics
        </p>
      </div>

      {analytics.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground">
              Analytics data will appear here once collected
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analytics.map((data) => (
            <Card key={data.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">
                      {data.pageTitle || data.pageUrl}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {data.pageUrl}
                    </p>
                    {data.pageType && (
                      <Badge variant="outline">{data.pageType}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(data.dateRecorded).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{data.impressions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{data.clicks.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-4 w-4 ${getCTRColor(data.ctr)}`} />
                    <div>
                      <p className={`text-sm font-medium ${getCTRColor(data.ctr)}`}>
                        {data.ctr.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">CTR</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {data.avgPosition ? `#${data.avgPosition.toFixed(1)}` : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Position</p>
                    </div>
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