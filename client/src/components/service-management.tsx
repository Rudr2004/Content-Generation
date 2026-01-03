import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { safeJsonParse } from "@/lib/markdown-utils";
import { type Service, type ServiceDetailPage } from "@shared/schema";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Loader2, 
  X,
  Wand2,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  FileText,
  Settings
} from "lucide-react";

// Default service categories configuration (fallback)
const defaultServiceCategories: Record<string, string[]> = {
  "AI & Machine Learning": [
    "Custom AI Development",
    "Machine Learning Solutions", 
    "Generative AI Services",
    "Computer Vision",
    "Natural Language Processing",
    "AI Consulting",
    "AI Automation Services",
    "Data Science Services"
  ],
  "Web3 & Blockchain": [
    "Smart Contract Development",
    "DeFi Solutions", 
    "NFT Development",
    "Blockchain Consulting",
    "Cryptocurrency Development",
    "Web3 Development"
  ],
  "Mobile Development": [
    "iOS App Development",
    "Android App Development",
    "React Native Development", 
    "Flutter Development",
    "Mobile App Consulting",
    "AR/VR Development"
  ],
  "Web Development": [
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
    "API Development", 
    "E-commerce Development",
    "CMS Development"
  ],
  "Enterprise Solutions": [
    "Custom Software Development",
    "Digital Transformation Consulting",
    "CRM Development",
    "ERP Development",
    "SaaS Development",
    "IT Consulting"
  ],
  "Cloud & DevOps": [
    "Cloud Computing Services",
    "DevOps Services",
    "DevOps Automation"
  ],
  "Design & UX": [
    "UI/UX Design",
    "User Experience Consulting",
    "Design Systems"
  ]
};

// Technology domains available for selection
const TECHNOLOGY_DOMAINS = [
  "Machine Learning",
  "Blockchain", 
  "Frontend",
  "Backend",
  "Database", 
  "DevOps",
  "Mobile",
  "Information Security"
] as const;

// Enhanced form schema - matches database Service schema with new features
const serviceFormSchema = z.object({
  // Basic Information
  title: z.string().min(1, "Service title is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Subcategory is required"),
  caseStudyCategories: z.array(z.string()).optional(),
  selectedCaseStudies: z.array(z.string()).optional(),
  pageName: z.string().optional(),
  slug: z.string().optional(),
  
  // Content
  content: z.string().optional(),
  excerpt: z.string().optional(),
  
  // Media
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  icon: z.string().optional(),
  
  // Arrays
  features: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  techStackDomains: z.array(z.string()).optional(), // New: Technology stack domains
  
  // SEO Meta Information
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  
  // Open Graph
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  
  // Status and Pricing
  status: z.enum(["active", "draft", "inactive"]).default("active"),
  featured: z.boolean().default(false),
  startingPrice: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service?: Service;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  status: string;
}

interface CaseStudyCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
}

