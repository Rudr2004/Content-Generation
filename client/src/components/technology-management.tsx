import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Technology {
  id: number;
  name: string;
  category: string;
  iconType: string;
  iconData?: string;
  iconColor?: string;
  description?: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const TECHNOLOGY_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "AI/ML",
  "Blockchain",
  "Mobile",
  "Language",
  "API",
  "Communication",
  "Security",
  "Testing",
  "Analytics",
];

export function TechnologyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    iconType: "text",
    iconData: "",
    iconColor: "#000000",
    description: "",
    status: "active",
    displayOrder: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch technologies safely
  const { data: techData, isLoading } = useQuery({
    queryKey: ["/api/technologies"],
    queryFn: async () => {
      const res = await fetch("/api/technologies");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const technologies: Technology[] = techData || [];

  // Group technologies by category safely
  const groupedTechnologies: Record<string, Technology[]> = technologies.reduce(
    (acc: Record<string, Technology[]>, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {}
  );

  // Filtered technologies for category filter
  const filteredTechnologies =
    selectedCategory === "all"
      ? technologies
      : technologies.filter((t) => t.category === selectedCategory);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      iconType: "text",
      iconData: "",
      iconColor: "#000000",
      description: "",
      status: "active",
      displayOrder: 0,
    });
    setEditingTech(null);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create technology");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      toast({ title: "Technology created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create technology", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/technologies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update technology");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      toast({ title: "Technology updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update technology", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/technologies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete technology");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      toast({ title: "Technology deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete technology", variant: "destructive" });
    },
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTech) updateMutation.mutate({ id: editingTech.id, data: formData });
    else createMutation.mutate(formData);
  };

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      category: tech.category,
      iconType: tech.iconType,
      iconData: tech.iconData || "",
      iconColor: tech.iconColor || "#000000",
      description: tech.description || "",
      status: tech.status,
      displayOrder: tech.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this technology?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technology Management</h1>
          <p className="text-muted-foreground">Manage technologies for service pages</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTech ? "Edit Technology" : "Add Technology"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Technology name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TECHNOLOGY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon (Text/Emoji)</Label>
                <Input
                  value={formData.iconData}
                  onChange={(e) => setFormData((prev) => ({ ...prev, iconData: e.target.value }))}
                  placeholder="e.g., ⚛️"
                />
              </div>

              <div>
                <Label>Icon Color</Label>
                <Input
                  type="color"
                  value={formData.iconColor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, iconColor: e.target.value }))}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">{editingTech ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All ({technologies.length})
        </Button>
        {TECHNOLOGY_CATEGORIES.map((cat) => {
          const count = groupedTechnologies[cat]?.length || 0;
          if (count === 0) return null;
          return (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} ({count})
            </Button>
          );
        })}
      </div>

      {/* Grid View */}
      <Tabs value="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading technologies...</div>
          ) : filteredTechnologies.length === 0 ? (
            <div className="text-center py-8">
              <p>No technologies found.</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Add First Technology
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTechnologies.map((tech) => (
                <Card key={tech.id} className="relative group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tech.iconData && <span style={{ color: tech.iconColor }}>{tech.iconData}</span>}
                        <CardTitle>{tech.name}</CardTitle>
                      </div>
                      <Badge variant={tech.status === "active" ? "default" : "secondary"}>
                        {tech.status}
                      </Badge>
                    </div>
                    <CardDescription>{tech.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {tech.description && <p className="text-sm mb-3">{tech.description}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Order: {tech.displayOrder}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(tech)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(tech.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-4">
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Icon</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechnologies.map((tech) => (
                  <tr key={tech.id} className="border-b">
                    <td className="p-3">{tech.name}</td>
                    <td className="p-3">{tech.category}</td>
                    <td className="p-3">{tech.iconData && <span style={{ color: tech.iconColor }}>{tech.iconData}</span>}</td>
                    <td className="p-3">
                      <Badge variant={tech.status === "active" ? "default" : "secondary"}>
                        {tech.status}
                      </Badge>
                    </td>
                    <td className="p-3">{tech.displayOrder}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(tech)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(tech.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
