import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link, RefreshCw, Eye, EyeOff } from "lucide-react";

interface PublicBacklink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string | null;
  authority: number | null;
  sourceType: string;
  lastSeen: string | null;
}

interface BacklinksDisplayProps {
  targetUrl?: string;
  showTitle?: boolean;
  maxDisplay?: number;
  compact?: boolean;
  className?: string;
}

export function BacklinksDisplay({ 
  targetUrl, 
  showTitle = true, 
  maxDisplay = 10,
  compact = false,
  className = ""
}: BacklinksDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  // Normalize target URL for better matching (remove query, hash, and trailing slash)
  const normalizedTargetUrl = targetUrl ? targetUrl.split('?')[0].split('#')[0].replace(/\/$/, '') : undefined;

  const { data: backlinksResponse, isLoading, refetch } = useQuery<{
    success: boolean; 
    backlinks: PublicBacklink[];
    count: number;
  }>({
    queryKey: ["/api/public/backlinks", normalizedTargetUrl, refreshKey],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (normalizedTargetUrl) params.append('targetUrl', normalizedTargetUrl);
      params.append('limit', maxDisplay.toString());
      // Add cache busting timestamp
      params.append('_t', Date.now().toString());
      
      const response = await fetch(`/api/public/backlinks?${params}`, {
        // Bypass browser cache for immediate updates
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch backlinks');
      }
      return response.json();
    },
    staleTime: 0, // Always consider stale for real-time updates
    gcTime: 1 * 60 * 1000, // 1 minute
  });

  // Set up Server-Sent Events for real-time updates
  useEffect(() => {
    const connectSSE = () => {
      try {
        console.log('🔌 Connecting to backlinks SSE...');
        const eventSource = new EventSource('/api/backlinks/updates');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('✅ SSE connected for backlinks updates');
          setIsConnected(true);
          setReconnectAttempts(0); // Reset attempts on successful connection
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Received SSE update:', data);

            if (data.type === 'backlinks-updated') {
              console.log(`♻️ Invalidating backlinks cache due to ${data.action} action`);
              
              // Targeted cache invalidation based on targetUrl
              if (data.targetUrl && normalizedTargetUrl) {
                // Server already normalizes URLs, so direct comparison
                if (data.targetUrl === normalizedTargetUrl) {
                  console.log(`🎯 Targeted cache invalidation for ${normalizedTargetUrl}`);
                  // Invalidate specific targetUrl queries
                  queryClient.invalidateQueries({ 
                    queryKey: ["/api/public/backlinks", normalizedTargetUrl] 
                  });
                  setRefreshKey(prev => prev + 1);
                } else {
                  console.log(`⚠️ URL mismatch: server ${data.targetUrl} vs client ${normalizedTargetUrl}`);
                }
              } else {
                console.log('🌍 Fallback: invalidating all backlinks queries');
                // Fallback: invalidate all public backlinks queries
                queryClient.invalidateQueries({ 
                  queryKey: ["/api/public/backlinks"] 
                });
                setRefreshKey(prev => prev + 1);
              }
            } else if (data.type === 'heartbeat') {
              // Handle heartbeat silently to maintain connection
              console.debug('💓 SSE heartbeat received');
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setIsConnected(false);
          eventSource.close();
          
          // Proper exponential backoff with jitter
          const baseDelay = 3000; // 3 seconds
          const attempt = reconnectAttempts;
          const exponentialDelay = baseDelay * Math.pow(2, attempt);
          const jitter = Math.random() * 1000; // 0-1000ms jitter
          const reconnectDelay = Math.min(exponentialDelay + jitter, 30000); // Cap at 30s
          
          setReconnectAttempts(prev => prev + 1);
          
          setTimeout(() => {
            if (eventSourceRef.current === eventSource) {
              console.log(`🔄 Attempting SSE reconnection #${attempt + 1} after ${reconnectDelay.toFixed(0)}ms`);
              connectSSE();
            }
          }, reconnectDelay);
        };

      } catch (error) {
        console.error('Failed to connect SSE:', error);
        setIsConnected(false);
      }
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        console.log('🔌 Closing SSE connection');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient]);

  // Manual refresh with cache busting
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
    
    // Also invalidate the query cache
    queryClient.invalidateQueries({ 
      queryKey: ["/api/public/backlinks", normalizedTargetUrl] 
    });
    
    refetch();
  };

  const backlinks = backlinksResponse?.backlinks || [];
  const totalCount = backlinksResponse?.count || 0;


  const getAuthorityColor = (authority: number | null) => {
    if (!authority) return "text-gray-500";
    if (authority >= 70) return "text-green-600";
    if (authority >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getAuthorityLabel = (authority: number | null) => {
    if (!authority) return "Unknown";
    if (authority >= 70) return "High";
    if (authority >= 40) return "Medium";
    return "Low";
  };

  if (compact) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          {showTitle && (
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Backlinks ({totalCount})
                {isConnected && <span className="ml-2 text-xs text-green-600">● Live</span>}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              data-testid="toggle-backlinks-visibility"
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isVisible ? "Hide" : "Show"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              data-testid="refresh-backlinks"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {isVisible && (
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading backlinks...</div>
            ) : backlinks.length === 0 ? (
              <div className="text-sm text-gray-500">No active backlinks found</div>
            ) : (
              backlinks.slice(0, 5).map((backlink, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                  data-testid={`compact-backlink-${index}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate">
                      <a 
                        href={backlink.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {backlink.anchorText || "View Link"}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {new URL(backlink.sourceUrl).hostname}
                    </div>
                  </div>
                  {backlink.authority && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAuthorityColor(backlink.authority)}`}
                    >
                      DA {backlink.authority}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" data-testid="backlinks-title">
              <Link className="h-5 w-5 text-blue-600" />
              Active Backlinks
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalCount}
                </Badge>
              )}
              {isConnected && (
                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                  Live Updates
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              Links pointing to this content from external sources
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="refresh-backlinks"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : backlinks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Active Backlinks</h3>
            <p className="text-muted-foreground">
              No external links are currently pointing to this content.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {backlinks.map((backlink, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={backlink.sourceType === 'content_extracted' ? 'secondary' : 'default'}
                      >
                        {backlink.sourceType === 'content_extracted' ? 'Internal' : 'External'}
                      </Badge>
                      {backlink.authority && (
                        <Badge 
                          variant="outline" 
                          className={getAuthorityColor(backlink.authority)}
                        >
                          DA {backlink.authority} - {getAuthorityLabel(backlink.authority)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</span>{" "}
                        <a 
                          href={backlink.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1 break-all"
                          data-testid={`backlink-source-${index}`}
                        >
                          {new URL(backlink.sourceUrl).hostname}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                      
                      {backlink.anchorText && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Anchor Text:</span>{" "}
                          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {backlink.anchorText}
                          </span>
                        </div>
                      )}
                      
                      {backlink.targetUrl && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</span>{" "}
                          <span className="text-green-600 text-sm break-all">
                            {backlink.targetUrl}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {backlink.lastSeen && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last seen: {new Date(backlink.lastSeen).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {totalCount > maxDisplay && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Showing {backlinks.length} of {totalCount} backlinks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}