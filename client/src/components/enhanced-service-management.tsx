import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { safeJsonParse } from "@/lib/markdown-utils";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  Code,
  Brain,
  Building,
  Cloud,
  Shield,
  Settings,
  ChevronRight,
  Grid3X3,
  FileText,
  Briefcase,
  Bot,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Service {
  id: number;
  title: string;
  slug: string;
  pageName?: string;
  category?: string;
  subCategory?: string;
  caseStudyCategory?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  icon?: string;
  features?: string[];
  technologies?: string[];
  techStackDomains?: string[];
  aiTechnologies?: string[];
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  status: string;
  startingPrice?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  status: string;
}

interface ServicePage {
  id: number;
  title: string;
  slug: string;
  subcategoryId: number;
  status: string;
}

interface CaseStudyCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
}

// Simplified service form schema following user requirements
const serviceFormSchema = z.object({
  // Core Fields (as requested by user)
  title: z.string().min(1, "Service title is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Subcategory is required"),
  caseStudyCategories: z.array(z.string()).optional(),
  selectedCaseStudies: z.array(z.string()).optional(),
  aiTechnologies: z.string().optional(),
  pageName: z.string().min(1, "Page name is required for user navigation"),

  // AI Content Generation Fields
  referenceUrl: z.string().url().optional().or(z.literal("")),
  referenceContent: z.string().optional(),

  // SEO Keywords
  primaryKeyword: z.string().min(1, "Primary keyword is required"),
  secondaryKeywords: z.string().min(1, "Secondary keywords are required (comma-separated)"),

  // Content
  content: z.string().min(100, "Content must be at least 100 characters"),

  // Optional fields
  status: z.enum(["active", "draft", "inactive"]).default("active"),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function ServiceFormComponent({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatingField, setGeneratingField] = useState<string>("");
  const [selectedCaseStudyCategories, setSelectedCaseStudyCategories] = useState<string[]>([]);
  const [availableCaseStudies, setAvailableCaseStudies] = useState<{[category: string]: Array<{id: number; title: string}>}>({});

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      caseStudyCategories: [],
      selectedCaseStudies: [],
      pageName: "",
      referenceUrl: "",
      referenceContent: "",
      primaryKeyword: "",
      secondaryKeywords: "",
      aiTechnologies: "",
      content: "",
      status: "active",
    },
  });
  
  // AI Content Generation Functions
  const generateAIContent = async (serviceName: string, category: string, subCategory: string) => {
    if (!serviceName) {
      toast({
        title: "Error",
        description: "Service name is required for AI content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    setGeneratingField("all");
    
    try {
      const authToken = localStorage.getItem('authToken');
      const referenceUrl = form.watch('referenceUrl');
      const referenceContent = form.watch('referenceContent');
      
      const response = await fetch('/api/ai-service-pages/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceName: serviceName,
          category: category,
          subCategory: subCategory,
          referenceUrl: referenceUrl || undefined,
          referenceContent: referenceContent || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }

      const result = await response.json();
      const generatedData = result.generatedData;

      // Parse structured content from the new format
      let structuredContent;
      try {
        structuredContent = JSON.parse(generatedData.structuredContent || '{}');
      } catch (e) {
        console.warn('Failed to parse structured content, using fallback');
        structuredContent = {};
      }

      // Auto-populate form with AI generated content from new structure
      form.setValue('title', structuredContent.heroSection?.headline || generatedData.title);
      form.setValue('primaryKeyword', generatedData.primaryKeyword);
      form.setValue('secondaryKeywords', generatedData.secondaryKeywords);
      
      // Store the structured JSON content directly instead of converting to markdown
      form.setValue('content', JSON.stringify(structuredContent, null, 2));

      // Set AI technologies from the structured technology tools
      if (structuredContent.technologyTools) {
        const allTechs: string[] = [];
        Object.values(structuredContent.technologyTools).forEach(techs => {
          if (Array.isArray(techs)) {
            allTechs.push(...techs);
          }
        });
        if (allTechs.length > 0) {
          form.setValue('aiTechnologies', allTechs.join(', '));
        }
      }


      toast({
        title: "Success",
        description: "AI content generated successfully! Review and save the service.",
      });
    } catch (error) {
      console.error('AI content generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
      setGeneratingField("");
    }
  };

  const generateSpecificField = async (field: string) => {
    const serviceName = form.getValues('title') || form.getValues('pageName');
    const category = form.getValues('category');
    
    if (!serviceName) {
      toast({
        title: "Error",
        description: "Please enter a service name first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    setGeneratingField(field);
    
    try {
      // Generate specific field content using OpenAI
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('/api/ai-service-pages/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceName,
          category,
          field
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate field content');
      }

      const result = await response.json();
      
      // Update specific field based on the field type
      switch (field) {
        case 'keywords':
          form.setValue('primaryKeyword', result.primaryKeyword);
          form.setValue('secondaryKeywords', result.secondaryKeywords);
          break;
        case 'content':
          form.setValue('content', result.content);
          break;
        case 'technologies':
          form.setValue('aiTechnologies', result.technologies.join(', '));
          break;
      }

      toast({
        title: "Success",
        description: `AI ${field} generated successfully!`,
      });
    } catch (error) {
      console.error(`AI ${field} generation error:`, error);
      toast({
        title: "Error",
        description: `Failed to generate AI ${field}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
      setGeneratingField("");
    }
  };



  // Load categories and subcategories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  // Load case study categories for the case study section
  const { data: caseStudyCategories = [] } = useQuery<CaseStudyCategory[]>({
    queryKey: ['/api/case-study-categories'],
    queryFn: async () => {
      const response = await fetch('/api/case-study-categories');
      if (!response.ok) throw new Error('Failed to fetch case study categories');
      return response.json();
    }
  });

  // Fetch case studies for selected categories
  const fetchCaseStudiesForCategories = async (categories: string[]) => {
    const newAvailableCaseStudies: {[category: string]: Array<{id: number; title: string}>} = {};
    
    for (const category of categories) {
      try {
        const response = await fetch(`/api/case-study-pages/category/${encodeURIComponent(category)}`);
        if (response.ok) {
          const caseStudies = await response.json();
          newAvailableCaseStudies[category] = caseStudies.map((cs: any) => ({
            id: cs.id,
            title: cs.title
          }));
        }
      } catch (error) {
        console.error(`Error fetching case studies for category ${category}:`, error);
        newAvailableCaseStudies[category] = [];
      }
    }
    
    setAvailableCaseStudies(newAvailableCaseStudies);
  };

  // Update available case studies when selected categories change
  useEffect(() => {
    if (selectedCaseStudyCategories.length > 0) {
      fetchCaseStudiesForCategories(selectedCaseStudyCategories);
    } else {
      setAvailableCaseStudies({});
    }
  }, [selectedCaseStudyCategories]);

  // Populate form when editing a service
  useEffect(() => {
    if (service) {
      // Reset form with service data
      form.reset({
        title: service.title || "",
        category: service.category || "",
        subCategory: service.subCategory || "",
        caseStudyCategories: safeJsonParse((service as any).caseStudyCategories, []),
        selectedCaseStudies: safeJsonParse((service as any).selectedCaseStudies, []),
        pageName: service.pageName || "",
        primaryKeyword: service.primaryKeyword || "",
        secondaryKeywords: service.secondaryKeywords || "",
        aiTechnologies: service.aiTechnologies ? service.aiTechnologies.join(', ') : "",
        content: service.content || "",
        status: service.status as "active" | "draft" | "inactive" || "active",
      });

      // Set the selected category to filter subcategories
      setSelectedCategory(service.category || "");
      
      // Update selected case study categories state
      const existingCategories = safeJsonParse((service as any).caseStudyCategories, []);
      setSelectedCaseStudyCategories(existingCategories);
    } else {
      // Reset to empty form for new service
      form.reset({
        title: "",
        category: "",
        subCategory: "",
        caseStudyCategories: [],
        selectedCaseStudies: [],
        pageName: "",
        primaryKeyword: "",
        secondaryKeywords: "",
        aiTechnologies: "",
        content: "",
        status: "active",
      });
      setSelectedCategory("");
      setSelectedCaseStudyCategories([]);
    }
  }, [service, form]);

  const filteredSubcategories = selectedCategory
    ? subcategories.filter(sub => {
      const category = categories.find(cat => cat.name === selectedCategory);
      return category && sub.categoryId === category.id;
    })
    : [];

  // AI Generation Functions
  const generateWithAI = async (type: 'title' | 'keywords' | 'content' | 'technologies') => {
    try {
      setIsGeneratingAI(true);
      setGeneratingField(type);

      const category = form.watch('category');
      const subCategory = form.watch('subCategory');
      const currentTitle = form.watch('title');

      let prompt = '';
      let endpoint = '';

      switch (type) {
        case 'title':
          prompt = `Generate a professional service title for: Category: ${category}, Subcategory: ${subCategory}. Make it compelling and SEO-friendly for a digital marketing agency.`;
          endpoint = '/api/ai/generate-title';
          break;
        case 'keywords':
          prompt = `Generate SEO keywords for service: ${currentTitle || `${category} - ${subCategory}`}. Provide 1 primary keyword and 5-8 secondary keywords (comma-separated) targeting USA and Canada markets.`;
          endpoint = '/api/ai/generate-keywords';
          break;
        case 'content':
          const aiTechnologies = form.watch('aiTechnologies');
          const techContext = aiTechnologies ? ` Include a comprehensive Technology Stack section featuring these specific technologies: ${aiTechnologies}.` : '';
          prompt = `Generate comprehensive service content for: ${currentTitle || `${category} - ${subCategory}`}. Include value propositions, process, benefits, and call-to-action.${techContext} Make it SEO-optimized and professional for a digital marketing agency. Minimum 500 words.`;
          endpoint = '/api/ai/generate-content';
          break;
        case 'technologies':
          prompt = `Suggest relevant technologies for this service: ${currentTitle || `${category} - ${subCategory}`}. Return an array of technology names that would be most relevant for this type of service. Focus on modern, widely-used technologies.`;
          endpoint = '/api/ai/generate-technologies';
          break;
      }

      const authToken = localStorage.getItem('authToken');
      const response = await fetch('/api/ai-service-pages/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceName: currentTitle,
          category,
          subCategory,
          type,
          aiTechnologies: form.watch('aiTechnologies')
        })
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();

      switch (type) {
        case 'title':
          form.setValue('title', data.title);
          break;
        case 'keywords':
          form.setValue('primaryKeyword', data.primaryKeyword);
          form.setValue('secondaryKeywords', data.secondaryKeywords);
          break;
        case 'content':
          form.setValue('content', data.content);
          // Note: Testimonials will be generated after service creation using proper database storage
          break;
        case 'technologies':
          // Handle AI-suggested technologies by setting them in the field
          if (data.technologies && Array.isArray(data.technologies)) {
            const techString = data.technologies.join(', ');
            form.setValue('aiTechnologies', techString);
            toast({
              title: "Technologies Generated",
              description: `AI generated ${data.technologies.length} relevant technologies. You can edit, add, or remove as needed.`,
            });
          }
          break;
      }

      const successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully`;

      toast({
        title: "Success",
        description: successMessage,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to generate ${type}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
      setGeneratingField("");
    }
  };

  // Stable callback for AI content generation (after form is declared)
  const handleGenerateAIContent = useCallback(() => {
    generateWithAI('content');
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const category = categories.find(cat => cat.name === data.category);
      const subcategory = subcategories.find(sub => sub.name === data.subCategory);

      if (!category || !subcategory) {
        throw new Error('Invalid category or subcategory');
      }

      // Parse AI technologies from comma-separated string to array
      const aiTechArray = data.aiTechnologies
        ? data.aiTechnologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0)
        : [];

      const serviceData = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        pageName: data.pageName,
        category: data.category,
        subCategory: data.subCategory,
        caseStudyCategories: JSON.stringify(data.caseStudyCategories || []),
        selectedCaseStudies: JSON.stringify(data.selectedCaseStudies || []),
        content: data.content,
        excerpt: data.content.substring(0, 200) + "...",
        metaTitle: `${data.title} | GreenAppleX Services`,
        metaDescription: data.content.substring(0, 155) + "...",
        primaryKeyword: data.primaryKeyword,
        secondaryKeywords: data.secondaryKeywords,
        aiTechnologies: aiTechArray,
        referenceUrl: data.referenceUrl || null,
        referenceContent: data.referenceContent || null,
        status: data.status,
        startingPrice: "Contact for pricing",
        featured: false,
      };

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) throw new Error('Failed to create service');
      const result = await response.json();

      // Generate testimonials for the new service using the proper endpoint (like hire developer pages)
      if (result.service?.id) {
        try {
          const category = categories.find(cat => cat.name === data.category);
          const subcategory = subcategories.find(sub => sub.name === data.subCategory);
          
          if (category && subcategory) {
            await fetch(`/api/services/${result.service.id}/testimonials/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              },
              body: JSON.stringify({
                category: category.name,
                subCategory: subcategory.name
              })
            });
          }
        } catch (testimonialError) {
          console.error('Error generating testimonials:', testimonialError);
        }
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (!service?.id) {
        throw new Error('Service ID is required for update');
      }

      // Parse AI technologies from comma-separated string to array
      const aiTechArray = data.aiTechnologies
        ? data.aiTechnologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0)
        : [];

      const serviceData = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        pageName: data.pageName,
        category: data.category,
        subCategory: data.subCategory,
        caseStudyCategories: JSON.stringify(data.caseStudyCategories || []),
        selectedCaseStudies: JSON.stringify(data.selectedCaseStudies || []),
        content: data.content,
        excerpt: data.content.substring(0, 200) + "...",
        metaTitle: `${data.title} | GreenAppleX Services`,
        metaDescription: data.content.substring(0, 155) + "...",
        primaryKeyword: data.primaryKeyword,
        secondaryKeywords: data.secondaryKeywords,
        aiTechnologies: aiTechArray,
        referenceUrl: data.referenceUrl || null,
        referenceContent: data.referenceContent || null,
        status: data.status,
        // Preserve existing fields
        startingPrice: service.startingPrice || "Contact for pricing",
        featured: service.featured || false,
      };


      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Service update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ServiceFormData) => {
    if (service) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* AI Service Generation Panel */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">🤖 AI-Powered Service Generation</h3>
              <p className="text-sm text-purple-600">Generate comprehensive service content with a single click using AI</p>
            </div>
            <Button
              type="button"
              onClick={() => {
                const serviceName = form.watch('title') || form.watch('pageName');
                const category = form.watch('category');
                const subCategory = form.watch('subCategory');
                
                if (!serviceName) {
                  toast({
                    title: "Missing Information",
                    description: "Please enter a service title or page name first",
                    variant: "destructive",
                  });
                  return;
                }
                
                generateAIContent(serviceName, category, subCategory);
              }}
              disabled={isGeneratingAI}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <Sparkles className="w-4 h-4" />
              {isGeneratingAI && generatingField === 'all' ? 'Generating Complete Service...' : 'Generate Complete AI Service'}
            </Button>
          </div>
          <div className="text-sm text-purple-600">
            This will automatically generate: Title, SEO Keywords, Comprehensive Content (10 sections), Technologies, and all service details using advanced AI.
            <div className="mt-2 text-xs">
              Sections: Hero, Overview, Service Offerings, Technology Tools, Process, Why Choose Us, Trust Signals, Testimonials, FAQs, Final CTA
            </div>
          </div>
        </div>

        {/* Title Section with AI Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="title" className="text-base font-semibold">Service Title *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateWithAI('title')}
              disabled={isGeneratingAI || !form.watch('category') || !form.watch('subCategory')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">✨</span>
              {generatingField === 'title' ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="e.g., Custom Software Development Solutions"
            className="text-base"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
            <Select 
              value={form.watch("category") || ""}
              onValueChange={(value) => {
                setSelectedCategory(value);
                form.setValue("category", value);
                form.setValue("subCategory", ""); // Reset subcategory when category changes
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subCategory" className="text-base font-semibold">Subcategory *</Label>
            <Select 
              value={form.watch("subCategory") || ""}
              onValueChange={(value) => form.setValue("subCategory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.name}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.subCategory && (
              <p className="text-sm text-red-600">{form.formState.errors.subCategory.message}</p>
            )}
          </div>
        </div>

        {/* Page Name */}
        <div>
          <Label htmlFor="pageName" className="text-base font-semibold">Page Name *</Label>
          <Input
            id="pageName"
            {...form.register("pageName")}
            placeholder="e.g., Custom Software Solutions (shown in user navigation)"
            className="text-base"
          />
          {form.formState.errors.pageName && (
            <p className="text-sm text-red-600">{form.formState.errors.pageName.message}</p>
          )}
        </div>

        {/* Enhanced Case Study Category Selection */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 space-y-4">
          <div>
            <Label className="text-base font-semibold text-gray-700">
              📚 Case Study Categories <span className="text-sm text-gray-500">(multiple selection)</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Select multiple categories to see related case studies and choose specific ones to display
            </p>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {caseStudyCategories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-blue-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCaseStudyCategories.includes(category.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCaseStudyCategories([...selectedCaseStudyCategories, category.name]);
                    } else {
                      setSelectedCaseStudyCategories(selectedCaseStudyCategories.filter(c => c !== category.name));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>

          {/* Case Study Selection */}
          {selectedCaseStudyCategories.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-blue-200">
              <h4 className="font-medium text-gray-800">Available Case Studies:</h4>
              {selectedCaseStudyCategories.map((category) => (
                <div key={category} className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-700">{category} ({availableCaseStudies[category]?.length || 0} studies)</h5>
                  {availableCaseStudies[category]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableCaseStudies[category].map((caseStudy) => (
                        <label key={caseStudy.id} className="flex items-center space-x-2 p-2 bg-white border rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.watch("selectedCaseStudies")?.includes(caseStudy.id.toString()) || false}
                            onChange={(e) => {
                              const currentSelected = form.watch("selectedCaseStudies") || [];
                              if (e.target.checked) {
                                form.setValue("selectedCaseStudies", [...currentSelected, caseStudy.id.toString()], { shouldDirty: true });
                              } else {
                                form.setValue("selectedCaseStudies", currentSelected.filter(id => id !== caseStudy.id.toString()), { shouldDirty: true });
                              }
                            }}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">{caseStudy.title}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No published case studies in this category yet.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedCaseStudyCategories.length === 0 && (
            <p className="text-sm text-gray-500 italic">Select categories above to see available case studies</p>
          )}
        </div>

        {/* AI Content Reference Fields */}
        <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-800">AI Content Reference</h3>
          </div>
          <p className="text-sm text-blue-600 mb-4">
            Provide a reference URL or content for AI to analyze and generate structured service content based on your specifications.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add URL Field */}
            <div>
              <Label htmlFor="referenceUrl" className="text-base font-semibold">Add URL</Label>
              <Input
                id="referenceUrl"
                {...form.register("referenceUrl")}
                placeholder="https://example.com/reference-service"
                type="url"
                className="text-base"
              />
              <p className="text-xs text-blue-600 mt-1">
                URL for AI to analyze and extract service structure
              </p>
              {form.formState.errors.referenceUrl && (
                <p className="text-sm text-red-600">{form.formState.errors.referenceUrl.message}</p>
              )}
            </div>

            {/* Reference Content Field */}
            <div>
              <Label htmlFor="referenceContent" className="text-base font-semibold">Reference Content</Label>
              <Textarea
                id="referenceContent"
                {...form.register("referenceContent")}
                placeholder="Paste content here for AI to analyze and structure according to service format..."
                className="text-base min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-blue-600 mt-1">
                Manual content input for AI analysis and structuring
              </p>
              {form.formState.errors.referenceContent && (
                <p className="text-sm text-red-600">{form.formState.errors.referenceContent.message}</p>
              )}
            </div>
          </div>
          
          <div className="bg-blue-100 p-3 rounded text-sm text-blue-700">
            <strong>How it works:</strong> When you click "Generate Complete AI Service", the AI will analyze the URL or content you provide and create a comprehensive service page following the proper structure, including hero section, services overview, technology stack, process steps, testimonials, FAQs, and more.
          </div>
        </div>

        {/* SEO Keywords with AI Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">SEO Keywords *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateWithAI('keywords')}
              disabled={isGeneratingAI || !form.watch('title')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🔍</span>
              {generatingField === 'keywords' ? 'Generating...' : 'Generate Keywords'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryKeyword">Primary Keyword</Label>
              <Input
                id="primaryKeyword"
                {...form.register("primaryKeyword")}
                placeholder="e.g., custom software development"
              />
              {form.formState.errors.primaryKeyword && (
                <p className="text-sm text-red-600">{form.formState.errors.primaryKeyword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="secondaryKeywords">Secondary Keywords</Label>
              <Input
                id="secondaryKeywords"
                {...form.register("secondaryKeywords")}
                placeholder="keyword1, keyword2, keyword3..."
              />
              {form.formState.errors.secondaryKeywords && (
                <p className="text-sm text-red-600">{form.formState.errors.secondaryKeywords.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content with AI Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="content" className="text-base font-semibold">Content *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateWithAI('content')}
              disabled={isGeneratingAI || !form.watch('title')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">📝</span>
              {generatingField === 'content' ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
          <RichTextEditor
            value={form.watch("content") || ''}
            onChange={(value) => form.setValue("content", value, { shouldDirty: true })}
            placeholder="Detailed service description, benefits, process, and call-to-action..."
            className="min-h-[200px] text-base"
            rows={8}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
          )}
        </div>

        {/* AI Generated Technologies Field */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="aiTechnologies" className="text-base font-semibold">Technologies</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateWithAI('technologies')}
              disabled={isGeneratingAI || !form.watch('title')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">⚡</span>
              {generatingField === 'technologies' ? 'Generating...' : 'AI Generate Technologies'}
            </Button>
          </div>
          <Input
            id="aiTechnologies"
            {...form.register("aiTechnologies")}
            placeholder="AI will generate relevant technologies here... You can edit, add, or remove as needed"
            className="text-base"
          />
          <p className="text-sm text-gray-600">
            Click "AI Generate Technologies" to get AI suggestions, then edit the list as needed. Use comma-separated values (e.g., React, Node.js, MongoDB, AWS).
          </p>
          {form.formState.errors.aiTechnologies && (
            <p className="text-sm text-red-600">{form.formState.errors.aiTechnologies.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-base font-semibold">Status</Label>
          <Select onValueChange={(value) => form.setValue("status", value as "active" | "draft" | "inactive")}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending || isGeneratingAI}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white flex-1"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : service
                ? "Update Service"
                : "Create Service"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EnhancedServiceManagement() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [showPageNames, setShowPageNames] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const { data: pages = [] } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages']
  });

  // Helper function to get category icon
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'AI & Machine Learning': Brain,
      'Web3 & Blockchain': Globe,
      'Mobile Development': Smartphone,
      'Web Development': Code,
      'Enterprise Solutions': Building,
      'Cloud & DevOps': Cloud,
      'IoT & Security': Shield,
      'Automation & Testing': Settings
    };
    return iconMap[categoryName] || Settings;
  };

  // Filter services based on selection
  const filteredServices = services.filter(service => {
    if (!selectedCategory) return true;
    if (selectedSubcategory) return service.subcategoryId === selectedSubcategory;
    return service.categoryId === selectedCategory;
  });

  const handleDeleteService = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  });

  const toggleServiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update service status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Success",
        description: "Service status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <h3 className="text-lg font-semibold text-gray-900">Service Overview</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {services.length} total services
            </Badge>
            <Badge variant="outline" className="text-xs">
              {services.filter(s => s.status === 'active').length} active
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPageNames(!showPageNames)}
            className="text-xs"
          >
            {showPageNames ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showPageNames ? 'Hide' : 'Show'} Page Names
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedService(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Three-Layer Hierarchy Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Categories */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg text-xs transition-all",
                  !selectedCategory
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                All Categories
              </button>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory(null);
                    }}
                    className={cn(
                      "w-full text-left p-2 rounded-lg text-xs transition-all flex items-center",
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <Icon className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Subcategories */}
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
              <ChevronRight className="w-4 h-4 mr-2" />
              Subcategories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
              {selectedCategory ? (
                <>
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={cn(
                      "w-full text-left p-2 rounded-lg text-xs transition-all",
                      !selectedSubcategory
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    All Subcategories
                  </button>
                  {subcategories
                    .filter(sub => sub.categoryId === selectedCategory)
                    .map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => setSelectedSubcategory(subcategory.id)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg text-xs transition-all",
                          selectedSubcategory === subcategory.id
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <span className="truncate">{subcategory.name}</span>
                      </button>
                    ))}
                </>
              ) : (
                <div className="text-xs text-gray-500 p-2">
                  Select a category first
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Pages */}
        <Card className="border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-pink-700 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Service Pages {showPageNames && "(Page Names Shown)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
              {selectedSubcategory ? (
                <>
                  {/* Show Services with Page Names */}
                  {services
                    .filter(service =>
                      service.subcategoryId === selectedSubcategory &&
                      service.pageName &&
                      service.status === 'active'
                    )
                    .map((service) => (
                      <div
                        key={`service-${service.id}`}
                        className="p-2 rounded-lg bg-pink-50 text-pink-700 text-xs border border-pink-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">{service.pageName}</span>
                          <Badge
                            variant="default"
                            className="text-xs px-1 py-0 bg-blue-100 text-blue-700"
                          >
                            Service
                          </Badge>
                        </div>
                        {showPageNames && (
                          <div className="text-xs text-pink-600 mt-1 opacity-75">
                            Title: {service.title}
                          </div>
                        )}
                      </div>
                    ))
                  }

                  {/* Show Service Pages if any */}
                  {pages
                    .filter(page => page.subcategoryId === selectedSubcategory)
                    .map((page) => (
                      <div
                        key={`page-${page.id}`}
                        className="p-2 rounded-lg bg-gray-50 text-gray-700 text-xs border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">{page.title}</span>
                          <Badge
                            variant={page.status === 'active' ? 'secondary' : 'outline'}
                            className="text-xs px-1 py-0"
                          >
                            Page
                          </Badge>
                        </div>
                        {showPageNames && (
                          <div className="text-xs text-gray-600 mt-1 opacity-75">
                            Slug: {page.slug}
                          </div>
                        )}
                      </div>
                    ))
                  }

                  {services.filter(service =>
                    service.subcategoryId === selectedSubcategory &&
                    service.pageName &&
                    service.status === 'active'
                  ).length === 0 && pages.filter(page => page.subcategoryId === selectedSubcategory).length === 0 && (
                      <div className="text-xs text-gray-500 p-2">
                        No services or pages in this subcategory yet
                      </div>
                    )}
                </>
              ) : (
                <div className="text-xs text-gray-500 p-2">
                  Select a subcategory to see service pages
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Services
              {selectedCategory && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  in {categories.find(c => c.id === selectedCategory)?.name}
                  {selectedSubcategory && (
                    <> → {subcategories.find(s => s.id === selectedSubcategory)?.name}</>
                  )}
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredServices.length} shown
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 text-sm mb-2">No services found</div>
              <div className="text-gray-400 text-xs">
                {selectedCategory || selectedSubcategory
                  ? "Try selecting a different category or subcategory"
                  : "Create your first service to get started"
                }
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredServices.map((service) => {
                const category = categories.find(c => c.name === service.category);
                const subcategory = subcategories.find(s => s.name === service.subCategory);
                const associatedPages = pages.filter(p => {
                  const pageSubcategory = subcategories.find(s => s.id === p.subcategoryId);
                  return pageSubcategory?.name === service.subCategory;
                });

                return (
                  <Card key={service.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-gray-900 truncate flex-1">
                            {service.title}
                          </h4>
                          <Badge
                            variant={service.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs ml-2"
                          >
                            {service.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2">
                          {service.description}
                        </p>

                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Category: {category?.name || 'Unknown'}</div>
                          <div>Subcategory: {subcategory?.name || 'Unknown'}</div>
                          {showPageNames && service.pageName && (
                            <div className="bg-blue-50 p-2 rounded border">
                              <div className="font-medium text-blue-700 mb-1">Page Name for Navigation:</div>
                              <div className="text-blue-600 text-xs">
                                • {service.pageName}
                              </div>
                            </div>
                          )}
                          {showPageNames && associatedPages.length > 0 && (
                            <div className="bg-gray-50 p-2 rounded border">
                              <div className="font-medium text-gray-700 mb-1">Associated Pages:</div>
                              {associatedPages.map(page => (
                                <div key={page.id} className="text-gray-600 text-xs">
                                  • {page.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-semibold text-green-600">
                            {service.price}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleServiceStatus.mutate({
                                id: service.id,
                                status: service.status === 'active' ? 'inactive' : 'active'
                              })}
                              className="h-7 w-7 p-0"
                            >
                              {service.status === 'active' ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedService(service);
                                setShowForm(true);
                              }}
                              className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Edit service"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService.mutate(service.id)}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Form Modal/Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedService ? 'Edit Service' : 'Create Service'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedService(null);
                  }}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>

              {/* Enhanced Service Form */}
              <ServiceFormComponent
                service={selectedService}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedService(null);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedService(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}