import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus, AlertCircle, CheckCircle } from "lucide-react";

export function DebugSEOButtons() {
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<string>("");
  const [isTestingTrackPage, setIsTestingTrackPage] = useState(false);
  const [isTestingSitemap, setIsTestingSitemap] = useState(false);
  const { toast } = useToast();

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugOutput(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log("DEBUG:", message);
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAuthStatus("❌ No auth token found");
      addDebugLog("No auth token in localStorage");
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      const hasRequiredRole = ['super_admin', 'content_admin'].includes(payload.role);
      
      if (isExpired) {
        setAuthStatus(`⚠️ Token expired (exp: ${new Date(payload.exp * 1000).toLocaleString()})`);
        addDebugLog("Token is expired");
        return null;
      }
      
      if (!hasRequiredRole) {
        setAuthStatus(`❌ Insufficient role: ${payload.role}`);
        addDebugLog(`User role ${payload.role} insufficient for SEO endpoints`);
        return null;
      }
      
      setAuthStatus(`✅ Authenticated as ${payload.email} (${payload.role})`);
      addDebugLog(`Auth OK: ${payload.email} (${payload.role})`);
      return token;
    } catch (error) {
      setAuthStatus("❌ Invalid token format");
      addDebugLog("Failed to parse auth token");
      return null;
    }
  };

  const testTrackPageButton = async () => {
    setIsTestingTrackPage(true);
    addDebugLog("Testing Track New Page button functionality...");
    
    const token = checkAuthStatus();
    if (!token) {
      setIsTestingTrackPage(false);
      return;
    }

    try {
      addDebugLog("Attempting to call /api/seo/pages endpoint...");
      
      const testData = {
        pageType: "service",
        referenceId: 1,
        metaTitle: "Test Page Title",
        metaDescription: "Test page description",
        primaryKeyword: "test keyword"
      };

      const response = await apiRequest("POST", "/api/seo/pages", testData);
      addDebugLog(`API Response status: ${response.status}`);
      
      const data = await response.json();
      addDebugLog(`API Response data: ${JSON.stringify(data)}`);
      
      toast({
        title: "Success",
        description: "Track page test completed successfully!",
      });
      
    } catch (error: any) {
      addDebugLog(`ERROR: ${error.message}`);
      console.error("Track page test error:", error);
      
      toast({
        title: "Track Page Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingTrackPage(false);
    }
  };

  const testSitemapButton = async () => {
    setIsTestingSitemap(true);
    addDebugLog("Testing Refresh Sitemap button functionality...");
    
    const token = checkAuthStatus();
    if (!token) {
      setIsTestingSitemap(false);
      return;
    }

    try {
      addDebugLog("Attempting to call /api/seo/sitemap/refresh endpoint...");
      
      const response = await apiRequest("POST", "/api/seo/sitemap/refresh", {});
      addDebugLog(`API Response status: ${response.status}`);
      addDebugLog(`API Response headers: ${JSON.stringify([...response.headers.entries()])}`);
      
      const responseText = await response.text();
      addDebugLog(`Raw response text: ${responseText.substring(0, 200)}...`);
      
      let data;
      try {
        data = JSON.parse(responseText);
        addDebugLog(`Parsed JSON data: ${JSON.stringify(data)}`);
      } catch (parseError) {
        addDebugLog(`JSON Parse Error: ${parseError}`);
        addDebugLog(`Response was not valid JSON. Got: ${responseText.substring(0, 100)}...`);
        throw new Error("Server returned non-JSON response");
      }
      
      toast({
        title: "Success",
        description: "Sitemap refresh test completed successfully!",
      });
      
    } catch (error: any) {
      addDebugLog(`ERROR: ${error.message}`);
      console.error("Sitemap test error:", error);
      
      toast({
        title: "Sitemap Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingSitemap(false);
    }
  };

  const clearDebugOutput = () => {
    setDebugOutput([]);
    setAuthStatus("");
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          SEO Button Debugging Tool
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Debug the Track New Page and Refresh Sitemap button functionality issues
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="p-3 border rounded-lg">
          <h4 className="font-medium mb-2">Authentication Status</h4>
          {authStatus ? (
            <Badge variant={authStatus.includes('✅') ? 'default' : 'destructive'}>
              {authStatus}
            </Badge>
          ) : (
            <Button size="sm" onClick={() => checkAuthStatus()}>
              Check Auth Status
            </Button>
          )}
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testTrackPageButton}
            disabled={isTestingTrackPage}
            variant="outline"
            data-testid="debug-track-page"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isTestingTrackPage ? "Testing..." : "Test Track Page"}
          </Button>
          
          <Button 
            onClick={testSitemapButton}
            disabled={isTestingSitemap}
            variant="outline"
            data-testid="debug-sitemap"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isTestingSitemap ? "animate-spin" : ""}`} />
            {isTestingSitemap ? "Testing..." : "Test Sitemap Refresh"}
          </Button>
          
          <Button onClick={clearDebugOutput} variant="ghost" size="sm">
            Clear Debug Log
          </Button>
        </div>

        {/* Debug Output */}
        {debugOutput.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Debug Output</h4>
            <div className="bg-black text-green-400 p-3 rounded-lg font-mono text-xs max-h-64 overflow-y-auto">
              {debugOutput.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}