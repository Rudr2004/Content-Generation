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
import { Loader2, Palette, Eye, EyeOff } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { ColorSettings } from "@/lib/types";

// Re-export for convenience
export type { ColorSettings };

// Default color values extracted from index.css
const defaultColors: ColorSettings = {
    general: {
        header: {
            backgroundColor: "#ffffff",
            textColor: "#1a1a1a",
            borderColor: "#e5e5e5",
        },
        footer: {
            backgroundColor: "#ffffff",
            textColor: "#1a1a1a",
            borderColor: "#e5e5e5",
        },
        navbar: {
            backgroundColor: "#ffffff",
            textColor: "#1a1a1a",
            activeColor: "#22c55e",
            hoverColor: "#f3f4f6",
        },
    },
    buttons: {
        primary: {
            backgroundColor: "#22c55e",
            textColor: "#ffffff",
            hoverColor: "#16a34a",
        },
        secondary: {
            backgroundColor: "#f3f4f6",
            textColor: "#1a1a1a",
            hoverColor: "#e5e7eb",
        },
    },
    pages: {},
};

const colorSettingsSchema = z.object({
    colorSettings: z.any().optional(),
});

type ColorSettingsFormData = z.infer<typeof colorSettingsSchema>;

interface ColorPickerFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
}

function ColorPickerField({ label, value, onChange, description }: ColorPickerFieldProps) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPicker(!showPicker)}
                    className="h-6 px-2"
                >
                    {showPicker ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="w-12 h-12 rounded-md border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: value }}
                    onClick={() => setShowPicker(!showPicker)}
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
                        className="w-16 h-12 cursor-pointer"
                    />
                )}
            </div>
            {description && (
                <FormDescription className="text-xs">{description}</FormDescription>
            )}
        </div>
    );
}

