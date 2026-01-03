import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface BlogListProps {
  posts: any[];
  onEdit: (post: any) => void;
  onRefetch: () => void;
}

export function BlogList({ posts, onEdit, onRefetch }: BlogListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/blog/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Blog post deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      onRefetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await fetch(`/api/blog/search/${encodeURIComponent(query)}`);
        const results = await response.json();
        setFilteredPosts(results);
      } catch (error) {
        console.error("Search error:", error);
        setFilteredPosts([]);
      }
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Update filtered posts when posts change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts);
    }
  }, [posts, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 text-poppins"
          />
        </div>
        <div className="text-sm text-gray-500 text-poppins">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 heading-georgia">
                {searchQuery ? "No posts found" : "No blog posts yet"}
              </h3>
              <p className="text-gray-400 text-center mt-2 text-poppins">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Create your first blog post to get started"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </div>
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Published {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 heading-georgia">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2 text-poppins">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 text-poppins">
                    Slug: /{post.slug}
                  </div>
                </div>
                {post.imageUrl && (
                  <div className="mt-4">
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full text-gray-400">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}