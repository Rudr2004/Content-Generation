import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe, TrendingUp, Search, RefreshCw, Save } from "lucide-react";
import { generateDynamicKeywords, LOCATION_KEYWORDS } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
    targetRegions: z.string().optional(),
    industryFocus: z.string().optional(),
});

export function SEOConfigurationForm() {
    const { settings, isLoading, updateSettings } = useSiteSettings();
    const [previewKeywords, setPreviewKeywords] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            targetRegions: "",
            industryFocus: "",
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                targetRegions: settings.targetRegions || "",
                industryFocus: settings.industryFocus || "",
            });
        }
    }, [settings, form]);

    // Live preview of generated keywords
    const targetRegions = form.watch("targetRegions");
    const industryFocus = form.watch("industryFocus");

    useEffect(() => {
        const keywords = generateDynamicKeywords(
            LOCATION_KEYWORDS, // Use the base location keywords as a sample
            targetRegions,
            industryFocus
        );
        setPreviewKeywords(keywords);
    }, [targetRegions, industryFocus]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateSettings(values);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Target Markets & Customization
                    </CardTitle>
                    <CardDescription>
                        Configure your target regions and industries to automatically generate localized SEO keywords across the site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="targetRegions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Regions (Comma Separated)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. USA, Canada, UK, Germany" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Keywords will be generated for each of these regions.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="industryFocus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industry Focus (Comma Separated)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Technology, Healthcare, Finance" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Used to tailor specific industry-related content.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Configuration
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Keyword Generation Preview
                    </CardTitle>
                    <CardDescription>
                        See exactly what keywords are being generated based on your settings above.
                        This list shows how your "Base Keywords" are combined with "Target Regions".
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-50 border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-700">Generated Output ({previewKeywords.length} keywords)</h4>
                            <Badge variant="outline" className="bg-white">
                                Example Sample
                            </Badge>
                        </div>
                        <ScrollArea className="h-[300px] w-full rounded-md border bg-white p-4">
                            <div className="flex flex-wrap gap-2">
                                {previewKeywords.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm py-1 px-2 font-normal">
                                        {keyword}
                                    </Badge>
                                ))}
                                {previewKeywords.length === 0 && (
                                    <p className="text-gray-500 italic text-sm">No keywords generated. Check your base keywords and regions.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
