import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Globe,
  Link,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  Eye,
  FileText,
  ToggleLeft
} from "lucide-react";
import { SEOOverview } from "./seo/seo-overview";
import { DebugSEOButtons } from "./debug-seo-buttons";
import { SEOSettings } from "./seo/seo-settings";
import { SEOKeywords } from "./seo/seo-keywords";
import { SEOAnalytics } from "./seo/seo-analytics";
import { SEOPageData } from "./seo/seo-page-data";
import { SitemapManager } from "./seo/sitemap-manager";
import { RobotsTxtEditor } from "./seo/robots-txt-editor";
import { PageIndexingManager } from "./seo/page-indexing-manager";
import { BacklinksManager } from "./seo/backlinks-manager";

interface SEODashboardProps { }

export function SEODashboard({ }: SEODashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" data-testid="text-seo-dashboard-title">SEO Management Dashboard</h2>
          <p className="text-muted-foreground" data-testid="text-seo-dashboard-description">
            Manage your website's search engine optimization and performance tracking
          </p>
        </div>
        <Button
          variant="outline"
          data-testid="button-view-sitemap"
          onClick={() => window.open("/sitemap.xml", "_blank")}
        >
          <Globe className="h-4 w-4 mr-2" />
          View Sitemap
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" data-testid="tabs-seo-dashboard">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="keywords" data-testid="tab-keywords">
            <Search className="h-4 w-4 mr-2" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="pages" data-testid="tab-pages">
            <Globe className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="backlinks" data-testid="tab-backlinks">
            <Link className="h-4 w-4 mr-2" />
            Internal links
          </TabsTrigger>
          <TabsTrigger value="robots-txt" data-testid="tab-robots-txt">
            <FileText className="h-4 w-4 mr-2" />
            Robots.txt
          </TabsTrigger>
          <TabsTrigger value="indexing" data-testid="tab-indexing">
            <ToggleLeft className="h-4 w-4 mr-2" />
            Indexing
          </TabsTrigger>
          <TabsTrigger value="sitemap" data-testid="tab-sitemap">
            <Eye className="h-4 w-4 mr-2" />
            Sitemap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4" data-testid="content-overview">
          <SEOOverview onTabChange={setActiveTab} />
          <DebugSEOButtons />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" data-testid="content-settings">
          <SEOSettings />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4" data-testid="content-keywords">
          <SEOKeywords />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-testid="content-analytics">
          <SEOAnalytics />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4" data-testid="content-pages">
          <SEOPageData />
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4" data-testid="content-backlinks">
          <BacklinksManager />
        </TabsContent>

        <TabsContent value="robots-txt" className="space-y-4" data-testid="content-robots-txt">
          <RobotsTxtEditor />
        </TabsContent>

        <TabsContent value="indexing" className="space-y-4" data-testid="content-indexing">
          <PageIndexingManager />
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-4" data-testid="content-sitemap">
          <SitemapManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}