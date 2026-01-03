import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ================= FORM SCHEMA =================
const authorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  description: z.string().optional(),
});
type AuthorFormData = z.infer<typeof authorSchema>;

// ================= COMPONENT =================
export function AuthorManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  // Fetch authors
  const { data: authorsData, isLoading: authorsLoading } = useQuery({
    queryKey: ["/api/authors"],
    queryFn: async () => {
      const res = await fetch("/api/authors");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
  const authors = authorsData || [];

  // Fetch blog posts
  const { data: blogPostsData, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
  const blogPosts = blogPostsData || [];

  // Count posts per author
  const getPostCountByAuthor = (authorId: number) =>
    blogPosts.filter((post: any) => post.authorId === authorId).length;

  // ================= FORM SETUP =================
  const form = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: { name: "", image: "", description: "" },
  });

  // ================= MUTATIONS =================
  const createMutation = useMutation({
    mutationFn: async (data: AuthorFormData) => {
      const res = await apiRequest("POST", "/api/authors", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      toast({ title: "Success", description: "Author created successfully" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create author",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AuthorFormData) => {
      const res = await apiRequest("PUT", `/api/authors/${editingAuthor.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      toast({ title: "Success", description: "Author updated successfully" });
      setDialogOpen(false);
      form.reset();
      setEditingAuthor(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update author",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/authors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      toast({ title: "Success", description: "Author deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete author",
        variant: "destructive",
      });
    },
  });

  // ================= HANDLERS =================
  const handleSubmit = (data: AuthorFormData) => {
    editingAuthor ? updateMutation.mutate(data) : createMutation.mutate(data);
  };

  const handleEdit = (author: any) => {
    setEditingAuthor(author);
    form.reset({
      name: author.name,
      image: author.image || "",
      description: author.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const postCount = getPostCountByAuthor(id);
    if (postCount > 0) {
      alert(
        `Cannot delete this author. They have ${postCount} blog post(s) associated. Reassign or delete posts first.`
      );
      return;
    }
    if (window.confirm("Are you sure you want to delete this author?")) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingAuthor(null);
    form.reset();
    setDialogOpen(true);
  };

  // ================= LOADING =================
  if (authorsLoading || blogLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ================= JSX =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Author Management</h2>
          <p className="text-gray-600">Manage blog authors and their profiles</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Author
        </Button>
      </div>

      {/* AUTHOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No authors found</h3>
              <p className="text-gray-600 text-center mb-4">
                Get started by adding your first author.
              </p>
              <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Author
              </Button>
            </CardContent>
          </Card>
        )}

        {authors.map((author: any) => (
          <Card key={author.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {author.image ? (
                    <SafeImage
                      src={author.image}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover"
                      fallback={
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{author.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {author.id}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getPostCountByAuthor(author.id)} blog post(s)
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {author.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{author.description}</p>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Blog Posts:</h4>
                {blogPosts.filter((post: any) => post.authorId === author.id).length > 0 ? (
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {blogPosts
                      .filter((post: any) => post.authorId === author.id)
                      .map((post: any) => (
                        <li key={post.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {post.title}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic">No blog posts yet</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(author)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(author.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIALOG FOR CREATE/EDIT */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAuthor ? "Edit Author" : "Add Author"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter author description" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? editingAuthor
                      ? "Updating..."
                      : "Creating..."
                    : editingAuthor
                      ? "Update Author"
                      : "Create Author"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
