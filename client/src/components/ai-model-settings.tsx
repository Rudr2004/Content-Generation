/**
 * AI Model Settings Component
 *
 * Admin UI for managing AI model selection, API keys, and model configuration.
 * Supports OpenAI, Gemini, Perplexity, and Grok (Coming Soon — no public API key yet).
 */

import { useState, useEffect, useRef } from 'react';
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
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff, Key, Sparkles, Shield, Settings, Zap } from 'lucide-react';
import type { AIModelSettings, AIModel } from '../lib/types';

const aiModelSettingsSchema = z.object({
  selectedModel: z.enum(['openai', 'gemini', 'perplexity', 'grok']).nullable(),
  useDefaultModelFromEnv: z.boolean().optional(),
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

const MODEL_OPTIONS: {
  value: AIModel;
  label: string;
  description: string;
  defaultModel: string;
  comingSoon?: boolean;
}[] = [
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
    defaultModel: 'gemini-2.0-flash',
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
    description: 'No publicly available API key yet.',
    defaultModel: 'grok-2-1212',
    comingSoon: true,
  },
];

/** App default model when none selected or when user switches after an error. */
const DEFAULT_APP_MODEL: AIModel = 'openai';

export function AIModelSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [validatingKey, setValidatingKey] = useState<string | null>(null);
  const [testingModel, setTestingModel] = useState(false);
  const [modelErrorOccurred, setModelErrorOccurred] = useState(false);

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
  const apiKeyConfigured = aiSettings?.apiKeyConfigured ?? {};
  const hasInitialized = useRef(false);

  const form = useForm<AIModelSettingsFormData>({
    resolver: zodResolver(aiModelSettingsSchema),
    defaultValues: {
      selectedModel: null,
      useDefaultModelFromEnv: false,
      apiKeys: {},
      modelConfig: {},
    },
  });

  useEffect(() => {
    if (isLoading || !settings || hasInitialized.current) return;
    hasInitialized.current = true;
    form.reset({
      selectedModel: aiSettings?.selectedModel ?? null,
      useDefaultModelFromEnv: !!aiSettings?.useDefaultModelFromEnv,
      apiKeys: {},
      modelConfig: aiSettings?.modelConfig ?? {},
    });
  }, [isLoading, settings, aiSettings?.selectedModel, aiSettings?.useDefaultModelFromEnv, aiSettings?.modelConfig, form]);

  const isDirty = form.formState.isDirty;
  const selectedModel = form.watch('selectedModel');
  const useDefaultFromEnv = !!form.watch('useDefaultModelFromEnv');
  const savedUseDefaultFromEnv = !!aiSettings?.useDefaultModelFromEnv;
  const savedModel = aiSettings?.selectedModel ?? null;
  const selectedVsSavedMismatch = selectedModel !== savedModel;
  const cannotTest = isDirty || (!savedUseDefaultFromEnv && selectedVsSavedMismatch);

  // Sync selectedModel, useDefaultModelFromEnv, and modelConfig from server when not dirty (e.g. after save + refetch)
  useEffect(() => {
    if (isLoading || !aiSettings || isDirty) return;
    form.setValue('selectedModel', aiSettings.selectedModel ?? null);
    form.setValue('useDefaultModelFromEnv', !!aiSettings.useDefaultModelFromEnv);
    form.setValue('modelConfig', aiSettings.modelConfig ?? {});
  }, [isLoading, aiSettings, isDirty, form]);

  const isMaskedOrPlaceholder = (k: string) => !k || !k.trim() || k.includes('...');

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<AIModelSettingsFormData>) => {
      const keys = data.apiKeys ?? {};
      const apiKeysToSend: Record<string, string> = {};
      for (const [model, v] of Object.entries(keys)) {
        if (typeof v === 'string' && !isMaskedOrPlaceholder(v)) apiKeysToSend[model] = v.trim();
      }
      const response = await apiRequest('POST', '/api/site-settings', {
        ...settings,
        aiModelSettings: {
          selectedModel: data.selectedModel ?? aiSettings?.selectedModel ?? null,
          useDefaultModelFromEnv: !!data.useDefaultModelFromEnv,
          apiKeys: apiKeysToSend,
          modelConfig: data.modelConfig ?? aiSettings?.modelConfig ?? {},
        },
      });
      return response.json();
    },
    onSuccess: (data: { settings?: { aiModelSettings?: AIModelSettings } }) => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      const next = data?.settings?.aiModelSettings;
      form.reset({
        selectedModel: next?.selectedModel ?? null,
        useDefaultModelFromEnv: !!next?.useDefaultModelFromEnv,
        apiKeys: {},
        modelConfig: next?.modelConfig ?? {},
      });
      setModelErrorOccurred(false);
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

  const validateApiKey = async (model: AIModel, apiKey: string) => {
    if (isMaskedOrPlaceholder(apiKey)) {
      toast({
        title: 'Error',
        description: 'Enter your API key above to validate. Keys are not stored until you save.',
        variant: 'destructive',
      });
      return false;
    }
    setValidatingKey(model);
    try {
      const response = await apiRequest('POST', '/api/ai/validate-api-key', { model, apiKey: apiKey.trim() });
      const data = await response.json();
      
      if (data.success) {
        setModelErrorOccurred(false);
        toast({
          title: 'Success',
          description: `API key for ${model} is valid`,
        });
        return true;
      } else {
        setModelErrorOccurred(true);
        toast({
          title: 'Error',
          description: data.message || 'Invalid API key',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      setModelErrorOccurred(true);
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

  // Test selected model or default-from-ENV (uses saved settings; disabled when form not saved or selected !== saved)
  const testModel = async () => {
    if (!selectedModel && !savedUseDefaultFromEnv) {
      toast({
        title: 'Error',
        description: 'Select a model or enable "Use default model from ENV" first',
        variant: 'destructive',
      });
      return;
    }
    if (cannotTest) {
      toast({
        title: 'Error',
        description: selectedVsSavedMismatch
          ? 'Selected model does not match saved model. Save your changes first, then test.'
          : 'Save your changes first to test the model.',
        variant: 'destructive',
      });
      return;
    }

    setTestingModel(true);
    try {
      const response = await apiRequest('POST', '/api/ai/test-model', {});
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const testedModel = data.model ?? savedModel ?? selectedModel;
      const modelLabel = MODEL_OPTIONS.find(m => m.value === testedModel)?.label ?? testedModel;

      if (data.success) {
        setModelErrorOccurred(false);
        toast({
          title: 'Success',
          description: data.message || `Saved model (${modelLabel}) is working correctly`,
        });
      } else {
        setModelErrorOccurred(true);
        toast({
          title: 'Error',
          description: data.message || 'Model test failed',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Test model error:', error);
      setModelErrorOccurred(true);
      toast({
        title: 'Error',
        description: error.message || 'Failed to test model. Make sure the API key is configured.',
        variant: 'destructive',
      });
    } finally {
      setTestingModel(false);
    }
  };

  const useDefaultModel = () => {
    form.setValue('selectedModel', DEFAULT_APP_MODEL);
    setModelErrorOccurred(false);
    const label = MODEL_OPTIONS.find(m => m.value === DEFAULT_APP_MODEL)?.label ?? 'OpenAI';
    toast({
      title: 'Switched to default model',
      description: `Using ${label}. Configure its API key if needed, then Save.`,
    });
  };

  const dismissModelError = () => setModelErrorOccurred(false);

  const onSubmit = (data: AIModelSettingsFormData) => {
    updateMutation.mutate(data);
  };

  const toggleKeyVisibility = (model: string) => {
    setVisibleKeys(prev => ({ ...prev, [model]: !prev[model] }));
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
              onValueChange={(value) => {
                form.setValue('selectedModel', value as AIModel || null);
                setModelErrorOccurred(false);
              }}
            >
              <SelectTrigger id="selectedModel" className="h-12 text-base">
                <SelectValue placeholder="Select a model (default: OpenAI)" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.comingSoon}
                    className="py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-semibold">
                        {option.label}
                        {option.comingSoon && (
                          <Badge variant="secondary" className="text-xs font-normal">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
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
                  <p className="text-sm font-medium">
                    Currently selected: <strong>{selectedModelInfo.label}</strong>
                    {selectedModelInfo.comingSoon && (
                      <Badge variant="secondary" className="ml-2 text-xs font-normal">Coming Soon</Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedModelInfo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Test Model Button */}
          {((selectedModel && !selectedModelInfo?.comingSoon) || useDefaultFromEnv) && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={testModel}
                disabled={testingModel || cannotTest}
                title={
                  cannotTest
                    ? !savedUseDefaultFromEnv && selectedVsSavedMismatch
                      ? 'Selected model does not match saved model. Save first to test.'
                      : 'Save your changes first to test the model.'
                    : undefined
                }
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
                    {savedUseDefaultFromEnv ? 'Test default model (ENV)' : 'Test Saved Model'}
                  </>
                )}
              </Button>
              {cannotTest && (
                <p className="text-sm text-muted-foreground">
                  {!savedUseDefaultFromEnv && selectedVsSavedMismatch
                    ? 'Selected model does not match saved model. Save first to test.'
                    : 'Save your changes first to test the model.'}
                </p>
              )}
            </div>
          )}

          {/* After error: offer "Use default model" so user can switch */}
          {modelErrorOccurred && selectedModel && (
            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <div className="flex flex-col gap-3">
                <p className="text-sm">
                  {selectedModel === DEFAULT_APP_MODEL ? (
                    <>An error occurred with the default model. Check your API key, then Save and Test.</>
                  ) : (
                    <>An error occurred with the selected model. You can switch to the default model and try again.</>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel !== DEFAULT_APP_MODEL ? (
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={useDefaultModel}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      Use default model ({MODEL_OPTIONS.find(m => m.value === DEFAULT_APP_MODEL)?.label ?? 'OpenAI'})
                    </Button>
                  ) : null}
                  <Button type="button" variant="outline" size="sm" onClick={dismissModelError}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </Alert>
          )}

          {/* Use default model (OpenAI) with key from ENV */}
          <div className="flex flex-col gap-2 rounded-lg border p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <Checkbox
                id="useDefaultModelFromEnv"
                checked={!!form.watch('useDefaultModelFromEnv')}
                onCheckedChange={(c) => form.setValue('useDefaultModelFromEnv', !!c)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="useDefaultModelFromEnv"
                  className="text-base font-semibold cursor-pointer leading-tight"
                >
                  Use default model (OpenAI) with key from environment
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, all generations use OpenAI (GPT-4o) with <code className="px-1.5 py-0.5 bg-muted rounded text-xs">OPENAI_API_KEY</code> from your environment. The selected model and stored API keys are ignored. Useful when the selected model fails (e.g. quota) or you prefer a central ENV key.
                </p>
              </div>
            </div>
          </div>
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
            if (!selectedModel) return null;

            const modelsToShow = MODEL_OPTIONS.filter(m => m.value === selectedModel);

            return modelsToShow.map((modelOption) => {
              const model = modelOption.value;

              if (modelOption.comingSoon) {
                return (
                  <Alert key={model} className="bg-muted/50 border-muted-foreground/20">
                    <AlertDescription className="text-sm">
                      <strong className="text-foreground">{modelOption.label}</strong>
                      <span className="text-muted-foreground"> — Coming Soon. No publicly available API key yet.</span>
                    </AlertDescription>
                  </Alert>
                );
              }

              const apiKey = form.watch(`apiKeys.${model}`) || '';
              const isVisible = visibleKeys[model];
              const configured = apiKeyConfigured[model];
              const placeholder = configured
                ? 'Key configured • Enter new key to change'
                : `Enter ${modelOption.label} API key`;

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
                        type={isVisible ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => form.setValue(`apiKeys.${model}`, e.target.value)}
                        placeholder={placeholder}
                        className="pr-12 h-11 text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-9 px-3 hover:bg-muted"
                        onClick={() => toggleKeyVisibility(model)}
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      title={isMaskedOrPlaceholder(apiKey) ? 'Enter your API key to validate.' : undefined}
                      onClick={() => {
                        const key = form.getValues(`apiKeys.${model}`) ?? '';
                        validateApiKey(model, key);
                      }}
                      disabled={validatingKey === model || isMaskedOrPlaceholder(apiKey)}
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
      {form.watch('selectedModel') && !selectedModelInfo?.comingSoon && (
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
                value={form.watch('modelConfig')?.[selectedModel!]?.model ?? defaultModel}
                onChange={(e) => {
                  if (!selectedModel) return;
                  const cfg = { ...(form.getValues('modelConfig') ?? {}) };
                  const cur = cfg[selectedModel] ?? {};
                  cfg[selectedModel] = { ...cur, model: e.target.value };
                  form.setValue('modelConfig', cfg);
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
                value={form.watch('modelConfig')?.[selectedModel!]?.temperature ?? 0.7}
                onChange={(e) => {
                  if (!selectedModel) return;
                  const cfg = { ...(form.getValues('modelConfig') ?? {}) };
                  const cur = cfg[selectedModel] ?? {};
                  cfg[selectedModel] = { ...cur, temperature: parseFloat(e.target.value) };
                  form.setValue('modelConfig', cfg);
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