function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>(service?.category || "");
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, string[]>>(defaultServiceCategories);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [showKeywordSelector, setShowKeywordSelector] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isGeneratingService, setIsGeneratingService] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingTestimonials, setIsGeneratingTestimonials] = useState(false);
  const [servicePages, setServicePages] = useState<Array<{title: string; slug?: string; summary: string}>>([]);
  const [selectedCaseStudyCategories, setSelectedCaseStudyCategories] = useState<string[]>([]);
  const [availableCaseStudies, setAvailableCaseStudies] = useState<{[category: string]: Array<{id: number; title: string}>}>({});

  // Load categories and subcategories from database
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  // Load case study categories for the case study section
  const { data: caseStudyCategories = [], isLoading: isLoadingCaseStudies, error: caseStudyError } = useQuery<CaseStudyCategory[]>({
    queryKey: ['/api/case-study-categories'],
    queryFn: async () => {
      const response = await fetch('/api/case-study-categories');
      if (!response.ok) throw new Error('Failed to fetch case study categories');
      const data = await response.json();
      console.log('Case study categories loaded:', data);
      return data;
    }
  });

  // Debug logging for case study categories
  useEffect(() => {
    console.log('Case study categories state:', {
      caseStudyCategories,
      isLoadingCaseStudies,
      caseStudyError,
      selectedCaseStudyCategories
    });
  }, [caseStudyCategories, isLoadingCaseStudies, caseStudyError, selectedCaseStudyCategories]);

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

  // Convert database categories to the format expected by the form
  useEffect(() => {
    if (categories.length > 0 && subcategories.length > 0) {
      const categoryMap: Record<string, string[]> = {};
      
      categories.forEach(category => {
        const categorySubcategories = subcategories
          .filter(sub => sub.categoryId === category.id)
          .map(sub => sub.name);
        categoryMap[category.name] = categorySubcategories;
      });
      
      // Merge with default categories (fallback)
      setDynamicCategories({ ...defaultServiceCategories, ...categoryMap });
    }
  }, [categories, subcategories]);

  // Fetch case studies when selected categories change
  useEffect(() => {
    if (selectedCaseStudyCategories.length > 0) {
      fetchCaseStudiesForCategories(selectedCaseStudyCategories);
    } else {
      setAvailableCaseStudies({});
    }
  }, [selectedCaseStudyCategories]);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      // Basic Information
      title: service?.title || "",
      category: service?.category || "",
      subCategory: service?.subCategory || "",
      caseStudyCategories: safeJsonParse(service?.caseStudyCategories, []),
      selectedCaseStudies: safeJsonParse(service?.selectedCaseStudies, []),
      pageName: service?.pageName || "",
      slug: service?.slug || "",
      
      // Content
      content: "",
      excerpt: "",
      
      // Media
      imageUrl: "",
      imageAlt: "",
      icon: "",
      
      // Arrays
      features: [],
      technologies: [],
      techStackDomains: [], // New: Technology stack domains
      
      // SEO Meta Information
      metaTitle: "",
      metaDescription: "",
      primaryKeyword: "",
      secondaryKeywords: "",
      keywords: "",
      canonicalUrl: "",
      
      // Open Graph
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      
      // Status and Pricing
      status: "active",
      featured: false,
      startingPrice: "",
    },
  });

  // Update form values when service prop changes (for editing)
  useEffect(() => {
    if (service) {
      // Also update selectedCategory state for dynamic subcategories
      setSelectedCategory(service.category || "");
      
      // Update selected case study categories
      const existingCategories = safeJsonParse(service.caseStudyCategories, []);
      setSelectedCaseStudyCategories(existingCategories);
      
      form.reset({
        // Basic Information
        title: service.title || "",
        category: service.category || "",
        subCategory: service.subCategory || "",
        pageName: service.pageName || "",
        slug: service.slug || "",
        
        // Content
        content: service.content || "",
        excerpt: service.excerpt || "",
        
        // Media
        imageUrl: service.imageUrl || "",
        imageAlt: service.imageAlt || "",
        icon: service.icon || "",
        
        // Arrays - Handle both array and string formats
        features: Array.isArray(service.features) ? service.features : 
                  (typeof service.features === 'string' && service.features ? [service.features] : []),
        technologies: Array.isArray(service.technologies) ? service.technologies : 
                     (typeof service.technologies === 'string' && service.technologies ? [service.technologies] : []),
        techStackDomains: Array.isArray(service.techStackDomains) ? service.techStackDomains : [],
        
        // SEO Meta Information
        metaTitle: service.metaTitle || "",
        metaDescription: service.metaDescription || "",
        primaryKeyword: service.primaryKeyword || "",
        secondaryKeywords: service.secondaryKeywords || "",
        keywords: service.keywords || "",
        canonicalUrl: service.canonicalUrl || "",
        
        // Open Graph
        ogTitle: service.ogTitle || "",
        ogDescription: service.ogDescription || "",
        ogImage: service.ogImage || "",
        
        // Case study selection
        caseStudyCategories: existingCategories,
        selectedCaseStudies: safeJsonParse(service.selectedCaseStudies, []),
        
        // Status and Pricing
        status: (service.status as "active" | "draft" | "inactive") || "active",
        featured: service.featured || false,
        startingPrice: service.startingPrice || "",
      });
      
      // Also fetch existing service pages if service has an ID
      if (service.id) {
        fetchServicePages(service.id);
      }
    } else {
      // Reset form and pages when not editing
      setSelectedCategory("");
      setServicePages([]);
    }
  }, [service, form]);

  // Function to fetch service pages
  const fetchServicePages = async (serviceId: number) => {
    try {
      const response = await fetch(`/api/services/${serviceId}/pages`);
      if (response.ok) {
        const pages = await response.json();
        setServicePages(pages.map((page: ServiceDetailPage) => ({
          title: page.title,
          slug: page.slug,
          summary: page.summary || ""
        })));
      }
    } catch (error) {
      console.error("Error fetching service pages:", error);
    }
  };

  // Page management functions
  const addServicePage = () => {
    setServicePages([...servicePages, { title: "", summary: "" }]);
  };

  const removeServicePage = (index: number) => {
    setServicePages(servicePages.filter((_, i) => i !== index));
  };

  const updateServicePage = (index: number, field: 'title' | 'slug' | 'summary', value: string) => {
    const updatedPages = [...servicePages];
    updatedPages[index] = { ...updatedPages[index], [field]: value };
    setServicePages(updatedPages);
  };

  // Function to generate AI SEO keywords
  const generateAISEOKeywords = async () => {
    const title = form.getValues("title");
    const category = form.getValues("category");
    const subCategory = form.getValues("subCategory");

    if (!title || !category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in Title, Category, and Sub-Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const response = await fetch("/api/ai/generate-seo-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          title,
          category,
          subCategory,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let keywordsString = "";
      if (data && typeof data === 'object' && 'keywords' in data) {
        keywordsString = data.keywords as string;
      }
      
      if (keywordsString && keywordsString.length > 0) {
        const keywordArray = keywordsString.split(/[,;]/).map(k => k.trim()).filter(k => k.length > 0);
        
        // Auto-populate primary and secondary keywords
        if (keywordArray.length > 0) {
          form.setValue("primaryKeyword", keywordArray[0]);
          form.setValue("secondaryKeywords", keywordArray.slice(1).join(", "));
        }
        
        setGeneratedKeywords(keywordArray);
        setShowKeywordSelector(true);
        toast({
          title: "Keywords Generated!",
          description: `${keywordArray.length} SEO keywords generated and applied to Primary and Secondary fields.`,
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

  // Function to generate AI title
  const generateAITitle = async () => {
    const category = form.getValues("category");
    const subCategory = form.getValues("subCategory");

    if (!category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please select Category and Sub-Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTitle(true);
    try {
      // Generate title based on category and subcategory
      const titleOptions = [
        `Professional ${subCategory} Services`,
        `Custom ${subCategory} Solutions`,
        `Expert ${subCategory} Development`,
        `${subCategory} Consulting Services`,
        `Advanced ${subCategory} Solutions`
      ];
      
      const randomTitle = titleOptions[Math.floor(Math.random() * titleOptions.length)];
      form.setValue("title", randomTitle);
      
      toast({
        title: "Title Generated!",
        description: `Generated: "${randomTitle}"`,
      });
    } catch (error: any) {
      console.error("AI title generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  // Function to generate testimonials for the service
  const handleGenerateTestimonials = async () => {
    const category = form.getValues("category");
    const subCategory = form.getValues("subCategory");
    const title = form.getValues("title");

    if (!category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please select Category and Sub-Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTestimonials(true);
    try {
      const response = await fetch("/api/services/temp/testimonials/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          category,
          subCategory,
          title
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.testimonials) {
        toast({
          title: "Testimonials Generated!",
          description: `Generated ${data.testimonials.length} testimonials for this service.`,
        });
      } else {
        throw new Error("No testimonials generated");
      }
    } catch (error: any) {
      console.error("Testimonials generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTestimonials(false);
    }
  };

  // Function to generate complete service using AI
  const generateAIService = async () => {
    const title = form.getValues("title");
    const category = form.getValues("category");
    const subCategory = form.getValues("subCategory");

    if (!title || !category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in Title, Category, and Sub-Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingService(true);
    try {
      const response = await fetch("/api/ai/generate-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          title,
          category,
          subCategory,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Populate all form fields with AI-generated content
      if (data.primaryKeyword) form.setValue("primaryKeyword", data.primaryKeyword);
      if (data.secondaryKeywords) form.setValue("secondaryKeywords", data.secondaryKeywords);
      if (data.content) form.setValue("content", data.content);
      
      toast({
        title: "Service Generated!",
        description: "AI has populated all fields with professional content.",
      });
    } catch (error: any) {
      console.error("AI service generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate service content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingService(false);
    }
  };

  // Function to generate everything at once
  const generateAllContent = async () => {
    const category = form.getValues("category");
    const subCategory = form.getValues("subCategory");

    if (!category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please select Category and Sub-Category first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingService(true);
    try {
      // Generate title first if empty
      if (!form.getValues("title")) {
        await generateAITitle();
      }

      // Wait a moment for title to be set
      setTimeout(async () => {
        const title = form.getValues("title");
        
        // Generate keywords
        await generateAISEOKeywords();
        
        // Generate service content
        await generateAIService();
        
        toast({
          title: "Complete Service Generated!",
          description: "Title, keywords, and content have been generated.",
        });
      }, 500);
      
    } catch (error: any) {
      console.error("Complete generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate complete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingService(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: ServiceFormData) => {
      const processedData = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        features: data.features ? JSON.parse(data.features) : ["Professional Development", "Expert Team", "Quality Assurance"],
        technologies: data.technologies ? JSON.parse(data.technologies) : ["Latest Technologies", "Industry Standards"],
        keywords: `${data.primaryKeyword}, ${data.secondaryKeywords}`, // Maintain backward compatibility
        // Auto-fill Open Graph fields if not provided
        ogTitle: data.ogTitle || data.metaTitle,
        ogDescription: data.ogDescription || data.metaDescription,
        pages: data.pages || [], // Include service pages
        caseStudyCategories: JSON.stringify(data.caseStudyCategories || []),
        selectedCaseStudies: JSON.stringify(data.selectedCaseStudies || [])
      };
      return apiRequest("POST", `/api/services`, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created successfully!" });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ServiceFormData) => {
      const processedData = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        // Handle arrays properly - don't parse if already array
        features: Array.isArray(data.features) ? data.features : 
                 (typeof data.features === 'string' && data.features ? 
                  safeJsonParse(data.features, [data.features]) : 
                  (service?.features || ["Professional Development", "Expert Team", "Quality Assurance"])),
        technologies: Array.isArray(data.technologies) ? data.technologies : 
                     (typeof data.technologies === 'string' && data.technologies ? 
                      safeJsonParse(data.technologies, [data.technologies]) : 
                      (service?.technologies || ["Latest Technologies", "Industry Standards"])),
        techStackDomains: Array.isArray(data.techStackDomains) ? data.techStackDomains : 
                         (service?.techStackDomains || []),
        // Preserve existing service data for fields that might not be in the form
        imageUrl: data.imageUrl || service?.imageUrl || "",
        imageAlt: data.imageAlt || service?.imageAlt || "",
        icon: data.icon || service?.icon || "",
        keywords: `${data.primaryKeyword || ''}, ${data.secondaryKeywords || ''}`.replace(/^,\s*|,\s*$/g, ''), // Clean up keywords
        // Auto-fill Open Graph fields if not provided
        ogTitle: data.ogTitle || data.metaTitle || service?.ogTitle || "",
        ogDescription: data.ogDescription || data.metaDescription || service?.ogDescription || "",
        ogImage: data.ogImage || service?.ogImage || "",
        pages: data.pages || [], // Include service pages
        caseStudyCategories: JSON.stringify(data.caseStudyCategories || []),
        selectedCaseStudies: JSON.stringify(data.selectedCaseStudies || [])
      };
      
      console.log('Updating service with data:', processedData);
      return apiRequest("PUT", `/api/services/${service!.id}`, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated successfully!" });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: "Error updating service",
        description: error.message || "Failed to update service. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    // Include pages data and case study selections in submission
    const submissionData = {
      ...data,
      pages: servicePages,
      caseStudyCategories: selectedCaseStudyCategories,
      selectedCaseStudies: data.selectedCaseStudies || []
    } as any;
    
    if (service) {
      updateMutation.mutate(submissionData);
    } else {
      createMutation.mutate(submissionData);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Form */}
      <div className="flex-1">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {/* SEO Structure Guidelines Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🔍 SEO Structure Guidelines Implementation</h3>
              <p className="text-sm text-gray-600 mb-3">Following professional SEO best practices for maximum visibility and ranking</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded border">
                  <div className="font-semibold text-blue-600">1. URL Structure</div>
                  <div className="text-gray-600">Clean, short, keyword-rich</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-semibold text-purple-600">2. Meta Tags</div>
                  <div className="text-gray-600">Title (60 chars) + Description (155-160)</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-semibold text-pink-600">3. Content Structure</div>
                  <div className="text-gray-600">H1-H6 hierarchy + Keywords</div>
                </div>
              </div>
            </div>

            {/* 1. Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 1. Basic Information</h3>
              <p className="text-sm text-gray-600">Essential service details and categorization</p>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                H1 Title with Main Keyword <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="e.g., Custom Software Development Services in USA & Canada"
                className="w-full"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Use only once, include main keyword - this becomes your page H1
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Main Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCategory || ""}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    form.setValue("category", value);
                    form.setValue("subCategory", "");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(dynamicCategories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subCategory" className="text-sm font-medium text-gray-700">
                  Subcategory <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.getValues("subCategory") || ""}
                  onValueChange={(value) => form.setValue("subCategory", value)}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory && dynamicCategories[selectedCategory]?.map((subCategory) => (
                      <SelectItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subCategory && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.subCategory.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="pageName" className="text-sm font-medium text-gray-700">
                Page Name <span className="text-xs text-gray-500">(optional)</span>
              </Label>
              <Input
                id="pageName"
                {...form.register("pageName")}
                placeholder="e.g., Custom Software Solutions (shown in user navigation)"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Display name for user navigation (if different from title)
              </p>
            </div>

            {/* Enhanced Case Study Category Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  📚 Case Study Categories <span className="text-xs text-gray-500">(multiple selection)</span>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple categories to see related case studies and choose specific ones to display
                </p>
              </div>

              {/* Debug info */}
              {isLoadingCaseStudies && <p className="text-sm text-gray-500">Loading case study categories...</p>}
              {caseStudyError && <p className="text-sm text-red-500">Error loading categories: {caseStudyError.message}</p>}
              {caseStudyCategories.length === 0 && !isLoadingCaseStudies && !caseStudyError && (
                <p className="text-sm text-gray-500">No case study categories found.</p>
              )}
              
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
                                checked={form.getValues("selectedCaseStudies")?.includes(caseStudy.id.toString()) || false}
                                onChange={(e) => {
                                  const currentSelected = form.getValues("selectedCaseStudies") || [];
                                  if (e.target.checked) {
                                    form.setValue("selectedCaseStudies", [...currentSelected, caseStudy.id.toString()]);
                                  } else {
                                    form.setValue("selectedCaseStudies", currentSelected.filter(id => id !== caseStudy.id.toString()));
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

            {/* 2. URL Structure */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 2. URL Structure</h3>
              <p className="text-sm text-gray-600">Clean, short, and keyword-rich URLs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                  URL Slug <span className="text-xs text-gray-500">(auto-generated)</span>
                </Label>
                <Input
                  id="slug"
                  {...form.register("slug")}
                  placeholder="custom-software-development"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use hyphens, lowercase, keyword-rich
                </p>
              </div>

              <div>
                <Label htmlFor="canonicalUrl" className="text-sm font-medium text-gray-700">
                  Canonical URL <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="canonicalUrl"
                  {...form.register("canonicalUrl")}
                  placeholder="https://www.greenapplex.com/services/custom-software-development"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add canonical tags if needed
                </p>
              </div>
            </div>

            {/* 3. Meta Tags */}
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 3. Meta Tags</h3>
              <p className="text-sm text-gray-600">Critical for search engine ranking</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">
                  Title Tag (Max 60 characters) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="metaTitle"
                  {...form.register("metaTitle")}
                  placeholder="Custom Software Development in USA & Canada | GreenAppleX"
                  className="w-full"
                  maxLength={60}
                />
                {form.formState.errors.metaTitle && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.metaTitle.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Start with target keyword, end with brand name
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">
                  Meta Description (155-160 characters) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="metaDescription"
                  {...form.register("metaDescription")}
                  placeholder="Get scalable custom software solutions tailored for businesses in USA & Canada. Delivered with speed, security & agility."
                  className="w-full"
                  rows={3}
                  maxLength={160}
                />
                {form.formState.errors.metaDescription && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.metaDescription.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Include primary keyword + value proposition + light urgency
                </p>
              </div>
            </div>

            {/* 4. Keyword Strategy */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 4. Keyword Strategy</h3>
              <p className="text-sm text-gray-600">Medium-difficulty, commercial-intent keywords</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="primaryKeyword" className="text-sm font-medium text-gray-700">
                  Primary Target Keyword <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryKeyword"
                    {...form.register("primaryKeyword")}
                    placeholder="e.g., custom software development"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={generateAISEOKeywords}
                    disabled={isGeneratingKeywords}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGeneratingKeywords ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.primaryKeyword && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.primaryKeyword.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Main commercial-intent keyword for this service
                </p>
              </div>

              <div>
                <Label htmlFor="secondaryKeywords" className="text-sm font-medium text-gray-700">
                  Long-tail & LSI Keywords <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="secondaryKeywords"
                  {...form.register("secondaryKeywords")}
                  placeholder="e.g., enterprise software solutions, custom app development services, business software consulting"
                  className="w-full"
                  rows={3}
                />
                {form.formState.errors.secondaryKeywords && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.secondaryKeywords.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use long-tail & LSI keywords naturally (comma-separated)
                </p>
              </div>

              <div>
                <Label htmlFor="localKeywords" className="text-sm font-medium text-gray-700">
                  Local Variations <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="localKeywords"
                  {...form.register("localKeywords")}
                  placeholder="e.g., New York fintech app development, Toronto healthcare software"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add local variations where relevant
                </p>
              </div>
            </div>



            {/* 5. Content Structure (Following Bacancy/SoluLab model) */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 5. Content Structure</h3>
              <p className="text-sm text-gray-600">Following high-performing sites like Bacancy and SoluLab</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="heroHeadline" className="text-sm font-medium text-gray-700">
                  Hero H1 Headline with Target Keyword <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="heroHeadline"
                  {...form.register("heroHeadline")}
                  placeholder="Custom Software Development Services in USA & Canada"
                  className="w-full"
                />
                {form.formState.errors.heroHeadline && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.heroHeadline.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="heroSubheadline" className="text-sm font-medium text-gray-700">
                  1-liner Benefit Statement <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="heroSubheadline"
                  {...form.register("heroSubheadline")}
                  placeholder="Scalable, secure, and agile solutions delivered by expert developers"
                  className="w-full"
                />
                {form.formState.errors.heroSubheadline && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.heroSubheadline.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whyChooseUsContent" className="text-sm font-medium text-gray-700">
                  Why Choose [Your Company]? (3-6 USPs) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="whyChooseUsContent"
                  {...form.register("whyChooseUsContent")}
                  placeholder="• Fast delivery with agile methodology&#10;• 24/7 Support from dedicated team&#10;• Local team understanding USA & Canada markets&#10;• Proven track record with 200+ successful projects"
                  className="w-full"
                  rows={4}
                />
                {form.formState.errors.whyChooseUsContent && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.whyChooseUsContent.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  3-6 bullet points with unique selling propositions
                </p>
              </div>

              <div>
                <Label htmlFor="servicesOffered" className="text-sm font-medium text-gray-700">
                  What We Offer / Our Services <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="servicesOffered"
                  {...form.register("servicesOffered")}
                  placeholder="Grid or tabbed layout with service offerings:&#10;• Custom Web Applications - 40-50 word description&#10;• Mobile App Development - Built for iOS & Android&#10;• Enterprise Software - Scalable solutions for large businesses"
                  className="w-full"
                  rows={6}
                />
                {form.formState.errors.servicesOffered && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.servicesOffered.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Grid/tabbed layout services with 40-50 word descriptions each
                </p>
              </div>

              <div>
                <Label htmlFor="industriesServed" className="text-sm font-medium text-gray-700">
                  Industries We Serve <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Textarea
                  id="industriesServed"
                  {...form.register("industriesServed")}
                  placeholder="• FinTech - Helping Toronto's financial startups build secure trading platforms&#10;• HealthTech - HIPAA-compliant apps for New York healthcare providers&#10;• EdTech - Learning management systems for Canadian universities"
                  className="w-full"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Highlight key sectors with local angles (FinTech, HealthTech, EdTech)
                </p>
              </div>

              <div>
                <Label htmlFor="processSteps" className="text-sm font-medium text-gray-700">
                  Our Process <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Textarea
                  id="processSteps"
                  {...form.register("processSteps")}
                  placeholder="1. Discovery & Strategy - Comprehensive analysis of your requirements&#10;2. UI/UX Design - User-centered design approach&#10;3. Development - Agile development with regular updates&#10;4. Quality Assurance - Rigorous testing protocols&#10;5. Launch & Deployment - Seamless go-live process&#10;6. Support & Maintenance - Ongoing 24/7 support"
                  className="w-full"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Visual or numbered format: Discovery → UI/UX → Development → QA → Launch → Support
                </p>
              </div>
            </div>

            {/* Meta Title Field */}
            <div>
              <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">
                Meta Title <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(max 60 characters)</span>
              </Label>
              <Input
                id="metaTitle"
                {...form.register("metaTitle")}
                placeholder="Custom Software Development in USA & Canada | GreenAppleX"
                maxLength={60}
                className="w-full"
              />
              {form.formState.errors.metaTitle && (
                <p className="text-sm text-red-500">{form.formState.errors.metaTitle.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Start with target keyword, end with brand name. Character count: {form.watch("metaTitle")?.length || 0}/60
              </p>
            </div>

            {/* Meta Description Field */}
            <div>
              <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">
                Meta Description <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(120-160 characters)</span>
              </Label>
              <Textarea
                id="metaDescription"
                {...form.register("metaDescription")}
                placeholder="Get scalable custom software solutions tailored for businesses in the USA and Canada. Delivered with speed, security, and excellence."
                maxLength={160}
                rows={3}
                className="w-full"
              />
              {form.formState.errors.metaDescription && (
                <p className="text-sm text-red-500">{form.formState.errors.metaDescription.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Include keywords and value proposition. Character count: {form.watch("metaDescription")?.length || 0}/160
              </p>
            </div>

            {/* Content Structure Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Content Structure</h3>
              <p className="text-sm text-gray-600">Follow the 10-section structure: Hero → Why Choose → What We Offer → Industries → Process → Case Studies → Testimonials → Tech Stack → FAQs → Contact</p>
            </div>

            {/* Service Excerpt Field */}
            <div>
              <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                Service Excerpt <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(50+ characters)</span>
              </Label>
              <Textarea
                id="excerpt"
                {...form.register("excerpt")}
                placeholder="Professional custom software development services for businesses in USA and Canada..."
                rows={2}
                className="w-full"
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-red-500">{form.formState.errors.excerpt.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Short service summary for cards and previews. Character count: {form.watch("excerpt")?.length || 0}
              </p>
            </div>

            {/* Content Field */}
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Service Content <span className="text-red-500">*</span> 
              </Label>
              <div className="bg-blue-50 p-3 rounded-md mb-2">
                <p className="text-xs text-blue-800 font-medium mb-1">📋 Required Content Structure (H1-H6 hierarchy):</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>H1:</strong> Main keyword title (only once)</li>
                  <li>• <strong>H2:</strong> Why Choose GreenAppleX, Our Services, Industries We Serve, Our Process, etc.</li>
                  <li>• <strong>H3-H6:</strong> Subsections within H2s</li>
                  <li>• <strong>Keywords:</strong> Include primary/secondary keywords naturally</li>
                  <li>• <strong>CTAs:</strong> Use actionable, keyword-rich calls-to-action</li>
                  <li>• <strong>Local:</strong> Add USA/Canada specific content where possible</li>
                </ul>
              </div>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="<h1>Custom Software Development Services in USA & Canada</h1>
<p>Professional custom software development solutions...</p>

<h2>Why Choose GreenAppleX?</h2>
<ul>
<li>Fast delivery and agile methodology</li>
<li>Localized support for USA & Canada</li>
<li>Enterprise-grade security</li>
</ul>

<h2>What We Offer</h2>
<h3>Custom Software Development</h3>
<p>Tailored solutions for your business needs...</p>

<h2>Industries We Serve</h2>
<p>Helping Toronto's healthcare startups and New York's fintech companies...</p>

<h2>Our Process</h2>
<h3>Discovery & Strategy</h3>
<p>Comprehensive analysis of your requirements...</p>

<h2>Frequently Asked Questions</h2>
<h3>How much does custom software development cost in California?</h3>
<p>Our pricing varies based on project complexity...</p>"
                rows={20}
                className="font-mono text-sm min-h-[500px] w-full"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                HTML content following SEO structure guidelines with proper header hierarchy
              </p>
            </div>

            {/* 8. Open Graph Tags */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📱 8. Open Graph Tags</h3>
              <p className="text-sm text-gray-600">Enhanced social media sharing and visibility</p>
            </div>

            {/* URL and Open Graph Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="canonicalUrl" className="text-sm font-medium text-gray-700">
                  Canonical URL <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="canonicalUrl"
                  {...form.register("canonicalUrl")}
                  placeholder="https://www.greenapplex.com/services/custom-software-development"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Clean, short, and keyword-rich URL structure
                </p>
              </div>

              <div>
                <Label htmlFor="ogTitle" className="text-sm font-medium text-gray-700">
                  Open Graph Title <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="ogTitle"
                  {...form.register("ogTitle")}
                  placeholder="Custom Software Development Services | GreenAppleX"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Title for LinkedIn, Facebook, Twitter sharing
                </p>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="ogDescription" className="text-sm font-medium text-gray-700">
                  Open Graph Description <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Textarea
                  id="ogDescription"
                  {...form.register("ogDescription")}
                  placeholder="Professional custom software development services for businesses in USA and Canada. Get scalable, secure solutions delivered by expert developers."
                  rows={2}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Description for social media preview (155 chars recommended)
                </p>
              </div>

              <div>
                <Label htmlFor="ogImage" className="text-sm font-medium text-gray-700">
                  Open Graph Image URL <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="ogImage"
                  {...form.register("ogImage")}
                  placeholder="https://www.greenapplex.com/images/custom-software-development.jpg"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  1200x630px image for social media sharing
                </p>
              </div>
            </div>

            {/* 9. Status and Pricing */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-l-4 border-gray-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ 9. Status and Pricing</h3>
              <p className="text-sm text-gray-600">Service visibility and pricing information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Service Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as "active" | "draft" | "inactive")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Live)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    <SelectItem value="inactive">Inactive (Disabled)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Service
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...form.register("featured")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featured" className="text-sm text-gray-600">
                    Mark as featured service
                  </Label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Featured services appear prominently on homepage
                </p>
              </div>

              <div>
                <Label htmlFor="startingPrice" className="text-sm font-medium text-gray-700">
                  Starting Price <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="startingPrice"
                  {...form.register("startingPrice")}
                  placeholder="$50,000"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Starting price range for this service
                </p>
              </div>
            </div>

            {/* Technology Stack Domains */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🛠️ Technology Stack Domains</h3>
              <p className="text-sm text-gray-600">Select relevant technology domains for this service</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Select Technology Stack Domains
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {TECHNOLOGY_DOMAINS.map((domain) => (
                    <div key={domain} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`tech-${domain}`}
                        checked={form.watch("techStackDomains")?.includes(domain) || false}
                        onChange={(e) => {
                          const current = form.watch("techStackDomains") || [];
                          if (e.target.checked) {
                            form.setValue("techStackDomains", [...current, domain]);
                          } else {
                            form.setValue("techStackDomains", current.filter(d => d !== domain));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`tech-${domain}`} className="text-sm text-gray-700">
                        {domain}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select domains that are relevant to this service. These will help categorize and filter services.
                </p>
              </div>
            </div>

            {/* Testimonials Generation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Service Testimonials</h3>
              <p className="text-sm text-gray-600">Generate AI-powered testimonials for this service</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">AI Testimonials Generation</h4>
                    <p className="text-sm text-gray-600">
                      Generate realistic testimonials based on the service category and subcategory
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGenerateTestimonials}
                    disabled={!form.watch("category") || !form.watch("subCategory") || isGeneratingTestimonials}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isGeneratingTestimonials ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Testimonials
                      </>
                    )}
                  </Button>
                </div>
                
                {!form.watch("category") || !form.watch("subCategory") ? (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Please select a category and subcategory first to generate testimonials.
                  </div>
                ) : null}
              </div>
            </div>

            {/* Service Pages Section */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-pink-600" />
                    Service Pages
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create multiple pages for this service. Each page will have its own URL and content.
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {servicePages.length} page{servicePages.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-4">
                {servicePages.map((page, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Page {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeServicePage(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`page-title-${index}`} className="text-sm font-medium text-gray-700">
                          Page Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`page-title-${index}`}
                          value={page.title}
                          onChange={(e) => updateServicePage(index, 'title', e.target.value)}
                          placeholder="e.g., Getting Started Guide"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`page-slug-${index}`} className="text-sm font-medium text-gray-700">
                          Page Slug <span className="text-xs text-gray-500">(auto-generated)</span>
                        </Label>
                        <Input
                          id={`page-slug-${index}`}
                          value={page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          onChange={(e) => updateServicePage(index, 'slug', e.target.value)}
                          placeholder="getting-started-guide"
                          className="mt-1 text-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor={`page-summary-${index}`} className="text-sm font-medium text-gray-700">
                        Page Summary <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`page-summary-${index}`}
                        value={page.summary}
                        onChange={(e) => updateServicePage(index, 'summary', e.target.value)}
                        placeholder="Brief description of what this page covers..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addServicePage}
                  className="w-full border-dashed border-2 border-pink-300 text-pink-600 hover:text-pink-700 hover:bg-pink-50 py-6"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Service Page
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : service
                ? "Update Service"
                : "Create Service"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* AI Service Generator */}
      <div className="w-80">
        <Button
          type="button"
          onClick={() => setShowAIGenerator(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5" />
          AI Service Generator
        </Button>
      </div>

      {/* AI Service Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  AI Service Generator
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIGenerator(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600 mt-2">
                Generate complete service content with SEO keywords and professional HTML templates.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Quick Start Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🚀 Quick Start - Generate Everything</h4>
                <p className="text-gray-600 mb-4">
                  Let AI generate your complete service including title, SEO keywords, and professional content in one click!
                </p>
                <Button
                  type="button"
                  onClick={generateAllContent}
                  disabled={isGeneratingService || !form.getValues("category") || !form.getValues("subCategory")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isGeneratingService ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Complete Service...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Complete Service
                    </>
                  )}
                </Button>
                {(!form.getValues("category") || !form.getValues("subCategory")) && (
                  <p className="text-sm text-orange-600 mt-2">
                    ⚠️ Please select Category and Sub-Category in the main form first
                  </p>
                )}
              </div>

              {/* Service Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Current Service Information</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Title:</span>
                    <p className="text-blue-700">{form.getValues("title") || "Not set"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Category:</span>
                    <p className="text-blue-700">{form.getValues("category") || "Not set"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Sub-Category:</span>
                    <p className="text-blue-700">{form.getValues("subCategory") || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Title Generation Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">📝 Service Title</h4>
                  <Button
                    type="button"
                    onClick={generateAITitle}
                    disabled={isGeneratingTitle || !form.getValues("category") || !form.getValues("subCategory")}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
                  >
                    {isGeneratingTitle ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate Title
                  </Button>
                </div>

                <div>
                  <Label htmlFor="modal-title" className="text-sm font-medium text-gray-700">
                    Service Title <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="modal-title"
                      value={form.getValues("title")}
                      onChange={(e) => form.setValue("title", e.target.value)}
                      placeholder="Enter service title or click 'Generate Title'"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    AI will generate professional titles based on your category and sub-category
                  </p>
                </div>
              </div>

              {/* SEO Keywords Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">🎯 SEO Keywords</h4>
                  <Button
                    type="button"
                    onClick={generateAISEOKeywords}
                    disabled={isGeneratingKeywords || !form.getValues("title") || !form.getValues("category") || !form.getValues("subCategory")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
                  >
                    {isGeneratingKeywords ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate Keywords
                  </Button>
                </div>

                {/* Primary Keyword Field in Modal */}
                <div>
                  <Label htmlFor="modal-primaryKeyword" className="text-sm font-medium text-gray-700">
                    Primary SEO Keyword <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="modal-primaryKeyword"
                      value={form.getValues("primaryKeyword")}
                      onChange={(e) => form.setValue("primaryKeyword", e.target.value)}
                      placeholder="Enter main SEO keyword (e.g., AI development services)"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your main target keyword for this service
                  </p>
                </div>

                {/* Secondary Keywords Field in Modal */}
                <div>
                  <Label htmlFor="modal-secondaryKeywords" className="text-sm font-medium text-gray-700">
                    Secondary SEO Keywords <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <Textarea
                      id="modal-secondaryKeywords"
                      value={form.getValues("secondaryKeywords")}
                      onChange={(e) => form.setValue("secondaryKeywords", e.target.value)}
                      placeholder="Enter secondary keywords separated by commas"
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Generate AI keywords first, then select the most relevant ones for your service
                  </p>
                </div>

                {/* Keyword Selector Interface in Modal */}
                {(showKeywordSelector && generatedKeywords.length > 0) && (
                  <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Generated Keywords ({generatedKeywords.length})</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKeywordSelector(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Select the most relevant keywords for your service. Choose 1 primary keyword and multiple secondary keywords.
                    </p>
                    
                    {/* Primary Keyword Selection */}
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-gray-800 mb-2 block">
                        Primary Keyword (select the most important one):
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedKeywords.slice(0, 8).map((keyword, index) => {
                          const isPrimary = form.getValues("primaryKeyword") === keyword;
                          
                          return (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                form.setValue("primaryKeyword", keyword);
                                toast({
                                  title: "Primary Keyword Selected",
                                  description: `"${keyword}" is now your primary keyword`,
                                });
                              }}
                              className={`text-xs transition-all ${isPrimary ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
                            >
                              {keyword}
                            </Button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Your primary keyword should be the main term you want to rank for
                      </p>
                    </div>

                    {/* Secondary Keywords Selection */}
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-gray-800 mb-2 block">
                        Secondary Keywords (select 3-5 supporting keywords):
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedKeywords.map((keyword, index) => {
                          const currentSecondary = form.getValues("secondaryKeywords").split(',').map(k => k.trim()).filter(k => k);
                          const isSelected = currentSecondary.includes(keyword);
                          const isPrimary = form.getValues("primaryKeyword") === keyword;
                          const selectedCount = currentSecondary.length;
                          
                          return (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isPrimary || (!isSelected && selectedCount >= 5)}
                              onClick={() => {
                                const secondary = form.getValues("secondaryKeywords");
                                const currentKeywords = secondary.split(',').map(k => k.trim()).filter(k => k);
                                
                                if (isSelected) {
                                  // Remove keyword
                                  const updatedKeywords = currentKeywords.filter(k => k !== keyword);
                                  form.setValue("secondaryKeywords", updatedKeywords.join(', '));
                                  toast({
                                    title: "Keyword Removed",
                                    description: `"${keyword}" removed from secondary keywords`,
                                  });
                                } else if (selectedCount < 5) {
                                  // Add keyword
                                  const updatedKeywords = [...currentKeywords, keyword];
                                  form.setValue("secondaryKeywords", updatedKeywords.join(', '));
                                  toast({
                                    title: "Keyword Added",
                                    description: `"${keyword}" added to secondary keywords`,
                                  });
                                }
                              }}
                              className={`text-xs transition-all ${
                                isPrimary ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' :
                                isSelected ? 'bg-green-500 border-green-500 text-white shadow-md' : 
                                selectedCount >= 5 ? 'bg-gray-50 border-gray-200 text-gray-400' :
                                'bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300'
                              }`}
                            >
                              {keyword}
                              {isPrimary && <span className="ml-1 text-blue-500">★</span>}
                            </Button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {form.getValues("secondaryKeywords").split(',').filter(k => k.trim()).length}/5 keywords
                        {form.getValues("primaryKeyword") && " (★ = Primary keyword, cannot be selected as secondary)"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("secondaryKeywords", generatedKeywords.slice(1).join(', '));
                        }}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Select All Secondary
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("primaryKeyword", "");
                          form.setValue("secondaryKeywords", "");
                        }}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Service Content Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">📄 Service Content</h4>
                <p className="text-gray-600">
                  Generate professional, user-focused content that showcases expertise, market leadership, and value propositions to attract potential clients.
                </p>
                
                <Button
                  type="button"
                  onClick={generateAIService}
                  disabled={isGeneratingService || !form.getValues("title") || !form.getValues("category") || !form.getValues("subCategory")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isGeneratingService ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      Generate Service Content Only
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIGenerator(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAIGenerator(false);
                    toast({
                      title: "Content Applied!",
                      description: "AI-generated content has been applied to your service form.",
                    });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Apply to Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [viewingService, setViewingService] = useState<Service | undefined>();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      const response = await fetch(`/api/services?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/services/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Initial services seeded successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error seeding services",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (service: Service) => {
    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
      deleteMutation.mutate(service.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(undefined);
    queryClient.invalidateQueries({ queryKey: ["/api/services"] });
  };

  const handleCloseView = () => {
    setViewingService(undefined);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Service Detail View
  if (viewingService) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleCloseView}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingService(viewingService);
                setShowForm(true);
                setViewingService(undefined);
              }}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Service
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/services/${viewingService.slug}`, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </Button>
          </div>
        </div>

        {/* Service Detail Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Title</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">{viewingService.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900 mt-1">{viewingService.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sub-Category</label>
                    <p className="text-gray-900 mt-1">{viewingService.subCategory}</p>
                  </div>
                </div>
                {viewingService.excerpt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Excerpt</label>
                    <p className="text-gray-700 mt-1">{viewingService.excerpt}</p>
                  </div>
                )}
                {viewingService.pageName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Page Name (for Navigation)</label>
                    <p className="text-gray-900 mt-1">{viewingService.pageName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {viewingService.content && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Content</h3>
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: viewingService.content }}
                  />
                </div>
              </div>
            )}

            {/* SEO Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                SEO Information
              </h3>
              <div className="space-y-4">
                {viewingService.metaTitle && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Meta Title</label>
                    <p className="text-gray-900 mt-1">{viewingService.metaTitle}</p>
                  </div>
                )}
                {viewingService.metaDescription && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Meta Description</label>
                    <p className="text-gray-700 mt-1">{viewingService.metaDescription}</p>
                  </div>
                )}
                {viewingService.primaryKeyword && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Primary Keyword</label>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-1">
                      {viewingService.primaryKeyword}
                    </span>
                  </div>
                )}
                {viewingService.secondaryKeywords && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Secondary Keywords</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {viewingService.secondaryKeywords.split(',').map((keyword, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Status & Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      viewingService.status === 'active' ? 'bg-green-100 text-green-800' :
                      viewingService.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingService.status}
                    </span>
                  </div>
                </div>
                {viewingService.featured && (
                  <div>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                      ⭐ Featured Service
                    </span>
                  </div>
                )}
                {viewingService.startingPrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Starting Price</label>
                    <p className="text-gray-900 mt-1 font-medium">{viewingService.startingPrice}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Technical Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Slug</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                    {viewingService.slug}
                  </p>
                </div>
                {viewingService.canonicalUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Canonical URL</label>
                    <p className="text-blue-600 mt-1 text-sm break-all">{viewingService.canonicalUrl}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Service ID</label>
                  <p className="text-gray-600 mt-1 text-sm">{viewingService.id}</p>
                </div>
                {viewingService.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-600 mt-1 text-sm">
                      {new Date(viewingService.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features & Technologies */}
            {(viewingService.features || viewingService.technologies) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Technologies</h3>
                <div className="space-y-4">
                  {viewingService.features && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Features</label>
                      <div className="mt-1">
                        {Array.isArray(viewingService.features) ? (
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {viewingService.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700 text-sm">{viewingService.features}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {viewingService.technologies && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Technologies</label>
                      <div className="mt-1">
                        {Array.isArray(viewingService.technologies) ? (
                          <div className="flex flex-wrap gap-1">
                            {viewingService.technologies.map((tech, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm">{viewingService.technologies}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingService ? "Edit Service" : "Create New Service"}
          </h2>
        </div>
        <ServiceForm
          service={editingService}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingService(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
          <p className="text-gray-600 mt-1">
            {services.length} total service{services.length !== 1 ? 's' : ''} 
            {filteredServices.length !== services.length && (
              <span> • {filteredServices.length} shown</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {services.length === 0 && (
            <Button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              variant="outline"
            >
              {seedMutation.isPending ? "Seeding..." : "Seed Initial Services"}
            </Button>
          )}
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(defaultServiceCategories).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {services.length === 0 ? "No services yet. Create your first service or seed initial data." : "No services match your search criteria."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{service.category || 'No Category'}</span> → <span className="font-medium">{service.subCategory || 'No Subcategory'}</span>
                  </p>
                  {service.pageName && (
                    <p className="text-xs text-blue-600 mt-1">
                      Page Name: {service.pageName}
                    </p>
                  )}
                  {service.content && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Content Preview:</p>
                      <div className="text-sm text-gray-700 line-clamp-3">
                        <div dangerouslySetInnerHTML={{ 
                          __html: service.content.length > 200 
                            ? service.content.substring(0, 200) + '...' 
                            : service.content 
                        }} />
                      </div>
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                          View Full Content
                        </summary>
                        <div className="mt-2 text-sm text-gray-700 max-h-60 overflow-y-auto border-t pt-2 prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: service.content }} />
                        </div>
                      </details>
                    </div>
                  )}
                  {service.primaryKeyword && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Primary Keyword:</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {service.primaryKeyword}
                      </span>
                    </div>
                  )}
                  {service.secondaryKeywords && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Secondary Keywords:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.secondaryKeywords.split(',').slice(0, 3).map((keyword, index) => (
                          <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {keyword.trim()}
                          </span>
                        ))}
                        {service.secondaryKeywords.split(',').length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{service.secondaryKeywords.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {service.status}
                    </span>
                    {service.featured && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingService(service)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Service
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/services/${service.slug}`, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service)}
                    disabled={deleteMutation.isPending}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}