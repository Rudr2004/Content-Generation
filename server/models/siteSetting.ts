import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema({
    siteName: { type: String, default: "GreenAppleX", required: true },
    pageTitle: { type: String, default: "Green Apple - Enterprise AI Development & Custom Software Solutions" },
    theme: { type: String, default: "light", required: true },
    primaryColor: { type: String, default: "blue" },
    logoUrl: String,
    targetRegions: { type: String, default: "USA, Canada" },
    industryFocus: { type: String, default: "Technology, AI" },
    colorSettings: { 
        type: mongoose.Schema.Types.Mixed, 
        default: {} 
    },
    aiModelSettings: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            selectedModel: null, // "openai" | "gemini" | "perplexity" | "grok" | null
            apiKeys: {}, // Encrypted API keys: { openai?: string, gemini?: string, etc. }
            modelConfig: {} // Model-specific configurations
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const SiteSettingModel = mongoose.model("SiteSetting", siteSettingSchema);