export function ColorManagement() {
    const { settings, isLoading, updateSettings } = useSiteSettings();
    const [colorSettings, setColorSettings] = useState<ColorSettings>(defaultColors);

    const form = useForm<ColorSettingsFormData>({
        resolver: zodResolver(colorSettingsSchema),
        defaultValues: {
            colorSettings: defaultColors,
        },
    });

    useEffect(() => {
        if (settings?.colorSettings) {
            const merged = {
                ...defaultColors,
                ...settings.colorSettings,
                general: {
                    ...defaultColors.general,
                    ...settings.colorSettings.general,
                },
                buttons: {
                    ...defaultColors.buttons,
                    ...settings.colorSettings.buttons,
                },
            };
            setColorSettings(merged);
            form.setValue("colorSettings", merged);
        }
    }, [settings, form]);

    const updateColor = (path: string[], value: string) => {
        const newSettings = { ...colorSettings };
        let current: any = newSettings;

        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }

        current[path[path.length - 1]] = value;
        setColorSettings(newSettings);
        form.setValue("colorSettings", newSettings);
    };

    const onSubmit = async (values: ColorSettingsFormData) => {
        try {
            await updateSettings({
                colorSettings: values.colorSettings || colorSettings,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Colors are applied via SiteSettingsContext useEffect
    // This component just manages the form state

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
                    Color Management
                </CardTitle>
                <CardDescription>
                    Manage color codes (hex codes) used throughout the website. Changes apply immediately.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Accordion type="multiple" defaultValue={["general", "buttons"]} className="w-full">
                            {/* General Colors */}
                            <AccordionItem value="general">
                                <AccordionTrigger>General Components</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    {/* Header Colors */}
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-semibold text-sm">Header</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorPickerField
                                                label="Background Color"
                                                value={colorSettings.general?.header?.backgroundColor || defaultColors.general?.header?.backgroundColor || "#ffffff"}
                                                onChange={(value) => updateColor(["general", "header", "backgroundColor"], value)}
                                                description="Header background color"
                                            />
                                            <ColorPickerField
                                                label="Text Color"
                                                value={colorSettings.general?.header?.textColor || defaultColors.general?.header?.textColor || "#1a1a1a"}
                                                onChange={(value) => updateColor(["general", "header", "textColor"], value)}
                                                description="Header text color"
                                            />
                                            <ColorPickerField
                                                label="Border Color"
                                                value={colorSettings.general?.header?.borderColor || defaultColors.general?.header?.borderColor || "#e5e5e5"}
                                                onChange={(value) => updateColor(["general", "header", "borderColor"], value)}
                                                description="Header border color"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer Colors */}
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-semibold text-sm">Footer</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorPickerField
                                                label="Background Color"
                                                value={colorSettings.general?.footer?.backgroundColor || defaultColors.general?.footer?.backgroundColor || "#ffffff"}
                                                onChange={(value) => updateColor(["general", "footer", "backgroundColor"], value)}
                                                description="Footer background color"
                                            />
                                            <ColorPickerField
                                                label="Text Color"
                                                value={colorSettings.general?.footer?.textColor || defaultColors.general?.footer?.textColor || "#1a1a1a"}
                                                onChange={(value) => updateColor(["general", "footer", "textColor"], value)}
                                                description="Footer text color"
                                            />
                                            <ColorPickerField
                                                label="Border Color"
                                                value={colorSettings.general?.footer?.borderColor || defaultColors.general?.footer?.borderColor || "#e5e5e5"}
                                                onChange={(value) => updateColor(["general", "footer", "borderColor"], value)}
                                                description="Footer border color"
                                            />
                                        </div>
                                    </div>

                                    {/* Navbar Colors */}
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-semibold text-sm">Navigation Bar</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ColorPickerField
                                                label="Background Color"
                                                value={colorSettings.general?.navbar?.backgroundColor || defaultColors.general?.navbar?.backgroundColor || "#ffffff"}
                                                onChange={(value) => updateColor(["general", "navbar", "backgroundColor"], value)}
                                                description="Navbar background color"
                                            />
                                            <ColorPickerField
                                                label="Text Color"
                                                value={colorSettings.general?.navbar?.textColor || defaultColors.general?.navbar?.textColor || "#1a1a1a"}
                                                onChange={(value) => updateColor(["general", "navbar", "textColor"], value)}
                                                description="Navbar text color"
                                            />
                                            <ColorPickerField
                                                label="Active Color"
                                                value={colorSettings.general?.navbar?.activeColor || defaultColors.general?.navbar?.activeColor || "#22c55e"}
                                                onChange={(value) => updateColor(["general", "navbar", "activeColor"], value)}
                                                description="Active link color"
                                            />
                                            <ColorPickerField
                                                label="Hover Color"
                                                value={colorSettings.general?.navbar?.hoverColor || defaultColors.general?.navbar?.hoverColor || "#f3f4f6"}
                                                onChange={(value) => updateColor(["general", "navbar", "hoverColor"], value)}
                                                description="Hover state color"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Button Colors */}
                            <AccordionItem value="buttons">
                                <AccordionTrigger>Buttons</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    {/* Primary Button */}
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-semibold text-sm">Primary Button</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorPickerField
                                                label="Background Color"
                                                value={colorSettings.buttons?.primary?.backgroundColor || defaultColors.buttons?.primary?.backgroundColor || "#22c55e"}
                                                onChange={(value) => updateColor(["buttons", "primary", "backgroundColor"], value)}
                                                description="Primary button background"
                                            />
                                            <ColorPickerField
                                                label="Text Color"
                                                value={colorSettings.buttons?.primary?.textColor || defaultColors.buttons?.primary?.textColor || "#ffffff"}
                                                onChange={(value) => updateColor(["buttons", "primary", "textColor"], value)}
                                                description="Primary button text"
                                            />
                                            <ColorPickerField
                                                label="Hover Color"
                                                value={colorSettings.buttons?.primary?.hoverColor || defaultColors.buttons?.primary?.hoverColor || "#16a34a"}
                                                onChange={(value) => updateColor(["buttons", "primary", "hoverColor"], value)}
                                                description="Primary button hover state"
                                            />
                                        </div>
                                    </div>

                                    {/* Secondary Button */}
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-semibold text-sm">Secondary Button</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorPickerField
                                                label="Background Color"
                                                value={colorSettings.buttons?.secondary?.backgroundColor || defaultColors.buttons?.secondary?.backgroundColor || "#f3f4f6"}
                                                onChange={(value) => updateColor(["buttons", "secondary", "backgroundColor"], value)}
                                                description="Secondary button background"
                                            />
                                            <ColorPickerField
                                                label="Text Color"
                                                value={colorSettings.buttons?.secondary?.textColor || defaultColors.buttons?.secondary?.textColor || "#1a1a1a"}
                                                onChange={(value) => updateColor(["buttons", "secondary", "textColor"], value)}
                                                description="Secondary button text"
                                            />
                                            <ColorPickerField
                                                label="Hover Color"
                                                value={colorSettings.buttons?.secondary?.hoverColor || defaultColors.buttons?.secondary?.hoverColor || "#e5e7eb"}
                                                onChange={(value) => updateColor(["buttons", "secondary", "hoverColor"], value)}
                                                description="Secondary button hover state"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setColorSettings(defaultColors);
                                    form.setValue("colorSettings", defaultColors);
                                }}
                            >
                                Reset to Defaults
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Color Settings
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
