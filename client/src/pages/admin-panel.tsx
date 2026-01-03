import { useState } from "react";
import { BlogDashboard } from "@/components/blog-dashboard";
import { BlogList } from "@/components/blog-list";
import { AllPosts } from "@/components/all-posts";
import { ScheduledPosts } from "@/components/scheduled-posts";
import { BlogForm } from "@/components/blog-form";
import { SEOBlogGenerator } from "@/components/seo-blog-generator";
import { SEOKeywordGenerator } from "@/components/seo-keyword-generator";
import { UserManagement } from "@/components/user-management";
import { AuthorManagement } from "@/components/author-management";
import { ServiceManagement } from "@/components/service-management";
import CategoryManagement from "@/components/category-management";
// Page Management removed from service section
import ResponsiveServiceNavigation from "@/components/responsive-service-navigation";
import EnhancedServiceManagement from "@/components/enhanced-service-management";

import { CaseStudyManagement } from "@/pages/admin/CaseStudyManagement";
import { SimplifiedCaseStudyCMS } from "@/components/simplified-case-study-cms";
import { TechnologyManagement } from "@/components/technology-management";
import { HireDeveloperManagement } from "@/components/hire-developer-management";
import { IndustryManagement } from "@/components/industry-management";
import AiServicePages from "@/pages/admin/AiServicePages";
import { SEODashboard } from "@/components/seo-dashboard";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  Search,
  BookOpen,
  Briefcase,
  UserPlus,
  LogOut,
  User,
  Settings,
  Grid3X3,
  FolderOpen,
  Cpu,
  Factory,
} from "lucide-react";
import logoImg from "@assets/Logo A_1752582606982.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { canManageUsers } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeMainSection, setActiveMainSection] = useState("blog");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeServiceTab, setActiveServiceTab] = useState("management");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showSEOGenerator, setShowSEOGenerator] = useState(false);
  const [showKeywordGenerator, setShowKeywordGenerator] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ["/api/blog"],
    enabled: activeMainSection === "blog",
  }) as { data: any[]; refetch: any };

  const { data: scheduledPosts = [], refetch: refetchScheduledPosts } =
    useQuery({
      queryKey: ["/api/scheduled-posts"],
      enabled: activeMainSection === "blog",
    }) as { data: any[]; refetch: any };

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/blog-stats"],
    enabled: activeMainSection === "blog",
  }) as { data: any; refetch: any };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      return response.json();
    },
    onSuccess: () => {
      refetchPosts();
      refetchStats();
      refetchScheduledPosts();
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
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
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (!response.ok) throw new Error("Failed to publish post");
      return response.json();
    },
    onSuccess: () => {
      refetchPosts();
      refetchStats();
      refetchScheduledPosts();
      toast({
        title: "Success",
        description: "Blog post published successfully",
      });
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
    mutationFn: async ({
      id,
      scheduledDate,
    }: {
      id: number;
      scheduledDate: Date;
    }) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "scheduled",
          scheduledAt: scheduledDate.toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to schedule post");
      return response.json();
    },
    onSuccess: () => {
      refetchPosts();
      refetchStats();
      refetchScheduledPosts();
      toast({
        title: "Success",
        description: "Blog post scheduled successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule blog post",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleSuccess = () => {
    refetchPosts();
    refetchStats();
    refetchScheduledPosts();
    handleCloseForm();
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handlePublish = (id: number) => {
    publishMutation.mutate(id);
  };

  const handleSchedule = (id: number, scheduledDate: Date) => {
    scheduleMutation.mutate({ id, scheduledDate });
  };

  const handleUpdateSchedule = (id: number, scheduledDate: Date) => {
    scheduleMutation.mutate({ id, scheduledDate });
  };

  const handleSEOGenerate = (generatedContent: any) => {
    // For AI-generated content, we treat it as a new post (no id)
    // This ensures the form will use create mutation instead of update
    setEditingPost({
      ...generatedContent,
      id: null, // Explicitly set id to null to indicate this is a new post
    });
    setIsEditing(true);
    setShowSEOGenerator(false);
  };

  const renderBlogSection = () => {
    if (showSEOGenerator) {
      return (
        <SEOBlogGenerator
          onGenerate={handleSEOGenerate}
          onClose={() => setShowSEOGenerator(false)}
        />
      );
    }

    if (showKeywordGenerator) {
      return (
        <SEOKeywordGenerator onClose={() => setShowKeywordGenerator(false)} />
      );
    }

    if (isEditing) {
      return (
        <BlogForm
          post={editingPost}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
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
              <FileText className="h-4 w-4" />
              All Posts
              <Badge variant="secondary" className="ml-1">
                {posts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
              <Badge variant="secondary" className="ml-1">
                {scheduledPosts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Authors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <BlogDashboard stats={stats} posts={posts} />
          </TabsContent>

          <TabsContent value="all-posts">
            <AllPosts
              posts={posts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPublish={handlePublish}
              onSchedule={handleSchedule}
              onRefetch={refetchPosts}
            />
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledPosts
              scheduledPosts={scheduledPosts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateSchedule={handleUpdateSchedule}
              onRefetch={refetchScheduledPosts}
            />
          </TabsContent>

          <TabsContent value="authors">
            <AuthorManagement />
          </TabsContent>

          <TabsContent value="editor">
            <BlogForm
              post={editingPost}
              onClose={handleCloseForm}
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderServiceSection = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Services & Categories
          </h2>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full hidden sm:block">
            Three-Layer Hierarchy Management
          </div>
        </div>

        {/* Responsive layout with navigation sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Service Navigation Sidebar - responsive */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ResponsiveServiceNavigation
              className="sticky top-4"
              onPageClick={(page) => {
                // Handle page click in service management
                console.log("Page clicked:", page);
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs
              value={activeServiceTab}
              onValueChange={setActiveServiceTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4 sm:mb-6 h-auto sm:h-10">
                <TabsTrigger
                  value="management"
                  className="text-xs sm:text-sm py-2 sm:py-0"
                >
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Service</span> Management
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="text-xs sm:text-sm py-2 sm:py-0"
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Category</span> Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="management" className="mt-4 sm:mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Service Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create and manage custom services. Page names will only be
                      displayed when admin creates custom service pages.
                    </p>
                  </div>
                  <EnhancedServiceManagement />
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-4 sm:mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Category Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage service categories (Level 1 of the three-layer
                      hierarchy).
                    </p>
                  </div>
                  <CategoryManagement />
                </div>
              </TabsContent>

              {/* Page Management removed - services now handle pages internally */}
            </Tabs>
          </div>
        </div>

        {/* Mobile-specific compact navigation */}
        <div className="lg:hidden mt-6">
          <ResponsiveServiceNavigation
            compact={true}
            className="mb-4"
            onPageClick={(page) => {
              // Handle page click in service management
              console.log("Page clicked:", page);
            }}
          />
        </div>
      </div>
    );
  };

  const renderHireDeveloperSection = () => {
    return <HireDeveloperManagement />;
  };

  const renderUsersSection = () => {
    return <UserManagement />;
  };

  const renderCaseStudiesSection = () => {
    return <CaseStudyManagement />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src={logoImg}
                alt="GreenAppleX"
                className="h-8 w-8 rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded flex items-center justify-center text-white font-bold text-xs">
                        GA
                      </div>
                    `;
                  }
                }}
              />
              <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.firstName || user?.email}</span>
                <Badge variant="outline">{user?.role.replace("_", " ")}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/profile")}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/blog", "_blank")}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Blog
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/", "_blank")}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                View Website
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <nav className="mt-8 px-4 space-y-2">
            <button
              onClick={() => setActiveMainSection("blog")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "blog"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Blog
            </button>
            <button
              onClick={() => setActiveMainSection("service")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "service"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Service
            </button>

            <button
              onClick={() => setActiveMainSection("hire-developer")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "hire-developer"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <UserPlus className="h-5 w-5 mr-3" />
              Hire Developer
            </button>
            <button
              onClick={() => setActiveMainSection("case-studies")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "case-studies"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FolderOpen className="h-5 w-5 mr-3" />
              Case Studies
            </button>

            <button
              onClick={() => setActiveMainSection("industry")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "industry"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Factory className="h-5 w-5 mr-3" />
              Industry
            </button>

            {/* Authors section */}
            <button
              onClick={() => setActiveMainSection("authors")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "authors"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              Authors
            </button>

            {/* Technology section */}
            <button
              onClick={() => setActiveMainSection("technologies")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "technologies"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Cpu className="h-5 w-5 mr-3" />
              Technologies
            </button>

            {/* SEO Dashboard section */}
            <button
              onClick={() => setActiveMainSection("seo")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeMainSection === "seo"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Search className="h-5 w-5 mr-3" />
              SEO Dashboard
            </button>

            {/* Users section - only show for super_admin and user_admin */}
            {canManageUsers(user) && (
              <button
                onClick={() => setActiveMainSection("users")}
                className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                  activeMainSection === "users"
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Users
              </button>
            )}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-8 py-8">
          {activeMainSection === "blog" && renderBlogSection()}
          {activeMainSection === "service" && renderServiceSection()}
          {activeMainSection === "hire-developer" &&
            renderHireDeveloperSection()}
          {activeMainSection === "case-studies" && renderCaseStudiesSection()}
          {activeMainSection === "industry" && <IndustryManagement />}
          {activeMainSection === "ai-service-pages" && <AiServicePages />}
          {activeMainSection === "authors" && <AuthorManagement />}
          {activeMainSection === "technologies" && <TechnologyManagement />}
          {activeMainSection === "seo" && <SEODashboard />}
          {activeMainSection === "users" && renderUsersSection()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img
                src={logoImg}
                alt="GreenAppleX"
                className="h-5 w-5 rounded"
              />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                GreenAppleX
              </span>
            </div>
            <span className="text-gray-500 text-sm ml-2">
              © 2025 GreenAppleX. All rights reserved. | Blog Content
              Management System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
