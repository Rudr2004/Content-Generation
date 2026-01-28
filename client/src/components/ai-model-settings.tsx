/**
 * AI Model Settings Component
 * 
 * Admin UI for managing AI model selection, API keys, and model configuration.
 * Supports OpenAI, Gemini, Perplexity, and Grok models.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff, Key, Sparkles, Shield, Settings, Zap } from 'lucide-react';
import type { AIModelSettings, AIModel } from '../lib/types';

const aiModelSettingsSchema = z.object({
  selectedModel: z.enum(['openai', 'gemini', 'perplexity', 'grok']).nullable(),
  apiKeys: z.object({
    openai: z.string().optional(),
    gemini: z.string().optional(),
    perplexity: z.string().optional(),
    grok: z.string().optional(),
  }).optional(),
  modelConfig: z.object({
    openai: z.object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
    }).optional(),
    gemini: z.object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
    }).optional(),
    perplexity: z.object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
    }).optional(),
    grok: z.object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
    }).optional(),
  }).optional(),
});

type AIModelSettingsFormData = z.infer<typeof aiModelSettingsSchema>;

const MODEL_OPTIONS: { value: AIModel; label: string; description: string; defaultModel: string }[] = [
  {
    value: 'openai',
    label: 'OpenAI (GPT-4o)',
    description: 'Powerful language model with excellent JSON structure support',
    defaultModel: 'gpt-4o',
  },
  {
    value: 'gemini',
    label: 'Google Gemini',
    description: 'Google\'s advanced AI model with strong reasoning capabilities',
    defaultModel: 'gemini-2.0-flash-exp',
  },
  {
    value: 'perplexity',
    label: 'Perplexity AI',
    description: 'Research-focused AI with real-time web access',
    defaultModel: 'sonar-pro',
  },
  {
    value: 'grok',
    label: 'Grok (xAI)',
    description: 'xAI\'s conversational AI model',
    defaultModel: 'grok-2-1212',
  },
];

export function AIModelSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [validatingKey, setValidatingKey] = useState<string | null>(null);
  const [testingModel, setTestingModel] = useState(false);

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await fetch('/api/site-settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const aiSettings: AIModelSettings | null = settings?.aiModelSettings || null;

  const form = useForm<AIModelSettingsFormData>({
    resolver: zodResolver(aiModelSettingsSchema),
    defaultValues: {
      selectedModel: aiSettings?.selectedModel || null,
      apiKeys: aiSettings?.apiKeys || {},
      modelConfig: aiSettings?.modelConfig || {},
    },
    values: {
      selectedModel: aiSettings?.selectedModel || null,
      apiKeys: aiSettings?.apiKeys || {},
      modelConfig: aiSettings?.modelConfig || {},
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<AIModelSettingsFormData>) => {
      const response = await apiRequest('POST', '/api/site-settings', {
        ...settings,
        aiModelSettings: {
          selectedModel: data.selectedModel ?? aiSettings?.selectedModel ?? null,
          apiKeys: data.apiKeys ?? aiSettings?.apiKeys ?? {},
          modelConfig: data.modelConfig ?? aiSettings?.modelConfig ?? {},
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'Success',
        description: 'AI model settings updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    },
  });

  // Validate API key
  const validateApiKey = async (model: AIModel, apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return false;
    }

    setValidatingKey(model);
    try {
      const response = await apiRequest('POST', '/api/ai/validate-api-key', { model, apiKey });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: `API key for ${model} is valid`,
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Invalid API key',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to validate API key',
        variant: 'destructive',
      });
      return false;
    } finally {
      setValidatingKey(null);
    }
  };

  // Test selected model
  const testModel = async () => {
    const selectedModel = form.watch('selectedModel');
    if (!selectedModel) {
      toast({
        title: 'Error',
        description: 'Please select a model first',
        variant: 'destructive',
      });
      return;
    }

    setTestingModel(true);
    try {
      // Test endpoint uses the selected model from settings, not from request body
      const response = await apiRequest('POST', '/api/ai/test-model', {});
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message || `Model ${selectedModel} is working correctly`,
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Model test failed',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Test model error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to test model. Make sure the API key is configured.',
        variant: 'destructive',
      });
    } finally {
      setTestingModel(false);
    }
  };

  const onSubmit = (data: AIModelSettingsFormData) => {
    updateMutation.mutate(data);
  };

  const toggleKeyVisibility = (model: string) => {
    setVisibleKeys(prev => ({ ...prev, [model]: !prev[model] }));
  };

  const maskApiKey = (key: string | undefined): string => {
    if (!key) return '';
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const isKeyMasked = (key: string | undefined): boolean => {
    if (!key) return false;
    return key.includes('...') || key.length <= 8;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedModelInfo = MODEL_OPTIONS.find(m => m.value === form.watch('selectedModel'));
  const defaultModel = selectedModelInfo?.defaultModel || 'gpt-4o';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Model Selection
          </CardTitle>
          <CardDescription className="text-base">
            Choose which AI model to use for content generation. All models will generate content following the same structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Model Message */}
          {!form.watch('selectedModel') && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertDescription className="text-sm">
                <strong className="text-blue-900 dark:text-blue-100">Default Model:</strong> 
                <span className="text-blue-800 dark:text-blue-200"> No model selected. The system will use </span>
                <strong className="text-blue-900 dark:text-blue-100">OpenAI (GPT-4o)</strong>
                <span className="text-blue-800 dark:text-blue-200"> by default if OPENAI_API_KEY is configured in environment variables.</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Model Selection */}
          <div className="space-y-3">
            <Label htmlFor="selectedModel" className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Select AI Model
            </Label>
            <Select
              value={form.watch('selectedModel') || ''}
              onValueChange={(value) => form.setValue('selectedModel', value as AIModel || null)}
            >
              <SelectTrigger id="selectedModel" className="h-12 text-base">
                <SelectValue placeholder="Select a model (default: OpenAI)" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModelInfo && (
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Currently selected: <strong>{selectedModelInfo.label}</strong></p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedModelInfo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Test Model Button */}
          {form.watch('selectedModel') && (
            <Button
              type="button"
              variant="outline"
              onClick={testModel}
              disabled={testingModel}
              className="w-full h-11 text-base"
            >
              {testingModel ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Testing Model...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Test Selected Model
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* API Keys Section */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            API Keys
          </CardTitle>
          <CardDescription className="text-base">
            {form.watch('selectedModel') 
              ? `Enter API key for the selected model (${MODEL_OPTIONS.find(m => m.value === form.watch('selectedModel'))?.label}). Keys are encrypted and stored securely.`
              : 'Select a model above to enter its API key. Keys are encrypted and stored securely.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {!form.watch('selectedModel') && (
            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <AlertDescription className="text-sm">
                <strong className="text-amber-900 dark:text-amber-100">No Model Selected:</strong>
                <span className="text-amber-800 dark:text-amber-200"> Please select a model above to configure its API key.</span>
              </AlertDescription>
            </Alert>
          )}
          {(() => {
            const selectedModel = form.watch('selectedModel');
            // Only show API key field for the selected model
            if (!selectedModel) {
              return null; // Don't show any API key fields if no model is selected
            }
            
            const modelsToShow = MODEL_OPTIONS.filter(m => m.value === selectedModel);
            
            return modelsToShow.map((modelOption) => {
              const model = modelOption.value;
              const apiKey = form.watch(`apiKeys.${model}`) || '';
              const isVisible = visibleKeys[model];
              const isMasked = isKeyMasked(apiKey);
              const displayKey = isVisible && !isMasked ? apiKey : maskApiKey(apiKey);

              return (
                <div key={model} className="space-y-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <Label htmlFor={`apiKey-${model}`} className="text-base font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  {modelOption.label} API Key
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      id={`apiKey-${model}`}
                      type={isVisible && !isMasked ? 'text' : 'password'}
                      value={displayKey}
                      onChange={(e) => {
                        form.setValue(`apiKeys.${model}`, e.target.value);
                      }}
                      placeholder={`Enter ${modelOption.label} API key`}
                      className="pr-12 h-11 text-base"
                    />
                    {apiKey && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-9 px-3 hover:bg-muted"
                        onClick={() => toggleKeyVisibility(model)}
                      >
                        {isVisible && !isMasked ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const key = form.getValues(`apiKeys.${model}`);
                      if (key) {
                        const isValid = await validateApiKey(model, key);
                        if (isValid) {
                          // Save the validated key
                          form.setValue(`apiKeys.${model}`, key);
                        }
                      }
                    }}
                    disabled={validatingKey === model || !apiKey}
                    className="h-11 px-6"
                  >
                    {validatingKey === model ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Validate
                      </>
                    )}
                  </Button>
                </div>
              </div>
              );
            });
          })()}
        </CardContent>
      </Card>

      {/* Model Configuration */}
      {form.watch('selectedModel') && (
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-primary" />
              Model Configuration
            </CardTitle>
            <CardDescription className="text-base">
              Configure advanced settings for the selected model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="model-name" className="text-base font-semibold">Model Name</Label>
              <Input
                id="model-name"
                value={form.watch(`modelConfig.${form.watch('selectedModel')}.model`) || defaultModel}
                onChange={(e) => {
                  const selectedModel = form.watch('selectedModel');
                  if (selectedModel) {
                    form.setValue(`modelConfig.${selectedModel}.model`, e.target.value);
                  }
                }}
                placeholder={defaultModel}
                className="h-11 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Default: <code className="px-2 py-1 bg-muted rounded text-xs">{defaultModel}</code>
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="temperature" className="text-base font-semibold">Temperature (0-2)</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={form.watch(`modelConfig.${form.watch('selectedModel')}.temperature`) || 0.7}
                onChange={(e) => {
                  const selectedModel = form.watch('selectedModel');
                  if (selectedModel) {
                    form.setValue(`modelConfig.${selectedModel}.temperature`, parseFloat(e.target.value));
                  }
                }}
                placeholder="0.7"
                className="h-11 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Controls randomness. Lower values make output more deterministic. Default: <code className="px-2 py-1 bg-muted rounded text-xs">0.7</code>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={updateMutation.isPending}
          size="lg"
          className="h-12 px-8 text-base font-semibold"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Save AI Model Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
