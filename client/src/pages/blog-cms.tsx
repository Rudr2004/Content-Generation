```javascript
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, FileText, Clock, Grid3X3, Settings, Globe } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";
import { BlogForm } from "@/components/blog-form";
import { BlogList } from "@/components/blog-list";
import { BlogDashboard } from "@/components/blog-dashboard";
import { AllPosts } from "@/components/all-posts";
import { ScheduledPosts } from "@/components/scheduled-posts";
import { ServiceManagement } from "@/components/service-management";
import { SEOHead } from "@/components/seo-head";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoImg from "@assets/Logo A_1752582606982.jpg";

export default function BlogCMS() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const queryClient = useQueryClient();

  const { data: posts = [], refetch } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/blog-stats"],
    queryFn: async () => {
      const response = await fetch("/api/blog-stats");
      return response.json();
    },
  });

  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ["/api/scheduled-posts"],
    queryFn: async () => {
      const response = await fetch("/api/scheduled-posts");
      return response.json();
    },
  });

  const handleNewPost = () => {
    setEditingPost(null);
    setShowForm(true);
    setActiveTab("editor");
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
    setActiveTab("editor");
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    refetch();
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/ api / blog / ${ id } `);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/ api / blog / ${ id } `, {
        status: "published",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post published successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish blog post",
        variant: "destructive",
      });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ id, scheduledDate }: { id: number; scheduledDate: Date }) => {
      const response = await apiRequest("PUT", `/ api / blog / ${ id } `, {
        status: "scheduled",
        scheduledAt: scheduledDate.toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule blog post",
        variant: "destructive",
      });
    },
  });

  const handleDeletePost = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePublishPost = (id: number) => {
    publishMutation.mutate(id);
  };

  const handleSchedulePost = (id: number, scheduledDate: Date) => {
    scheduleMutation.mutate({ id, scheduledDate });
  };

  const handleUpdateSchedule = (id: number, scheduledDate: Date) => {
    scheduleMutation.mutate({ id, scheduledDate });
  };

  return (
    <>
      <SEOHead
        title={`Blog CMS | ${ siteName } `}
        description={`Manage blog content and track performance with ${ siteName } Blog CMS`}
        keywords={["Blog CMS", "Content Management", siteName, "Admin Panel"]}
        canonicalUrl="https://www.greenapplex.com/cms"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img
                  src={logoImg}
                  alt="GreenAppleX Logo"
                  className="h-8 w-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
  < div class="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded flex items-center justify-center text-white font-bold text-xs" >
    GA
                        </div >
  `;
                    }
                  }}
                />
                <div className="ml-4">
                  <h1 className="text-2xl font-normal bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 heading-georgia">
                    Admin Panel
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => window.open('/blog', '_blank')}
                  variant="outline"
                  className="text-poppins"
                >
                  View Blog
                </Button>
                <Button
                  onClick={() => window.open('/', '_blank')}
                  variant="outline"
                  className="text-poppins"
                >
                  View Website
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 heading-georgia">
                  Content Management System
                </h2>
                <p className="text-gray-600 mt-2 text-poppins">
                  Manage your blog content, services, and track performance
                </p>
              </div>
              <Button
                onClick={handleNewPost}
                className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="all-posts" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {editingPost ? "Edit Post" : "New Post"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <BlogDashboard stats={stats} posts={posts} />
            </TabsContent>

            <TabsContent value="all-posts" className="mt-6">
              <AllPosts
                posts={posts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onPublish={handlePublishPost}
                onSchedule={handleSchedulePost}
                onRefetch={refetch}
              />
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <ServiceManagement />
            </TabsContent>

            <TabsContent value="scheduled" className="mt-6">
              <ScheduledPosts
                scheduledPosts={scheduledPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onUpdateSchedule={handleUpdateSchedule}
                onRefetch={refetch}
              />
            </TabsContent>



            <TabsContent value="editor" className="mt-6">
              {(showForm || activeTab === "editor") && (
                <BlogForm
                  post={editingPost}
                  onClose={handleFormClose}
                  onSuccess={() => {
                    handleFormClose();
                    setActiveTab("all-posts");
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img
                  src={logoImg}
                  alt={`${ siteName } Logo`}
                  className="h-5 w-5 rounded"
                />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {siteName}
                </span>
              </div>
              <span className="text-gray-500 text-sm ml-2">
                © 2025 {siteName}. All rights reserved. | Blog Content
                Management System
              </span>
            </div>
          </div>
        </footer>
      </div>
      

    </>
  );
}