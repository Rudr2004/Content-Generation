import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle, Save, Eye, X, Plus, Wand2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertBlogPostSchema } from "@shared/schema";
import { z } from "zod";
import { SEOBlogGenerator } from "./seo-blog-generator";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

interface BlogFormProps {
  post?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PREDEFINED_TAGS = [
  "Web3",
  "AI and Machine Learning",
  "Mobile Development",
  "Software Engineering",
  "Digital Transformation"
];

const blogFormSchema = insertBlogPostSchema.extend({
  tagsInput: z.string().optional(),
  scheduledAt: z.string().optional(),
  authorId: z.number().optional(),
});

export function BlogForm({ post, onClose, onSuccess }: BlogFormProps) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>(Array.isArray(post?.tags) ? post.tags : []);
  const [tagInput, setTagInput] = useState("");
  const [showSEOGenerator, setShowSEOGenerator] = useState(false);

  // Fetch authors for selection
  const { data: authors = [] } = useQuery({
    queryKey: ["/api/authors"],
    queryFn: async () => {
      const response = await fetch("/api/authors");
      return response.json();
    },
  });

  const form = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      tags: Array.isArray(post?.tags) ? post.tags : [],
      imageUrl: post?.imageUrl || "",
      imageAlt: post?.imageAlt || "",
      metaTitle: post?.metaTitle || "",
      metaDescription: post?.metaDescription || "",
      keywords: post?.keywords || "",
      status: post?.status || "draft",
      scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "",
      authorId: post?.authorId || undefined,
      tagsInput: "",
    },
  });

  const title = form.watch("title");
  const content = form.watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !post) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [title, post, form]);

  // Auto-generate meta description if empty
  const generateMetaDescription = () => {
    if (content) {
      const plainText = content.replace(/<[^>]*>/g, "");
      const metaDesc = plainText.substring(0, 155) + (plainText.length > 155 ? "..." : "");
      form.setValue("metaDescription", metaDesc);
    }
  };

  // Auto-suggest meta title
  useEffect(() => {
    if (title && !form.getValues("metaTitle")) {
      form.setValue("metaTitle", `${title} | ${siteName} Blog`);
    }
  }, [title, form, siteName]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = Array.isArray(tags) ? tags : [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()];
        setTags(newTags);
        form.setValue("tags", newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = Array.isArray(tags) ? tags : [];
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/blog", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/blog/${post.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Blog post updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-stats"] });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const { tagsInput, ...blogData } = data;
    blogData.tags = tags;

    // Handle scheduledAt conversion
    if (blogData.scheduledAt) {
      blogData.scheduledAt = new Date(blogData.scheduledAt).toISOString();
    }

    // Remove empty/undefined fields
    Object.keys(blogData).forEach(key => {
      if (blogData[key] === '' || blogData[key] === undefined) {
        delete blogData[key];
      }
    });

    // Check if this is an existing post (has valid id) or a new post
    if (post && post.id && post.id !== null) {
      updateMutation.mutate(blogData);
    } else {
      createMutation.mutate(blogData);
    }
  };

  const handleSEOGenerate = (generatedContent: any) => {
    // Fill the form with generated content
    form.setValue("title", generatedContent.title);
    form.setValue("slug", generatedContent.slug);
    form.setValue("content", generatedContent.content);
    form.setValue("excerpt", generatedContent.excerpt);
    form.setValue("metaTitle", generatedContent.metaTitle);
    form.setValue("metaDescription", generatedContent.metaDescription);
    form.setValue("keywords", generatedContent.keywords);
    form.setValue("imageUrl", generatedContent.imageUrl);
    form.setValue("imageAlt", generatedContent.imageAlt);

    // Update tags - ensure it's an array
    const tagsArray = Array.isArray(generatedContent.tags) ? generatedContent.tags : [];
    setTags(tagsArray);
    form.setValue("tags", tagsArray);

    setShowSEOGenerator(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold heading-georgia">
            {post ? "Edit Blog Post" : "Create New Blog Post"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {!post && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSEOGenerator(true)}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI SEO Generator
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-poppins">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog post title"
                        {...field}
                        className="text-poppins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-poppins">Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated-slug"
                        {...field}
                        className="text-poppins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-poppins">Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the post"
                      {...field}
                      rows={3}
                      className="text-poppins"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-poppins">Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Write your blog post content here..."
                      rows={10}
                      className="text-poppins"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-poppins">Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        className="text-poppins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-poppins">Image Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe the image"
                        {...field}
                        className="text-poppins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-poppins">Tags</FormLabel>
              <div className="mt-2 space-y-3">
                {/* Predefined Tags */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-poppins">Select from predefined tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={Array.isArray(tags) && tags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${Array.isArray(tags) && tags.includes(tag)
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-50"
                          }`}
                        onClick={() => {
                          const currentTags = Array.isArray(tags) ? tags : [];
                          if (currentTags.includes(tag)) {
                            removeTag(tag);
                          } else {
                            const newTags = [...currentTags, tag];
                            setTags(newTags);
                            form.setValue("tags", newTags);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Custom Tag Input */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-poppins">Or add custom tags:</p>
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="text-poppins"
                  />
                </div>

                {/* Selected Tags */}
                {Array.isArray(tags) && tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-poppins">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 heading-georgia">SEO Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-poppins">Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title"
                          {...field}
                          className="text-poppins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-poppins">Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO keywords, separated by commas"
                          {...field}
                          className="text-poppins"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-poppins">Meta Description</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateMetaDescription}
                      >
                        <Wand2 className="h-4 w-4 mr-1" />
                        Auto-generate
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="SEO description"
                        {...field}
                        rows={3}
                        className="text-poppins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-poppins">Author</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors.map((author: any) => (
                            <SelectItem key={author.id} value={author.id.toString()}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-poppins">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === "scheduled" && (
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-poppins">Scheduled Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className="text-poppins"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      {post ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {post ? "Update Post" : "Create Post"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      {showSEOGenerator && (
        <SEOBlogGenerator
          onGenerate={handleSEOGenerate}
          onClose={() => setShowSEOGenerator(false)}
        />
      )}
    </Card>
  );
}