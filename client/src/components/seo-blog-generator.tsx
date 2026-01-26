import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Wand2, Plus, X, RefreshCw, Search, Lightbulb, Save, Check, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveRegion } from "@/lib/region-resolver";

const seoGeneratorSchema = z.object({
  blogTitle: z.string().min(1, "Blog title is required"),
  primaryKeyword: z.string().min(1, "Primary keyword is required"),
  secondaryKeywords: z.string().min(1, "Secondary keywords are required (comma-separated)"),
  region: z.string().optional(),
});

const titleGeneratorSchema = z.object({
  marketTrends: z.string().optional(),
  techType: z.string().min(1, "Tech type is required"),
  blogType: z.string().min(1, "Blog type is required"),
  existingTitles: z.string().optional(),
});

interface SEOBlogGeneratorProps {
  onGenerate: (generatedContent: any) => void;
  onClose: () => void;
}

export function SEOBlogGenerator({ onGenerate, onClose }: SEOBlogGeneratorProps) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isRegeneratingContent, setIsRegeneratingContent] = useState(false);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [showTitleGenerator, setShowTitleGenerator] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(seoGeneratorSchema),
    defaultValues: {
      blogTitle: "",
      primaryKeyword: "",
      secondaryKeywords: "",
      region: resolveRegion(null, settings?.targetRegions),
    },
  });

  // Update region default when settings load
  useEffect(() => {
    if (settings && !form.getValues("region")) {
      const resolvedRegion = resolveRegion(null, settings.targetRegions);
      form.setValue("region", resolvedRegion);
    }
  }, [settings, form]);

  const titleForm = useForm({
    resolver: zodResolver(titleGeneratorSchema),
    defaultValues: {
      marketTrends: "",
      techType: "",
      blogType: "",
      existingTitles: "",
    },
  });

  const generateKeywordsMutation = useMutation({
    mutationFn: async (blogTitle: string) => {
      setIsGeneratingKeywords(true);
      const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
      if (!region || region.trim() === "") {
        throw new Error("Region is required for keyword generation. Please set a target region.");
      }
      const response = await apiRequest("POST", "/api/generate-seo-keywords", { blogTitle, region });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedKeywords(data.keywords);
      toast({
        title: "Keywords Generated Successfully",
        description: `Generated ${data.keywords.length} SEO-optimized keywords.`,
      });
    },
    onError: (error: any) => {
      console.error('Keyword generation error:', error);
      let errorMessage = "Failed to generate keywords. Please try again.";
      
      // Handle specific quota/rate limit errors
      if (error?.message?.includes('quota exceeded') || error?.message?.includes('billing details')) {
        errorMessage = "OpenAI API quota exceeded. Please check your plan and billing details, or try again later.";
      } else if (error?.message?.includes('rate limit')) {
        errorMessage = "API rate limit reached. Please wait a moment and try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Keyword Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGeneratingKeywords(false);
    },
  });

  const generateTitlesMutation = useMutation({
    mutationFn: async (data: z.infer<typeof titleGeneratorSchema>) => {
      setIsGeneratingTitles(true);
      const response = await apiRequest("POST", "/api/generate-blog-titles", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedTitles(data.titles);
      toast({
        title: "Blog Titles Generated Successfully",
        description: `Generated ${data.titles.length} unique, SEO-optimized blog titles.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Title Generation Failed",
        description: error?.message || "Failed to generate blog titles. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGeneratingTitles(false);
    },
  });

  const generateBlogMutation = useMutation({
    mutationFn: async (data: z.infer<typeof seoGeneratorSchema>) => {
      setIsGenerating(true);
      const region = data.region || resolveRegion(null, settings?.targetRegions);
      const response = await apiRequest("POST", "/api/generate-seo-blog", {
        ...data,
        region
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Blog Generated Successfully",
        description: "Your SEO-optimized blog content has been generated with OpenAI AI.",
      });
    },
    onError: (error: any) => {
      console.error('Blog generation error:', error);
      let errorMessage = "Failed to generate blog content. Please try again.";
      
      // Handle specific quota/rate limit errors
      if (error?.message?.includes('quota exceeded') || error?.message?.includes('billing details')) {
        errorMessage = "OpenAI API quota exceeded. Please check your plan and billing details, or try again later.";
      } else if (error?.message?.includes('rate limit')) {
        errorMessage = "API rate limit reached. Please wait a moment and try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Blog Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const regenerateContentMutation = useMutation({
    mutationFn: async (data: { blogTitle: string; primaryKeyword: string; secondaryKeywords: string }) => {
      setIsRegeneratingContent(true);
      const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
      const response = await apiRequest("POST", "/api/regenerate-content", {
        ...data,
        region
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent((prev: any) => ({
        ...prev,
        content: data.content,
        excerpt: data.excerpt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        tags: data.tags
      }));
      toast({
        title: "Content Regenerated",
        description: "Blog content has been regenerated with fresh AI content.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Content Regeneration Failed",
        description: error?.message || "Failed to regenerate content. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRegeneratingContent(false);
    },
  });

  const regenerateImageMutation = useMutation({
    mutationFn: async (data: { blogTitle: string; primaryKeyword: string }) => {
      setIsRegeneratingImage(true);
      const response = await apiRequest("POST", "/api/regenerate-image", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent((prev: any) => ({
        ...prev,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt
      }));
      toast({
        title: "Image Regenerated",
        description: "Blog image has been regenerated with a new AI-generated image.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Image Regeneration Failed",
        description: error?.message || "Failed to regenerate image. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRegeneratingImage(false);
    },
  });

  const storeImageMutation = useMutation({
    mutationFn: async (temporaryUrl: string) => {
      const response = await apiRequest("POST", "/api/images/store", { 
        temporaryUrl,
        prefix: 'blog-',
        folder: 'blog-images'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent((prev: any) => ({
        ...prev,
        imageUrl: data.image.permanentUrl,
        isImageStored: true
      }));
      toast({
        title: "Image Stored",
        description: "Image has been stored permanently and is ready for use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Image Storage Failed",
        description: error?.message || "Failed to store image permanently. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof seoGeneratorSchema>) => {
    generateBlogMutation.mutate(data);
  };

  const handleUseContent = () => {
    if (generatedContent) {
      // Make sure the image is stored before using the content
      if (generatedContent.imageUrl && !generatedContent.isImageStored) {
        toast({
          title: "Image Not Stored",
          description: "Please click 'Use This Image' to store the image permanently before using the content.",
          variant: "destructive",
        });
        return;
      }
      onGenerate(generatedContent);
      onClose();
    }
  };

  const handleGenerateKeywords = () => {
    const blogTitle = form.getValues("blogTitle");
    const region = form.getValues("region");
    
    if (!blogTitle) {
      toast({
        title: "Blog Title Required",
        description: "Please enter a blog title first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!region || region.trim() === "") {
      toast({
        title: "Region Required",
        description: "Please set a target region first. This is required for SEO keyword generation.",
        variant: "destructive",
      });
      return;
    }
    
    generateKeywordsMutation.mutate(blogTitle);
  };

  const handleKeywordSelect = (keyword: string) => {
    const isSelected = selectedKeywords.includes(keyword);
    if (isSelected) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleUseSelectedKeywords = () => {
    if (selectedKeywords.length > 0) {
      const primaryKeyword = selectedKeywords[0];
      const secondaryKeywords = selectedKeywords.slice(1).join(", ");
      
      form.setValue("primaryKeyword", primaryKeyword);
      form.setValue("secondaryKeywords", secondaryKeywords);
      
      toast({
        title: "Keywords Applied",
        description: `Applied ${selectedKeywords.length} keywords to the form.`,
      });
    }
  };

  const handleRegenerateContent = () => {
    if (generatedContent) {
      regenerateContentMutation.mutate({
        blogTitle: generatedContent.title,
        primaryKeyword: form.getValues("primaryKeyword"),
        secondaryKeywords: form.getValues("secondaryKeywords"),
      });
    }
  };

  const handleRegenerateImage = () => {
    if (generatedContent) {
      regenerateImageMutation.mutate({
        blogTitle: generatedContent.title,
        primaryKeyword: form.getValues("primaryKeyword"),
      });
    }
  };

  const handleGenerateTitles = (data: z.infer<typeof titleGeneratorSchema>) => {
    generateTitlesMutation.mutate(data);
  };

  const handleSelectTitle = (title: string) => {
    form.setValue("blogTitle", title);
    setShowTitleGenerator(false);
    toast({
      title: "Title Selected",
      description: "Selected title has been applied to the blog form.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🤖 AI SEO Blog Generator
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {!generatedContent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="blogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-semibold">Blog Title</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTitleGenerator(true)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Generate Titles
                          </Button>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="e.g., How AI is Transforming Healthcare in 2025"
                            {...field}
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Keywords Generation Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">SEO Keywords</h3>
                      <Button
                        type="button"
                        onClick={handleGenerateKeywords}
                        disabled={isGeneratingKeywords || !form.getValues("blogTitle")}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 hover:from-green-600 hover:to-blue-600"
                      >
                        {isGeneratingKeywords ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Generate Keywords
                          </>
                        )}
                      </Button>
                    </div>

                    {generatedKeywords.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-gray-700">
                            Generated Keywords ({generatedKeywords.length})
                          </p>
                          {selectedKeywords.length > 0 && (
                            <Button
                              type="button"
                              onClick={handleUseSelectedKeywords}
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                            >
                              Use Selected ({selectedKeywords.length})
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {generatedKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              onClick={() => handleKeywordSelect(keyword)}
                              className={`cursor-pointer transition-all ${
                                selectedKeywords.includes(keyword)
                                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Click keywords to select them, then click "Use Selected" to apply to your form.
                        </p>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold flex items-center gap-2">
                          <span>🌍 Target Regions</span>
                          {settings?.targetRegions && !field.value && (
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                              Using Global: {settings.targetRegions}
                            </Badge>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={settings?.targetRegions || "USA, Canada, India, UK, Germany"}
                            {...field}
                            value={field.value || ""}
                            className="text-lg"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          {field.value ? (
                            <>Region set: <strong>{field.value}</strong>. This will be used for SEO keyword generation.</>
                          ) : settings?.targetRegions ? (
                            <>Using global default: <strong>{settings.targetRegions}</strong>. Leave empty to use global, or set a page-specific region.</>
                          ) : (
                            <>Comma-separated list of target regions for this blog. This is required for SEO keyword generation.</>
                          )}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryKeyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Primary Keyword</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., AI in healthcare"
                            {...field}
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Secondary Keywords</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., machine learning healthcare, AI medical diagnosis, healthcare automation, medical AI solutions"
                            {...field}
                            className="text-lg"
                            rows={3}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Separate multiple keywords with commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate SEO Blog
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-green-600">
                  ✅ Generated Successfully!
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRegenerateContent}
                    disabled={isRegeneratingContent}
                    size="sm"
                  >
                    {isRegeneratingContent ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Regenerate Content
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRegenerateImage}
                    disabled={isRegeneratingImage}
                    size="sm"
                  >
                    {isRegeneratingImage ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Regenerate Image
                  </Button>
                  <Button
                    onClick={handleUseContent}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                  >
                    Use This Content
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Elements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="font-medium text-sm text-gray-700">Slug:</label>
                      <p className="text-sm bg-gray-100 p-2 rounded">{generatedContent?.slug}</p>
                    </div>
                    <div>
                      <label className="font-medium text-sm text-gray-700">Meta Title:</label>
                      <p className="text-sm bg-gray-100 p-2 rounded">{generatedContent?.metaTitle}</p>
                    </div>
                    <div>
                      <label className="font-medium text-sm text-gray-700">Meta Description:</label>
                      <p className="text-sm bg-gray-100 p-2 rounded">{generatedContent?.metaDescription}</p>
                    </div>
                    <div>
                      <label className="font-medium text-sm text-gray-700">Keywords:</label>
                      <p className="text-sm bg-gray-100 p-2 rounded">{generatedContent?.keywords}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generated Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedContent?.imageUrl ? (
                      <div className="space-y-3">
                        <img
                          src={generatedContent.imageUrl}
                          alt={generatedContent.imageAlt}
                          className="w-full h-40 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">
                          <strong>Alt Text:</strong> {generatedContent.imageAlt}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              if (generatedContent.imageUrl) {
                                storeImageMutation.mutate(generatedContent.imageUrl);
                              }
                            }}
                            disabled={storeImageMutation.isPending || generatedContent.isImageStored}
                            className="flex-1"
                            variant={generatedContent.isImageStored ? "secondary" : "default"}
                          >
                            {storeImageMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Storing...
                              </>
                            ) : generatedContent.isImageStored ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Stored
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Use This Image
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => {
                              const blogTitle = form.getValues("blogTitle");
                              const primaryKeyword = form.getValues("primaryKeyword");
                              if (blogTitle && primaryKeyword) {
                                regenerateImageMutation.mutate({ blogTitle, primaryKeyword });
                              }
                            }}
                            disabled={isRegeneratingImage}
                            variant="outline"
                          >
                            {isRegeneratingImage ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {generatedContent.isImageStored && (
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            ✓ Image stored permanently and ready for blog publication
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-500">Image generated</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Content Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded">
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent?.content || '' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Title Generator Modal */}
      {showTitleGenerator && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                🚀 AI Blog Title Generator
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTitleGenerator(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Form {...titleForm}>
                <form onSubmit={titleForm.handleSubmit(handleGenerateTitles)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={titleForm.control}
                      name="marketTrends"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Market Trends (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., AI automation, remote work, sustainability, digital transformation... (leave empty for AI to identify latest trends)"
                              {...field}
                              className="min-h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={titleForm.control}
                        name="techType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Technology</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select technology type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                                <SelectItem value="web2">Web 2.0</SelectItem>
                                <SelectItem value="blockchain">Blockchain</SelectItem>
                                <SelectItem value="web3">Web 3.0</SelectItem>
                                <SelectItem value="mobile-apps">Mobile Apps</SelectItem>
                                <SelectItem value="custom-tech">Custom Technology</SelectItem>
                                <SelectItem value="iot">Internet of Things</SelectItem>
                                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                                <SelectItem value="devops">DevOps</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={titleForm.control}
                        name="blogType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blog Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blog format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="news-update">News Update</SelectItem>
                                <SelectItem value="listicle">Listicle (Top X, Best Y)</SelectItem>
                                <SelectItem value="comparison">Comparison Guide</SelectItem>
                                <SelectItem value="educational">Educational Guide</SelectItem>
                                <SelectItem value="how-to">How-to Tutorial</SelectItem>
                                <SelectItem value="case-study">Case Study</SelectItem>
                                <SelectItem value="opinion">Opinion/Analysis</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={titleForm.control}
                      name="existingTitles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Existing Blog Titles (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter existing blog titles (one per line) to ensure uniqueness..."
                              {...field}
                              className="min-h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isGeneratingTitles}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGeneratingTitles ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Generating Titles...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Generate Blog Titles
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {generatedTitles.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Generated Blog Titles</h3>
                  <div className="space-y-2">
                    {generatedTitles.map((title, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <span className="flex-1 text-sm font-medium">{title}</span>
                        <Button
                          size="sm"
                          onClick={() => handleSelectTitle(title)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                        >
                          Use This Title
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}