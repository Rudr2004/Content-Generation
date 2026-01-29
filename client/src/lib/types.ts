// Type definitions for AI Model Settings
export interface AIModelSettings {
    selectedModel: "openai" | "gemini" | "perplexity" | "grok" | null;
    apiKeys?: {
        openai?: string; // Encrypted
        gemini?: string; // Encrypted
        perplexity?: string; // Encrypted
        grok?: string; // Encrypted
    };
    modelConfig?: {
        openai?: {
            model: string;
            temperature?: number;
        };
        gemini?: {
            model: string;
            temperature?: number;
        };
        perplexity?: {
            model: string;
            temperature?: number;
        };
        grok?: {
            model: string;
            temperature?: number;
        };
    };
}

// Type definitions for AI Model Settings
export type AIModel = 'openai' | 'gemini' | 'perplexity' | 'grok';

export interface AIModelSettings {
    selectedModel: AIModel | null;
    apiKeys?: {
        openai?: string;
        gemini?: string;
        perplexity?: string;
        grok?: string;
    };
    /** Which models have a key stored (from API). Never use masked values in form. */
    apiKeyConfigured?: Record<string, boolean>;
    /** When true, use OpenAI with OPENAI_API_KEY from env for all generations; ignores selected model and stored keys. */
    useDefaultModelFromEnv?: boolean;
    modelConfig?: {
        openai?: {
            model: string;
            temperature?: number;
        };
        gemini?: {
            model: string;
            temperature?: number;
        };
        perplexity?: {
            model: string;
            temperature?: number;
        };
        grok?: {
            model: string;
            temperature?: number;
        };
    };
}

// Type definitions for color settings
export interface ColorSettings {
    general?: {
        header?: {
            backgroundColor?: string;
            textColor?: string;
            borderColor?: string;
        };
        footer?: {
            backgroundColor?: string;
            textColor?: string;
            borderColor?: string;
        };
        navbar?: {
            backgroundColor?: string;
            textColor?: string;
            activeColor?: string;
            hoverColor?: string;
        };
    };
    buttons?: {
        primary?: {
            backgroundColor?: string;
            textColor?: string;
            hoverColor?: string;
        };
        secondary?: {
            backgroundColor?: string;
            textColor?: string;
            hoverColor?: string;
        };
    };
    pages?: {
        [pageName: string]: {
            [componentName: string]: {
                [property: string]: string;
            };
        };
    };
}
