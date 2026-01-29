/**
 * Unified AI Client
 * 
 * Provides a unified interface for multiple AI providers:
 * - OpenAI (GPT-4o, GPT-5)
 * - Google Gemini
 * - Perplexity AI
 * - Grok (xAI)
 * 
 * All providers implement the same interface for consistent usage across the application.
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** User-friendly error message for OpenAI-like APIs (OpenAI, Perplexity, Grok) by status code. */
function parseProviderHttpError(provider: string, status: number, body: string): string {
  const s = body.toLowerCase();
  if (status === 401 || s.includes('invalid_api_key') || s.includes('invalid api key') || s.includes('authentication')) {
    return `Invalid API key for ${provider}. Check your key and try again.`;
  }
  if (status === 403 || s.includes('permission') || s.includes('forbidden')) {
    return `${provider} API: Permission denied. Check your API key and plan.`;
  }
  if (status === 429 || s.includes('rate limit') || s.includes('quota') || s.includes('overloaded')) {
    return `${provider} rate limit or quota exceeded. Please retry in a few minutes.`;
  }
  if (status === 400 || s.includes('bad request')) {
    return `${provider} API: Bad request. Check your input and try again.`;
  }
  if (status >= 500) {
    return `${provider} API is temporarily unavailable. Please retry later.`;
  }
  return `${provider} API error (${status}). Please try again.`;
}

/** Parse retry-after header (seconds) or use default. Returns ms. */
function parseRetryAfterMs(headers: Headers | undefined, defaultSec = 15): number {
  if (!headers?.get) return defaultSec * 1000;
  const v = headers.get('retry-after');
  if (!v) return defaultSec * 1000;
  const n = parseInt(v, 10);
  if (Number.isFinite(n) && n > 0) return Math.min(n, 30) * 1000;
  return defaultSec * 1000;
}

/** Ensure message content is non-empty to avoid provider-specific errors (e.g. 400). */
function ensureNonEmptyContent(content: string | undefined): string {
  const s = typeof content === 'string' ? content.trim() : String(content ?? '');
  return s || ' ';
}

/** Parse retry delay (e.g. "21s" or "21.43s") from Gemini 429 errorDetails. Returns ms. */
function parseGemini429RetryDelay(err: { status?: number; errorDetails?: unknown[] }): number {
  if (err.status !== 429 || !Array.isArray(err.errorDetails)) return 0;
  for (const d of err.errorDetails) {
    if (d && typeof d === 'object' && (d as { '@type'?: string })['@type']?.includes('RetryInfo')) {
      const raw = (d as { retryDelay?: string }).retryDelay;
      if (typeof raw === 'string') {
        const sec = parseFloat(raw.replace(/s$/i, '').trim());
        if (Number.isFinite(sec) && sec > 0) return Math.ceil(sec * 1000);
      }
      break;
    }
  }
  return 0;
}

export type AIModel = 'openai' | 'gemini' | 'perplexity' | 'grok';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Base interface for AI providers
 */
export interface AIProvider {
  /**
   * Generate chat completion
   */
  generateChatCompletion(
    messages: ChatMessage[],
    options?: ChatCompletionOptions
  ): Promise<ChatCompletionResponse>;

  /**
   * Generate text from a prompt
   */
  generateText(
    prompt: string,
    options?: ChatCompletionOptions
  ): Promise<string>;

  /**
   * Validate API key by making a test call
   */
  validateApiKey(apiKey: string): Promise<boolean>;
}

