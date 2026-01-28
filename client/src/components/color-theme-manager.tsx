import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Palette, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { currentColors, ExtractedColors } from "@/lib/color-extractor";
import { useToast } from "@/hooks/use-toast";

const colorThemeSchema = z.object({
    colorSettings: z.any().optional(),
});

type ColorThemeFormData = z.infer<typeof colorThemeSchema>;

interface ColorPickerFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
    showPreview?: boolean;
}

function ColorPickerField({ label, value, onChange, description, showPreview = true }: ColorPickerFieldProps) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                {showPreview && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPicker(!showPicker)}
                        className="h-6 px-2"
                    >
                        {showPicker ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="w-12 h-12 rounded-md border-2 border-gray-300 cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: value }}
                    onClick={() => setShowPicker(!showPicker)}
                    title={value}
                />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
                {showPicker && (
                    <Input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-16 h-12 cursor-pointer flex-shrink-0"
                    />
                )}
            </div>
            {description && (
                <FormDescription className="text-xs">{description}</FormDescription>
            )}
            <div className="text-xs text-gray-500 font-mono">{value}</div>
        </div>
    );
}

export function ColorThemeManager() {
    const { settings, isLoading, updateSettings } = useSiteSettings();
    const { toast } = useToast();
    const [colorSettings, setColorSettings] = useState<ExtractedColors>(currentColors);

    const form = useForm<ColorThemeFormData>({
        resolver: zodResolver(colorThemeSchema),
        defaultValues: {
            colorSettings: currentColors,
        },
        shouldFocusError: false, // Prevent auto-scroll to error fields
        mode: "onSubmit", // Only validate on submit
    });

    useEffect(() => {
        if (settings?.colorSettings) {
            // Merge saved colors with defaults - deep merge for nested objects
            const saved = settings.colorSettings as any;
            const merged = {
                general: {
                    ...currentColors.general,
                    ...saved.general,
                    header: {
                        ...currentColors.general.header,
                        ...saved.general?.header,
                    },
                    footer: {
                        ...currentColors.general.footer,
                        ...saved.general?.footer,
                    },
                    navbar: {
                        ...currentColors.general.navbar,
                        ...saved.general?.navbar,
                    },
                },
                buttons: {
                    ...currentColors.buttons,
                    ...saved.buttons,
                    primary: {
                        ...currentColors.buttons.primary,
                        ...saved.buttons?.primary,
                    },
                    secondary: {
                        ...currentColors.buttons.secondary,
                        ...saved.buttons?.secondary,
                    },
                    gradient: {
                        ...currentColors.buttons.gradient,
                        ...saved.buttons?.gradient,
                    },
                },
                pages: {
                    ...currentColors.pages,
                    ...saved.pages,
                    homepage: {
                        ...currentColors.pages.homepage,
                        ...saved.pages?.homepage,
                        heroGradient: {
                            ...currentColors.pages.homepage.heroGradient,
                            ...saved.pages?.homepage?.heroGradient,
                        },
                        heroGradientOverlay: {
                            ...currentColors.pages.homepage.heroGradientOverlay,
                            ...saved.pages?.homepage?.heroGradientOverlay,
                        },
                    },
                    blog: {
                        ...currentColors.pages.blog,
                        ...saved.pages?.blog,
                    },
                    service: {
                        ...currentColors.pages.service,
                        ...saved.pages?.service,
                    },
                    industry: {
                        ...currentColors.pages.industry,
                        ...saved.pages?.industry,
                    },
                    caseStudy: {
                        ...currentColors.pages.caseStudy,
                        ...saved.pages?.caseStudy,
                        heroGradient: {
                            ...currentColors.pages.caseStudy.heroGradient,
                            ...saved.pages?.caseStudy?.heroGradient,
                        },
                    },
                    hireDeveloper: {
                        ...currentColors.pages.hireDeveloper,
                        ...saved.pages?.hireDeveloper,
                    },
                },
                forms: {
                    ...currentColors.forms,
                    ...saved.forms,
                },
            };
            
            // Ensure homepage overlay is always present
            if (merged.pages?.homepage && !merged.pages.homepage.heroGradientOverlay) {
                merged.pages.homepage.heroGradientOverlay = {
                    ...currentColors.pages.homepage.heroGradientOverlay,
                };
            }
            
            setColorSettings(merged);
            form.setValue("colorSettings", merged);
        } else {
            setColorSettings(currentColors);
            form.setValue("colorSettings", currentColors);
        }
    }, [settings, form]);

    const updateColor = (path: string[], value: string) => {
        const newSettings = JSON.parse(JSON.stringify(colorSettings));
        let current: any = newSettings;

        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }

        current[path[path.length - 1]] = value;
        
        // Ensure homepage overlay is always present if homepage exists
        if (newSettings.pages?.homepage && !newSettings.pages.homepage.heroGradientOverlay) {
            newSettings.pages.homepage.heroGradientOverlay = {
                ...currentColors.pages.homepage.heroGradientOverlay,
            };
        }
        
        setColorSettings(newSettings);
        form.setValue("colorSettings", newSettings);
        
        // Apply immediately for preview
        applyColorsToDocument(newSettings);
    };

    const applyColorsToDocument = (colors: ExtractedColors = colorSettings) => {
        const root = document.documentElement;
        
        // General colors
        if (colors.general?.header) {
            root.style.setProperty("--header-bg", colors.general.header.backgroundColor);
            root.style.setProperty("--header-text", colors.general.header.textColor);
            root.style.setProperty("--header-border", colors.general.header.borderColor);
        }
        
        if (colors.general?.footer) {
            root.style.setProperty("--footer-bg", colors.general.footer.backgroundColor);
            root.style.setProperty("--footer-text", colors.general.footer.textColor);
            root.style.setProperty("--footer-border", colors.general.footer.borderColor);
            root.style.setProperty("--footer-link", colors.general.footer.linkColor || colors.general.footer.textColor);
            root.style.setProperty("--footer-hover", colors.general.footer.hoverColor || colors.general.footer.textColor);
        }
        
        if (colors.general?.navbar) {
            root.style.setProperty("--navbar-bg", colors.general.navbar.backgroundColor);
            root.style.setProperty("--navbar-text", colors.general.navbar.textColor);
            root.style.setProperty("--navbar-active", colors.general.navbar.activeColor);
            root.style.setProperty("--navbar-hover", colors.general.navbar.hoverColor);
            root.style.setProperty("--navbar-border", colors.general.navbar.borderColor || colors.general.navbar.backgroundColor);
        }

        // Button colors
        if (colors.buttons?.primary) {
            root.style.setProperty("--btn-primary-bg", colors.buttons.primary.backgroundColor);
            root.style.setProperty("--btn-primary-text", colors.buttons.primary.textColor);
            root.style.setProperty("--btn-primary-hover", colors.buttons.primary.hoverColor);
        }
        
        if (colors.buttons?.secondary) {
            root.style.setProperty("--btn-secondary-bg", colors.buttons.secondary.backgroundColor);
            root.style.setProperty("--btn-secondary-text", colors.buttons.secondary.textColor);
            root.style.setProperty("--btn-secondary-hover", colors.buttons.secondary.hoverColor);
        }

        // Gradient colors
        if (colors.buttons?.gradient) {
            root.style.setProperty("--gradient-start", colors.buttons.gradient.start);
            root.style.setProperty("--gradient-middle", colors.buttons.gradient.middle);
            root.style.setProperty("--gradient-end", colors.buttons.gradient.end);
        }

        // Page-specific colors - Homepage
        if (colors.pages?.homepage) {
            root.style.setProperty("--homepage-hero-start", colors.pages.homepage.heroGradient?.start || currentColors.pages.homepage.heroGradient.start);
            root.style.setProperty("--homepage-hero-middle", colors.pages.homepage.heroGradient?.middle || currentColors.pages.homepage.heroGradient.middle);
            root.style.setProperty("--homepage-hero-end", colors.pages.homepage.heroGradient?.end || currentColors.pages.homepage.heroGradient.end);
            root.style.setProperty("--homepage-hero-bg", colors.pages.homepage.heroBg || currentColors.pages.homepage.heroBg);
            // Always apply overlay colors - they're critical for the hero background
            root.style.setProperty("--homepage-hero-overlay-start", colors.pages.homepage.heroGradientOverlay?.start || currentColors.pages.homepage.heroGradientOverlay.start);
            root.style.setProperty("--homepage-hero-overlay-middle", colors.pages.homepage.heroGradientOverlay?.middle || currentColors.pages.homepage.heroGradientOverlay.middle);
            root.style.setProperty("--homepage-hero-overlay-end", colors.pages.homepage.heroGradientOverlay?.end || currentColors.pages.homepage.heroGradientOverlay.end);
        } else {
            // Apply defaults if no homepage colors exist
            root.style.setProperty("--homepage-hero-start", currentColors.pages.homepage.heroGradient.start);
            root.style.setProperty("--homepage-hero-middle", currentColors.pages.homepage.heroGradient.middle);
            root.style.setProperty("--homepage-hero-end", currentColors.pages.homepage.heroGradient.end);
            root.style.setProperty("--homepage-hero-bg", currentColors.pages.homepage.heroBg);
            root.style.setProperty("--homepage-hero-overlay-start", currentColors.pages.homepage.heroGradientOverlay.start);
            root.style.setProperty("--homepage-hero-overlay-middle", currentColors.pages.homepage.heroGradientOverlay.middle);
            root.style.setProperty("--homepage-hero-overlay-end", currentColors.pages.homepage.heroGradientOverlay.end);
        }

        if (colors.pages?.blog) {
            root.style.setProperty("--blog-card-bg", colors.pages.blog.cardBg);
            root.style.setProperty("--blog-text", colors.pages.blog.textColor);
            root.style.setProperty("--blog-link", colors.pages.blog.linkColor);
            root.style.setProperty("--blog-border", colors.pages.blog.borderColor);
        }

        if (colors.pages?.service) {
            root.style.setProperty("--service-card-bg", colors.pages.service.cardBg);
            root.style.setProperty("--service-gradient-start", colors.pages.service.gradientStart);
            root.style.setProperty("--service-gradient-middle", colors.pages.service.gradientMiddle);
            root.style.setProperty("--service-gradient-end", colors.pages.service.gradientEnd);
            root.style.setProperty("--service-text", colors.pages.service.textColor);
        }

        if (colors.pages?.industry) {
            root.style.setProperty("--industry-primary-bg", colors.pages.industry.primaryBg);
            root.style.setProperty("--industry-accent-bg", colors.pages.industry.accentBg);
            root.style.setProperty("--industry-button-bg", colors.pages.industry.buttonBg);
            root.style.setProperty("--industry-text", colors.pages.industry.textColor);
        }

        if (colors.pages?.caseStudy) {
            root.style.setProperty("--casestudy-hero-bg", colors.pages.caseStudy.heroBg || currentColors.pages.caseStudy.heroBg);
            root.style.setProperty("--casestudy-hero-start", colors.pages.caseStudy.heroGradientStart || currentColors.pages.caseStudy.heroGradientStart);
            root.style.setProperty("--casestudy-hero-middle", colors.pages.caseStudy.heroGradientMiddle || currentColors.pages.caseStudy.heroGradientMiddle);
            root.style.setProperty("--casestudy-hero-end", colors.pages.caseStudy.heroGradientEnd || currentColors.pages.caseStudy.heroGradientEnd);
            root.style.setProperty("--casestudy-card-bg", colors.pages.caseStudy.cardBg);
            root.style.setProperty("--casestudy-text", colors.pages.caseStudy.textColor);
            root.style.setProperty("--casestudy-border", colors.pages.caseStudy.borderColor);
        }

        if (colors.pages?.hireDeveloper) {
            root.style.setProperty("--hiredev-hero-bg", colors.pages.hireDeveloper.heroBg);
            root.style.setProperty("--hiredev-card-bg", colors.pages.hireDeveloper.cardBg);
            root.style.setProperty("--hiredev-button-bg", colors.pages.hireDeveloper.buttonBg);
            root.style.setProperty("--hiredev-text", colors.pages.hireDeveloper.textColor);
        }

        // Form colors
        if (colors.forms) {
            root.style.setProperty("--form-input-bg", colors.forms.inputBg);
            root.style.setProperty("--form-input-border", colors.forms.inputBorder);
            root.style.setProperty("--form-input-text", colors.forms.inputText);
            root.style.setProperty("--form-input-placeholder", colors.forms.inputPlaceholder || currentColors.forms.inputPlaceholder || "#6b7280");
            root.style.setProperty("--form-label-text", colors.forms.labelText);
            root.style.setProperty("--form-error-text", colors.forms.errorText);
        }
    };

    useEffect(() => {
        applyColorsToDocument();
    }, []);

    // Custom save handler that bypasses react-hook-form validation
    const handleSaveAll = async () => {
        try {
            // Prevent any scroll behavior immediately
            window.scrollTo(0, 0);
            
            // Normalize form state to ensure all required fields are present
            const normalizedSettings = JSON.parse(JSON.stringify(colorSettings));
            
            // Ensure ALL page structures exist with defaults
            if (!normalizedSettings.pages) {
                normalizedSettings.pages = { ...currentColors.pages };
            }
            
            // Ensure homepage structure is complete
            if (!normalizedSettings.pages.homepage) {
                normalizedSettings.pages.homepage = { ...currentColors.pages.homepage };
            } else {
                normalizedSettings.pages.homepage = {
                    ...currentColors.pages.homepage,
                    ...normalizedSettings.pages.homepage,
                    heroGradient: {
                        ...currentColors.pages.homepage.heroGradient,
                        ...normalizedSettings.pages.homepage.heroGradient,
                    },
                    heroGradientOverlay: {
                        ...currentColors.pages.homepage.heroGradientOverlay,
                        ...normalizedSettings.pages.homepage.heroGradientOverlay,
                    },
                };
            }
            
            // Ensure all other page structures exist
            if (!normalizedSettings.pages.blog) {
                normalizedSettings.pages.blog = { ...currentColors.pages.blog };
            }
            if (!normalizedSettings.pages.service) {
                normalizedSettings.pages.service = { ...currentColors.pages.service };
            }
            if (!normalizedSettings.pages.industry) {
                normalizedSettings.pages.industry = { ...currentColors.pages.industry };
            }
            if (!normalizedSettings.pages.caseStudy) {
                normalizedSettings.pages.caseStudy = { ...currentColors.pages.caseStudy };
            } else if (!normalizedSettings.pages.caseStudy.heroGradient) {
                normalizedSettings.pages.caseStudy.heroGradient = {
                    ...currentColors.pages.caseStudy.heroGradient,
                };
            }
            if (!normalizedSettings.pages.hireDeveloper) {
                normalizedSettings.pages.hireDeveloper = { ...currentColors.pages.hireDeveloper };
            }
            
            // Update form state to reflect normalized values (prevents validation issues)
            form.setValue("colorSettings", normalizedSettings, { shouldValidate: false });
            
            // Update local state as well
            setColorSettings(normalizedSettings);
            
            // Use normalized settings for saving
            const settingsToSave = normalizedSettings;
            
            // Deep merge to ensure all nested properties are present
            const finalSettings: ExtractedColors = {
                general: {
                    ...currentColors.general,
                    ...settingsToSave.general,
                    header: {
                        ...currentColors.general.header,
                        ...settingsToSave.general?.header,
                    },
                    footer: {
                        ...currentColors.general.footer,
                        ...settingsToSave.general?.footer,
                    },
                    navbar: {
                        ...currentColors.general.navbar,
                        ...settingsToSave.general?.navbar,
                    },
                },
                buttons: {
                    ...currentColors.buttons,
                    ...settingsToSave.buttons,
                    primary: {
                        ...currentColors.buttons.primary,
                        ...settingsToSave.buttons?.primary,
                    },
                    secondary: {
                        ...currentColors.buttons.secondary,
                        ...settingsToSave.buttons?.secondary,
                    },
                    gradient: {
                        ...currentColors.buttons.gradient,
                        ...settingsToSave.buttons?.gradient,
                    },
                },
                pages: {
                    ...currentColors.pages,
                    ...settingsToSave.pages,
                    homepage: {
                        ...currentColors.pages.homepage,
                        ...settingsToSave.pages?.homepage,
                        heroGradient: {
                            ...currentColors.pages.homepage.heroGradient,
                            ...settingsToSave.pages?.homepage?.heroGradient,
                        },
                        heroGradientOverlay: {
                            ...currentColors.pages.homepage.heroGradientOverlay,
                            ...settingsToSave.pages?.homepage?.heroGradientOverlay,
                        },
                    },
                    blog: {
                        ...currentColors.pages.blog,
                        ...settingsToSave.pages?.blog,
                    },
                    service: {
                        ...currentColors.pages.service,
                        ...settingsToSave.pages?.service,
                    },
                    industry: {
                        ...currentColors.pages.industry,
                        ...settingsToSave.pages?.industry,
                    },
                    caseStudy: {
                        ...currentColors.pages.caseStudy,
                        ...settingsToSave.pages?.caseStudy,
                        heroGradient: {
                            ...currentColors.pages.caseStudy.heroGradient,
                            ...settingsToSave.pages?.caseStudy?.heroGradient,
                        },
                    },
                    hireDeveloper: {
                        ...currentColors.pages.hireDeveloper,
                        ...settingsToSave.pages?.hireDeveloper,
                    },
                },
                forms: {
                    ...currentColors.forms,
                    ...settingsToSave.forms,
                },
            };
            
            await updateSettings({
                colorSettings: finalSettings,
            });
            
            toast({
                title: "Success",
                description: "Color settings saved successfully",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save color settings. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetToDefaults = async () => {
        try {
            // Reset local state
            setColorSettings(currentColors);
            form.setValue("colorSettings", currentColors);
            
            // Apply colors immediately for preview in admin panel
            applyColorsToDocument(currentColors);
            
            // Save to database so user-facing site also updates
            // This will trigger SiteSettingsContext to re-apply colors via onSuccess callback
            await updateSettings({
                colorSettings: currentColors,
            });
            
            // Force re-application after a brief delay to ensure context has updated
            setTimeout(() => {
                applyColorsToDocument(currentColors);
            }, 100);
            
            toast({
                title: "Colors Reset",
                description: "All color settings have been reset to default values and saved. The user-facing site will update shortly.",
            });
        } catch (error) {
            console.error("Failed to reset colors:", error);
            toast({
                title: "Error",
                description: "Failed to reset color settings. Please try again.",
                variant: "destructive",
            });
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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Color & Theme Management
                        </CardTitle>
                        <CardDescription className="mt-2">
                            View and update all color codes (hex codes) used throughout the website. 
                            Changes apply immediately for preview and are saved to the database.
                            <br />
                            <span className="text-xs text-muted-foreground mt-1 block">
                                Each color setting description shows exactly which components and pages use that color.
                            </span>
                        </CardDescription>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetToDefaults}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset to Defaults
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Component Color Mapping Guide</h3>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                        <li><strong>General:</strong> Header, Footer, Navbar - Used on ALL pages site-wide (affects every page)</li>
                        <li><strong>Buttons:</strong> Primary, Secondary, Gradient - Used in buttons across all pages (CTA buttons, action buttons)</li>
                        <li><strong>Pages:</strong> Homepage, Blog, Service, Industry, Case Study, Hire Developer - Page-specific colors (only affect those page types)</li>
                        <li><strong>Forms:</strong> Input fields, labels, errors - Used in all contact forms and admin forms</li>
                        <li><strong>💡 Tip:</strong> Each color field description shows exactly which components and pages use that color</li>
                        <li><strong>🔄 Dynamic Pages:</strong> Service, Case Study, Industry, and Hire Developer pages are dynamically generated and use their respective page color settings</li>
                    </ul>
                </div>
                <Form {...form}>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }} 
                        className="space-y-6"
                    >
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                                <TabsTrigger value="pages">Pages</TabsTrigger>
                                <TabsTrigger value="forms">Forms</TabsTrigger>
                                <TabsTrigger value="all">All Colors</TabsTrigger>
                            </TabsList>

                            {/* General Components Tab */}
                            <TabsContent value="general" className="space-y-4 mt-4">
                                <Accordion type="multiple" defaultValue={["header", "footer", "navbar"]} className="w-full">
                                    <AccordionItem value="header">
                                        <AccordionTrigger>Header Colors</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Background Color"
                                                    value={colorSettings.general.header.backgroundColor}
                                                    onChange={(value) => updateColor(["general", "header", "backgroundColor"], value)}
                                                    description="Used in: All Pages - Header section background (top banner area above navigation)"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.general.header.textColor}
                                                    onChange={(value) => updateColor(["general", "header", "textColor"], value)}
                                                    description="Used in: All Pages - Header text, Hero section headings, main page titles"
                                                />
                                                <ColorPickerField
                                                    label="Border Color"
                                                    value={colorSettings.general.header.borderColor}
                                                    onChange={(value) => updateColor(["general", "header", "borderColor"], value)}
                                                    description="Used in: All Pages - Header borders, section dividers, Hero badge borders"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="footer">
                                        <AccordionTrigger>Footer Colors</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Background Color"
                                                    value={colorSettings.general.footer.backgroundColor}
                                                    onChange={(value) => updateColor(["general", "footer", "backgroundColor"], value)}
                                                    description="Used in: All Pages - Footer section background (bottom of every page)"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.general.footer.textColor}
                                                    onChange={(value) => updateColor(["general", "footer", "textColor"], value)}
                                                    description="Used in: All Pages - Footer text, descriptions, tagline, copyright text"
                                                />
                                                <ColorPickerField
                                                    label="Border Color"
                                                    value={colorSettings.general.footer.borderColor}
                                                    onChange={(value) => updateColor(["general", "footer", "borderColor"], value)}
                                                    description="Used in: All Pages - Footer top border, section dividers within footer"
                                                />
                                                <ColorPickerField
                                                    label="Link Color"
                                                    value={colorSettings.general.footer.linkColor || colorSettings.general.footer.textColor}
                                                    onChange={(value) => updateColor(["general", "footer", "linkColor"], value)}
                                                    description="Used in: All Pages - Footer navigation links (Services, Company, Contact links)"
                                                />
                                                <ColorPickerField
                                                    label="Hover Color"
                                                    value={colorSettings.general.footer.hoverColor || colorSettings.general.footer.textColor}
                                                    onChange={(value) => updateColor(["general", "footer", "hoverColor"], value)}
                                                    description="Used in: All Pages - Footer link hover state, active link colors"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="navbar">
                                        <AccordionTrigger>Navigation Bar Colors</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Background Color"
                                                    value={colorSettings.general.navbar.backgroundColor}
                                                    onChange={(value) => updateColor(["general", "navbar", "backgroundColor"], value)}
                                                    description="Used in: All Pages - Navigation bar background, dropdown menus, mobile menu"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.general.navbar.textColor}
                                                    onChange={(value) => updateColor(["general", "navbar", "textColor"], value)}
                                                    description="Used in: All Pages - Navigation links text, menu items, dropdown items"
                                                />
                                                <ColorPickerField
                                                    label="Active Color"
                                                    value={colorSettings.general.navbar.activeColor}
                                                    onChange={(value) => updateColor(["general", "navbar", "activeColor"], value)}
                                                    description="Used in: All Pages - Active/current page link color, selected menu items"
                                                />
                                                <ColorPickerField
                                                    label="Hover Color"
                                                    value={colorSettings.general.navbar.hoverColor}
                                                    onChange={(value) => updateColor(["general", "navbar", "hoverColor"], value)}
                                                    description="Used in: All Pages - Navigation link hover background, mobile menu hover states"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            {/* Buttons Tab */}
                            <TabsContent value="buttons" className="space-y-4 mt-4">
                                <Accordion type="multiple" defaultValue={["primary", "secondary", "gradient"]} className="w-full">
                                    <AccordionItem value="primary">
                                        <AccordionTrigger>Primary Button</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <ColorPickerField
                                                    label="Background Color"
                                                    value={colorSettings.buttons.primary.backgroundColor}
                                                    onChange={(value) => updateColor(["buttons", "primary", "backgroundColor"], value)}
                                                    description="Used in: All Pages - Primary CTA buttons (Note: Gradient buttons use 'Gradient Colors' below)"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.buttons.primary.textColor}
                                                    onChange={(value) => updateColor(["buttons", "primary", "textColor"], value)}
                                                    description="Used in: All Pages - Primary button text color (white by default)"
                                                />
                                                <ColorPickerField
                                                    label="Hover Color (for non-gradient buttons)"
                                                    value={colorSettings.buttons.primary.hoverColor}
                                                    onChange={(value) => updateColor(["buttons", "primary", "hoverColor"], value)}
                                                    description="Used in: Non-gradient primary buttons - Most buttons use gradient hover (see 'Gradient Colors' below). This is for solid color buttons only."
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="secondary">
                                        <AccordionTrigger>Secondary Button</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <ColorPickerField
                                                    label="Background Color"
                                                    value={colorSettings.buttons.secondary.backgroundColor}
                                                    onChange={(value) => updateColor(["buttons", "secondary", "backgroundColor"], value)}
                                                    description="Secondary button background"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.buttons.secondary.textColor}
                                                    onChange={(value) => updateColor(["buttons", "secondary", "textColor"], value)}
                                                    description="Secondary button text"
                                                />
                                                <ColorPickerField
                                                    label="Hover Color"
                                                    value={colorSettings.buttons.secondary.hoverColor}
                                                    onChange={(value) => updateColor(["buttons", "secondary", "hoverColor"], value)}
                                                    description="Secondary button hover state"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="gradient">
                                        <AccordionTrigger>Gradient Colors (Used in Buttons, Headers, etc.)</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>🌈 Gradient Colors:</strong> These colors create beautiful gradient effects. On hover, buttons automatically use these same gradient colors with a slight darkening effect (brightness 0.9) for a smooth hover transition.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <ColorPickerField
                                                    label="Gradient Start"
                                                    value={colorSettings.buttons.gradient.start}
                                                    onChange={(value) => updateColor(["buttons", "gradient", "start"], value)}
                                                    description="Used in: Navigation logo gradient, navigation active links, footer site name gradient, 'View All Services' buttons, CTA buttons, button hover states (with brightness filter)"
                                                />
                                                <ColorPickerField
                                                    label="Gradient Middle"
                                                    value={colorSettings.buttons.gradient.middle}
                                                    onChange={(value) => updateColor(["buttons", "gradient", "middle"], value)}
                                                    description="Used in: All gradient elements (middle transition color) - buttons, button hover states, text gradients, navigation, footer"
                                                />
                                                <ColorPickerField
                                                    label="Gradient End"
                                                    value={colorSettings.buttons.gradient.end}
                                                    onChange={(value) => updateColor(["buttons", "gradient", "end"], value)}
                                                    description="Used in: All gradient elements (end color) - buttons, button hover states, text gradients, navigation, footer, hero sections"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            {/* Pages Tab */}
                            <TabsContent value="pages" className="space-y-4 mt-4">
                                <Accordion type="multiple" defaultValue={["homepage", "blog", "service"]} className="w-full">
                                    <AccordionItem value="homepage">
                                        <AccordionTrigger>Homepage</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>🏠 Homepage:</strong> These colors control the main homepage (/) appearance. The hero section is the large banner area at the top with the company name, tagline, and call-to-action buttons.
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Hero Section Background</h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <ColorPickerField
                                                            label="Background Color"
                                                            value={colorSettings.pages.homepage.heroBg || "#ffffff"}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroBg"], value)}
                                                            description="Used in: Homepage Hero section - Base background color (white by default, appears behind the gradient overlay)"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Background Gradient Overlay (Soft Background Effect)</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <ColorPickerField
                                                            label="Overlay Gradient Start"
                                                            value={colorSettings.pages.homepage?.heroGradientOverlay?.start || currentColors.pages.homepage.heroGradientOverlay.start}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradientOverlay", "start"], value)}
                                                            description="Used in: Homepage Hero section - Soft background gradient overlay (top-left, light blue) - Creates the subtle background effect"
                                                        />
                                                        <ColorPickerField
                                                            label="Overlay Gradient Middle"
                                                            value={colorSettings.pages.homepage?.heroGradientOverlay?.middle || currentColors.pages.homepage.heroGradientOverlay.middle}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradientOverlay", "middle"], value)}
                                                            description="Used in: Homepage Hero section - Background gradient overlay middle (white center) - Creates the soft transition"
                                                        />
                                                        <ColorPickerField
                                                            label="Overlay Gradient End"
                                                            value={colorSettings.pages.homepage?.heroGradientOverlay?.end || currentColors.pages.homepage.heroGradientOverlay.end}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradientOverlay", "end"], value)}
                                                            description="Used in: Homepage Hero section - Background gradient overlay end (bottom-right, light green) - Creates the subtle background effect"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">💡 Tip: Use rgba() format for transparency (e.g., rgba(59, 130, 246, 0.3) for 30% opacity)</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Text Gradient Colors (For Text Elements)</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <ColorPickerField
                                                            label="Hero Gradient Start"
                                                            value={colorSettings.pages.homepage.heroGradient.start}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradient", "start"], value)}
                                                            description="Used in: Rocket icon, 'Transformative Digital Solutions' badge text, Site name (BootSolo) in heading, Stats numbers (500+, 50M+, 200+, 98%)"
                                                        />
                                                        <ColorPickerField
                                                            label="Hero Gradient Middle"
                                                            value={colorSettings.pages.homepage.heroGradient.middle}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradient", "middle"], value)}
                                                            description="Used in: All gradient text elements (middle transition color) - Creates smooth color transitions in text"
                                                        />
                                                        <ColorPickerField
                                                            label="Hero Gradient End"
                                                            value={colorSettings.pages.homepage.heroGradient.end}
                                                            onChange={(value) => updateColor(["pages", "homepage", "heroGradient", "end"], value)}
                                                            description="Used in: All gradient text elements (end color) - Creates smooth color transitions in text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="blog">
                                        <AccordionTrigger>Blog Pages</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Card Background"
                                                    value={colorSettings.pages.blog.cardBg}
                                                    onChange={(value) => updateColor(["pages", "blog", "cardBg"], value)}
                                                    description="Used in: Blog Listing Page, Individual Blog Posts - Blog post cards, article cards, content cards"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.pages.blog.textColor}
                                                    onChange={(value) => updateColor(["pages", "blog", "textColor"], value)}
                                                    description="Used in: Blog Pages - Blog post titles, article text, descriptions, metadata"
                                                />
                                                <ColorPickerField
                                                    label="Link Color"
                                                    value={colorSettings.pages.blog.linkColor}
                                                    onChange={(value) => updateColor(["pages", "blog", "linkColor"], value)}
                                                    description="Used in: Blog Pages - Read more links, category links, tag links, author links"
                                                />
                                                <ColorPickerField
                                                    label="Border Color"
                                                    value={colorSettings.pages.blog.borderColor}
                                                    onChange={(value) => updateColor(["pages", "blog", "borderColor"], value)}
                                                    description="Used in: Blog Pages - Blog card borders, article section dividers, content borders"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="service">
                                        <AccordionTrigger>Service Pages</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>🔧 Service Pages:</strong> These colors control all dynamically generated service pages (e.g., /services/your-service-slug). These pages display detailed information about specific services offered.
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Hero Section & Gradients</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <ColorPickerField
                                                            label="Gradient Start"
                                                            value={colorSettings.pages.service.gradientStart}
                                                            onChange={(value) => updateColor(["pages", "service", "gradientStart"], value)}
                                                            description="Hero section background (left), CTA buttons, progress bars, accent elements - Blue gradient start"
                                                        />
                                                        <ColorPickerField
                                                            label="Gradient Middle"
                                                            value={colorSettings.pages.service.gradientMiddle}
                                                            onChange={(value) => updateColor(["pages", "service", "gradientMiddle"], value)}
                                                            description="Gradient middle transition color - Purple transition in hero and buttons"
                                                        />
                                                        <ColorPickerField
                                                            label="Gradient End"
                                                            value={colorSettings.pages.service.gradientEnd}
                                                            onChange={(value) => updateColor(["pages", "service", "gradientEnd"], value)}
                                                            description="Hero section background (right), buttons, highlights - Pink gradient end"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Content Sections</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <ColorPickerField
                                                            label="Card Background"
                                                            value={colorSettings.pages.service.cardBg}
                                                            onChange={(value) => updateColor(["pages", "service", "cardBg"], value)}
                                                            description="Used in: Feature cards, content cards, service detail cards, overview sections, key features cards"
                                                        />
                                                        <ColorPickerField
                                                            label="Text Color"
                                                            value={colorSettings.pages.service.textColor}
                                                            onChange={(value) => updateColor(["pages", "service", "textColor"], value)}
                                                            description="Used in: Main text content, headings (h2, h3), descriptions, body paragraphs, feature descriptions"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="industry">
                                        <AccordionTrigger>Industry Pages</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>🏭 Industry Pages:</strong> These colors control all dynamically generated industry pages (e.g., /industry/healthcare, /industry/finance). These pages showcase solutions for specific industries.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Primary Background"
                                                    value={colorSettings.pages.industry.primaryBg}
                                                    onChange={(value) => updateColor(["pages", "industry", "primaryBg"], value)}
                                                    description="Used in: Hero section background gradient, main content area backgrounds, section backgrounds"
                                                />
                                                <ColorPickerField
                                                    label="Accent Background"
                                                    value={colorSettings.pages.industry.accentBg}
                                                    onChange={(value) => updateColor(["pages", "industry", "accentBg"], value)}
                                                    description="Used in: Accent sections, feature highlight cards, secondary content areas, stat cards"
                                                />
                                                <ColorPickerField
                                                    label="Button Background"
                                                    value={colorSettings.pages.industry.buttonBg}
                                                    onChange={(value) => updateColor(["pages", "industry", "buttonBg"], value)}
                                                    description="Used in: CTA buttons (e.g., 'Get Started', 'Contact Us'), action buttons, contact form buttons"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.pages.industry.textColor}
                                                    onChange={(value) => updateColor(["pages", "industry", "textColor"], value)}
                                                    description="Used in: Main headings (h1, h2), body text, descriptions, feature titles, stat labels"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="caseStudy">
                                        <AccordionTrigger>Case Study Pages</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>📄 Case Study Pages:</strong> These colors control the appearance of all dynamically generated case study pages (e.g., /case-studies/your-case-study-slug). The hero section appears at the top with the case study title and description.
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Hero Section (Top Banner)</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <ColorPickerField
                                                            label="Hero Gradient Start"
                                                            value={colorSettings.pages.caseStudy.heroGradientStart || colorSettings.pages.caseStudy.heroBg || "#1e3a8a"}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "heroGradientStart"], value)}
                                                            description="Hero section gradient start color (left side) - Controls the dark blue gradient at the top of case study pages"
                                                        />
                                                        <ColorPickerField
                                                            label="Hero Gradient Middle"
                                                            value={colorSettings.pages.caseStudy.heroGradientMiddle || "#581c87"}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "heroGradientMiddle"], value)}
                                                            description="Hero section gradient middle color - Controls the purple transition in the hero gradient"
                                                        />
                                                        <ColorPickerField
                                                            label="Hero Gradient End"
                                                            value={colorSettings.pages.caseStudy.heroGradientEnd || "#312e81"}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "heroGradientEnd"], value)}
                                                            description="Hero section gradient end color (right side) - Controls the indigo gradient at the top of case study pages"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Content Sections</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <ColorPickerField
                                                            label="Card Background"
                                                            value={colorSettings.pages.caseStudy.cardBg}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "cardBg"], value)}
                                                            description="Used in: Content cards, feature cards, detail sections, project overview cards, solution cards, results cards"
                                                        />
                                                        <ColorPickerField
                                                            label="Text Color"
                                                            value={colorSettings.pages.caseStudy.textColor}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "textColor"], value)}
                                                            description="Used in: Main content text, headings (h2, h3), descriptions, body paragraphs, list items"
                                                        />
                                                        <ColorPickerField
                                                            label="Border Color"
                                                            value={colorSettings.pages.caseStudy.borderColor}
                                                            onChange={(value) => updateColor(["pages", "caseStudy", "borderColor"], value)}
                                                            description="Used in: Card borders, section dividers, content borders, feature card outlines"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="hireDeveloper">
                                        <AccordionTrigger>Hire Developer Pages</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    <strong>👨‍💻 Hire Developer Pages:</strong> These colors control all dynamically generated hire developer pages (e.g., /hire-developers/react-developers, /hire-llm-developers). These pages showcase developer profiles and hiring options.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPickerField
                                                    label="Hero Background"
                                                    value={colorSettings.pages.hireDeveloper.heroBg}
                                                    onChange={(value) => updateColor(["pages", "hireDeveloper", "heroBg"], value)}
                                                    description="Used in: Hero section background (top banner with title), page background gradient, loading states"
                                                />
                                                <ColorPickerField
                                                    label="Card Background"
                                                    value={colorSettings.pages.hireDeveloper.cardBg}
                                                    onChange={(value) => updateColor(["pages", "hireDeveloper", "cardBg"], value)}
                                                    description="Used in: Developer profile cards, feature cards, testimonial cards, skill cards, process step cards"
                                                />
                                                <ColorPickerField
                                                    label="Button Background"
                                                    value={colorSettings.pages.hireDeveloper.buttonBg}
                                                    onChange={(value) => updateColor(["pages", "hireDeveloper", "buttonBg"], value)}
                                                    description="Used in: CTA buttons (e.g., 'Hire Developer', 'Get Started'), contact buttons, action buttons"
                                                />
                                                <ColorPickerField
                                                    label="Text Color"
                                                    value={colorSettings.pages.hireDeveloper.textColor}
                                                    onChange={(value) => updateColor(["pages", "hireDeveloper", "textColor"], value)}
                                                    description="Used in: Main headings (h1, h2), body text, descriptions, developer names, skill labels"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            {/* Forms Tab */}
                            <TabsContent value="forms" className="space-y-4 mt-4">
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                        <strong>📝 Forms:</strong> These colors control all form inputs across the website - contact forms, admin forms, search inputs, and any input fields. Changes apply to all forms site-wide.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ColorPickerField
                                        label="Input Background"
                                        value={colorSettings.forms.inputBg}
                                        onChange={(value) => updateColor(["forms", "inputBg"], value)}
                                        description="Used in: All Forms - Input field backgrounds, textarea backgrounds, select dropdown backgrounds"
                                    />
                                    <ColorPickerField
                                        label="Input Border"
                                        value={colorSettings.forms.inputBorder}
                                        onChange={(value) => updateColor(["forms", "inputBorder"], value)}
                                        description="Used in: All Forms - Input field borders, textarea borders, select dropdown borders, focus ring colors"
                                    />
                                    <ColorPickerField
                                        label="Input Text"
                                        value={colorSettings.forms.inputText}
                                        onChange={(value) => updateColor(["forms", "inputText"], value)}
                                        description="Used in: All Forms - Text typed in input fields, textarea content, placeholder text"
                                    />
                                    <ColorPickerField
                                        label="Label Text"
                                        value={colorSettings.forms.labelText}
                                        onChange={(value) => updateColor(["forms", "labelText"], value)}
                                        description="Used in: All Forms - Form field labels (e.g., 'Name', 'Email', 'Message')"
                                    />
                                    <ColorPickerField
                                        label="Error Text"
                                        value={colorSettings.forms.errorText}
                                        onChange={(value) => updateColor(["forms", "errorText"], value)}
                                        description="Used in: All Forms - Validation error messages, required field indicators"
                                    />
                                </div>
                            </TabsContent>

                            {/* All Colors Tab - Summary View */}
                            <TabsContent value="all" className="space-y-4 mt-4">
                                <div className="space-y-6">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-4">General Components</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Header BG</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.general.header.backgroundColor }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.general.header.backgroundColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Footer BG</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.general.footer.backgroundColor }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.general.footer.backgroundColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Navbar BG</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.general.navbar.backgroundColor }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.general.navbar.backgroundColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Navbar Active</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.general.navbar.activeColor }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.general.navbar.activeColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-4">Buttons & Gradients</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Primary Button</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.buttons.primary.backgroundColor }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.buttons.primary.backgroundColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Gradient Start</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.buttons.gradient.start }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.buttons.gradient.start}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Gradient Middle</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.buttons.gradient.middle }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.buttons.gradient.middle}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Gradient End</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.buttons.gradient.end }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.buttons.gradient.end}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-4">Page-Specific Colors</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Blog Card BG</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.pages.blog.cardBg }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.pages.blog.cardBg}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Service Card BG</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.pages.service.cardBg }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.pages.service.cardBg}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Industry Button</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: colorSettings.pages.industry.buttonBg }}></div>
                                                    <span className="text-xs font-mono">{colorSettings.pages.industry.buttonBg}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button 
                                type="button" 
                                onClick={handleSaveAll}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save All Color Settings
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
