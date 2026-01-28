/**
 * AI Settings Manager
 * 
 * Manages AI model settings, API key retrieval, and decryption.
 * Provides a centralized way to access AI configuration from SiteSettings.
 */

import { storage, SiteSettings, AIModelSettings } from '../storage';
import { decryptApiKey } from './api-key-encryption';
import { AIModel, getAIProvider, AIProvider } from './unified-ai-client';

/**
 * Get AI settings from database
 */
export async function getAISettings(): Promise<AIModelSettings | null> {
  try {
    const settings = await storage.getSiteSettings();
    return settings.aiModelSettings || null;
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return null;
  }
}

/**
 * Get the selected AI model (with fallback to OpenAI)
 */
export async function getSelectedModel(): Promise<AIModel | null> {
  const aiSettings = await getAISettings();
  return aiSettings?.selectedModel || null;
}

/**
 * Get decrypted API key for a specific model
 */
export async function getDecryptedApiKey(model: AIModel): Promise<string | null> {
  try {
    const aiSettings = await getAISettings();
    
    if (!aiSettings?.apiKeys) {
      return null;
    }

    const encryptedKey = aiSettings.apiKeys[model];
    if (!encryptedKey) {
      return null;
    }

    // Decrypt the API key
    try {
      return decryptApiKey(encryptedKey);
    } catch (error) {
      console.error(`Error decrypting API key for ${model}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error getting API key for ${model}:`, error);
    return null;
  }
}

/**
 * Check if a model is configured (has valid API key)
 */
export async function isModelConfigured(model: AIModel): Promise<boolean> {
  const apiKey = await getDecryptedApiKey(model);
  return !!apiKey;
}

/**
 * Get the active AI provider based on current settings
 * Falls back to OpenAI with environment variable if no model is selected
 */
export async function getActiveAIProvider(): Promise<AIProvider> {
  const aiSettings = await getAISettings();
  const selectedModel = aiSettings?.selectedModel;
  
  // If no model selected, use OpenAI with environment variable
  if (!selectedModel) {
    const envKey = process.env.OPENAI_API_KEY;
    if (!envKey) {
      throw new Error('No AI model selected and OPENAI_API_KEY environment variable not configured');
    }
    return getAIProvider('openai', envKey, aiSettings?.modelConfig?.openai);
  }

  // Get decrypted API key for selected model
  const apiKey = await getDecryptedApiKey(selectedModel);
  if (!apiKey) {
    // Fallback to OpenAI if API key not found
    const envKey = process.env.OPENAI_API_KEY;
    if (envKey) {
      console.warn(`API key for ${selectedModel} not found, falling back to OpenAI`);
      return getAIProvider('openai', envKey, aiSettings?.modelConfig?.openai);
    }
    throw new Error(`API key for ${selectedModel} is not configured`);
  }

  // Get model-specific config
  const modelConfig = aiSettings?.modelConfig?.[selectedModel];

  return getAIProvider(selectedModel, apiKey, modelConfig);
}

/**
 * Get model configuration for a specific model
 */
export async function getModelConfig(model: AIModel): Promise<{ model: string; temperature?: number } | null> {
  const aiSettings = await getAISettings();
  return aiSettings?.modelConfig?.[model] || null;
}

/**
 * Check if any model is configured
 */
export async function hasAnyModelConfigured(): Promise<boolean> {
  const aiSettings = await getAISettings();
  if (!aiSettings?.apiKeys) {
    return !!process.env.OPENAI_API_KEY; // Check environment variable as fallback
  }
  
  // Check if at least one model has an API key
  return Object.keys(aiSettings.apiKeys).length > 0 || !!process.env.OPENAI_API_KEY;
}

/**
 * Get the default model name (for display purposes)
 */
export function getDefaultModelName(): { model: AIModel; name: string } {
  return {
    model: 'openai',
    name: 'OpenAI (GPT-4o)',
  };
}
