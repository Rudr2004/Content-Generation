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
    
    const response = await this.client.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
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

/**
 * Google Gemini Provider Implementation
 */
export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string = 'gemini-2.0-flash-exp') {
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

    // Convert messages to Gemini format
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chat = genModel.startChat({
      history: conversationMessages.slice(0, -1),
      systemInstruction,
    });

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
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
      const testClient = new GoogleGenerativeAI(apiKey);
      const model = testClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      await model.generateContent('test');
      return true;
    } catch (error) {
      return false;
    }
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
    
    // Convert messages to Perplexity format
    const perplexityMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

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
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0]?.message?.content;

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
    
    // Convert messages to xAI format
    const xaiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
      content: msg.content,
    }));

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
      const error = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0]?.message?.content;

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
      return new GeminiProvider(apiKey, selectedModel || 'gemini-2.0-flash-exp');
    
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
      return 'gemini-2.0-flash-exp';
    case 'perplexity':
      return 'sonar-pro';
    case 'grok':
      return 'grok-2-1212';
    default:
      return 'gpt-4o';
  }
}
