import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

import { apiRequest } from "@/lib/queryClient";

interface SiteSettingsContextType {
    settings: SiteSettings | null;
    isLoading: boolean;
    updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { setTheme } = useTheme();

    const { data: settings, isLoading } = useQuery<SiteSettings>({
        queryKey: ["/api/site-settings"],
        // Default query function from queryClient will handle the fetch with auth headers
    });

    // Effect to apply theme when settings load
    useEffect(() => {
        if (settings?.theme) {
            setTheme(settings.theme);
        }
    }, [settings?.theme, setTheme]);

    // Effect to apply document title (Site Name)
    // This runs whenever settings change, ensuring the title stays updated
    // Priority: This should run AFTER other effects to ensure siteName takes precedence
    useEffect(() => {
        if (settings?.siteName) {
            // Set title immediately
            document.title = settings.siteName;
            
            // Set it again after a brief delay to ensure it persists even if other components override it
            // This is important because SEOHead and other components might set the title
            const timeoutId1 = setTimeout(() => {
                if (settings.siteName) {
                    document.title = settings.siteName;
                }
            }, 50);
            
            // Set it again after a longer delay to ensure it persists
            const timeoutId2 = setTimeout(() => {
                if (settings.siteName) {
                    document.title = settings.siteName;
                }
            }, 200);
            
            return () => {
                clearTimeout(timeoutId1);
                clearTimeout(timeoutId2);
            };
        }
    }, [settings?.siteName, settings]);

