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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
    siteName: z.string().min(2, "Site name must be at least 2 characters"),
    theme: z.enum(["light", "dark", "system"]),
    logoUrl: z.string().optional(),
    targetRegions: z.string().optional(),
    industryFocus: z.string().optional(),
});

export function SiteSettingsForm() {
    const { settings, isLoading, updateSettings } = useSiteSettings();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            siteName: "",
            theme: "light",
            logoUrl: "",
            targetRegions: "",
            industryFocus: "",
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                siteName: settings.siteName,
                theme: (settings.theme as "light" | "dark" | "system") || "light",
                logoUrl: settings.logoUrl || "",
                targetRegions: settings.targetRegions || "",
                industryFocus: settings.industryFocus || "",
            });
        }
    }, [settings, form]);

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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    General Settings
                </CardTitle>
                <CardDescription>
                    Manage your global site configuration including site name and theme.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="siteName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Website" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name that appears in the browser tab and navigation.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theme</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the default color theme for the application.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/logo.png" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        URL to your brand logo.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="targetRegions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Regions (Global Default)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="USA, Canada, UK, Germany" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Comma-separated list of target regions used as default for all pages. This will be used when page-specific regions are not set. Default: USA, Canada
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
                                    <FormLabel>Industry Focus (Global Default)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Technology, AI, Healthcare" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Comma-separated list of industries used as default for SEO keyword generation.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
