import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, Save, X, Brain, Zap, Eye, EyeOff, Globe, Sparkles, FileText, Tags, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import type { IndustryPage } from "@shared/schema";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveRegion } from "@/lib/region-resolver";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  
  // Meta Fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  region: z.string().optional(),
  
  // Hero Section
  heroHeadline: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroBackgroundImage: z.string().optional(),
  heroBackgroundImageAlt: z.string().optional(),
  heroBackgroundImageS3Key: z.string().optional(),
  heroCtaText: z.string().optional(),
  heroCtaLink: z.string().optional(),
  
  // Overview Section
  overviewTitle: z.string().optional(),
  overviewContent: z.string().optional(),
  industryStatistics: z.string().optional(),
  
  // Industries Detail Section
  industriesDetailTitle: z.string().optional(),
  industries: z.string().optional(),
  
  // Technology Stack Section
  technologyStackTitle: z.string().optional(),
  keyTechnologies: z.string().optional(),
  platforms: z.string().optional(),
  tools: z.string().optional(),
  
  // Engagement Process Section
  engagementProcessTitle: z.string().optional(),
  engagementSteps: z.string().optional(),
  
  // Unique Value Propositions Section
  uniqueValuePropositionsTitle: z.string().optional(),
  uniqueValuePropositionsPoints: z.string().optional(),
  
  // Testimonials Section
  testimonialsTitle: z.string().optional(),
  testimonialsEntries: z.string().optional(),
  
  // FAQs Section
  faqsTitle: z.string().optional(),
  faqsItems: z.string().optional(),
  
  // Call to Action Section
  ctaHeadline: z.string().optional(),
  ctaSubtext: z.string().optional(),
  ctaPrimaryButtonText: z.string().optional(),
  ctaPrimaryButtonLink: z.string().optional(),
  ctaSecondaryButtonText: z.string().optional(),
  ctaSecondaryButtonLink: z.string().optional(),
  
  // Visibility Controls
  showOverview: z.boolean().default(true),
  showIndustriesDetail: z.boolean().default(true),
  showTechnologyStack: z.boolean().default(true),
  showEngagementProcess: z.boolean().default(true),
  showUniqueValuePropositions: z.boolean().default(true),
  showTestimonials: z.boolean().default(true),
  showFaqs: z.boolean().default(true),
  showCta: z.boolean().default(true),
  
  // Additional Fields
  primaryKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  referenceContent: z.string().optional(),
  content: z.string().optional(),
  generatedContent: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  page?: IndustryPage;
  onSuccess: () => void;
  onClose: () => void;
}

