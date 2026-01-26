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
    useEffect(() => {
        if (settings?.siteName) {
            document.title = settings.siteName;
        }
    }, [settings?.siteName]);

    const updateMutation = useMutation({
        mutationFn: async (updates: Partial<SiteSettings>) => {
            const response = await apiRequest("POST", "/api/site-settings", updates);
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/site-settings"], data.settings);

            // immediate effect
            if (data.settings.theme) setTheme(data.settings.theme);
            if (data.settings.siteName) document.title = data.settings.siteName;

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

    return (
        <SiteSettingsContext.Provider value={{ settings: settings || null, isLoading, updateSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (context === undefined) {
        throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
    }
    return context;
}
