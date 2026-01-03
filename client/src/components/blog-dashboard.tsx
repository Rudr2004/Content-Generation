import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Eye, Tag, Calendar, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

interface BlogDashboardProps {
  stats: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    scheduledBlogs: number;
    topTags: { tag: string; count: number }[];
  };
  posts: any[];
}

export function BlogDashboard({ stats, posts }: BlogDashboardProps) {
  const recentPosts = posts.slice(0, 5);
  const publishedPosts = posts.filter(post => post.status === 'published').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium heading-georgia">Total Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-poppins">{stats?.totalBlogs || 0}</div>
            <p className="text-xs text-muted-foreground text-poppins">
              All posts in your blog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium heading-georgia">Published Posts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 text-poppins">{stats?.publishedBlogs || 0}</div>
            <p className="text-xs text-muted-foreground text-poppins">
              Live on your website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium heading-georgia">Draft Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 text-poppins">{stats?.draftBlogs || 0}</div>
            <p className="text-xs text-muted-foreground text-poppins">
              Waiting to be published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium heading-georgia">Scheduled Posts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 text-poppins">{stats?.scheduledBlogs || 0}</div>
            <p className="text-xs text-muted-foreground text-poppins">
              Scheduled for publishing
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 heading-georgia">
              <Tag className="h-5 w-5" />
              Top Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topTags?.length > 0 ? (
                stats.topTags.map((tag, index) => (
                  <div key={tag.tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {tag.tag}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 text-poppins">
                      {tag.count} post{tag.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 text-poppins">
                  No tags yet. Start adding tags to your blog posts.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 heading-georgia">
              <Calendar className="h-5 w-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 text-poppins">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 text-poppins">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 text-poppins">
                  No posts yet. Create your first blog post to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Published Posts Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 heading-georgia">
            <TrendingUp className="h-5 w-5" />
            Published Posts Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publishedPosts.length > 0 ? (
              publishedPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-poppins">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 text-poppins">
                        {post.excerpt || post.content?.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Published {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                        </div>
                        <div>Slug: /{post.slug}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 text-poppins">
                No published posts yet. Publish your first blog post to see it here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}