    // Effect to apply color settings - comprehensive color application
    useEffect(() => {
        const applyColors = async () => {
            const root = document.documentElement;
            const { currentColors } = await import("@/lib/color-extractor");
            
            // Use saved colors or fallback to current defaults
            const colors = (settings?.colorSettings as any) || currentColors;
            
            // Always apply colors - if no custom colors, use defaults
            if (!settings?.colorSettings) {
                // Apply default colors from currentColors
                Object.entries(currentColors).forEach(([key, value]: [string, any]) => {
                    if (key === 'general' && value) {
                        if (value.header) {
                            root.style.setProperty("--header-bg", value.header.backgroundColor);
                            root.style.setProperty("--header-text", value.header.textColor);
                            root.style.setProperty("--header-border", value.header.borderColor);
                        }
                        if (value.footer) {
                            root.style.setProperty("--footer-bg", value.footer.backgroundColor);
                            root.style.setProperty("--footer-text", value.footer.textColor);
                            root.style.setProperty("--footer-border", value.footer.borderColor);
                            root.style.setProperty("--footer-link", value.footer.linkColor || value.footer.textColor);
                            root.style.setProperty("--footer-hover", value.footer.hoverColor || value.footer.textColor);
                        }
                        if (value.navbar) {
                            root.style.setProperty("--navbar-bg", value.navbar.backgroundColor);
                            root.style.setProperty("--navbar-text", value.navbar.textColor);
                            root.style.setProperty("--navbar-active", value.navbar.activeColor);
                            root.style.setProperty("--navbar-hover", value.navbar.hoverColor);
                            root.style.setProperty("--navbar-border", value.navbar.borderColor || value.navbar.backgroundColor);
                        }
                    }
                    if (key === 'buttons' && value) {
                        if (value.primary) {
                            root.style.setProperty("--btn-primary-bg", value.primary.backgroundColor);
                            root.style.setProperty("--btn-primary-text", value.primary.textColor);
                            root.style.setProperty("--btn-primary-hover", value.primary.hoverColor);
                        }
                        if (value.secondary) {
                            root.style.setProperty("--btn-secondary-bg", value.secondary.backgroundColor);
                            root.style.setProperty("--btn-secondary-text", value.secondary.textColor);
                            root.style.setProperty("--btn-secondary-hover", value.secondary.hoverColor);
                        }
                        if (value.gradient) {
                            root.style.setProperty("--gradient-start", value.gradient.start);
                            root.style.setProperty("--gradient-middle", value.gradient.middle);
                            root.style.setProperty("--gradient-end", value.gradient.end);
                        }
                    }
                    if (key === 'pages' && value) {
                        if (value.homepage) {
                            if (value.homepage.heroGradient) {
                                root.style.setProperty("--homepage-hero-start", value.homepage.heroGradient.start);
                                root.style.setProperty("--homepage-hero-middle", value.homepage.heroGradient.middle);
                                root.style.setProperty("--homepage-hero-end", value.homepage.heroGradient.end);
                            }
                            if (value.homepage.heroBg) {
                                root.style.setProperty("--homepage-hero-bg", value.homepage.heroBg);
                            }
                            if (value.homepage.heroGradientOverlay) {
                                root.style.setProperty("--homepage-hero-overlay-start", value.homepage.heroGradientOverlay.start);
                                root.style.setProperty("--homepage-hero-overlay-middle", value.homepage.heroGradientOverlay.middle);
                                root.style.setProperty("--homepage-hero-overlay-end", value.homepage.heroGradientOverlay.end);
                            }
                        }
                        if (value.blog) {
                            root.style.setProperty("--blog-card-bg", value.blog.cardBg);
                            root.style.setProperty("--blog-text", value.blog.textColor);
                            root.style.setProperty("--blog-link", value.blog.linkColor);
                            root.style.setProperty("--blog-border", value.blog.borderColor);
                        }
                        if (value.service) {
                            root.style.setProperty("--service-card-bg", value.service.cardBg);
                            root.style.setProperty("--service-gradient-start", value.service.gradientStart);
                            root.style.setProperty("--service-gradient-middle", value.service.gradientMiddle);
                            root.style.setProperty("--service-gradient-end", value.service.gradientEnd);
                            root.style.setProperty("--service-text", value.service.textColor);
                        }
                        if (value.industry) {
                            root.style.setProperty("--industry-primary-bg", value.industry.primaryBg);
                            root.style.setProperty("--industry-accent-bg", value.industry.accentBg);
                            root.style.setProperty("--industry-button-bg", value.industry.buttonBg);
                            root.style.setProperty("--industry-text", value.industry.textColor);
                        }
                        if (value.caseStudy) {
                            root.style.setProperty("--casestudy-hero-bg", value.caseStudy.heroBg);
                            root.style.setProperty("--casestudy-hero-start", value.caseStudy.heroGradientStart);
                            root.style.setProperty("--casestudy-hero-middle", value.caseStudy.heroGradientMiddle);
                            root.style.setProperty("--casestudy-hero-end", value.caseStudy.heroGradientEnd);
                            root.style.setProperty("--casestudy-card-bg", value.caseStudy.cardBg);
                            root.style.setProperty("--casestudy-text", value.caseStudy.textColor);
                            root.style.setProperty("--casestudy-border", value.caseStudy.borderColor);
                        }
                        if (value.hireDeveloper) {
                            root.style.setProperty("--hiredev-hero-bg", value.hireDeveloper.heroBg);
                            root.style.setProperty("--hiredev-card-bg", value.hireDeveloper.cardBg);
                            root.style.setProperty("--hiredev-button-bg", value.hireDeveloper.buttonBg);
                            root.style.setProperty("--hiredev-text", value.hireDeveloper.textColor);
                        }
                    }
                    if (key === 'forms' && value) {
                        root.style.setProperty("--form-input-bg", value.inputBg);
                        root.style.setProperty("--form-input-border", value.inputBorder);
                        root.style.setProperty("--form-input-text", value.inputText);
                        root.style.setProperty("--form-input-placeholder", value.inputPlaceholder || "#6b7280");
                        root.style.setProperty("--form-label-text", value.labelText);
                        root.style.setProperty("--form-error-text", value.errorText);
                    }
                });
                return;
            }
        
            // Apply general colors
            if (colors.general?.header) {
                root.style.setProperty("--header-bg", colors.general.header.backgroundColor || currentColors.general.header.backgroundColor);
                root.style.setProperty("--header-text", colors.general.header.textColor || currentColors.general.header.textColor);
                root.style.setProperty("--header-border", colors.general.header.borderColor || currentColors.general.header.borderColor);
            }
            
            if (colors.general?.footer) {
                root.style.setProperty("--footer-bg", colors.general.footer.backgroundColor || currentColors.general.footer.backgroundColor);
                root.style.setProperty("--footer-text", colors.general.footer.textColor || currentColors.general.footer.textColor);
                root.style.setProperty("--footer-border", colors.general.footer.borderColor || currentColors.general.footer.borderColor);
                root.style.setProperty("--footer-link", colors.general.footer.linkColor || colors.general.footer.textColor || currentColors.general.footer.textColor);
                root.style.setProperty("--footer-hover", colors.general.footer.hoverColor || colors.general.footer.textColor || currentColors.general.footer.textColor);
            }
            
            if (colors.general?.navbar) {
                root.style.setProperty("--navbar-bg", colors.general.navbar.backgroundColor || currentColors.general.navbar.backgroundColor);
                root.style.setProperty("--navbar-text", colors.general.navbar.textColor || currentColors.general.navbar.textColor);
                root.style.setProperty("--navbar-active", colors.general.navbar.activeColor || currentColors.general.navbar.activeColor);
                root.style.setProperty("--navbar-hover", colors.general.navbar.hoverColor || currentColors.general.navbar.hoverColor);
                root.style.setProperty("--navbar-border", colors.general.navbar.borderColor || colors.general.navbar.backgroundColor || currentColors.general.navbar.backgroundColor);
            }

            // Apply button colors
            if (colors.buttons?.primary) {
                root.style.setProperty("--btn-primary-bg", colors.buttons.primary.backgroundColor || currentColors.buttons.primary.backgroundColor);
                root.style.setProperty("--btn-primary-text", colors.buttons.primary.textColor || currentColors.buttons.primary.textColor);
                root.style.setProperty("--btn-primary-hover", colors.buttons.primary.hoverColor || currentColors.buttons.primary.hoverColor);
            }
            
            if (colors.buttons?.secondary) {
                root.style.setProperty("--btn-secondary-bg", colors.buttons.secondary.backgroundColor || currentColors.buttons.secondary.backgroundColor);
                root.style.setProperty("--btn-secondary-text", colors.buttons.secondary.textColor || currentColors.buttons.secondary.textColor);
                root.style.setProperty("--btn-secondary-hover", colors.buttons.secondary.hoverColor || currentColors.buttons.secondary.hoverColor);
            }

            // Apply gradient colors
            if (colors.buttons?.gradient) {
                root.style.setProperty("--gradient-start", colors.buttons.gradient.start || currentColors.buttons.gradient.start);
                root.style.setProperty("--gradient-middle", colors.buttons.gradient.middle || currentColors.buttons.gradient.middle);
                root.style.setProperty("--gradient-end", colors.buttons.gradient.end || currentColors.buttons.gradient.end);
            }

            // Apply page-specific colors
            if (colors.pages?.homepage) {
                root.style.setProperty("--homepage-hero-start", colors.pages.homepage.heroGradient?.start || currentColors.pages.homepage.heroGradient.start);
                root.style.setProperty("--homepage-hero-middle", colors.pages.homepage.heroGradient?.middle || currentColors.pages.homepage.heroGradient.middle);
                root.style.setProperty("--homepage-hero-end", colors.pages.homepage.heroGradient?.end || currentColors.pages.homepage.heroGradient.end);
                root.style.setProperty("--homepage-hero-bg", colors.pages.homepage.heroBg || currentColors.pages.homepage.heroBg);
                root.style.setProperty("--homepage-hero-overlay-start", colors.pages.homepage.heroGradientOverlay?.start || currentColors.pages.homepage.heroGradientOverlay.start);
                root.style.setProperty("--homepage-hero-overlay-middle", colors.pages.homepage.heroGradientOverlay?.middle || currentColors.pages.homepage.heroGradientOverlay.middle);
                root.style.setProperty("--homepage-hero-overlay-end", colors.pages.homepage.heroGradientOverlay?.end || currentColors.pages.homepage.heroGradientOverlay.end);
            } else {
                root.style.setProperty("--homepage-hero-start", currentColors.pages.homepage.heroGradient.start);
                root.style.setProperty("--homepage-hero-middle", currentColors.pages.homepage.heroGradient.middle);
                root.style.setProperty("--homepage-hero-end", currentColors.pages.homepage.heroGradient.end);
                root.style.setProperty("--homepage-hero-bg", currentColors.pages.homepage.heroBg);
                root.style.setProperty("--homepage-hero-overlay-start", currentColors.pages.homepage.heroGradientOverlay.start);
                root.style.setProperty("--homepage-hero-overlay-middle", currentColors.pages.homepage.heroGradientOverlay.middle);
                root.style.setProperty("--homepage-hero-overlay-end", currentColors.pages.homepage.heroGradientOverlay.end);
            }

            if (colors.pages?.blog) {
                root.style.setProperty("--blog-card-bg", colors.pages.blog.cardBg || currentColors.pages.blog.cardBg);
                root.style.setProperty("--blog-text", colors.pages.blog.textColor || currentColors.pages.blog.textColor);
                root.style.setProperty("--blog-link", colors.pages.blog.linkColor || currentColors.pages.blog.linkColor);
                root.style.setProperty("--blog-border", colors.pages.blog.borderColor || currentColors.pages.blog.borderColor);
            }

            if (colors.pages?.service) {
                root.style.setProperty("--service-card-bg", colors.pages.service.cardBg || currentColors.pages.service.cardBg);
                root.style.setProperty("--service-gradient-start", colors.pages.service.gradientStart || currentColors.pages.service.gradientStart);
                root.style.setProperty("--service-gradient-middle", colors.pages.service.gradientMiddle || currentColors.pages.service.gradientMiddle);
                root.style.setProperty("--service-gradient-end", colors.pages.service.gradientEnd || currentColors.pages.service.gradientEnd);
                root.style.setProperty("--service-text", colors.pages.service.textColor || currentColors.pages.service.textColor);
            }

            if (colors.pages?.industry) {
                root.style.setProperty("--industry-primary-bg", colors.pages.industry.primaryBg || currentColors.pages.industry.primaryBg);
                root.style.setProperty("--industry-accent-bg", colors.pages.industry.accentBg || currentColors.pages.industry.accentBg);
                root.style.setProperty("--industry-button-bg", colors.pages.industry.buttonBg || currentColors.pages.industry.buttonBg);
                root.style.setProperty("--industry-text", colors.pages.industry.textColor || currentColors.pages.industry.textColor);
            }

            if (colors.pages?.caseStudy) {
                root.style.setProperty("--casestudy-hero-bg", colors.pages.caseStudy.heroBg || currentColors.pages.caseStudy.heroBg);
                root.style.setProperty("--casestudy-hero-start", colors.pages.caseStudy.heroGradientStart || currentColors.pages.caseStudy.heroGradientStart);
                root.style.setProperty("--casestudy-hero-middle", colors.pages.caseStudy.heroGradientMiddle || currentColors.pages.caseStudy.heroGradientMiddle);
                root.style.setProperty("--casestudy-hero-end", colors.pages.caseStudy.heroGradientEnd || currentColors.pages.caseStudy.heroGradientEnd);
                root.style.setProperty("--casestudy-card-bg", colors.pages.caseStudy.cardBg || currentColors.pages.caseStudy.cardBg);
                root.style.setProperty("--casestudy-text", colors.pages.caseStudy.textColor || currentColors.pages.caseStudy.textColor);
                root.style.setProperty("--casestudy-border", colors.pages.caseStudy.borderColor || currentColors.pages.caseStudy.borderColor);
            } else {
                root.style.setProperty("--casestudy-hero-bg", currentColors.pages.caseStudy.heroBg);
                root.style.setProperty("--casestudy-hero-start", currentColors.pages.caseStudy.heroGradientStart);
                root.style.setProperty("--casestudy-hero-end", currentColors.pages.caseStudy.heroGradientEnd);
                root.style.setProperty("--casestudy-hero-middle", currentColors.pages.caseStudy.heroGradientMiddle);
                root.style.setProperty("--casestudy-card-bg", currentColors.pages.caseStudy.cardBg);
                root.style.setProperty("--casestudy-text", currentColors.pages.caseStudy.textColor);
                root.style.setProperty("--casestudy-border", currentColors.pages.caseStudy.borderColor);
            }

            if (colors.pages?.hireDeveloper) {
                root.style.setProperty("--hiredev-hero-bg", colors.pages.hireDeveloper.heroBg || currentColors.pages.hireDeveloper.heroBg);
                root.style.setProperty("--hiredev-card-bg", colors.pages.hireDeveloper.cardBg || currentColors.pages.hireDeveloper.cardBg);
                root.style.setProperty("--hiredev-button-bg", colors.pages.hireDeveloper.buttonBg || currentColors.pages.hireDeveloper.buttonBg);
                root.style.setProperty("--hiredev-text", colors.pages.hireDeveloper.textColor || currentColors.pages.hireDeveloper.textColor);
            }

            // Apply form colors
            if (colors.forms) {
                root.style.setProperty("--form-input-bg", colors.forms.inputBg || currentColors.forms.inputBg);
                root.style.setProperty("--form-input-border", colors.forms.inputBorder || currentColors.forms.inputBorder);
                root.style.setProperty("--form-input-text", colors.forms.inputText || currentColors.forms.inputText);
                root.style.setProperty("--form-input-placeholder", colors.forms.inputPlaceholder || currentColors.forms.inputPlaceholder || "#6b7280");
                root.style.setProperty("--form-label-text", colors.forms.labelText || currentColors.forms.labelText);
                root.style.setProperty("--form-error-text", colors.forms.errorText || currentColors.forms.errorText);
            } else {
                root.style.setProperty("--form-input-bg", currentColors.forms.inputBg);
                root.style.setProperty("--form-input-border", currentColors.forms.inputBorder);
                root.style.setProperty("--form-input-text", currentColors.forms.inputText);
                root.style.setProperty("--form-input-placeholder", currentColors.forms.inputPlaceholder || "#6b7280");
                root.style.setProperty("--form-label-text", currentColors.forms.labelText);
                root.style.setProperty("--form-error-text", currentColors.forms.errorText);
            }
        };
        
        applyColors();
    }, [settings?.colorSettings, settings]);

