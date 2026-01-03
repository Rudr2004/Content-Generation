import OpenAI from 'openai';

// Create a safe OpenAI client that handles missing API keys gracefully
let openai: OpenAI | null = null;

// Initialize OpenAI client only if API key is available
const initializeOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (apiKey && apiKey.trim() !== '') {
    openai = new OpenAI({
      apiKey: apiKey,
    });
    console.log("✅ OpenAI client initialized successfully");
  } else {
    console.log("⚠️  OPENAI_API_KEY not configured. AI features will be disabled.");
  }
};

// Initialize on module load
initializeOpenAI();

export const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    throw new Error("OpenAI client is not available. Please configure OPENAI_API_KEY environment variable.");
  }
  return openai;
};

export const isOpenAIAvailable = (): boolean => {
  return openai !== null;
};

export default openai;