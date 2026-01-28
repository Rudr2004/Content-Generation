/**
 * Unified AI Client Wrapper
 * 
 * This module provides backward-compatible functions that use the unified AI client.
 * All AI generation functions should use getAIProvider() instead of direct OpenAI calls.
 */

import { getActiveAIProvider, type AIProvider } from './utils/ai-settings-manager';
import { ChatMessage } from './utils/unified-ai-client';

let cachedProvider: AIProvider | null = null;

/**
 * Get the active AI provider (cached for performance)
 * Falls back to OpenAI if no model is selected
 */
export async function getAIProvider(): Promise<AIProvider> {
  if (!cachedProvider) {
    cachedProvider = await getActiveAIProvider();
  }
  return cachedProvider;
}

/**
 * Reset the cached provider (useful when settings change)
 */
export function resetAIProviderCache(): void {
  cachedProvider = null;
}

/**
 * Generate chat completion using the active AI provider
 * Maintains the same interface as OpenAI for backward compatibility
 * Ensures consistent JSON output structure across all models
 */
export async function generateChatCompletion(messages: ChatMessage[], options?: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: { type: 'json_object' | 'text' };
}): Promise<{ choices: Array<{ message: { content: string | null } }> }> {
  const provider = await getAIProvider();
  
  // Enhance messages for JSON format requirement and structure consistency
  let enhancedMessages = [...messages];
  if (options?.response_format?.type === 'json_object') {
    // Check if there's a system message
    const hasSystemMessage = enhancedMessages.some(m => m.role === 'system');
    
    // Add or enhance system message with JSON structure requirements
    if (hasSystemMessage) {
      enhancedMessages = enhancedMessages.map(msg => {
        if (msg.role === 'system') {
          return {
            ...msg,
            content: `${msg.content}\n\nCRITICAL: You MUST respond with ONLY valid JSON. No markdown code blocks, no explanations, no text before or after. Return a single, well-formed JSON object that matches the exact structure specified in the user's request.`,
          };
        }
        return msg;
      });
    } else {
      // Add system message at the beginning
      enhancedMessages = [
        {
          role: 'system',
          content: 'You are a precise JSON generator. You MUST respond with ONLY valid JSON. No markdown code blocks, no explanations, no text before or after. Return a single, well-formed JSON object that matches the exact structure specified in the user\'s request.',
        },
        ...enhancedMessages,
      ];
    }
    
    // Add explicit JSON instruction to the last user message if not already present
    const lastMessage = enhancedMessages[enhancedMessages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const content = lastMessage.content;
      // Check if JSON instruction is already present
      if (!content.toLowerCase().includes('json') && !content.includes('{')) {
        enhancedMessages = [
          ...enhancedMessages.slice(0, -1),
          {
            role: 'user',
            content: `${content}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON object. Ensure the JSON structure matches exactly what was requested.`,
          },
        ];
      }
    }
  }
  
  const response = await provider.generateChatCompletion(enhancedMessages, {
    model: options?.model,
    temperature: options?.temperature,
    maxTokens: options?.max_tokens,
    topP: options?.top_p,
    frequencyPenalty: options?.frequency_penalty,
    presencePenalty: options?.presence_penalty,
  });

  // Clean and validate JSON response if required
  let content = response.content;
  if (options?.response_format?.type === 'json_object') {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    } else {
      // Try to extract JSON object from the response
      const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        content = jsonObjectMatch[0];
      }
    }
    
    // Validate JSON
    try {
      JSON.parse(content);
    } catch (error) {
      console.warn('Response is not valid JSON, returning as-is. Content:', content.substring(0, 200));
      // Return as-is and let caller handle parsing
    }
  }

  return {
    choices: [{
      message: {
        content: content,
      },
    }],
  };
}

/**
 * Backward compatibility: Get OpenAI client (deprecated, use getAIProvider instead)
 * @deprecated Use getAIProvider() instead
 */
export const getOpenAIClient = (): any => {
  console.warn('getOpenAIClient() is deprecated. Use getAIProvider() instead.');
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          const messages: ChatMessage[] = params.messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          }));
          return generateChatCompletion(messages, {
            model: params.model,
            temperature: params.temperature,
            max_tokens: params.max_tokens,
            top_p: params.top_p,
            frequency_penalty: params.frequency_penalty,
            presence_penalty: params.presence_penalty,
            response_format: params.response_format,
          });
        },
      },
    },
  };
};

/**
 * Check if AI is available
 */
export const isOpenAIAvailable = async (): Promise<boolean> => {
  try {
    await getAIProvider();
    return true;
  } catch {
    return false;
  }
};

export default null;