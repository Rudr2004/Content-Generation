import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2
} from "lucide-react";

interface SEOKeyword {
  id: number;
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  category: string | null;
  targetRanking: number;
  currentRanking: number | null;
  status: string;
  notes: string | null;
}

export function SEOKeywords() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newKeyword, setNewKeyword] = useState({
    keyword: "",
    category: "",
    targetRanking: 1,
    searchVolume: null as number | null,
    difficulty: null as number | null
  });
  const [editingKeyword, setEditingKeyword] = useState({
    keyword: "",
    category: "",
    targetRanking: 1,
    searchVolume: null as number | null,
    difficulty: null as number | null,
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keywordsResponse, isLoading } = useQuery<{success: boolean, keywords: SEOKeyword[]}>({
    queryKey: ["/api/seo/keywords"],
  });

  const keywords = keywordsResponse?.keywords || [];

  const createMutation = useMutation({
    mutationFn: async (keyword: typeof newKeyword) => {
      const response = await apiRequest("POST", "/api/seo/keywords", keyword);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/keywords"] });
      setIsCreating(false);
      setNewKeyword({ keyword: "", category: "", targetRanking: 1, searchVolume: null, difficulty: null });
      toast({
        title: "Success",
        description: "Keyword added successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SEOKeyword> }) => {
      const response = await apiRequest("PUT", `/api/seo/keywords/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/keywords"] });
      setEditingId(null);
      toast({
        title: "Success",
        description: "Keyword updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/seo/keywords/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/keywords"] });
      toast({
        title: "Success",
        description: "Keyword deleted successfully",
      });
    },
  });

  const getRankingColor = (current: number | null, target: number) => {
    if (!current) return "text-gray-500";
    if (current <= target) return "text-green-500";
    if (current <= target * 2) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "tracking": return "secondary";
      case "inactive": return "outline";
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
          <h3 className="text-lg font-semibold">SEO Keywords</h3>
          <p className="text-sm text-muted-foreground">
            Track and monitor keyword performance
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Keyword
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Keyword</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                  placeholder="Enter keyword phrase"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newKeyword.category}
                  onChange={(e) => setNewKeyword({ ...newKeyword, category: e.target.value })}
                  placeholder="e.g., primary, secondary, long-tail"
                />
              </div>
              <div>
                <Label htmlFor="searchVolume">Search Volume</Label>
                <Input
                  id="searchVolume"
                  type="number"
                  value={newKeyword.searchVolume || ""}
                  onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Monthly search volume"
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty (1-100)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max="100"
                  value={newKeyword.difficulty || ""}
                  onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value ? Number(e.target.value) : null })}
                  placeholder="SEO difficulty"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => createMutation.mutate(newKeyword)} 
                disabled={!newKeyword.keyword || createMutation.isPending}
              >
                Add Keyword
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Keyword Form */}
      {editingId && (
        <Card data-testid="card-edit-keyword">
          <CardHeader>
            <CardTitle>Edit SEO Keyword</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="editKeyword">Keyword</Label>
                <Input
                  id="editKeyword"
                  value={editingKeyword.keyword}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, keyword: e.target.value })}
                  placeholder="Enter keyword phrase"
                  data-testid="input-edit-keyword"
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Input
                  id="editCategory"
                  value={editingKeyword.category}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, category: e.target.value })}
                  placeholder="e.g., primary, secondary, long-tail"
                  data-testid="input-edit-category"
                />
              </div>
              <div>
                <Label htmlFor="editSearchVolume">Search Volume</Label>
                <Input
                  id="editSearchVolume"
                  type="number"
                  value={editingKeyword.searchVolume || ""}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, searchVolume: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Monthly search volume"
                  data-testid="input-edit-search-volume"
                />
              </div>
              <div>
                <Label htmlFor="editDifficulty">Difficulty (1-100)</Label>
                <Input
                  id="editDifficulty"
                  type="number"
                  min="1"
                  max="100"
                  value={editingKeyword.difficulty || ""}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, difficulty: e.target.value ? Number(e.target.value) : null })}
                  placeholder="SEO difficulty"
                  data-testid="input-edit-difficulty"
                />
              </div>
              <div>
                <Label htmlFor="editTargetRanking">Target Ranking</Label>
                <Input
                  id="editTargetRanking"
                  type="number"
                  min="1"
                  value={editingKeyword.targetRanking}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, targetRanking: Number(e.target.value) || 1 })}
                  placeholder="Target ranking position"
                  data-testid="input-edit-target-ranking"
                />
              </div>
              <div>
                <Label htmlFor="editNotes">Notes</Label>
                <Input
                  id="editNotes"
                  value={editingKeyword.notes}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, notes: e.target.value })}
                  placeholder="Additional notes"
                  data-testid="input-edit-notes"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => updateMutation.mutate({ id: editingId, data: editingKeyword })} 
                disabled={!editingKeyword.keyword || updateMutation.isPending}
                data-testid="button-save-edit-keyword"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setEditingKeyword({ keyword: "", category: "", targetRanking: 1, searchVolume: null, difficulty: null, notes: "" });
                }}
                data-testid="button-cancel-edit-keyword"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {keywords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Keywords</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking keywords to monitor your SEO performance
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Keyword
              </Button>
            </CardContent>
          </Card>
        ) : (
          keywords.map((keyword) => (
            <Card key={keyword.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{keyword.keyword}</h4>
                      <Badge variant={getStatusBadge(keyword.status)}>
                        {keyword.status}
                      </Badge>
                      {keyword.category && (
                        <Badge variant="outline">{keyword.category}</Badge>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Volume:</span> {keyword.searchVolume || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span> {keyword.difficulty || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium">Target:</span> #{keyword.targetRanking}
                      </div>
                      <div className={`flex items-center gap-1 ${getRankingColor(keyword.currentRanking, keyword.targetRanking)}`}>
                        <span className="font-medium">Current:</span> 
                        {keyword.currentRanking ? (
                          <>
                            #{keyword.currentRanking}
                            {keyword.currentRanking <= keyword.targetRanking ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </>
                        ) : (
                          "Not ranked"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingId(keyword.id);
                        setEditingKeyword({
                          keyword: keyword.keyword,
                          category: keyword.category || "",
                          targetRanking: keyword.targetRanking,
                          searchVolume: keyword.searchVolume,
                          difficulty: keyword.difficulty,
                          notes: keyword.notes || ""
                        });
                      }}
                      data-testid={`button-edit-${keyword.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(keyword.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${keyword.id}`}
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