    const updateMutation = useMutation({
        mutationFn: async (updates: Partial<SiteSettings>) => {
            const response = await apiRequest("POST", "/api/site-settings", updates);
            return response.json();
        },
        onSuccess: async (data) => {
            // Update query cache - this will trigger the useEffect
            queryClient.setQueryData(["/api/site-settings"], data.settings);
            
            // CRITICAL: Update document title IMMEDIATELY before any other operations
            // This ensures the title updates right away, even if other components try to override it
            if (data.settings.siteName) {
                document.title = data.settings.siteName;
            }
            
            // Force a refetch to ensure all components get the updated data
            await queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });

            // Apply theme
            if (data.settings.theme) setTheme(data.settings.theme);
            
            // Ensure title is set again after refetch (in case it was overridden)
            if (data.settings.siteName) {
                // Use setTimeout to ensure this runs after any other effects
                setTimeout(() => {
                    document.title = data.settings.siteName;
                }, 0);
            }

            // Immediately apply ALL color settings after update - comprehensive application
            const root = document.documentElement;
            const { currentColors } = await import("@/lib/color-extractor");
            const colors = (data.settings.colorSettings as any) || currentColors;
            
            // Apply general colors
            if (colors.general?.header) {
                root.style.setProperty("--header-bg", colors.general.header.backgroundColor || currentColors.general.header.backgroundColor);
                root.style.setProperty("--header-text", colors.general.header.textColor || currentColors.general.header.textColor);
                root.style.setProperty("--header-border", colors.general.header.borderColor || currentColors.general.header.borderColor);
            } else {
                root.style.setProperty("--header-bg", currentColors.general.header.backgroundColor);
                root.style.setProperty("--header-text", currentColors.general.header.textColor);
                root.style.setProperty("--header-border", currentColors.general.header.borderColor);
            }
            
            if (colors.general?.footer) {
                root.style.setProperty("--footer-bg", colors.general.footer.backgroundColor || currentColors.general.footer.backgroundColor);
                root.style.setProperty("--footer-text", colors.general.footer.textColor || currentColors.general.footer.textColor);
                root.style.setProperty("--footer-border", colors.general.footer.borderColor || currentColors.general.footer.borderColor);
                root.style.setProperty("--footer-link", colors.general.footer.linkColor || colors.general.footer.textColor || currentColors.general.footer.textColor);
                root.style.setProperty("--footer-hover", colors.general.footer.hoverColor || colors.general.footer.textColor || currentColors.general.footer.textColor);
            } else {
                root.style.setProperty("--footer-bg", currentColors.general.footer.backgroundColor);
                root.style.setProperty("--footer-text", currentColors.general.footer.textColor);
                root.style.setProperty("--footer-border", currentColors.general.footer.borderColor);
                root.style.setProperty("--footer-link", currentColors.general.footer.linkColor || currentColors.general.footer.textColor);
                root.style.setProperty("--footer-hover", currentColors.general.footer.hoverColor || currentColors.general.footer.textColor);
            }
            
            if (colors.general?.navbar) {
                root.style.setProperty("--navbar-bg", colors.general.navbar.backgroundColor || currentColors.general.navbar.backgroundColor);
                root.style.setProperty("--navbar-text", colors.general.navbar.textColor || currentColors.general.navbar.textColor);
                root.style.setProperty("--navbar-active", colors.general.navbar.activeColor || currentColors.general.navbar.activeColor);
                root.style.setProperty("--navbar-hover", colors.general.navbar.hoverColor || currentColors.general.navbar.hoverColor);
                root.style.setProperty("--navbar-border", colors.general.navbar.borderColor || colors.general.navbar.backgroundColor || currentColors.general.navbar.backgroundColor);
            } else {
                root.style.setProperty("--navbar-bg", currentColors.general.navbar.backgroundColor);
                root.style.setProperty("--navbar-text", currentColors.general.navbar.textColor);
                root.style.setProperty("--navbar-active", currentColors.general.navbar.activeColor);
                root.style.setProperty("--navbar-hover", currentColors.general.navbar.hoverColor);
                root.style.setProperty("--navbar-border", currentColors.general.navbar.borderColor || currentColors.general.navbar.backgroundColor);
            }

            // Apply button colors
            if (colors.buttons?.primary) {
                root.style.setProperty("--btn-primary-bg", colors.buttons.primary.backgroundColor || currentColors.buttons.primary.backgroundColor);
                root.style.setProperty("--btn-primary-text", colors.buttons.primary.textColor || currentColors.buttons.primary.textColor);
                root.style.setProperty("--btn-primary-hover", colors.buttons.primary.hoverColor || currentColors.buttons.primary.hoverColor);
            } else {
                root.style.setProperty("--btn-primary-bg", currentColors.buttons.primary.backgroundColor);
                root.style.setProperty("--btn-primary-text", currentColors.buttons.primary.textColor);
                root.style.setProperty("--btn-primary-hover", currentColors.buttons.primary.hoverColor);
            }
            
            if (colors.buttons?.secondary) {
                root.style.setProperty("--btn-secondary-bg", colors.buttons.secondary.backgroundColor || currentColors.buttons.secondary.backgroundColor);
                root.style.setProperty("--btn-secondary-text", colors.buttons.secondary.textColor || currentColors.buttons.secondary.textColor);
                root.style.setProperty("--btn-secondary-hover", colors.buttons.secondary.hoverColor || currentColors.buttons.secondary.hoverColor);
            } else {
                root.style.setProperty("--btn-secondary-bg", currentColors.buttons.secondary.backgroundColor);
                root.style.setProperty("--btn-secondary-text", currentColors.buttons.secondary.textColor);
                root.style.setProperty("--btn-secondary-hover", currentColors.buttons.secondary.hoverColor);
            }

            // Apply gradient colors - CRITICAL
            if (colors.buttons?.gradient) {
                root.style.setProperty("--gradient-start", colors.buttons.gradient.start || currentColors.buttons.gradient.start);
                root.style.setProperty("--gradient-middle", colors.buttons.gradient.middle || currentColors.buttons.gradient.middle);
                root.style.setProperty("--gradient-end", colors.buttons.gradient.end || currentColors.buttons.gradient.end);
            } else {
                root.style.setProperty("--gradient-start", currentColors.buttons.gradient.start);
                root.style.setProperty("--gradient-middle", currentColors.buttons.gradient.middle);
                root.style.setProperty("--gradient-end", currentColors.buttons.gradient.end);
            }

            // Apply page-specific colors
            if (colors.pages?.homepage) {
                root.style.setProperty("--homepage-hero-start", colors.pages.homepage.heroGradient?.start || currentColors.pages.homepage.heroGradient.start);
                root.style.setProperty("--homepage-hero-middle", colors.pages.homepage.heroGradient?.middle || currentColors.pages.homepage.heroGradient.middle);
                root.style.setProperty("--homepage-hero-end", colors.pages.homepage.heroGradient?.end || currentColors.pages.homepage.heroGradient.end);
                root.style.setProperty("--homepage-hero-bg", colors.pages.homepage.heroBg || currentColors.pages.homepage.heroBg);
                root.style.setProperty("--homepage-hero-overlay-start", colors.pages.homepage.heroGradientOverlay?.start || currentColors.pages.homepage.heroGradientOverlay.start);
                root.style.setProperty("--homepage-hero-overlay-middle", colors.pages.homepage.heroGradientOverlay?.middle || currentColors.pages.homepage.heroGradientOverlay.middle);
                root.style.setProperty("--homepage-hero-overlay-end", colors.pages.homepage.heroGradientOverlay?.end || currentColors.pages.homepage.heroGradientOverlay.end);
            } else {
                root.style.setProperty("--homepage-hero-start", currentColors.pages.homepage.heroGradient.start);
                root.style.setProperty("--homepage-hero-middle", currentColors.pages.homepage.heroGradient.middle);
                root.style.setProperty("--homepage-hero-end", currentColors.pages.homepage.heroGradient.end);
                root.style.setProperty("--homepage-hero-bg", currentColors.pages.homepage.heroBg);
                root.style.setProperty("--homepage-hero-overlay-start", currentColors.pages.homepage.heroGradientOverlay.start);
                root.style.setProperty("--homepage-hero-overlay-middle", currentColors.pages.homepage.heroGradientOverlay.middle);
                root.style.setProperty("--homepage-hero-overlay-end", currentColors.pages.homepage.heroGradientOverlay.end);
            }

            if (colors.pages?.blog) {
                root.style.setProperty("--blog-card-bg", colors.pages.blog.cardBg || currentColors.pages.blog.cardBg);
                root.style.setProperty("--blog-text", colors.pages.blog.textColor || currentColors.pages.blog.textColor);
                root.style.setProperty("--blog-link", colors.pages.blog.linkColor || currentColors.pages.blog.linkColor);
                root.style.setProperty("--blog-border", colors.pages.blog.borderColor || currentColors.pages.blog.borderColor);
            } else {
                root.style.setProperty("--blog-card-bg", currentColors.pages.blog.cardBg);
                root.style.setProperty("--blog-text", currentColors.pages.blog.textColor);
                root.style.setProperty("--blog-link", currentColors.pages.blog.linkColor);
                root.style.setProperty("--blog-border", currentColors.pages.blog.borderColor);
            }

            if (colors.pages?.service) {
                root.style.setProperty("--service-card-bg", colors.pages.service.cardBg || currentColors.pages.service.cardBg);
                root.style.setProperty("--service-gradient-start", colors.pages.service.gradientStart || currentColors.pages.service.gradientStart);
                root.style.setProperty("--service-gradient-middle", colors.pages.service.gradientMiddle || currentColors.pages.service.gradientMiddle);
                root.style.setProperty("--service-gradient-end", colors.pages.service.gradientEnd || currentColors.pages.service.gradientEnd);
                root.style.setProperty("--service-text", colors.pages.service.textColor || currentColors.pages.service.textColor);
            } else {
                root.style.setProperty("--service-card-bg", currentColors.pages.service.cardBg);
                root.style.setProperty("--service-gradient-start", currentColors.pages.service.gradientStart);
                root.style.setProperty("--service-gradient-middle", currentColors.pages.service.gradientMiddle);
                root.style.setProperty("--service-gradient-end", currentColors.pages.service.gradientEnd);
                root.style.setProperty("--service-text", currentColors.pages.service.textColor);
            }

            if (colors.pages?.industry) {
                root.style.setProperty("--industry-primary-bg", colors.pages.industry.primaryBg || currentColors.pages.industry.primaryBg);
                root.style.setProperty("--industry-accent-bg", colors.pages.industry.accentBg || currentColors.pages.industry.accentBg);
                root.style.setProperty("--industry-button-bg", colors.pages.industry.buttonBg || currentColors.pages.industry.buttonBg);
                root.style.setProperty("--industry-text", colors.pages.industry.textColor || currentColors.pages.industry.textColor);
            } else {
                root.style.setProperty("--industry-primary-bg", currentColors.pages.industry.primaryBg);
                root.style.setProperty("--industry-accent-bg", currentColors.pages.industry.accentBg);
                root.style.setProperty("--industry-button-bg", currentColors.pages.industry.buttonBg);
                root.style.setProperty("--industry-text", currentColors.pages.industry.textColor);
            }

            if (colors.pages?.caseStudy) {
                root.style.setProperty("--casestudy-hero-bg", colors.pages.caseStudy.heroBg || currentColors.pages.caseStudy.heroBg);
                root.style.setProperty("--casestudy-hero-start", colors.pages.caseStudy.heroGradientStart || currentColors.pages.caseStudy.heroGradientStart);
                root.style.setProperty("--casestudy-hero-middle", colors.pages.caseStudy.heroGradientMiddle || currentColors.pages.caseStudy.heroGradientMiddle);
                root.style.setProperty("--casestudy-hero-end", colors.pages.caseStudy.heroGradientEnd || currentColors.pages.caseStudy.heroGradientEnd);
                root.style.setProperty("--casestudy-card-bg", colors.pages.caseStudy.cardBg || currentColors.pages.caseStudy.cardBg);
                root.style.setProperty("--casestudy-text", colors.pages.caseStudy.textColor || currentColors.pages.caseStudy.textColor);
                root.style.setProperty("--casestudy-border", colors.pages.caseStudy.borderColor || currentColors.pages.caseStudy.borderColor);
            } else {
                root.style.setProperty("--casestudy-hero-bg", currentColors.pages.caseStudy.heroBg);
                root.style.setProperty("--casestudy-hero-start", currentColors.pages.caseStudy.heroGradientStart);
                root.style.setProperty("--casestudy-hero-middle", currentColors.pages.caseStudy.heroGradientMiddle);
                root.style.setProperty("--casestudy-hero-end", currentColors.pages.caseStudy.heroGradientEnd);
                root.style.setProperty("--casestudy-card-bg", currentColors.pages.caseStudy.cardBg);
                root.style.setProperty("--casestudy-text", currentColors.pages.caseStudy.textColor);
                root.style.setProperty("--casestudy-border", currentColors.pages.caseStudy.borderColor);
            }

            if (colors.pages?.hireDeveloper) {
                root.style.setProperty("--hiredev-hero-bg", colors.pages.hireDeveloper.heroBg || currentColors.pages.hireDeveloper.heroBg);
                root.style.setProperty("--hiredev-card-bg", colors.pages.hireDeveloper.cardBg || currentColors.pages.hireDeveloper.cardBg);
                root.style.setProperty("--hiredev-button-bg", colors.pages.hireDeveloper.buttonBg || currentColors.pages.hireDeveloper.buttonBg);
                root.style.setProperty("--hiredev-text", colors.pages.hireDeveloper.textColor || currentColors.pages.hireDeveloper.textColor);
            } else {
                root.style.setProperty("--hiredev-hero-bg", currentColors.pages.hireDeveloper.heroBg);
                root.style.setProperty("--hiredev-card-bg", currentColors.pages.hireDeveloper.cardBg);
                root.style.setProperty("--hiredev-button-bg", currentColors.pages.hireDeveloper.buttonBg);
                root.style.setProperty("--hiredev-text", currentColors.pages.hireDeveloper.textColor);
            }

            // Apply form colors
            if (colors.forms) {
                root.style.setProperty("--form-input-bg", colors.forms.inputBg || currentColors.forms.inputBg);
                root.style.setProperty("--form-input-border", colors.forms.inputBorder || currentColors.forms.inputBorder);
                root.style.setProperty("--form-input-text", colors.forms.inputText || currentColors.forms.inputText);
                root.style.setProperty("--form-input-placeholder", colors.forms.inputPlaceholder || currentColors.forms.inputPlaceholder || "#6b7280");
                root.style.setProperty("--form-label-text", colors.forms.labelText || currentColors.forms.labelText);
                root.style.setProperty("--form-error-text", colors.forms.errorText || currentColors.forms.errorText);
            } else {
                root.style.setProperty("--form-input-bg", currentColors.forms.inputBg);
                root.style.setProperty("--form-input-border", currentColors.forms.inputBorder);
                root.style.setProperty("--form-input-text", currentColors.forms.inputText);
                root.style.setProperty("--form-input-placeholder", currentColors.forms.inputPlaceholder || "#6b7280");
                root.style.setProperty("--form-label-text", currentColors.forms.labelText);
                root.style.setProperty("--form-error-text", currentColors.forms.errorText);
            }

            toast({
                title: "Success",
                description: "Site settings updated successfully",
            });
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update settings",
                variant: "destructive",
            });
        },
    });

    const updateSettings = async (updates: Partial<SiteSettings>) => {
        await updateMutation.mutateAsync(updates);
    };

    // Ensure we always provide a valid context value
    const contextValue: SiteSettingsContextType = {
        settings: settings || null,
        isLoading: isLoading || false,
        updateSettings,
    };

    return (
        <SiteSettingsContext.Provider value={contextValue}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
    }
    return context;
}