/**
 * OpenAI Provider Implementation
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string = 'gpt-4o') {
    this.client = new OpenAI({ apiKey });
    this.defaultModel = defaultModel;
  }

  async generateChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const model = options.model || this.defaultModel;
    const safeMessages = messages.map(msg => ({
      role: msg.role,
      content: ensureNonEmptyContent(msg.content),
    }));

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          model,
          messages: safeMessages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          top_p: options.topP,
          frequency_penalty: options.frequencyPenalty,
          presence_penalty: options.presencePenalty,
        });

        const choice = response.choices[0];
        if (!choice || !choice.message.content) {
          throw new Error('No response from OpenAI');
        }

        return {
          content: choice.message.content,
          model: response.model,
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          } : undefined,
        };
      } catch (e) {
        lastErr = e;
        const err = e as { status?: number; headers?: Headers; message?: string };
        const status = err?.status ?? (String((e as Error)?.message || '').includes('429') ? 429 : 0);
        if (status === 429 && attempt === 0) {
          const ms = Math.min(parseRetryAfterMs(err?.headers), 15_000);
          console.warn('[OpenAI] 429 rate limit, retrying after', Math.round(ms / 1000), 's');
          await sleep(ms);
          continue;
        }
        const msg = (e as Error)?.message ?? String(e);
        if (status === 401 || status === 403 || status === 429 || (status >= 400 && status < 600)) {
          throw new Error(parseProviderHttpError('OpenAI', status, msg));
        }
        throw e;
      }
    }
    const err = lastErr as { status?: number; message?: string };
    const status = err?.status ?? 429;
    throw new Error(parseProviderHttpError('OpenAI', status, err?.message ?? ''));
  }

  async generateText(
    prompt: string,
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const response = await this.generateChatCompletion(
      [{ role: 'user', content: prompt }],
      options
    );
    return response.content;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new OpenAI({ apiKey });
      await testClient.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }
}

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * User-friendly messages for Gemini API errors (list-models response).
 * @see https://ai.google.dev/gemini-api/docs/troubleshooting
 */
function parseGeminiHttpError(status: number, body: string): string {
  const s = body.toLowerCase();
  if (status === 401 || s.includes('api_key_invalid') || s.includes('api key not valid') || s.includes('invalid api key')) {
    return 'Invalid API key. Create or check your key at aistudio.google.com/apikey.';
  }
  if (status === 403 || s.includes('permission') || s.includes('permission_denied')) {
    return 'API key invalid or missing permissions. Use a key from Google AI Studio (aistudio.google.com/apikey).';
  }
  if (status === 429 || s.includes('resource_exhausted') || s.includes('quota')) {
    return 'Rate limit or quota exceeded. Try again later.';
  }
  if (status === 400 || s.includes('failed_precondition') || s.includes('not available')) {
    return 'Gemini API not available. Check your key and region at aistudio.google.com/apikey.';
  }
  return 'Gemini API error. Verify your API key at aistudio.google.com/apikey.';
}

/**
 * Validate a Gemini API key using the list-models endpoint.
 * Does not depend on any specific model—only checks that the key works.
 * Exported for use by validate-api-key route.
 */
