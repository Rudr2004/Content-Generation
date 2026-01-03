import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Save, Plus, X, FileText, Eye } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Simplified Case Study form validation schema matching Service Form exactly
const caseStudySchema = z.object({
  title: z.string().min(1, 'Page name is required'),
  category: z.string().min(1, 'Category is required'),
  referenceContent: z.string().optional(),
  generatedContent: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
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

export function SimplifiedCaseStudyCMS({ caseStudy, onSave, onClose }: CaseStudyCMSProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCaseStudyList, setShowCaseStudyList] = useState(true);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: '',
      category: '',
      referenceContent: '',
      generatedContent: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      status: 'draft',
    },
  });

  // Fetch all case studies
  const { data: caseStudies = [], refetch: refetchCaseStudies } = useQuery({
    queryKey: ['/api/case-study-pages'],
    enabled: showCaseStudyList,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CaseStudyFormData) => {
      const url = selectedCaseStudy ? `/api/case-study-pages/${selectedCaseStudy.id}` : '/api/case-study-pages';
      const method = selectedCaseStudy ? 'PUT' : 'POST';
      
      // Transform the simplified form data to the full schema structure
      const fullData = {
        title: data.title,
        category: data.category,
        referenceContent: data.referenceContent,
        // Store generated content in a simple content field for now
        problemStatement: data.generatedContent || '',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        status: data.status,
      };
      
      const response = await apiRequest(method, url, fullData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Case study ${selectedCaseStudy ? 'updated' : 'created'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/case-study-pages'] });
      refetchCaseStudies();
      handleCloseForm();
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
      const response = await apiRequest('POST', '/api/ai/generate-case-study-content', data);
      return response.json();
    },
    onSuccess: (data) => {
      // Handle both old and new response formats
      const content = data.content?.json || data.content || data;
      const formattedContent = data.content?.formatted || JSON.stringify(content, null, 2);
      
      // Store the JSON content as formatted string for better display
      form.setValue('generatedContent', formattedContent);
      form.setValue('metaTitle', data.metaTitle || content.title || form.getValues('title'));
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/case-study-pages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Case study deleted successfully',
      });
      refetchCaseStudies();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete case study: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleGenerateCompleteAI = () => {
    const title = form.getValues('title');
    const category = form.getValues('category');
    const referenceContent = form.getValues('referenceContent');
    
    if (!title || !category) {
      toast({
        title: 'Error',
        description: 'Please enter a page name and select a category before generating content',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingAI(true);
    generateAIMutation.mutate({ title, category, referenceContent });
  };

  const handleEdit = (caseStudy: any) => {
    setSelectedCaseStudy(caseStudy);
    setIsEditing(true);
    setShowCaseStudyList(false);
    
    // Populate form with case study data
    form.reset({
      title: caseStudy.title || '',
      category: caseStudy.category || '',
      referenceContent: caseStudy.referenceContent || '',
      generatedContent: caseStudy.problemStatement || '', // Using problemStatement as main content field
      metaTitle: caseStudy.metaTitle || '',
      metaDescription: caseStudy.metaDescription || '',
      metaKeywords: caseStudy.metaKeywords || '',
      status: caseStudy.status || 'draft',
    });
    
    setSelectedCategory(caseStudy.category || '');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewCaseStudy = () => {
    setSelectedCaseStudy(null);
    setIsEditing(true);
    setShowCaseStudyList(false);
    form.reset({
      title: '',
      category: '',
      referenceContent: '',
      generatedContent: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      status: 'draft',
    });
    setSelectedCategory('');
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setShowCaseStudyList(true);
    setSelectedCaseStudy(null);
    form.reset();
    setSelectedCategory('');
  };

  const onSubmit = (data: CaseStudyFormData) => {
    saveMutation.mutate(data);
  };

  // Show case study list
  if (showCaseStudyList && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Case Studies Management</h2>
          <Button
            onClick={handleNewCaseStudy}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Case Study
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseStudies.map((caseStudy: any) => (
                <div key={caseStudy.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{caseStudy.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {caseStudy.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {caseStudy.category}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        caseStudy.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {caseStudy.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {caseStudy.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/case-studies/${caseStudy.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(caseStudy)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(caseStudy.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {caseStudies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No case studies found. Create your first case study to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form (matching Service Form structure exactly)
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCaseStudy ? 'Edit Case Study' : 'Create New Case Study'}
        </h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseForm}
          >
            <X className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Study Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Page Name */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter case study page name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                    }} value={field.value}>
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

              {/* 3. Reference Content */}
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

              {/* Generate Complete Case Study Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleGenerateCompleteAI}
                  disabled={isGeneratingAI}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 px-8"
                >
                  {isGeneratingAI ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate Complete Case Study
                </Button>
              </div>

              {/* 4. Generated Content */}
              <FormField
                control={form.control}
                name="generatedContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generated Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="AI-generated case study content will appear here..."
                        className="min-h-[300px]"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">
                      This field will be populated with AI-generated content based on your reference material and selected category.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 5. SEO Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
                
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
              </div>

              {/* 6. Draft or Publish Dropdown */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              {/* Save Button */}
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
                  {selectedCaseStudy ? 'Update Case Study' : 'Create Case Study'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}