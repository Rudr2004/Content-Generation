import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface AllPostsProps {
  posts: any[];
  onEdit: (post: any) => void;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
  onSchedule: (id: number, scheduledDate: Date) => void;
  onRefetch: () => void;
}

export function AllPosts({ posts, onEdit, onDelete, onPublish, onSchedule, onRefetch }: AllPostsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    return filtered;
  }, [posts, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      draft: { variant: "secondary" as const, color: "bg-orange-100 text-orange-800" },
      scheduled: { variant: "outline" as const, color: "bg-blue-100 text-blue-800" }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  const handleSchedulePost = (post: any) => {
    setSelectedPost(post);
    setShowScheduleDialog(true);
  };

  const handleScheduleConfirm = () => {
    if (selectedPost && scheduledDate) {
      onSchedule(selectedPost.id, new Date(scheduledDate));
      setShowScheduleDialog(false);
      setSelectedPost(null);
      setScheduledDate("");
    }
  };

  const handlePublishNow = (post: any) => {
    onPublish(post.id);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "All Posts" :
                  statusFilter === "published" ? "Published" :
                    statusFilter === "draft" ? "Draft" : "Scheduled"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>
                Scheduled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-gray-500">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Three-Column Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="h-full flex flex-col overflow-hidden">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight heading-georgia mb-2">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={getStatusBadge(post.status).variant}
                      className={getStatusBadge(post.status).color}
                    >
                      {post.status}
                    </Badge>
                    {post.status === 'scheduled' && post.scheduledAt && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        {/* <Clock className="h-3 w-3" /> */}
                        {format(new Date(post.scheduledAt), 'MMM d, yyyy HH:mm')}
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {post.status === 'draft' && (
                      <>
                        <DropdownMenuItem onClick={() => handlePublishNow(post)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSchedulePost(post)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(post.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 text-poppins">
                {post.excerpt || post.content?.substring(0, 150) + '...'}
              </p>

              <div className="mt-auto space-y-3">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </div>
                  {post.status === 'published' && post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Published
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 heading-georgia">
              No posts found
            </h3>
            <p className="text-gray-600 text-poppins">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first blog post to get started"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Post Title
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {selectedPost?.title}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Scheduled Date & Time
              </label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleScheduleConfirm}
                disabled={!scheduledDate}
                className="flex-1"
              >
                Schedule Post
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}