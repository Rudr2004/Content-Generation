import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, Search, Copy, X, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveRegion } from "@/lib/region-resolver";

const keywordGeneratorSchema = z.object({
  blogTitle: z.string().min(1, "Blog title is required"),
  region: z.string().optional(),
});

interface SEOKeywordGeneratorProps {
  onClose: () => void;
}

export function SEOKeywordGenerator({ onClose }: SEOKeywordGeneratorProps) {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(keywordGeneratorSchema),
    defaultValues: {
      blogTitle: "",
      region: resolveRegion(null, settings?.targetRegions),
    },
  });

  const generateKeywordsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof keywordGeneratorSchema>) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/generate-seo-keywords", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedKeywords(data.keywords);
      toast({
        title: "Keywords Generated Successfully",
        description: `Generated ${data.keywords.length} SEO-optimized keywords for your target markets.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error?.message || "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const onSubmit = (data: z.infer<typeof keywordGeneratorSchema>) => {
    generateKeywordsMutation.mutate(data);
  };

  const handleRegenerate = () => {
    const formData = form.getValues();
    generateKeywordsMutation.mutate(formData);
  };

  const copyKeywords = () => {
    const keywordsList = generatedKeywords.join(", ");
    navigator.clipboard.writeText(keywordsList);
    toast({
      title: "Keywords Copied",
      description: "Keywords have been copied to your clipboard.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🔍 SEO Keyword Generator
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="blogTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Blog Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., How Generative AI Can Transform Retail Operations"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <p className="text-sm text-gray-600">
                      Enter your blog title to generate SEO keywords optimized for your target markets
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Target Regions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="USA, Canada, UK, Germany"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <p className="text-sm text-gray-600">
                      Comma-separated list of target regions for SEO keyword generation. Default: USA, Canada
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Search className="mr-2 h-4 w-4" />
                      Generate Keywords
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {generatedKeywords.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-green-600">
                  ✅ Generated {generatedKeywords.length} Keywords
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={copyKeywords}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Keywords</CardTitle>
                  <p className="text-sm text-gray-600">
                    Mix of informational, commercial, and localized keywords for maximum search visibility
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {generatedKeywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(keyword);
                          toast({
                            title: "Keyword Copied",
                            description: `"${keyword}" copied to clipboard.`,
                          });
                        }}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comma-Separated List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {generatedKeywords.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}