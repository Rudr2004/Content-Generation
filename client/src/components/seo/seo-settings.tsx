import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  X
} from "lucide-react";

interface SEOSetting {
  id: number;
  settingKey: string;
  settingValue: string | null;
  description: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SEOSettingsProps {}

export function SEOSettings({}: SEOSettingsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSetting, setNewSetting] = useState({
    settingKey: "",
    settingValue: "",
    description: "",
    category: "global"
  });
  const [editingSetting, setEditingSetting] = useState({
    settingKey: "",
    settingValue: "",
    description: "",
    category: "global"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settingsResponse, isLoading } = useQuery<{success: boolean, settings: SEOSetting[]}>({
    queryKey: ["/api/seo/settings"],
  });

  const settings = settingsResponse?.settings || [];

  const createMutation = useMutation({
    mutationFn: async (setting: typeof newSetting) => {
      const response = await apiRequest("POST", "/api/seo/settings", setting);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/settings"] });
      setIsCreating(false);
      setNewSetting({ settingKey: "", settingValue: "", description: "", category: "global" });
      toast({
        title: "Success",
        description: "SEO setting created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create SEO setting",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SEOSetting> }) => {
      const response = await apiRequest("PUT", `/api/seo/settings/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/settings"] });
      setEditingId(null);
      toast({
        title: "Success",
        description: "SEO setting updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update SEO setting",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/seo/settings/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/settings"] });
      toast({
        title: "Success",
        description: "SEO setting deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete SEO setting",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "global": return "default";
      case "technical": return "secondary";
      case "social": return "outline";
      case "analytics": return "destructive";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" data-testid="text-settings-title">SEO Settings</h3>
          <p className="text-sm text-muted-foreground" data-testid="text-settings-description">
            Manage global SEO configuration and technical settings
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-add-setting">
          <Plus className="h-4 w-4 mr-2" />
          Add Setting
        </Button>
      </div>

      {/* Create New Setting */}
      {isCreating && (
        <Card data-testid="card-create-setting">
          <CardHeader>
            <CardTitle>Create New SEO Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="settingKey">Setting Key</Label>
                <Input
                  id="settingKey"
                  value={newSetting.settingKey}
                  onChange={(e) => setNewSetting({ ...newSetting, settingKey: e.target.value })}
                  placeholder="e.g., meta_robots, canonical_base"
                  data-testid="input-setting-key"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newSetting.category}
                  onValueChange={(value) => setNewSetting({ ...newSetting, category: value })}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="settingValue">Setting Value</Label>
              <Input
                id="settingValue"
                value={newSetting.settingValue}
                onChange={(e) => setNewSetting({ ...newSetting, settingValue: e.target.value })}
                placeholder="Setting value"
                data-testid="input-setting-value"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Describe what this setting controls"
                data-testid="textarea-description"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => createMutation.mutate(newSetting)} 
                disabled={!newSetting.settingKey || createMutation.isPending}
                data-testid="button-save-setting"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Setting
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                data-testid="button-cancel-setting"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Setting Form */}
      {editingId && (
        <Card data-testid="card-edit-setting">
          <CardHeader>
            <CardTitle>Edit SEO Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="editSettingKey">Setting Key</Label>
                <Input
                  id="editSettingKey"
                  value={editingSetting.settingKey}
                  onChange={(e) => setEditingSetting({ ...editingSetting, settingKey: e.target.value })}
                  placeholder="e.g., meta_robots, canonical_base"
                  data-testid="input-edit-setting-key"
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select
                  value={editingSetting.category}
                  onValueChange={(value) => setEditingSetting({ ...editingSetting, category: value })}
                >
                  <SelectTrigger data-testid="select-edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editSettingValue">Setting Value</Label>
              <Input
                id="editSettingValue"
                value={editingSetting.settingValue}
                onChange={(e) => setEditingSetting({ ...editingSetting, settingValue: e.target.value })}
                placeholder="Setting value"
                data-testid="input-edit-setting-value"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editingSetting.description}
                onChange={(e) => setEditingSetting({ ...editingSetting, description: e.target.value })}
                placeholder="Describe what this setting controls"
                data-testid="textarea-edit-description"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => updateMutation.mutate({ id: editingId, data: editingSetting })} 
                disabled={!editingSetting.settingKey || updateMutation.isPending}
                data-testid="button-save-edit-setting"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setEditingSetting({ settingKey: "", settingValue: "", description: "", category: "global" });
                }}
                data-testid="button-cancel-edit-setting"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings List */}
      <div className="space-y-4">
        {settings.length === 0 ? (
          <Card data-testid="card-no-settings">
            <CardContent className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No SEO Settings</h3>
              <p className="text-muted-foreground mb-4">
                Create your first SEO setting to start managing your site configuration
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Setting
              </Button>
            </CardContent>
          </Card>
        ) : (
          settings.map((setting) => (
            <Card key={setting.id} data-testid={`card-setting-${setting.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium" data-testid={`text-setting-key-${setting.id}`}>
                        {setting.settingKey}
                      </h4>
                      <Badge variant={getCategoryColor(setting.category)} data-testid={`badge-category-${setting.id}`}>
                        {setting.category || "uncategorized"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-setting-value-${setting.id}`}>
                      Value: {setting.settingValue || "Not set"}
                    </p>
                    {setting.description && (
                      <p className="text-sm text-gray-600" data-testid={`text-setting-description-${setting.id}`}>
                        {setting.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Updated: {new Date(setting.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingId(setting.id);
                        setEditingSetting({
                          settingKey: setting.settingKey,
                          settingValue: setting.settingValue || "",
                          description: setting.description || "",
                          category: setting.category || "global"
                        });
                      }}
                      data-testid={`button-edit-${setting.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(setting.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${setting.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}