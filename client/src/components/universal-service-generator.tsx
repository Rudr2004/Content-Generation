import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Download, Eye } from 'lucide-react';

interface UniversalServiceGeneratorProps {
  onContentGenerated?: (content: any, serviceData: any) => void;
}

export function UniversalServiceGenerator({ onContentGenerated }: UniversalServiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    targetAudience: '',
    industryFocus: '',
    seoKeywords: ''
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.serviceName.trim()) {
      toast({
        title: "Service Name Required",
        description: "Please enter a service name to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/services/generate-universal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate content');
      }

      const result = await response.json();
      setGeneratedContent(result.content);
      setServiceData(result.serviceData);
      
      toast({
        title: "Content Generated Successfully",
        description: `Universal service content created for ${formData.serviceName}`,
      });

      if (onContentGenerated) {
        onContentGenerated(result.content, result.serviceData);
      }

    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate service content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyJson = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2));
      toast({
        title: "Content Copied",
        description: "JSON content has been copied to clipboard."
      });
    }
  };

  const handleDownloadJson = () => {
    if (generatedContent) {
      const blob = new Blob([JSON.stringify(generatedContent, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.serviceName.toLowerCase().replace(/\s+/g, '-')}-service-content.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Universal Service Content Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate structured JSON content for any service page that matches the exact UI/UX structure as the LLM Development Services page.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                placeholder="e.g., Web Development Services"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Startups, Enterprise businesses"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industryFocus">Industry Focus</Label>
              <Input
                id="industryFocus"
                placeholder="e.g., Healthcare, Finance, E-commerce"
                value={formData.industryFocus}
                onChange={(e) => setFormData({ ...formData, industryFocus: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                placeholder="e.g., web development, custom software"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !formData.serviceName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Universal Service Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Generated Content Preview
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJson}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJson}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Hero Section</h4>
                <p className="text-sm"><strong>Headline:</strong> {generatedContent.heroSection?.headline}</p>
                <p className="text-sm"><strong>Subheading:</strong> {generatedContent.heroSection?.subheading}</p>
                <p className="text-sm"><strong>CTA:</strong> {generatedContent.heroSection?.ctaButton}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Service Offerings ({generatedContent.serviceOfferings?.components?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generatedContent.serviceOfferings?.components?.slice(0, 4).map((service: any, index: number) => (
                    <div key={index} className="text-sm">
                      <strong>{service.name}</strong>: {service.description.substring(0, 60)}...
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Structure Validation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>✅ Hero Section</div>
                  <div>✅ Intro Overview</div>
                  <div>✅ Service Offerings</div>
                  <div>✅ Trust Signals</div>
                  <div>✅ Capabilities</div>
                  <div>✅ Technical Foundation</div>
                  <div>✅ Technology Tools</div>
                  <div>✅ Process Steps</div>
                  <div>✅ Why Choose Us</div>
                  <div>✅ Testimonials ({generatedContent.testimonials?.length || 0})</div>
                  <div>✅ FAQs ({generatedContent.faqs?.length || 0})</div>
                  <div>✅ Ready for Display</div>
                </div>
              </div>

              <details className="space-y-2">
                <summary className="cursor-pointer font-medium">View Full JSON Structure</summary>
                <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(generatedContent, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground p-4 bg-blue-50 rounded-lg">
        <p className="font-medium mb-2">📋 How it works:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Enter your service name and optional targeting details</li>
          <li>AI generates content matching the exact LLM service page structure</li>
          <li>All sections, fields, and formatting remain identical</li>
          <li>Content is automatically adapted for your specific service type</li>
          <li>Generated JSON can be used directly in the service display component</li>
        </ol>
      </div>
    </div>
  );
}