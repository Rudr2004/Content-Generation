import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import {
  Link,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Scan,
  FileText
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BacklinksManagerProps { }

export function BacklinksManager({ }: BacklinksManagerProps) {
  const [filter, setFilter] = useState({
    status: "all",
    linkType: "all",
    validationStatus: "all"
  });
  const [editingLink, setEditingLink] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    targetUrl: "",
    displayText: "",
    linkType: "external" as const,
    notes: ""
  });
  const [editForm, setEditForm] = useState({
    targetUrl: "",
    displayText: "",
    linkType: "external" as const,
    notes: "",
    status: "active" as const
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch backlinks with filters
  const { data: backlinksData, isLoading, error: backlinksError } = useQuery({
    queryKey: ["/api/seo/backlinks", filter],
    queryFn: async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders.Authorization) {
        throw new Error('Authentication required');
      }

      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.linkType !== "all") params.append("linkType", filter.linkType);
      if (filter.validationStatus !== "all") params.append("validationStatus", filter.validationStatus);

      const url = `/api/seo/backlinks${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch backlinks');
        } else {
          throw new Error('Authentication failed - please log in again');
        }
      }

      return response.json();
    },
    enabled: true,
  });

  // Fetch statistics
  const { data: statsData, error: statsError } = useQuery({
    queryKey: ["/api/seo/backlinks/stats"],
    queryFn: async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders.Authorization) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/seo/backlinks/stats', {
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch stats');
        } else {
          throw new Error('Authentication failed - please log in again');
        }
      }

      return response.json();
    },
    enabled: true,
  });

  // Create backlink mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof newLink) => {
      return await apiRequest("POST", "/api/seo/backlinks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks/stats"] });
      setIsCreateDialogOpen(false);
      setNewLink({ targetUrl: "", displayText: "", linkType: "external", notes: "" });
      toast({ title: "Success", description: "Backlink created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create backlink",
        variant: "destructive"
      });
    }
  });

  // Update backlink mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/seo/backlinks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks/stats"] });
      setEditingLink(null);
      setIsEditDialogOpen(false);
      toast({ title: "Success", description: "Backlink updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update backlink",
        variant: "destructive"
      });
    }
  });

  // Delete backlink mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/seo/backlinks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks/stats"] });
      toast({ title: "Success", description: "Backlink deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete backlink",
        variant: "destructive"
      });
    }
  });

  // Scan website mutation
  const scanWebsiteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/seo/backlinks/scan-website", {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks/stats"] });
      toast({
        title: "Scan Complete",
        description: data.message || "Website scan completed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to scan website",
        variant: "destructive"
      });
    }
  });

  // Fix link types mutation
  const fixLinkTypesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/seo/backlinks/fix-link-types", {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/backlinks/stats"] });
      toast({
        title: "Link Types Fixed",
        description: data.message || "Successfully corrected link types"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fix link types",
        variant: "destructive"
      });
    }
  });

  const backlinks = (backlinksData as any)?.backlinks || [];
  const stats = (statsData as any)?.stats || {
    totalLinks: 0,
    activeLinks: 0,
    brokenLinks: 0,
    redirectLinks: 0,
    totalUsages: 0,
    usagesByType: {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" data-testid={`badge-status-active`}>Active</Badge>;
      case 'broken': return <Badge variant="destructive" data-testid={`badge-status-broken`}>Broken</Badge>;
      case 'redirect': return <Badge variant="secondary" data-testid={`badge-status-redirect`}>Redirect</Badge>;
      case 'inactive': return <Badge variant="outline" data-testid={`badge-status-inactive`}>Inactive</Badge>;
      default: return <Badge variant="outline" data-testid={`badge-status-unknown`}>{status}</Badge>;
    }
  };

  const getValidationIcon = (validationStatus: string) => {
    switch (validationStatus) {
      case 'valid': return <CheckCircle className="h-4 w-4 text-green-600" data-testid="icon-valid" />;
      case 'invalid': return <XCircle className="h-4 w-4 text-red-600" data-testid="icon-invalid" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" data-testid="icon-pending" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" data-testid="icon-unknown" />;
    }
  };

  const formatContentType = (contentType: string) => {
    const typeMap: Record<string, string> = {
      'blog': 'Blog Post',
      'service': 'Service Page',
      'hire': 'Hire Page',
      'case-study': 'Case Study',
      'service-detail': 'Service Detail'
    };
    return typeMap[contentType] || contentType;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8" data-testid="loading-backlinks">Loading backlinks...</div>;
  }

  if (backlinksError || statsError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600" data-testid="error-backlinks">
        Error loading backlinks: {(backlinksError || statsError)?.toString()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-links">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-links">{stats.totalLinks}</div>
            <p className="text-xs text-muted-foreground">Managed backlinks</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-links">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-active-links">{stats.activeLinks}</div>
            <p className="text-xs text-muted-foreground">Working correctly</p>
          </CardContent>
        </Card>

        <Card data-testid="card-broken-links">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broken Links</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-broken-links">{stats.brokenLinks}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-usages">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usages</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-usages">{stats.totalUsages}</div>
            <p className="text-xs text-muted-foreground">Across all content</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card data-testid="card-backlinks-filters">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Internal links Management</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => scanWebsiteMutation.mutate()}
                disabled={scanWebsiteMutation.isPending}
                data-testid="button-scan-website"
              >
                {scanWebsiteMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Scan className="h-4 w-4 mr-2" />
                )}
                {scanWebsiteMutation.isPending ? "Scanning..." : "Scan Website"}
              </Button>
              <Button
                variant="outline"
                onClick={() => fixLinkTypesMutation.mutate()}
                disabled={fixLinkTypesMutation.isPending}
                data-testid="button-fix-link-types"
              >
                {fixLinkTypesMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {fixLinkTypesMutation.isPending ? "Fixing..." : "Fix Link Types"}
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-backlink">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Backlink
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-create-backlink">
                  <DialogHeader>
                    <DialogTitle>Create New Backlink</DialogTitle>
                    <DialogDescription>
                      Add a new backlink to track across your content
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetUrl">Target URL</Label>
                      <Input
                        id="targetUrl"
                        data-testid="input-target-url"
                        placeholder="https://example.com"
                        value={newLink.targetUrl}
                        onChange={(e) => setNewLink({ ...newLink, targetUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayText">Display Text</Label>
                      <Input
                        id="displayText"
                        data-testid="input-display-text"
                        placeholder="Click here"
                        value={newLink.displayText}
                        onChange={(e) => setNewLink({ ...newLink, displayText: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkType">Link Type</Label>
                      <Select
                        value={newLink.linkType}
                        onValueChange={(value: any) => setNewLink({ ...newLink, linkType: value })}
                      >
                        <SelectTrigger data-testid="select-link-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        data-testid="input-notes"
                        placeholder="Additional notes..."
                        value={newLink.notes}
                        onChange={(e) => setNewLink({ ...newLink, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      data-testid="button-submit-create"
                      onClick={() => createMutation.mutate(newLink)}
                      disabled={!newLink.targetUrl || !newLink.displayText || createMutation.isPending}
                    >
                      {createMutation.isPending ? "Creating..." : "Create Backlink"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Moved Edit Dialog out of the header */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent data-testid="dialog-edit-backlink">
              <DialogHeader>
                <DialogTitle>Edit Backlink</DialogTitle>
                <DialogDescription>
                  Update the backlink information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-targetUrl">Target URL</Label>
                  <Input
                    id="edit-targetUrl"
                    data-testid="input-edit-target-url"
                    placeholder="https://example.com"
                    value={editForm.targetUrl}
                    onChange={(e) => setEditForm({ ...editForm, targetUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-displayText">Display Text</Label>
                  <Input
                    id="edit-displayText"
                    data-testid="input-edit-display-text"
                    placeholder="Click here"
                    value={editForm.displayText}
                    onChange={(e) => setEditForm({ ...editForm, displayText: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-linkType">Link Type</Label>
                  <Select
                    value={editForm.linkType}
                    onValueChange={(value: any) => setEditForm({ ...editForm, linkType: value })}
                  >
                    <SelectTrigger data-testid="select-edit-link-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger data-testid="select-edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="broken">Broken</SelectItem>
                      <SelectItem value="redirect">Redirect</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notes (Optional)</Label>
                  <Input
                    id="edit-notes"
                    data-testid="input-edit-notes"
                    placeholder="Additional notes..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  data-testid="button-cancel-edit"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  data-testid="button-submit-edit"
                  onClick={() => {
                    if (editingLink) {
                      updateMutation.mutate({
                        id: editingLink.linkId,
                        data: editForm
                      });
                    }
                  }}
                  disabled={!editForm.targetUrl || !editForm.displayText || updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Backlink"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Label>Status Filter</Label>
              <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
                <SelectTrigger data-testid="select-filter-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="broken">Broken</SelectItem>
                  <SelectItem value="redirect">Redirect</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Link Type Filter</Label>
              <Select value={filter.linkType} onValueChange={(value) => setFilter({ ...filter, linkType: value })}>
                <SelectTrigger data-testid="select-filter-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Validation Status</Label>
              <Select value={filter.validationStatus} onValueChange={(value) => setFilter({ ...filter, validationStatus: value })}>
                <SelectTrigger data-testid="select-filter-validation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Validations</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="invalid">Invalid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Backlinks Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Display Text</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usages</TableHead>
                  <TableHead>Pages Used On</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground" data-testid="text-no-backlinks">
                      No backlinks found. Create your first backlink to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  backlinks.map((link: any) => (
                    <TableRow key={link.linkId} data-testid={`row-backlink-${link.linkId}`}>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={link.targetUrl}
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                          data-testid={`link-url-${link.linkId}`}
                        >
                          {link.targetUrl}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell data-testid={`text-display-${link.linkId}`}>
                        {link.displayText || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-type-${link.linkId}`}>
                          {link.linkType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(link.status)}</TableCell>
                      <TableCell data-testid={`text-usages-${link.linkId}`}>{link.usageCount || 0}</TableCell>
                      <TableCell>
                        {link.usages && link.usages.length > 0 ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                data-testid={`button-view-pages-${link.linkId}`}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                View Pages ({link.usages.length})
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" data-testid={`popover-pages-${link.linkId}`}>
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Pages using this link:</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {link.usages.map((usage: any, idx: number) => (
                                    <div
                                      key={`${usage.contentType}-${usage.contentId}-${idx}`}
                                      className="p-2 bg-secondary rounded-md"
                                      data-testid={`usage-${link.linkId}-${idx}`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <Badge variant="outline" className="mb-1" data-testid={`badge-content-type-${link.linkId}-${idx}`}>
                                            {formatContentType(usage.contentType)}
                                          </Badge>
                                          <p className="text-sm font-medium" data-testid={`text-content-title-${link.linkId}-${idx}`}>
                                            {usage.contentTitle || `ID: ${usage.contentId}`}
                                          </p>
                                          {usage.fieldName && (
                                            <p className="text-xs text-muted-foreground" data-testid={`text-field-name-${link.linkId}-${idx}`}>
                                              Field: {usage.fieldName}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-sm text-muted-foreground" data-testid={`text-no-pages-${link.linkId}`}>No pages</span>
                        )}
                      </TableCell>
                      <TableCell>{getValidationIcon(link.validationStatus || 'pending')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${link.linkId}`}
                            onClick={() => {
                              setEditingLink(link);
                              setEditForm({
                                targetUrl: link.targetUrl,
                                displayText: link.displayText || "",
                                linkType: link.linkType,
                                notes: link.notes || "",
                                status: link.status
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${link.linkId}`}
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this backlink?')) {
                                deleteMutation.mutate(link.linkId);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
