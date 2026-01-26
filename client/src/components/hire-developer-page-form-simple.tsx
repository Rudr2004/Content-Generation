import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, Save, X, FileText, Globe, Tags, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { apiRequest } from "@/lib/queryClient";
import type { HirePage } from "@shared/schema";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveRegion } from "@/lib/region-resolver";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  developerType: z.string().min(1, "Developer type is required"),
  referenceContent: z.string().optional(),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  caseStudyCategories: z.string().optional(),
  selectedCaseStudies: z.string().optional(),
  region: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  page?: HirePage;
  onSuccess: () => void;
  onClose: () => void;
}

export function HireDeveloperPageFormSimple({ page, onSuccess, onClose }: Props) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  
  // Case study state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);

  // Fetch case study categories
  const { data: caseStudyCategories = [] } = useQuery({
    queryKey: ['/api/case-study-categories'],
    queryFn: async () => {
      const response = await fetch('/api/case-study-categories');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Fetch case studies by category
  const { data: caseStudies = [] } = useQuery({
    queryKey: ['/api/case-study-pages', 'by-categories', selectedCategories],
    queryFn: async () => {
      if (!selectedCategories.length) return [];
      const params = new URLSearchParams();
      selectedCategories.forEach(cat => params.append('categories', cat));
      const response = await fetch(`/api/case-study-pages/by-categories?${params}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: selectedCategories.length > 0
  });
  

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      developerType: page?.developerType || "",
      referenceContent: page?.referenceContent || "",
      content: page?.content || "",
      metaTitle: page?.metaTitle || "",
      metaDescription: page?.metaDescription || "",
      primaryKeyword: page?.primaryKeyword || "",
      secondaryKeywords: page?.secondaryKeywords || "",
      caseStudyCategories: page?.caseStudyCategories || "",
      selectedCaseStudies: page?.selectedCaseStudies || "",
      region: page?.region || resolveRegion(null, settings?.targetRegions),
      status: (page?.status as "draft" | "published") || "draft",
    },
  });

  // Update region default when settings load
  useEffect(() => {
    if (settings && !page?.region) {
      const resolvedRegion = resolveRegion(null, settings.targetRegions);
      form.setValue("region", resolvedRegion);
    }
  }, [settings, page?.region, form]);

  // Initialize case study state from page data
  useEffect(() => {
    if (page?.caseStudyCategories) {
      try {
        const categories = JSON.parse(page.caseStudyCategories);
        setSelectedCategories(categories);
      } catch (e) {
        console.error('Failed to parse case study categories:', e);
      }
    }
    if (page?.selectedCaseStudies) {
      try {
        const studies = JSON.parse(page.selectedCaseStudies);
        setSelectedCaseStudies(studies);
      } catch (e) {
        console.error('Failed to parse selected case studies:', e);
      }
    }
  }, [page]);

  // Sync state with form
  useEffect(() => {
    form.setValue('caseStudyCategories', JSON.stringify(selectedCategories));
  }, [selectedCategories, form]);

  useEffect(() => {
    form.setValue('selectedCaseStudies', JSON.stringify(selectedCaseStudies));
  }, [selectedCaseStudies, form]);





  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/hire-developer-pages', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] });
      toast({
        title: "Success",
        description: "Hire developer page created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create hire developer page",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('PUT', `/api/hire-developer-pages/${page!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hire-developer-pages'] });
      toast({
        title: "Success",
        description: "Hire developer page updated successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update hire developer page",
        variant: "destructive",
      });
    }
  });

  // Generate content from reference material
  const generateFromReference = async () => {
    const referenceContent = form.getValues("referenceContent");
    const developerType = form.getValues("developerType");

    if (!referenceContent || !developerType) {
      toast({
        title: "Error",
        description: "Please enter both developer type and reference content first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAll(true);

    try {
      const response = await fetch('/api/ai/generate-hire-from-reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          referenceContent,
          developerType,
          location: "USA & Canada"
        })
      });

      if (!response.ok) throw new Error('Failed to generate content from reference');

      const data = await response.json();
      
      // Store the complete generated content in a formatted way
      const formattedContent = JSON.stringify(data.content, null, 2);
      form.setValue('content', formattedContent);
      
      // Update title and SEO fields
      const content = data.content;
      form.setValue('title', content.heroSection?.headline?.replace('[Developer Type]', developerType) || `Hire ${developerType} Developers`);
      form.setValue('metaTitle', `Hire Expert ${developerType} Developers | GreenAppleX`);
      form.setValue('metaDescription', content.heroSection?.subheading || `Hire skilled ${developerType} developers from GreenAppleX. Expert developers with proven track record in ${developerType} development.`);
      // Generate proper title-based keywords with location awareness
      const generatedTitle = content.heroSection?.headline?.replace('[Developer Type]', developerType) || `Hire ${developerType} Developers`;
      
      // Always use AI keyword generation to ensure location and city words are never ignored
      try {
        const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
        const keywordResponse = await fetch('/api/generate-hire-developer-keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ title: generatedTitle, region })
        });

        if (keywordResponse.ok) {
          const keywordData = await keywordResponse.json();
          if (keywordData.success && keywordData.keywords && keywordData.keywords.length > 0) {
            form.setValue('primaryKeyword', keywordData.keywords[0]);
            form.setValue('secondaryKeywords', keywordData.keywords.slice(1).join(', '));
          } else {
            // Fallback to location-aware generic keywords if AI fails
            const locationMatch = generatedTitle.match(/in ([a-zA-Z\s]+?)(?:\s*$|$)/i);
            const location = locationMatch ? locationMatch[1].trim() : '';
            const baseKeyword = `hire ${developerType.toLowerCase()} developers`;
            form.setValue('primaryKeyword', location ? `${baseKeyword} ${location}` : baseKeyword);
            form.setValue('secondaryKeywords', location ? 
              `${developerType.toLowerCase()} developers ${location}, ${developerType.toLowerCase()} development ${location}, ${developerType.toLowerCase()} programmers ${location}` :
              `${developerType.toLowerCase()} development, ${developerType.toLowerCase()} programmers, ${developerType.toLowerCase()} experts`);
          }
        } else {
          // Fallback to location-aware generic keywords if API fails
          const locationMatch = generatedTitle.match(/in ([a-zA-Z\s]+?)(?:\s*$|$)/i);
          const location = locationMatch ? locationMatch[1].trim() : '';
          const baseKeyword = `hire ${developerType.toLowerCase()} developers`;
          form.setValue('primaryKeyword', location ? `${baseKeyword} ${location}` : baseKeyword);
          form.setValue('secondaryKeywords', location ? 
            `${developerType.toLowerCase()} developers ${location}, ${developerType.toLowerCase()} development ${location}, ${developerType.toLowerCase()} programmers ${location}` :
            `${developerType.toLowerCase()} development, ${developerType.toLowerCase()} programmers, ${developerType.toLowerCase()} experts`);
        }
      } catch (keywordError) {
        console.error('Failed to generate keywords:', keywordError);
        // Fallback to location-aware generic keywords if request fails
        const locationMatch = generatedTitle.match(/in ([a-zA-Z\s]+?)(?:\s*$|$)/i);
        const location = locationMatch ? locationMatch[1].trim() : '';
        const baseKeyword = `hire ${developerType.toLowerCase()} developers`;
        form.setValue('primaryKeyword', location ? `${baseKeyword} ${location}` : baseKeyword);
        form.setValue('secondaryKeywords', location ? 
          `${developerType.toLowerCase()} developers ${location}, ${developerType.toLowerCase()} development ${location}, ${developerType.toLowerCase()} programmers ${location}` :
          `${developerType.toLowerCase()} development, ${developerType.toLowerCase()} programmers, ${developerType.toLowerCase()} experts`);
      }

      toast({
        title: "AI Content Generated Successfully",
        description: "Generated comprehensive hire developer content from your reference material.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate content from reference",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // Generate keywords based on title
  const generateAISEOKeywords = async () => {
    const title = form.getValues("title");
    
    if (!title || title.trim().length === 0) {
      toast({
        title: "Missing Title",
        description: "Please enter a page title first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
      const response = await fetch("/api/generate-hire-developer-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ title, region })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.keywords && data.keywords.length > 0) {
        // Set primary keyword (first one)
        form.setValue("primaryKeyword", data.keywords[0]);
        // Set secondary keywords (rest, comma-separated)
        form.setValue("secondaryKeywords", data.keywords.slice(1).join(", "));
        
        toast({
          title: "Keywords Generated!",
          description: `${data.keywords.length} SEO keywords generated based on your title.`,
        });
      } else {
        toast({
          title: "No keywords generated",
          description: "Please try again or enter keywords manually.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("AI keyword generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (page) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {page ? "Edit Hire Developer Page" : "Create Hire Developer Page"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Generate professional hire developer content from reference materials
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        {/* AI Generation Controls */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={generateFromReference}
            disabled={isGeneratingAll || !form.watch("developerType") || !form.watch("referenceContent")}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-none hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
          >
            {isGeneratingAll ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Generate by Reference
          </Button>
        </div>
        
        {/* Help Text */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 How to use:</h4>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p>1. Enter the developer type (e.g., "LLM", "React", "Blockchain")</p>
            <p>2. Paste reference content in the textarea below</p>
            <p>3. Click "Generate by Reference" to create structured content</p>
            <p>4. Review and edit the generated content as needed</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hire LLM Developers"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the main title of your hire developer page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="developerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer Type *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., LLM, Blockchain, React"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the type of developers (required for AI content generation)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., hire-llm-developers"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title (auto-generated if left empty)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Reference Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reference Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="referenceContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Paste your reference content here (articles, company info, service descriptions, etc.) that AI should analyze to generate hire developer content..."
                        rows={8}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide reference content for AI to analyze and generate structured hire developer content. You can format text using the toolbar above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>


          {/* Generated Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generated Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="AI-generated hire developer content will appear here. You can edit and format this content using the rich text editor..."
                        rows={12}
                      />
                    </FormControl>
                    <FormDescription>
                      AI-generated content that will be displayed on the hire developer page. You can edit and format this content using the rich text editor above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hire Expert LLM Developers | GreenAppleX"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      SEO title that appears in search results (auto-generated from content)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the hire developer page for search engines..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      SEO description for search results (auto-generated from content)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Keyword</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., hire llm developers"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Main SEO keyword for this page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., llm development, llm programmers, llm experts"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional SEO keywords, comma-separated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span>🌍 Target Regions</span>
                      {settings?.targetRegions && !field.value && (
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                          Using Global: {settings.targetRegions}
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={settings?.targetRegions || "USA, Canada, UK, Germany"}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value ? (
                        <>Page-specific region set. Keywords will target: <strong>{field.value}</strong></>
                      ) : settings?.targetRegions ? (
                        <>Using global default: <strong>{settings.targetRegions}</strong>. Leave empty to use global, or set a page-specific region.</>
                      ) : (
                        <>Comma-separated list of target regions. If not set, will use global default from Site Settings.</>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Generate Keywords Button */}
              <div className="flex justify-start">
                <Button
                  type="button"
                  onClick={generateAISEOKeywords}
                  disabled={isGeneratingKeywords}
                  variant="outline"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none"
                >
                  {isGeneratingKeywords ? (
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate Keywords
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Case Study Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Case Study Selection
                <Badge variant="outline" className="ml-2">
                  {caseStudyCategories.length} categories available
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Select categories and specific case studies to display on the hire developer page
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Category Selection */}
              <div>
                <FormLabel className="text-base font-medium">Select Categories</FormLabel>
                <FormDescription className="text-sm text-gray-600 mb-3">
                  Choose case study categories to filter available case studies
                </FormDescription>
                
                {caseStudyCategories.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Loading case study categories...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {caseStudyCategories.map((category: any) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.name]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(cat => cat !== category.name));
                              // Also remove any selected case studies from this category
                              setSelectedCaseStudies(selectedCaseStudies.filter(studyId => {
                                const study = caseStudies.find((s: any) => s.id.toString() === studyId);
                                return study && study.category !== category.name;
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          data-testid={`checkbox-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <label 
                          htmlFor={`category-${category.id}`} 
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Case Study Selection */}
              {selectedCategories.length > 0 && (
                <div>
                  <FormLabel className="text-base font-medium">Select Case Studies</FormLabel>
                  <FormDescription className="text-sm text-gray-600 mb-3">
                    Choose specific case studies to display on the hire developer page ({selectedCaseStudies.length} selected)
                  </FormDescription>
                  {caseStudies.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                      {caseStudies.map((study: any) => (
                        <div key={study.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            id={`study-${study.id}`}
                            checked={selectedCaseStudies.includes(study.id.toString())}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCaseStudies([...selectedCaseStudies, study.id.toString()]);
                              } else {
                                setSelectedCaseStudies(selectedCaseStudies.filter(id => id !== study.id.toString()));
                              }
                            }}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            data-testid={`checkbox-case-study-${study.slug}`}
                          />
                          <div className="flex-1 min-w-0">
                            <label htmlFor={`study-${study.id}`} className="cursor-pointer">
                              <div className="font-medium text-gray-900">{study.title}</div>
                              <div className="text-sm text-gray-500">
                                Category: {study.category} • Client: {study.clientName || 'Not specified'}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Loading case studies for selected categories...</p>
                    </div>
                  )}
                </div>
              )}

              {selectedCategories.length === 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Select one or more categories above to see available case studies
                  </p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {page ? "Update Page" : "Create Page"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}