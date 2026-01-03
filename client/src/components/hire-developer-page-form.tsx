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
import { LoaderCircle, Save, X, Sparkles, Brain, FileText, Settings, Zap, Star, Users, MessageSquare, Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { apiRequest } from "@/lib/queryClient";
import type { HirePage } from "@shared/schema";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  developerType: z.string().min(1, "Developer type is required"),
  referenceContent: z.string().optional(),
  content: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  whyHireTitle: z.string().optional(),
  whyHireDescription: z.string().optional(),
  whyHirePoints: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesDescription: z.string().optional(),
  servicesOffered: z.string().optional(),
  technologyStack: z.string().optional(),
  aiTechnologies: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  caseStudyCategories: z.string().optional(),
  selectedCaseStudies: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  page?: HirePage;
  onSuccess: () => void;
  onClose: () => void;
}

export function HireDeveloperPageForm({ page, onSuccess, onClose }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<string>("");
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showTechnologies, setShowTechnologies] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  





  // Fetch testimonials from hire_page_testimonials table
  const { data: hirePageTestimonials = [], refetch: refetchTestimonials } = useQuery({
    queryKey: ['/api/hire-developer-pages', page?.id, 'testimonials', 'public'],
    queryFn: async () => {
      if (!page?.id) return [];
      const response = await fetch(`/api/hire-developer-pages/${page.id}/testimonials/public`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!page?.id
  });

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);

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
      heroTitle: page?.heroTitle || "",
      heroSubtitle: page?.heroSubtitle || "",
      heroDescription: page?.heroDescription || "",
      whyHireTitle: page?.whyHireTitle || "",
      whyHireDescription: page?.whyHireDescription || "",
      whyHirePoints: page?.whyHirePoints || "",
      servicesTitle: page?.servicesTitle || "",
      servicesDescription: page?.servicesDescription || "",
      servicesOffered: page?.servicesOffered || "",
      technologyStack: page?.technologyStack || "",
      aiTechnologies: page?.aiTechnologies || "",
      metaTitle: page?.metaTitle || "",
      metaDescription: page?.metaDescription || "",
      primaryKeyword: page?.primaryKeyword || "",
      secondaryKeywords: page?.secondaryKeywords || "",
      caseStudyCategories: page?.caseStudyCategories || "",
      selectedCaseStudies: page?.selectedCaseStudies || "",
      status: (page?.status as "draft" | "published") || "draft",
    },
  });

  // Auto-generate slug from title
  const title = form.watch("title");
  useEffect(() => {
    if (title && !page) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [title, page, form]);

  // Initialize case study states from form data
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

  // Update form values when case study selections change
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

  // AI Technology Generation
  const generateAITechnologies = async () => {
    const developerType = form.getValues("developerType");
    const title = form.getValues("title");

    // Extract technology from title or use developerType directly
    const technology = developerType || (title ? title.replace('Hire ', '').replace(' Developer', '').replace(' Developers', '') : '');

    if (!technology) {
      toast({
        title: "Error",
        description: "Please enter the developer type or title first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField("technologies");

    try {
      const response = await fetch('/api/ai/generate-hire-tech-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          technology: technology
        })
      });

      if (!response.ok) throw new Error('Failed to generate hire tech content');

      const data = await response.json();

      if (data.success && data.content) {
        const { technologyStack, testimonials } = data.content;
        
        // Save technologies to ai_technologies field as comma-separated string (PRIMARY field for display)
        const allTechnologies = [
          ...(technologyStack.frontend || []),
          ...(technologyStack.backend || []),
          ...(technologyStack.devops || []),
          ...(technologyStack.machineLearning || []),
          ...(technologyStack.database || []),
          ...(technologyStack.mobile || []),
          ...(technologyStack.informationSecurity || [])
        ].filter(tech => tech && typeof tech === 'string' && tech.trim() !== '');
        
        const techString = allTechnologies.join(', ');
        form.setValue('aiTechnologies', techString);

        // Store the full technology stack in the technology stack field as JSON (FALLBACK field)
        form.setValue('technologyStack', JSON.stringify(technologyStack));

        toast({
          title: "Technology Stack Generated",
          description: `Generated ${allTechnologies.length} technologies across ${Object.keys(technologyStack).length} categories for ${technology} developers. ${testimonials.length} testimonials also available.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate technology content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingField("");
    }
  };

  // Generate tech-specific testimonials using the new AI service
  const generateTechTestimonials = async () => {
    if (!page?.id) {
      toast({
        title: "Error",
        description: "Please save the page first before generating testimonials",
        variant: "destructive",
      });
      return;
    }

    const developerType = form.getValues("developerType");
    const title = form.getValues("title");
    const technology = developerType || (title ? title.replace('Hire ', '').replace(' Developer', '').replace(' Developers', '') : '');

    if (!technology) {
      toast({
        title: "Error",
        description: "Please enter the developer type or title first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField("testimonials");

    try {
      // First get the tech-specific content
      const techResponse = await fetch('/api/ai/generate-hire-tech-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          technology: technology
        })
      });

      if (!techResponse.ok) throw new Error('Failed to generate tech content');

      const techData = await techResponse.json();
      
      if (techData.success && techData.content?.testimonials) {
        // Store testimonials in the database using existing testimonial creation endpoint
        for (const testimonial of techData.content.testimonials) {
          const testimonialResponse = await fetch(`/api/hire-developer-pages/${page.id}/testimonials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              clientName: testimonial.clientName,
              clientCompany: testimonial.clientCompany,
              clientPosition: 'CTO', // Default position
              testimonialText: testimonial.testimonialText,
              rating: 5 // Default rating
            })
          });

          if (!testimonialResponse.ok) {
            console.warn('Failed to create testimonial:', testimonial.clientName);
          }
        }

        await refetchTestimonials();
        toast({
          title: "Tech-Specific Testimonials Generated",
          description: `Generated ${techData.content.testimonials.length} authentic testimonials specifically for ${technology} developers.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate tech testimonials",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingField("");
    }
  };

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
      form.setValue('primaryKeyword', `hire ${developerType.toLowerCase()} developers`);
      form.setValue('secondaryKeywords', `${developerType.toLowerCase()} development, ${developerType.toLowerCase()} programmers, ${developerType.toLowerCase()} experts`);

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

  // Comprehensive AI Content Generation - Generates all sections at once
  const generateAllContent = async () => {
    const developerType = form.getValues("developerType");

    if (!developerType) {
      toast({
        title: "Error",
        description: "Please enter the developer type first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAll(true);

    try {
      const response = await fetch('/api/ai/generate-comprehensive-hire-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          developerType,
          location: "USA & Canada",
          companySectors: ["startups", "enterprises"]
        })
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      const content = data.content;

      // Populate all form fields with generated content
      form.setValue('title', content.heroTitle || `Hire ${developerType} Developers`);
      form.setValue('slug', content.heroTitle?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '');
      form.setValue('heroTitle', content.heroTitle);
      form.setValue('heroSubtitle', content.heroSubtitle);
      form.setValue('heroDescription', content.heroDescription);
      form.setValue('whyHireTitle', content.whyHireTitle);
      form.setValue('whyHireDescription', content.whyHireDescription);
      form.setValue('whyHirePoints', JSON.stringify(content.whyHirePoints));
      form.setValue('servicesTitle', content.servicesTitle);
      form.setValue('servicesDescription', content.servicesDescription);
      form.setValue('servicesOffered', JSON.stringify(content.servicesOffered));
      form.setValue('technologyStack', JSON.stringify(content.technologyStack));

      // Extract technologies into a comma-separated string
      if (content.technologyStack?.categories) {
        const allTechnologies = content.technologyStack.categories
          .flatMap((category: any) => category.technologies)
          .filter((tech: string) => tech && tech.trim() !== '');
        form.setValue('aiTechnologies', allTechnologies.join(', '));
      }

      form.setValue('metaTitle', content.metaTitle);
      form.setValue('metaDescription', content.metaDescription);
      form.setValue('primaryKeyword', content.primaryKeyword);
      form.setValue('secondaryKeywords', content.secondaryKeywords);

      // Note: Testimonials will be automatically generated via AI when the page is created/updated
      // They will be saved to the database and displayed on the user side dynamically

      toast({
        title: "Content Generated Successfully",
        description: `AI generated comprehensive content for ${developerType} developer hiring page including hero section, skills, services, technology stack, testimonials, and SEO elements.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate comprehensive content",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const generateTestimonials = async () => {
    if (!form.watch("developerType")) {
      toast({
        title: "Missing Information",
        description: "Please set the developer type first",
        variant: "destructive",
      });
      return;
    }

    if (!page?.id) {
      toast({
        title: "Error",
        description: "Please save the page first before generating testimonials",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField("testimonials");

    try {
      const response = await fetch(`/api/hire-developer-pages/${page.id}/testimonials/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          developerType: form.watch("developerType"),
          title: form.watch("title")
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate testimonials");
      }

      await refetchTestimonials();
      toast({
        title: "Testimonials Generated",
        description: "AI has generated testimonials for your hire page.",
      });
    } catch (error) {
      console.error("Error generating testimonials:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingField("");
    }
  };

  const deleteAllTestimonials = async () => {
    if (!page?.id) return;

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/hire-developer-pages/${page.id}/testimonials`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonials");
      }

      await refetchTestimonials();
      toast({
        title: "Testimonials Deleted",
        description: "All testimonials have been deleted.",
      });
    } catch (error) {
      console.error("Error deleting testimonials:", error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Content Generation
  const generateContent = async () => {
    const developerType = form.getValues("developerType");
    if (!developerType) {
      toast({
        title: "Error",
        description: "Please enter the developer type first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/ai/generate-hire-developer-content', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          developerType,
          location: "USA & Canada"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Debug logging to verify what data is being received
      form.setValue("heroDescription", data.heroDescription || "");

      form.setValue("title", data.title || "");

      // Always set these critical fields even if empty to ensure form displays them
      form.setValue("slug", data.slug || "");
      form.setValue("heroSubtitle", data.heroSubtitle || "");
      form.setValue("whyHireTitle", data.whyHireTitle || "");
      form.setValue("whyHireDescription", data.whyHireDescription || "");
      form.setValue("whyHirePoints", data.whyHirePoints ? JSON.stringify(data.whyHirePoints, null, 2) : "[]");
      form.setValue("servicesTitle", data.servicesTitle || "");
      form.setValue("servicesDescription", data.servicesDescription || "");
      form.setValue("servicesOffered", data.servicesOffered ? JSON.stringify(data.servicesOffered, null, 2) : "[]");
      form.setValue("technologyStack", data.technologyStack ? JSON.stringify(data.technologyStack, null, 2) : "{}");
      form.setValue("metaTitle", data.metaTitle || "");
      form.setValue("metaDescription", data.metaDescription || "");
      form.setValue("primaryKeyword", data.primaryKeyword || "");
      form.setValue("secondaryKeywords", data.secondaryKeywords || "");

      // Trigger form re-render by forcing a state update
      setTimeout(() => {
      }, 100);

      toast({
        title: "Success",
        description: "Content generated successfully using structured guidelines",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {page ? "Edit Hire Developer Page" : "Create Hire Developer Page"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Use AI to generate professional hire developer content or manually edit each section
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        {/* AI Generation Controls */}
        <div className="mt-6 flex flex-wrap gap-3">
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
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 How to use AI generation:</h4>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <p><strong>Generate from Reference:</strong> Paste reference content below and provide developer type to generate structured content</p>
            <p><strong>Generate All Content:</strong> Creates complete page content based on developer type using predefined templates</p>
            <p><strong>AI Generate Content:</strong> Uses the new structured guidelines to create professional hire developer content</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        Enter the type of developers (used for AI content generation)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide reference content for AI to analyze and generate structured hire developer content. You can format text using the toolbar above. Use "Generate from Reference" button after filling this field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Hire Expert React Developers"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Main heading displayed on the hire developer page
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
                          placeholder="auto-generated from title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title (auto-generated)
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

            {/* SEO Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
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
                          placeholder="SEO title for search engines"
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="Brief description for search results"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="Main SEO keyword"
                          {...field}
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
                      <FormLabel>Secondary Keywords</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional SEO keywords (comma-separated)"
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Hero Section Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Subtitle</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Compelling subtitle addressing pain points or establishing credibility"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="2-3 lines describing how these developers provide value to businesses (cost efficiency, automation, scalability)"
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Include title, 2-3 line description, CTA text, and 3 professional stats. You can format text using the toolbar above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Key Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Key Skills and Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="whyHireTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Key Skills and Qualifications of Our [Developer Type] Developers"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whyHireDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction Paragraph</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Describe the general skillset and capabilities of the developer type"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      You can format text using the toolbar above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whyHirePoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6 Skills (JSON Format)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='[{"icon": "Brain", "title": "Natural Language Processing", "description": "Advanced NLP expertise for language understanding"}]'
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON array with 6 skills, each having icon, title, and 1-line description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                What Our Developers Can Do for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="servicesTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What Our [Developer Type] Developers Can Do for You"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servicesDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction Paragraph</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Highlight how these developers improve business performance"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      You can format text using the toolbar above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servicesOffered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6 Services (JSON Format)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='[{"icon": "MessageSquare", "title": "LLM Consultation", "description": "Expert consultation services for LLM implementation and ROI optimization"}]'
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON array with 6 services, each having icon, title, and 2-3 line description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="aiTechnologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      AI Generated Technologies (For User Display)
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateAITechnologies}
                        disabled={isGenerating && generatingField === "aiTechnologies"}
                        className="ml-2"
                      >
                        {isGenerating && generatingField === "aiTechnologies" ? (
                          <LoaderCircle className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Brain className="h-3 w-3 mr-1" />
                        )}
                        Generate AI Technologies
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="React, Node.js, Python, Docker, AWS..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      AI-generated technologies that will be displayed to users. Comma-separated list.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technologyStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology Stack (JSON Format - Admin Only)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"description": "Modern tools and technologies", "categories": [{"name": "Machine Learning", "technologies": ["Python", "TensorFlow"]}]}'
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON object with description and categories (Machine Learning, Backend, Database, DevOps)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>


          {/* Technology Stack Management */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technology Stack Management
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTechnologies(!showTechnologies)}
                  >
                    {showTechnologies ? 'Hide' : 'Show'} Technologies
                  </Button>
                </CardTitle>
              </CardHeader>
              {showTechnologies && (
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={generateAITechnologies}
                      disabled={isGenerating || !form.watch('developerType')}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      {generatingField === 'technologies' ? (
                        <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      {generatingField === 'technologies' ? 'Generating...' : 'Generate Technologies'}
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Current Technology Stack</h4>
                    {(() => {
                      const aiTech = form.watch('aiTechnologies');
                      const techStack = form.watch('technologyStack');
                      
                      // First check structured technology stack (JSON format)
                      if (techStack) {
                        try {
                          const parsed = JSON.parse(techStack);
                          const categories = [];
                          if (parsed.frontend?.length) categories.push(`Frontend: ${parsed.frontend.join(', ')}`);
                          if (parsed.backend?.length) categories.push(`Backend: ${parsed.backend.join(', ')}`);
                          if (parsed.devops?.length) categories.push(`DevOps: ${parsed.devops.join(', ')}`);
                          if (parsed.machineLearning?.length) categories.push(`ML: ${parsed.machineLearning.join(', ')}`);
                          if (parsed.database?.length) categories.push(`Database: ${parsed.database.join(', ')}`);
                          if (parsed.mobile?.length) categories.push(`Mobile: ${parsed.mobile.join(', ')}`);
                          if (parsed.informationSecurity?.length) categories.push(`Security: ${parsed.informationSecurity.join(', ')}`);
                          
                          if (categories.length > 0) {
                            return (
                              <div className="space-y-2">
                                <p className="text-xs text-blue-600 font-medium">Structured Format:</p>
                                {categories.map((cat, index) => (
                                  <p key={index} className="text-sm text-blue-700">{cat}</p>
                                ))}
                              </div>
                            );
                          }
                        } catch (error) {
                          // Fallback if JSON parsing fails
                        }
                      }
                      
                      // Then check simple AI technologies format
                      if (aiTech) {
                        return (
                          <div className="space-y-2">
                            <p className="text-xs text-blue-600 font-medium">Simple Format (from database ai_technologies field):</p>
                            <p className="text-sm text-blue-700">{aiTech}</p>
                          </div>
                        );
                      }
                      
                      return (
                        <p className="text-sm text-blue-700">
                          No technologies set - click Generate Technologies to create structured stack
                        </p>
                      );
                    })()}
                  </div>
                </CardContent>
              )}
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
                      <p className="text-sm text-gray-600">
                        No published case studies found for the selected categories.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Case Studies Summary */}
              {selectedCaseStudies.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Case Studies</h4>
                  <div className="space-y-1">
                    {selectedCaseStudies.map(studyId => {
                      const study = caseStudies.find((s: any) => s.id.toString() === studyId);
                      return study ? (
                        <div key={studyId} className="text-sm text-blue-700">
                          • {study.title} ({study.category})
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Testimonials Management */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Testimonials Management
                    <Badge variant="outline" className="ml-2">
                      {hirePageTestimonials.length} testimonials
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTestimonials(!showTestimonials)}
                  >
                    {showTestimonials ? 'Hide' : 'Show'} Testimonials
                  </Button>
                </CardTitle>
              </CardHeader>
              {showTestimonials && (
                <CardContent className="space-y-4">
                  {!page?.id && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-medium text-amber-900 mb-2">Note</h4>
                      <p className="text-sm text-amber-700">
                        Testimonials can only be generated after saving the page. Please save your hire developer page first, then you can generate both general and tech-specific testimonials.
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      onClick={generateTestimonials}
                      disabled={isGenerating || !form.watch('developerType') || !page?.id}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white disabled:opacity-50"
                    >
                      {generatingField === 'testimonials' ? (
                        <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Users className="h-4 w-4 mr-2" />
                      )}
                      {generatingField === 'testimonials' ? 'Generating...' : 'Generate Testimonials'}
                    </Button>
                    <Button
                      type="button"
                      onClick={generateTechTestimonials}
                      disabled={isGenerating || !form.watch('developerType') || !page?.id}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white disabled:opacity-50"
                      title={!page?.id ? "Save the page first to enable tech-specific testimonials" : "Generate testimonials based on technology stack"}
                    >
                      {generatingField === 'testimonials' ? (
                        <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 mr-2" />
                      )}
                      Tech-Specific Testimonials
                    </Button>
                    {hirePageTestimonials.length > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={deleteAllTestimonials}
                        disabled={isGenerating}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All
                      </Button>
                    )}
                  </div>

                  {hirePageTestimonials.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Current Testimonials</h4>
                      <div className="grid gap-3">
                        {hirePageTestimonials.map((testimonial: any) => (
                          <div key={testimonial.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-medium text-gray-900">{testimonial.clientName}</h5>
                                <p className="text-sm text-gray-600">{testimonial.clientPosition}, {testimonial.clientCompany}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm italic">"{testimonial.testimonialText}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
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