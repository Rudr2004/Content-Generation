import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Save, Plus, X, FileText } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { resolveRegion } from '@/lib/region-resolver';

// Simplified Case Study form validation schema matching Service Form structure
const caseStudySchema = z.object({
  title: z.string().min(1, 'Page name is required'),
  category: z.string().min(1, 'Category is required'),
  referenceContent: z.string().optional(),
  // Generated content will be stored in individual fields but displayed as one
  generatedContent: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  region: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

type CaseStudyFormData = z.infer<typeof caseStudySchema>;

const categories = [
  'AI & Machine Learning',
  'Web3 & Blockchain', 
  'Mobile Development',
  'Web Development',
  'E-commerce',
  'Enterprise Solutions',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Digital Transformation'
];

const categoryDescriptions = {
  'AI & Machine Learning': 'Showcase AI-powered solutions including machine learning models, natural language processing, computer vision, and intelligent automation systems.',
  'Web3 & Blockchain': 'Demonstrate blockchain applications, smart contracts, DeFi platforms, NFT marketplaces, and decentralized applications (dApps).',
  'Mobile Development': 'Feature mobile app development projects for iOS and Android platforms, including native and cross-platform solutions.',
  'Web Development': 'Highlight web application development projects including responsive websites, progressive web apps, and complex web platforms.',
  'E-commerce': 'Display e-commerce platform development, online marketplace solutions, and digital commerce innovations.',
  'Enterprise Solutions': 'Present enterprise-level software solutions, business process automation, and organizational digital transformation.',
  'FinTech': 'Showcase financial technology solutions including payment systems, banking platforms, and investment applications.',
  'HealthTech': 'Feature healthcare technology projects including telemedicine platforms, health monitoring systems, and medical software.',
  'EdTech': 'Demonstrate educational technology solutions including learning management systems, online education platforms, and training applications.',
  'Digital Transformation': 'Present comprehensive digital transformation projects that modernize business operations and processes.'
};

interface CaseStudyCMSProps {
  caseStudy?: any;
  onSave?: (data: any) => void;
  onClose?: () => void;
}

export function CaseStudyCMS({ caseStudy, onSave, onClose }: CaseStudyCMSProps) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: caseStudy?.title || '',
      clientName: caseStudy?.clientName || '',
      clientIndustry: caseStudy?.clientIndustry || '',
      clientLocation: caseStudy?.clientLocation || '',
      projectDuration: caseStudy?.projectDuration || '',
      problemStatement: caseStudy?.problemStatement || '',
      objectives: caseStudy?.objectives || '',
      challenges: caseStudy?.challenges || '',
      solutionStrategy: caseStudy?.solutionStrategy || '',
      featuresCapabilities: caseStudy?.featuresCapabilities || '',
      userExperienceDesign: caseStudy?.userExperienceDesign || '',
      technologiesUsed: caseStudy?.technologiesUsed || '',
      implementationProcess: caseStudy?.implementationProcess || '',
      quantitativeMetrics: caseStudy?.quantitativeMetrics || '',
      qualitativeBenefits: caseStudy?.qualitativeBenefits || '',
      businessOutcomes: caseStudy?.businessOutcomes || '',
      clientTestimonial: caseStudy?.clientTestimonial || '',
      futureScopeEnhancements: caseStudy?.futureScopeEnhancements || '',
      conclusion: caseStudy?.conclusion || '',
      referenceContent: caseStudy?.referenceContent || '',
      category: caseStudy?.category || '',
      tags: caseStudy?.tags || '',
      metaTitle: caseStudy?.metaTitle || '',
      metaDescription: caseStudy?.metaDescription || '',
      metaKeywords: caseStudy?.metaKeywords || '',
      region: caseStudy?.region || resolveRegion(null, settings?.targetRegions),
      status: caseStudy?.status || 'draft',
      featured: caseStudy?.featured || false,
    },
  });

  // Update region default when settings load
  useEffect(() => {
    if (settings && !caseStudy?.region) {
      const resolvedRegion = resolveRegion(null, settings.targetRegions);
      form.setValue("region", resolvedRegion);
    }
  }, [settings, caseStudy?.region, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: CaseStudyFormData) => {
      const url = caseStudy ? `/api/case-study-pages/${caseStudy.id}` : '/api/case-study-pages';
      const method = caseStudy ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save case study');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Case study ${caseStudy ? 'updated' : 'created'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/case-study-pages'] });
      onSave?.(form.getValues());
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save case study: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const generateAIMutation = useMutation({
    mutationFn: async (data: { title: string; category: string; referenceContent?: string }) => {
      const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
      const response = await fetch('/api/ai/generate-case-study-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, region }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const content = data.content;
      
      // Parse the generated content and populate form fields
      if (content.client) {
        form.setValue('clientName', content.client.name || '');
        form.setValue('clientIndustry', content.client.industry || '');
        form.setValue('clientLocation', content.client.location || '');
      }
      
      if (content.project_overview) {
        form.setValue('projectDuration', content.project_overview.duration || '');
        form.setValue('problemStatement', content.project_overview.problem_statement || '');
        form.setValue('objectives', JSON.stringify(content.project_overview.objectives || []));
      }
      
      form.setValue('challenges', JSON.stringify(content.challenges || []));
      
      if (content.solution) {
        form.setValue('solutionStrategy', content.solution.strategy || '');
        form.setValue('featuresCapabilities', JSON.stringify(content.solution.features_and_capabilities || []));
        form.setValue('userExperienceDesign', content.solution.user_experience_design || '');
        form.setValue('technologiesUsed', JSON.stringify(content.solution.technologies_used || []));
      }
      
      form.setValue('implementationProcess', JSON.stringify(content.implementation_process || []));
      
      if (content.results_and_impact) {
        form.setValue('quantitativeMetrics', JSON.stringify(content.results_and_impact.quantitative_metrics || {}));
        form.setValue('qualitativeBenefits', JSON.stringify(content.results_and_impact.qualitative_benefits || []));
        form.setValue('businessOutcomes', content.results_and_impact.business_outcomes || '');
      }
      
      form.setValue('clientTestimonial', content.client_testimonial || '');
      form.setValue('futureScopeEnhancements', content.future_scope_enhancements || '');
      form.setValue('conclusion', content.conclusion || '');
      
      // Generate SEO content
      form.setValue('metaTitle', data.metaTitle || content.title || '');
      form.setValue('metaDescription', data.metaDescription || content.project_overview?.problem_statement?.substring(0, 150) || '');
      form.setValue('metaKeywords', data.metaKeywords || '');
      
      toast({
        title: 'Success',
        description: 'AI content generated successfully',
      });
      
      setIsGeneratingAI(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate AI content: ${error.message}`,
        variant: 'destructive',
      });
      setIsGeneratingAI(false);
    },
  });

  const handleGenerateAI = () => {
    const title = form.getValues('title');
    const category = form.getValues('category');
    const referenceContent = form.getValues('referenceContent');
    
    if (!title || !category) {
      toast({
        title: 'Error',
        description: 'Please enter a title and select a category before generating AI content',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingAI(true);
    generateAIMutation.mutate({ title, category, referenceContent });
  };

  const onSubmit = (data: CaseStudyFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {caseStudy ? 'Edit Case Study' : 'Create New Case Study'}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateAI}
            disabled={isGeneratingAI}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
          >
            {isGeneratingAI ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate AI Content
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="project">Project Details</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Study Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter case study title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        {selectedCategory && categoryDescriptions[selectedCategory] && (
                          <p className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-md">
                            <strong>Category Focus:</strong> {categoryDescriptions[selectedCategory]}
                          </p>
                        )}
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
                          <Textarea 
                            placeholder="Paste reference content here that AI should use to generate the case study..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Provide any reference materials, existing content, or specific details that should guide the AI content generation.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Industry/Sector" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 6 months, Jan 2024 - Jun 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="problemStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Statement</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the client's needs or pain points"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Objectives</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter objectives as JSON array: ['Objective 1', 'Objective 2']"
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
                    name="challenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenges</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter challenges as JSON array: ['Challenge 1', 'Challenge 2']"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="solution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solution Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="solutionStrategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solution Strategy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Summary of approach/vision"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featuresCapabilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features & Capabilities</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter features as JSON array: ['Feature 1', 'Feature 2']"
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
                    name="userExperienceDesign"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Experience Design</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Details about UI/UX design and customization"
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
                    name="technologiesUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies Used</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter technologies as JSON array: ['React', 'Node.js', 'MongoDB']"
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
                    name="implementationProcess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Implementation Process</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter implementation phases as JSON array with phase and activities"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Results & Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="quantitativeMetrics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantitative Metrics</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter metrics as JSON object: {'user_growth': '200%', 'engagement_rate': '85%'}"
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
                    name="qualitativeBenefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualitative Benefits</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter benefits as JSON array: ['Benefit 1', 'Benefit 2']"
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
                    name="businessOutcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Outcomes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Summary of how business goals were achieved"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientTestimonial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Testimonial</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Client's statement or direct quote"
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
                    name="futureScopeEnhancements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Future Scope & Enhancements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Roadmap for next steps or potential upgrades"
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
                    name="conclusion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conclusion</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Summary of project success and reflections"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          {field.value ? (
                            <>Page-specific region set. Keywords will target: <strong>{field.value}</strong></>
                          ) : settings?.targetRegions ? (
                            <>Using global default: <strong>{settings.targetRegions}</strong>. Leave empty to use global, or set a page-specific region.</>
                          ) : (
                            <>Comma-separated list of target regions. If not set, will use global default from Site Settings.</>
                          )}
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="SEO meta title" {...field} />
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
                            placeholder="SEO meta description"
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
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="tag1, tag2, tag3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured</FormLabel>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Mark as featured case study</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {caseStudy ? 'Update Case Study' : 'Create Case Study'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}