export async function validateGeminiKey(
  apiKey: string
): Promise<{ valid: true } | { valid: false; error: string }> {
  const trimmed = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!trimmed) {
    return { valid: false, error: 'API key is required.' };
  }
  try {
    const url = `${GEMINI_MODELS_URL}?key=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    const body = await res.text();

    if (res.ok) {
      return { valid: true };
    }

    let errMsg: string;
    try {
      const j = JSON.parse(body) as { error?: { message?: string } };
      errMsg = j?.error?.message ?? body;
    } catch {
      errMsg = body || `HTTP ${res.status}`;
    }
    const error = parseGeminiHttpError(res.status, errMsg);
    console.warn('[Gemini] API key validation failed:', res.status, errMsg);
    return { valid: false, error };
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    console.warn('[Gemini] API key validation failed:', raw);
    return {
      valid: false,
      error: raw.toLowerCase().includes('fetch') || raw.toLowerCase().includes('network')
        ? 'Network error. Check your connection and try again.'
        : 'Gemini API error. Verify your API key at aistudio.google.com/apikey.',
    };
  }
}

/**
 * Google Gemini Provider Implementation
 */
export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string = 'gemini-2.0-flash') {
    this.client = new GoogleGenerativeAI(apiKey);
    this.defaultModel = defaultModel;
  }

  async generateChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const model = options.model || this.defaultModel;
    const genModel = this.client.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
      },
    });

    // Convert messages to Gemini format; skip systemInstruction (causes 400 with some models).
    const systemContent = messages.find(m => m.role === 'system')?.content;
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: ensureNonEmptyContent(m.content) }],
      }));

    let history = conversationMessages.slice(0, -1);
    let lastText = conversationMessages[conversationMessages.length - 1]?.parts[0]?.text ?? '';

    if (systemContent && ensureNonEmptyContent(systemContent).trim()) {
      history = [
        { role: 'user' as const, parts: [{ text: `[System]\n${ensureNonEmptyContent(systemContent)}` }] },
        { role: 'model' as const, parts: [{ text: 'Understood.' }] },
        ...history,
      ];
    }

    const chat = genModel.startChat({ history });

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await chat.sendMessage(lastText);
        const response = await result.response;
        const text = response.text();
        return {
          content: text,
          model: model,
          usage: {
            promptTokens: response.usageMetadata?.promptTokenCount,
            completionTokens: response.usageMetadata?.candidatesTokenCount,
            totalTokens: response.usageMetadata?.totalTokenCount,
          },
        };
      } catch (e) {
        lastErr = e;
        const err = e as { status?: number; errorDetails?: unknown[] };
        const is429 = err?.status === 429 || String((e as Error)?.message || '').includes('429');
        if (is429 && attempt === 0) {
          const rawMs = parseGemini429RetryDelay(err) || 22_000;
          if (rawMs > 30_000) {
            console.warn('[Gemini] 429 quota exceeded, suggested retry > 30s — failing fast');
            throw new Error(
              'Gemini quota exceeded. Please retry in a few minutes or check your plan and billing: https://ai.google.dev/gemini-api/docs/rate-limits'
            );
          }
          const ms = Math.min(rawMs, 15_000);
          console.warn('[Gemini] 429 quota exceeded, retrying after', Math.round(ms / 1000), 's');
          await sleep(ms);
          continue;
        }
        throw e;
      }
    }
    const err = lastErr as { status?: number };
    if (err?.status === 429) {
      throw new Error(
        'Gemini quota exceeded. Please retry in a few minutes or check your plan and billing: https://ai.google.dev/gemini-api/docs/rate-limits'
      );
    }
    throw lastErr;
  }

  async generateText(
    prompt: string,
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const response = await this.generateChatCompletion(
      [{ role: 'user', content: prompt }],
      options
    );
    return response.content;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    const result = await validateGeminiKey(apiKey);
    return result.valid;
  }
}

/**
 * Perplexity Provider Implementation
 * Uses direct API calls to Perplexity API
 */
export class PerplexityProvider implements AIProvider {
  private apiKey: string;
  private defaultModel: string;
  private apiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string, defaultModel: string = 'sonar-pro') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async generateChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const model = options.model || this.defaultModel;
    const perplexityMessages = messages.map(msg => {
      const role = msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user';
      return { role, content: ensureNonEmptyContent(msg.content) };
    });

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: perplexityMessages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
            top_p: options.topP,
          }),
        });

        if (!response.ok) {
          const body = await response.text();
          const errMsg = parseProviderHttpError('Perplexity', response.status, body);
          const e = new Error(errMsg) as Error & { status?: number };
          e.status = response.status;
          throw e;
        }

        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }>; model?: string; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } };
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error('No response from Perplexity API');
        }

        return {
          content,
          model: data.model || model,
          usage: data.usage ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          } : undefined,
        };
      } catch (e) {
        lastErr = e;
        const err = e as { status?: number; message?: string };
        const status = err?.status ?? (String((e as Error)?.message || '').includes('429') ? 429 : 0);
        if (status === 429 && attempt === 0) {
          const ms = 15_000;
          console.warn('[Perplexity] 429 rate limit, retrying after 15 s');
          await sleep(ms);
          continue;
        }
        throw e;
      }
    }
    const err = lastErr as { status?: number; message?: string };
    throw new Error(parseProviderHttpError('Perplexity', err?.status ?? 429, err?.message ?? ''));
  }

  async generateText(
    prompt: string,
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const response = await this.generateChatCompletion(
      [{ role: 'user', content: prompt }],
      options
    );
    return response.content;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Grok (xAI) Provider Implementation
 * Uses direct API calls to xAI API
 */
export class GrokProvider implements AIProvider {
  private apiKey: string;
  private defaultModel: string;
  private apiUrl = 'https://api.x.ai/v1/chat/completions';

  constructor(apiKey: string, defaultModel: string = 'grok-2-1212') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async generateChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const model = options.model || this.defaultModel;
    const xaiMessages = messages.map(msg => ({
      role: (msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user') as 'system' | 'user' | 'assistant',
      content: ensureNonEmptyContent(msg.content),
    }));

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: xaiMessages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
            top_p: options.topP,
            frequency_penalty: options.frequencyPenalty,
            presence_penalty: options.presencePenalty,
          }),
        });

        if (!response.ok) {
          const body = await response.text();
          const errMsg = parseProviderHttpError('Grok', response.status, body);
          const e = new Error(errMsg) as Error & { status?: number };
          e.status = response.status;
          throw e;
        }

        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }>; model?: string; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } };
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error('No response from Grok API');
        }

        return {
          content,
          model: data.model || model,
          usage: data.usage ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          } : undefined,
        };
      } catch (e) {
        lastErr = e;
        const err = e as { status?: number; message?: string };
        const status = err?.status ?? (String((e as Error)?.message || '').includes('429') ? 429 : 0);
        if (status === 429 && attempt === 0) {
          console.warn('[Grok] 429 rate limit, retrying after 15 s');
          await sleep(15_000);
          continue;
        }
        throw e;
      }
    }
    const err = lastErr as { status?: number; message?: string };
    throw new Error(parseProviderHttpError('Grok', err?.status ?? 429, err?.message ?? ''));
  }

  async generateText(
    prompt: string,
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const response = await this.generateChatCompletion(
      [{ role: 'user', content: prompt }],
      options
    );
    return response.content;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2-1212',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Factory function to get the appropriate AI provider
 */
export function getAIProvider(
  model: AIModel | null,
  apiKey: string,
  modelConfig?: { model?: string; temperature?: number }
): AIProvider {
  const selectedModel = modelConfig?.model;
  const temperature = modelConfig?.temperature;

  switch (model) {
    case 'openai':
      return new OpenAIProvider(apiKey, selectedModel || 'gpt-4o');
    
    case 'gemini':
      return new GeminiProvider(apiKey, selectedModel || 'gemini-2.0-flash');
    
    case 'perplexity':
      return new PerplexityProvider(apiKey, selectedModel || 'sonar-pro');
    
    case 'grok':
      return new GrokProvider(apiKey, selectedModel || 'grok-2-1212');
    
    default:
      // Fallback to OpenAI if no model selected
      const fallbackKey = process.env.OPENAI_API_KEY || apiKey;
      if (!fallbackKey) {
        throw new Error('No AI model selected and OPENAI_API_KEY not configured');
      }
      return new OpenAIProvider(fallbackKey, selectedModel || 'gpt-4o');
  }
}

/**
 * Get default model name for a provider
 */
export function getDefaultModel(model: AIModel): string {
  switch (model) {
    case 'openai':
      return 'gpt-4o';
    case 'gemini':
      return 'gemini-2.0-flash';
    case 'perplexity':
      return 'sonar-pro';
    case 'grok':
      return 'grok-2-1212';
    default:
      return 'gpt-4o';
  }
}
