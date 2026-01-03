import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText,
  Save,
  Eye,
  AlertCircle,
  Download,
  History,
  Play,
  Trash2,
  GitCompare,
  CheckCircle2
} from "lucide-react";

interface RobotsTxtSettings {
  id: number;
  content: string;
  isActive: boolean;
  version: string;
  versionNotes: string | null;
  contentHash: string;
  lastUpdated: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RobotsTxtEditorProps {}

export function RobotsTxtEditor({}: RobotsTxtEditorProps) {
  const [content, setContent] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<RobotsTxtSettings | null>(null);
  const [compareVersion, setCompareVersion] = useState<RobotsTxtSettings | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settingsResponse, isLoading } = useQuery<{success: boolean, settings: RobotsTxtSettings}>({
    queryKey: ["/api/seo/robots-txt"],
  });

  const { data: versionsResponse, isLoading: versionsLoading } = useQuery<{success: boolean, versions: RobotsTxtSettings[]}>({
    queryKey: ["/api/seo/robots-txt/versions"],
  });

  const settings = settingsResponse?.settings;
  const versions = versionsResponse?.versions || [];

  // Initialize content when data loads and ensure it shows current content
  useEffect(() => {
    if (settings) {
      // Always update content to show current version
      setContent(settings.content || "User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml");
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: { content: string; versionNotes?: string }) => {
      const response = await apiRequest("POST", "/api/seo/robots-txt", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/robots-txt"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/robots-txt/versions"] });
      // Update content to show the saved version immediately
      if (data?.settings?.content) {
        setContent(data.settings.content);
      }
      setIsEditing(false);
      setVersionNotes("");
      toast({
        title: "Success",
        description: "New robots.txt version created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save robots.txt settings",
        variant: "destructive",
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const response = await apiRequest("PUT", `/api/seo/robots-txt/${versionId}/activate`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/robots-txt"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/robots-txt/versions"] });
      toast({
        title: "Success", 
        description: "Robots.txt version activated successfully",
      });
      // Force refresh to show the activated content
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to activate robots.txt version",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const response = await apiRequest("DELETE", `/api/seo/robots-txt/${versionId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/robots-txt/versions"] });
      toast({
        title: "Success",
        description: "Robots.txt version deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete robots.txt version",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ content, versionNotes });
  };

  const handleActivate = (version: RobotsTxtSettings) => {
    if (confirm(`Are you sure you want to activate version ${version.version}?`)) {
      activateMutation.mutate(version.id);
    }
  };

  const handleDelete = (version: RobotsTxtSettings) => {
    if (confirm(`Are you sure you want to delete version ${version.version}? This action cannot be undone.`)) {
      deleteMutation.mutate(version.id);
    }
  };

  const getDiffHighlight = (line: string, compareContent: string): string => {
    if (!compareContent) return "";
    const compareLines = compareContent.split('\n');
    const currentLines = content.split('\n');
    
    // Simple diff highlighting - you could enhance this with a proper diff library
    if (compareLines.includes(line) && !currentLines.includes(line)) {
      return "bg-red-100 text-red-800"; // removed
    }
    if (!compareLines.includes(line) && currentLines.includes(line)) {
      return "bg-green-100 text-green-800"; // added
    }
    return "";
  };

  const handlePreview = () => {
    // Open robots.txt in new tab for preview
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight flex items-center" data-testid="text-robots-editor-title">
            <FileText className="h-6 w-6 mr-2" />
            Robots.txt Editor
          </h3>
          <p className="text-muted-foreground" data-testid="text-robots-editor-description">
            Manage your website's robots.txt file to control search engine crawling
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            data-testid="button-preview-robots"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/robots.txt", "_blank")}
            data-testid="button-view-current-robots"
          >
            <Download className="h-4 w-4 mr-2" />
            View Current
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" data-testid="tab-robots-editor">
            <FileText className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-robots-history">
            <History className="h-4 w-4 mr-2" />
            Version History ({versions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card data-testid="card-robots-editor">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Version {settings?.version || "v1.0"}</span>
                {settings && (
                  <Badge variant={settings.isActive ? "default" : "secondary"} data-testid="badge-robots-status">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </CardTitle>
              {settings?.lastUpdated && (
                <p className="text-sm text-muted-foreground" data-testid="text-robots-last-updated">
                  Last updated: {new Date(settings.lastUpdated).toLocaleString()}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Content</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    data-testid="button-toggle-edit-robots"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={!isEditing}
                  rows={12}
                  placeholder="User-agent: *&#10;Allow: /&#10;&#10;Sitemap: /sitemap.xml"
                  className="font-mono text-sm"
                  data-testid="textarea-robots-content"
                />
              </div>

              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Version Notes (Optional)</label>
                    <Textarea
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      placeholder="Describe what changed in this version..."
                      rows={2}
                      className="mt-1"
                      data-testid="textarea-version-notes"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Changes will create a new version and make it active
                    </div>
                    <Button 
                      onClick={handleSave} 
                      disabled={saveMutation.isPending}
                      data-testid="button-save-robots"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saveMutation.isPending ? "Creating Version..." : "Create New Version"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2" data-testid="text-robots-tips-title">Common robots.txt directives:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">User-agent: *</code>
                    <p>Apply to all search engines</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">Allow: /</code>
                    <p>Allow crawling all pages</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">Disallow: /admin</code>
                    <p>Block specific directories</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">Sitemap: /sitemap.xml</code>
                    <p>Reference your sitemap</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card data-testid="card-robots-history">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage and compare different versions of your robots.txt file
              </p>
            </CardHeader>
            <CardContent>
              {versionsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : versions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No versions found</p>
              ) : (
                <div className="space-y-4">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className={`border rounded-lg p-4 ${version.isActive ? 'border-primary bg-primary/5' : 'border-border'}`}
                      data-testid={`version-item-${version.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={version.isActive ? "default" : "secondary"}>
                                {version.version}
                              </Badge>
                              {version.isActive && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Created: {new Date(version.createdAt).toLocaleString()}
                            </p>
                            {version.versionNotes && (
                              <p className="text-sm mt-1">{version.versionNotes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVersion(version)}
                                data-testid={`button-view-version-${version.id}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Version {version.version} Content</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-96 w-full">
                                <pre className="text-sm font-mono whitespace-pre-wrap p-4 bg-muted rounded">
                                  {version.content}
                                </pre>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          {!version.isActive && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivate(version)}
                                disabled={activateMutation.isPending}
                                data-testid={`button-activate-version-${version.id}`}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(version)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-version-${version.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}