export function IndustryPageForm({ page, onSuccess, onClose }: Props) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      
      // Meta Fields
      metaTitle: page?.metaTitle || "",
      metaDescription: page?.metaDescription || "",
      metaKeywords: page?.metaKeywords || "",
      region: page?.region || resolveRegion(null, settings?.targetRegions),
      
      // Hero Section
      heroHeadline: page?.heroHeadline || "",
      heroSubheading: page?.heroSubheading || "",
      heroBackgroundImage: page?.heroBackgroundImage || "",
      heroBackgroundImageAlt: page?.heroBackgroundImageAlt || "",
      heroBackgroundImageS3Key: page?.heroBackgroundImageS3Key || "",
      heroCtaText: page?.heroCtaText || "",
      heroCtaLink: page?.heroCtaLink || "",
      
      // Overview Section
      overviewTitle: page?.overviewTitle || "Industry Overview",
      overviewContent: page?.overviewContent || "",
      industryStatistics: page?.industryStatistics || "",
      
      // Industries Detail Section
      industriesDetailTitle: page?.industriesDetailTitle || "Our Industry Solutions",
      industries: page?.industries || "",
      
      // Technology Stack Section
      technologyStackTitle: page?.technologyStackTitle || "Technologies We Use",
      keyTechnologies: page?.keyTechnologies || "",
      platforms: page?.platforms || "",
      tools: page?.tools || "",
      
      // Engagement Process Section
      engagementProcessTitle: page?.engagementProcessTitle || "How We Work",
      engagementSteps: page?.engagementSteps || "",
      
      // Unique Value Propositions Section
      uniqueValuePropositionsTitle: page?.uniqueValuePropositionsTitle || "",
      uniqueValuePropositionsPoints: page?.uniqueValuePropositionsPoints || "",
      
      // Testimonials Section
      testimonialsTitle: page?.testimonialsTitle || "What Our Clients Say",
      testimonialsEntries: page?.testimonialsEntries || "",
      
      // FAQs Section
      faqsTitle: page?.faqsTitle || "Frequently Asked Questions",
      faqsItems: page?.faqsItems || "",
      
      // Call to Action Section
      ctaHeadline: page?.ctaHeadline || "",
      ctaSubtext: page?.ctaSubtext || "",
      ctaPrimaryButtonText: page?.ctaPrimaryButtonText || "",
      ctaPrimaryButtonLink: page?.ctaPrimaryButtonLink || "",
      ctaSecondaryButtonText: page?.ctaSecondaryButtonText || "",
      ctaSecondaryButtonLink: page?.ctaSecondaryButtonLink || "",
      
      // Visibility Controls
      showOverview: page?.showOverview ?? true,
      showIndustriesDetail: page?.showIndustriesDetail ?? true,
      showTechnologyStack: page?.showTechnologyStack ?? true,
      showEngagementProcess: page?.showEngagementProcess ?? true,
      showUniqueValuePropositions: page?.showUniqueValuePropositions ?? true,
      showTestimonials: page?.showTestimonials ?? true,
      showFaqs: page?.showFaqs ?? true,
      showCta: page?.showCta ?? true,
      
      // Additional Fields
      primaryKeyword: page?.primaryKeyword || "",
      secondaryKeywords: page?.secondaryKeywords || "",
      referenceContent: page?.referenceContent || "",
      content: page?.content || "",
      generatedContent: page?.generatedContent || "",
      status: (page?.status as "draft" | "published") || "draft",
      featured: page?.featured || false,
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    const title = form.watch('title');
    if (title && !page) { // Only auto-generate for new pages
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  }, [form.watch('title'), page, form]);

  // Initialize image preview when editing existing page
  useEffect(() => {
    if (page?.heroBackgroundImage) {
      setImagePreview(page.heroBackgroundImage);
    }
  }, [page]);

  // Update region default when settings load
  useEffect(() => {
    if (settings && !page?.region) {
      const resolvedRegion = resolveRegion(null, settings.targetRegions);
      form.setValue("region", resolvedRegion);
    }
  }, [settings, page?.region, form]);

  // Enhanced AI Generation Function
  const generateAllContent = async () => {
    const title = form.getValues("title");
    const referenceContent = form.getValues("referenceContent");
    
    if (!title) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and optionally reference content first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAll(true);
    try {
      // Comprehensive content generation with reference content
      const response = await apiRequest('POST', '/api/ai/generate-industry-content', {
        title,
        referenceContent,
        industryType: title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim(),
        primaryFocus: "Digital transformation and technology solutions",
        geographicFocus: "Global",
        companySize: "All sizes",
        challenges: "Digital transformation, efficiency, competition, scalability",
        solutions: "Custom software development, AI solutions, cloud migration, digital innovation",
        targetAudience: "Business leaders, CTOs, IT decision makers",
        businessModel: "B2B enterprise services and solutions"
      });

      if (response.ok) {
        const response_data = await response.json();
        const data = response_data.content || response_data; // Handle both response structures
        
        // Populate all form fields with comprehensive generated content
        const heroData = data.hero || data.heroSection;
        if (heroData) {
          form.setValue('heroHeadline', heroData.title || '');
          form.setValue('heroSubheading', heroData.subtitle || heroData.heroSubtitle || '');
          form.setValue('heroCtaText', heroData.ctaPrimary || 'Get Started');
          form.setValue('heroCtaLink', '/contact');
        }

        // Normalize AI response data to match UI expectations
        const normalizeContent = (data: any) => {
          // Handle both response structures: data.overview or data.overviewSection
          const overview = data.overview || data.overviewSection || {};
          const introduction = overview.introduction || '';
          const overviewArray = Array.isArray(introduction) ? introduction : [introduction];
          const filteredOverview = overviewArray.filter((item: any) => item && item.trim()); // Remove empty strings
          
          // Industry statistics normalization
          const stats = (overview.industryMetrics || []).map((stat: any) => ({
            statistic: stat.title || stat.statistic || stat.metric || 'N/A',
            description: stat.description || stat.label || stat.value || ''
          }));
          
          return {
            overviewContent: filteredOverview.length > 0 ? filteredOverview : ['Leading digital transformation solutions tailored for your industry.'],
            industryStatistics: stats.length > 0 ? stats : []
          };
        };

        const overviewData = data.overview || data.overviewSection;
        if (overviewData) {
          const normalized = normalizeContent(data);
          form.setValue('overviewTitle', overviewData.sectionTitle || 'Industry Overview');
          form.setValue('overviewContent', JSON.stringify(normalized.overviewContent, null, 2));
          form.setValue('industryStatistics', JSON.stringify(normalized.industryStatistics, null, 2));
        }

        // Normalize industries data to match UI expectations
        const industriesData = data.industries || data.industriesDetailSection;
        if (industriesData) {
          const normalizeIndustries = (industries: any[]) => {
            return industries.map((industry: any) => ({
              title: industry.title || industry.name || 'Industry Solution',
              description: industry.description || industry.details || '',
              services: Array.isArray(industry.services) ? industry.services : 
                       (industry.services ? [industry.services] : []),
              technologies: Array.isArray(industry.technologies) ? industry.technologies : 
                          (industry.technologies ? [industry.technologies] : []),
              challenges: Array.isArray(industry.challenges) ? industry.challenges : 
                        (industry.challenges ? [industry.challenges] : []),
              benefits: Array.isArray(industry.benefits) ? industry.benefits : 
                      (industry.benefits ? [industry.benefits] : [])
            }));
          };
          
          const industries = normalizeIndustries(industriesData.industries || []);
          form.setValue('industriesDetailTitle', industriesData.sectionTitle || 'Industries We Serve');
          form.setValue('industries', JSON.stringify(industries, null, 2));
        }

        if (data.technologyStack) {
          form.setValue('technologyStackTitle', data.technologyStack.sectionTitle || 'Technology Stack');
          
          // Robust technology categorization
          const categories = data.technologyStack.categories || [];
          
          // Enhanced pattern matching for technology categories
          const frontendPatterns = /(frontend|client|ui|interface|react|angular|vue)/i;
          const backendPatterns = /(backend|server|api|cloud|platform|database|devops|integration|infrastructure)/i;
          
          const frontendTechs: string[] = [];
          const backendTechs: string[] = [];
          const allTechnologies: string[] = [];
          
          // Helper to convert technology entries to strings
          const toText = (t: any): string => {
            if (typeof t === 'string') return t;
            return t?.name || t?.title || t?.label || t?.value || String(t) || '';
          };

          categories.forEach((cat: any) => {
            const categoryName = cat.title || cat.categoryName || '';
            const technologies = (cat.technologies || cat.tools || cat.items || [])
              .map(toText)
              .filter(Boolean); // Remove empty strings
            
            // Add all technologies to the main list
            allTechnologies.push(...technologies);
            
            // Categorize based on patterns
            if (frontendPatterns.test(categoryName)) {
              frontendTechs.push(...technologies);
            } else if (backendPatterns.test(categoryName)) {
              backendTechs.push(...technologies);
            }
          });
          
          // Remove duplicates and provide fallbacks
          const uniqueAll = Array.from(new Set(allTechnologies));
          const uniqueFrontend = Array.from(new Set(frontendTechs));
          const uniqueBackend = Array.from(new Set(backendTechs));
          
          // Defensive defaults with meaningful fallbacks
          const keyTechs = uniqueAll.length > 0 ? uniqueAll.slice(0, 15) : ['JavaScript', 'Python', 'React', 'Node.js', 'AWS'];
          const platforms = uniqueBackend.length > 0 ? uniqueBackend : ['AWS', 'Azure', 'Docker', 'Kubernetes'];
          const tools = uniqueFrontend.length > 0 ? uniqueFrontend : ['React', 'Angular', 'Vue.js', 'HTML5', 'CSS3'];
          
          form.setValue('keyTechnologies', JSON.stringify(keyTechs, null, 2));
          form.setValue('platforms', JSON.stringify(platforms, null, 2)); 
          form.setValue('tools', JSON.stringify(tools, null, 2));
        }

        // Normalize engagement process data
        if (data.engagementProcess) {
          const steps = (data.engagementProcess.steps || []).map((step: any, index: number) => ({
            step: (index + 1).toString(),
            title: step.title || step.name || step.step || `Step ${index + 1}`,
            description: step.description || step.details || ''
          }));
          
          form.setValue('engagementProcessTitle', data.engagementProcess.sectionTitle || data.engagementProcess.title || 'Our Proven Process');
          form.setValue('engagementSteps', JSON.stringify(steps, null, 2));
        }

        // Normalize value propositions data - UI expects string[] not objects
        if (data.whyChooseUs || data.whyChooseUsSection) {
          const whyUs = data.whyChooseUs || data.whyChooseUsSection || {};
          const benefits = (whyUs.benefits || []).map((benefit: any) => {
            // Extract text content for simple string display
            const title = benefit.title || benefit.name || 'Key Benefit';
            const description = benefit.description || benefit.details || '';
            return description ? `${title}: ${description}` : title;
          });
          
          form.setValue('uniqueValuePropositionsTitle', whyUs.sectionTitle || whyUs.title || 'Why Choose Us');
          form.setValue('uniqueValuePropositionsPoints', JSON.stringify(benefits, null, 2));
        }

        // Normalize testimonials data
        if (data.testimonials) {
          const testimonials = (data.testimonials || []).map((testimonial: any) => ({
            name: testimonial.name || 'Client',
            company: testimonial.company || testimonial.organization || 'Company',
            position: testimonial.position || testimonial.title || 'Executive',
            testimonial: testimonial.testimonial || testimonial.feedback || testimonial.quote || '',
            rating: testimonial.rating || 5
          }));
          
          form.setValue('testimonialsTitle', 'What Our Clients Say');
          form.setValue('testimonialsEntries', JSON.stringify(testimonials, null, 2));
        }

        // Normalize FAQs data
        if (data.faqs) {
          const faqs = (data.faqs || []).map((faq: any) => ({
            question: faq.question || faq.q || 'Question',
            answer: faq.answer || faq.a || faq.response || ''
          }));
          
          form.setValue('faqsTitle', 'Frequently Asked Questions');
          form.setValue('faqsItems', JSON.stringify(faqs, null, 2));
        }

        // CTA Section
        form.setValue('ctaHeadline', `Ready to Transform Your ${title}?`);
        form.setValue('ctaSubtext', 'Contact us today to discuss your project requirements and get started.');
        form.setValue('ctaPrimaryButtonText', 'Get Free Consultation');
        form.setValue('ctaPrimaryButtonLink', '/contact');
        form.setValue('ctaSecondaryButtonText', 'View Portfolio');
        form.setValue('ctaSecondaryButtonLink', '/portfolio');

        // SEO and Meta Data - handle both response structures
        const seoData = data.seo || data.seoElements;
        if (seoData) {
          if (seoData.metaTitle) form.setValue('metaTitle', seoData.metaTitle);
          if (seoData.metaDescription) form.setValue('metaDescription', seoData.metaDescription);
          if (seoData.keywords) form.setValue('metaKeywords', seoData.keywords);
          if (seoData.focusKeyword) form.setValue('primaryKeyword', seoData.focusKeyword);
          if (seoData.keywords) {
            const keywordsArray = seoData.keywords.split(',').map((k: string) => k.trim());
            form.setValue('secondaryKeywords', keywordsArray.slice(1, 10).join(', '));
          }
        }

        // Enable all visibility toggles
        form.setValue('showOverview', true);
        form.setValue('showIndustriesDetail', true);
        form.setValue('showTechnologyStack', true);
        form.setValue('showEngagementProcess', true);
        form.setValue('showUniqueValuePropositions', true);
        form.setValue('showTestimonials', true);
        form.setValue('showFaqs', true);
        form.setValue('showCta', true);

        // Calculate counts correctly by checking the actual AI response structure
        const overviewMetricsCount = (data.overviewSection?.industryMetrics && Array.isArray(data.overviewSection.industryMetrics)) ? data.overviewSection.industryMetrics.length : 
                                     (data.overview?.industryMetrics && Array.isArray(data.overview.industryMetrics)) ? data.overview.industryMetrics.length : 0;
        
        const industriesCount = (data.industriesDetailSection?.industries && Array.isArray(data.industriesDetailSection.industries)) ? data.industriesDetailSection.industries.length :
                               (data.industries?.industries && Array.isArray(data.industries.industries)) ? data.industries.industries.length : 0;
        
        const techStackCount = (data.technologyStack?.categories && Array.isArray(data.technologyStack.categories)) ? data.technologyStack.categories.length : 0;
        
        const engagementStepsCount = (data.engagementProcess?.steps && Array.isArray(data.engagementProcess.steps)) ? data.engagementProcess.steps.length : 0;
        
        const benefitsCount = (data.whyChooseUs?.benefits && Array.isArray(data.whyChooseUs.benefits)) ? data.whyChooseUs.benefits.length :
                             (data.whyChooseUsSection?.benefits && Array.isArray(data.whyChooseUsSection.benefits)) ? data.whyChooseUsSection.benefits.length : 0;
        
        const testimonialsCount = (data.testimonials && Array.isArray(data.testimonials)) ? data.testimonials.length : 0;
        
        const faqsCount = (data.faqs && Array.isArray(data.faqs)) ? data.faqs.length : 0;

        // Generate a summary of what content was created for admin review
        const generatedSummary = [
          `✅ Generated comprehensive content for "${title}" industry page`,
          `📝 Hero Section: ${data.heroSection?.title || data.hero?.title || 'Created'}`,
          `📊 Industry Overview: ${data.overviewSection?.sectionTitle || data.overview?.sectionTitle || 'Created'} with ${overviewMetricsCount} metrics`,
          `🏭 Industries Detail: ${industriesCount} industry solutions`,
          `⚙️ Technology Stack: ${techStackCount} technology categories`,
          `🔄 Engagement Process: ${engagementStepsCount} process steps`,
          `🎯 Value Propositions: ${benefitsCount} key benefits`,
          `💬 Testimonials: ${testimonialsCount} client testimonials`,
          `❓ FAQs: ${faqsCount} frequently asked questions`,
          `📞 Call-to-Action: Customized for ${title} industry`,
          `🎯 SEO Elements: ${data.seoElements?.metaTitle || data.seo?.metaTitle ? 'Meta title, description, and keywords' : 'SEO elements'} generated`,
          `⏰ Generated on: ${new Date().toLocaleString()}`
        ].join('\n');
        
        form.setValue('generatedContent', generatedSummary);

        toast({
          title: "Content Generated Successfully!",
          description: "AI has generated comprehensive content for all sections. Review the content below and click Save when ready.",
        });

      } else {
        throw new Error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please check your reference content and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const generateKeywords = async () => {
    const title = form.getValues("title");
    
    if (!title) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const region = form.getValues("region") || resolveRegion(null, settings?.targetRegions);
      const response = await apiRequest('POST', '/api/ai/generate-industry-keywords', {
        title,
        industryType: title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim(),
        region,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.primaryKeyword) form.setValue('primaryKeyword', data.primaryKeyword);
        if (data.secondaryKeywords) form.setValue('secondaryKeywords', data.secondaryKeywords);

        toast({
          title: "Keywords Generated!",
          description: "SEO keywords have been generated and applied.",
        });
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const generateMetaData = async () => {
    const title = form.getValues("title");
    const primaryKeyword = form.getValues("primaryKeyword");
    
    if (!title) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMeta(true);
    try {
      const response = await apiRequest('POST', '/api/ai/generate-industry-meta', {
        title,
        primaryKeyword,
        industryType: title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim(),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.metaTitle) form.setValue('metaTitle', data.metaTitle);
        if (data.metaDescription) form.setValue('metaDescription', data.metaDescription);
        if (data.metaKeywords) form.setValue('metaKeywords', data.metaKeywords);

        toast({
          title: "Meta Data Generated!",
          description: "SEO meta data has been generated and applied.",
        });
      }
    } catch (error) {
      console.error('Error generating meta data:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate meta data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  // Generate background image using AI
  const generateBackgroundImage = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await apiRequest('POST', '/api/ai/industry-image', {
        title,
        style: "professional",
        aspect: "16:9"
      });

      const data = await response.json();
      
      if (data.success) {
        // Set preview image and update form with the generated image URL
        setImagePreview(`data:image/png;base64,${data.imageDataBase64}`);
        form.setValue("heroBackgroundImage", data.imageUrl);
        form.setValue("heroBackgroundImageAlt", `Professional ${title} industry background`);
        
        toast({
          title: "Success",
          description: "Background image generated successfully! Click 'Save to AWS' to permanently store it.",
        });
      } else {
        throw new Error(data.message || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate background image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Save image to S3 using existing Blog CMS storage functionality
  const saveImageToS3 = async () => {
    const currentImageUrl = form.getValues("heroBackgroundImage");
    const title = form.getValues("title");
    
    if (!currentImageUrl || !title) {
      toast({
        title: "Error", 
        description: "No image to save or title missing",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingToS3(true);
    try {
      // Use the new endpoint that leverages existing Blog CMS image storage
      const response = await apiRequest('POST', '/api/images/store-industry-background', {
        imageUrl: currentImageUrl,
        filename: `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-bg.png`
      });

      const data = await response.json();
      
      if (data.success) {
        // Update form with stored URL
        form.setValue("heroBackgroundImage", data.url);
        form.setValue("heroBackgroundImageS3Key", data.key);
        
        // Show different messages based on storage type
        const message = data.temporary 
          ? "Image saved temporarily (permanent storage unavailable - may expire)"
          : "Image saved to AWS successfully!";
        
        toast({
          title: "Success",
          description: message,
          variant: data.temporary ? "default" : "default",
        });
        
        // Show warning for temporary storage
        if (data.warning) {
          console.warn("Storage warning:", data.warning);
        }
      } else {
        throw new Error(data.message || "Failed to save image");
      }
    } catch (error: any) {
      console.error("Error saving image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingToS3(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/industry-pages', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-pages'] });
      toast({
        title: "Success",
        description: "Industry page created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create industry page",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('PUT', `/api/industry-pages/${page!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-pages'] });
      toast({
        title: "Success",
        description: "Industry page updated successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update industry page",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    if (page) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* AI Generation Header */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <Brain className="h-6 w-6 text-blue-600" />
                AI-Powered Content Generation
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-auto">Smart CMS</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Generate comprehensive industry page content automatically using AI. Simply provide a title and optional reference content for the best results.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Industry Page Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Healthcare Industry Solutions" 
                          {...field} 
                          data-testid="input-title"
                          className="border-blue-200 focus:border-blue-400"
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
                      <FormLabel className="text-sm font-semibold">URL Slug</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="healthcare-industry-solutions" 
                          {...field} 
                          data-testid="input-slug"
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">Auto-generated from title</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="referenceContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Reference Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste existing content, website URLs, or detailed requirements here to help AI generate more targeted and relevant content for your industry page..."
                        className="min-h-[120px] border-blue-200 focus:border-blue-400"
                        {...field}
                        data-testid="textarea-reference-content"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      💡 Tip: Provide competitor content, existing materials, or specific requirements to get better AI-generated results
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  onClick={generateAllContent}
                  disabled={isGeneratingAll}
                  data-testid="button-generate-all-content"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  size="lg"
                >
                  {isGeneratingAll ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate All Content with AI
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateKeywords}
                    disabled={isGeneratingKeywords}
                    data-testid="button-generate-keywords"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {isGeneratingKeywords ? (
                      <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Tags className="h-4 w-4 mr-1" />
                    )}
                    Keywords
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateMetaData}
                    disabled={isGeneratingMeta}
                    data-testid="button-generate-meta"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {isGeneratingMeta ? (
                      <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Globe className="h-4 w-4 mr-1" />
                    )}
                    SEO Meta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Page</FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
                          Highlight this page in navigation and listings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-featured"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <h3 className="text-sm font-medium text-gray-700">Show Advanced Fields</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                >
                  {showAdvancedFields ? (
                    <><EyeOff className="h-4 w-4 mr-1" /> Hide Advanced</>
                  ) : (
                    <><Eye className="h-4 w-4 mr-1" /> Show Advanced</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Media Section - Background Images */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Hero Background Image
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 ml-auto">AI Powered</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-sm">
                Generate professional background images for your industry page hero section using AI, or manage existing images.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Generation & Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">AI Image Generation</h4>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={generateBackgroundImage}
                    disabled={isGeneratingImage || !form.getValues("title")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    data-testid="button-generate-image"
                  >
                    {isGeneratingImage ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Background Image
                      </>
                    )}
                  </Button>
                  
                  {imagePreview && (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        onClick={saveImageToS3}
                        disabled={isUploadingToS3}
                        variant="outline"
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        data-testid="button-save-to-s3"
                      >
                        {isUploadingToS3 ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Saving to AWS...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save to AWS
                          </>
                        )}
                      </Button>
                      
                      <div className="text-xs text-gray-500 p-2 bg-amber-50 border border-amber-200 rounded">
                        <strong>Note:</strong> Click "Save to AWS" to permanently store the image. Generated images are temporary until saved.
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="heroBackgroundImageAlt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Image Alt Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Professional industry background" 
                              {...field} 
                              data-testid="input-image-alt"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Describe the image for accessibility and SEO
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="heroBackgroundImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Background Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://..." 
                              {...field} 
                              data-testid="input-image-url"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Automatically populated when image is generated/saved
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Right Side - Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Preview</h4>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden relative">
                    {imagePreview || form.getValues("heroBackgroundImage") ? (
                      <div className="relative h-full">
                        <img 
                          src={imagePreview || form.getValues("heroBackgroundImage")} 
                          alt="Background preview"
                          className="w-full h-full object-cover"
                          data-testid="img-preview"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="text-xl font-bold mb-2">
                              {form.getValues("heroHeadline") || form.getValues("title") || "Your Industry Title"}
                            </h3>
                            <p className="text-sm opacity-90">
                              {form.getValues("heroSubheading") || "Hero content will appear here"}
                            </p>
                          </div>
                        </div>
                        {imagePreview && !form.getValues("heroBackgroundImageS3Key") && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                              Temporary
                            </Badge>
                          </div>
                        )}
                        {form.getValues("heroBackgroundImageS3Key") && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Saved to AWS
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Generate an image to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Dimensions:</strong> 1792×1024 (16:9 aspect ratio)</p>
                    <p><strong>Style:</strong> Professional business background</p>
                    <p><strong>Usage:</strong> Hero section background image</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Sections - Conditional Display */}
          {showAdvancedFields && (
            <>
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Hero Section Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="heroHeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Headline</FormLabel>
                        <FormControl>
                          <Input placeholder="Transforming Healthcare with Cutting-Edge Technology Solutions" {...field} data-testid="input-hero-headline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heroSubheading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Subheading</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Empowering healthcare organizations with innovative software solutions..."
                            {...field}
                            data-testid="textarea-hero-subheading"
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heroCtaText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Get Started Today" {...field} data-testid="input-hero-cta-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heroCtaLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Link</FormLabel>
                          <FormControl>
                            <Input placeholder="/contact" {...field} data-testid="input-hero-cta-link" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* All other form sections with JSON fields */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Sections (AI Generated)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Overview Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      Overview Section
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="overviewTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Industry Overview" {...field} data-testid="input-overview-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showOverview"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Show Overview Section</FormLabel>
                              <FormDescription className="text-sm text-muted-foreground">
                                Display this section on the page
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-show-overview"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="overviewContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overview Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Industry overview and introduction..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="textarea-overview-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industryStatistics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Statistics (JSON Array)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='[{"icon": "TrendingUp", "value": "$4.1T", "label": "Market Size"}, {"icon": "Users", "value": "2.8B", "label": "Global Users"}]'
                              className="min-h-[100px] font-mono text-sm"
                              {...field}
                              data-testid="textarea-industry-statistics"
                            />
                          </FormControl>
                          <FormDescription>
                            JSON array of statistics with icon, value, and label properties
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Industries Detail Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Industries We Serve
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industriesDetailTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Industries We Serve" {...field} data-testid="input-industries-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showIndustriesDetail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Show Industries Section</FormLabel>
                              <FormDescription className="text-sm text-muted-foreground">
                                Display this section on the page
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-show-industries"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="industries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industries List (JSON Array)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='[{"icon": "Building2", "name": "Healthcare", "description": "Comprehensive healthcare solutions..."}]'
                              className="min-h-[120px] font-mono text-sm"
                              {...field}
                              data-testid="textarea-industries"
                            />
                          </FormControl>
                          <FormDescription>
                            JSON array of industries with icon, name, and description properties
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </CardContent>
              </Card>
            </>
          )}

          {/* SEO & Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO & Meta Information
              </CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Healthcare Industry Solutions | Your Company" {...field} data-testid="input-meta-title" />
                      </FormControl>
                      <FormDescription>Recommended: 50-60 characters</FormDescription>
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
                        <Input placeholder="healthcare technology solutions" {...field} data-testid="input-primary-keyword" />
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
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Transform your healthcare organization with our cutting-edge technology solutions..."
                        className="min-h-[80px]"
                        {...field}
                        data-testid="textarea-meta-description"
                      />
                    </FormControl>
                    <FormDescription>Recommended: 150-160 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="secondaryKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="medical software, healthcare apps, health tech" {...field} data-testid="input-secondary-keywords" />
                      </FormControl>
                      <FormDescription>Comma-separated list</FormDescription>
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
                        <Input placeholder="healthcare, technology, solutions, software" {...field} data-testid="input-meta-keywords" />
                      </FormControl>
                      <FormDescription>Comma-separated list</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generated Content Summary - For Admin Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Generated Content Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="generatedContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Generated Content Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AI content generation summary will appear here..."
                        className="min-h-[200px] font-mono text-sm bg-gray-50 dark:bg-gray-900"
                        readOnly
                        {...field}
                        data-testid="textarea-generated-content"
                      />
                    </FormControl>
                    <FormDescription>
                      This shows a summary of what content was generated by AI for admin review and tracking purposes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Separator />
          
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel"
              className="min-w-[120px]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.setValue('status', 'draft')}
                data-testid="button-save-draft"
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save as Draft
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                onClick={() => form.setValue('status', 'published')}
                data-testid="button-publish"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-w-[140px]"
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {page ? 'Update & Publish' : 'Create & Publish'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}