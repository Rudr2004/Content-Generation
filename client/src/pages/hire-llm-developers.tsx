import { useEffect, useState } from "react";
import { HireLLMDeveloperPage } from "@/components/hire-llm-developer-page";
import { LoaderCircle } from "lucide-react";

export default function HireLLMDevelopersPage() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the page title
    document.title = "Hire Expert LLM Developers | Build Advanced AI Solutions | GreenAppleX";
    
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/hire-developer-pages');
        if (!response.ok) {
          throw new Error('Failed to fetch hire developer pages');
        }
        const pages = await response.json();
        
        // Find the LLM page
        const llmPage = pages.find((page: any) => 
          page.developer_type === 'LLM' || 
          page.title?.toLowerCase().includes('llm')
        );
        
        if (llmPage) {
          console.log('Found LLM page:', llmPage);
          // Try reference_content first, then content field
          let parsedContent = null;
          
          if (llmPage.reference_content) {
            try {
              parsedContent = typeof llmPage.reference_content === 'string' 
                ? JSON.parse(llmPage.reference_content) 
                : llmPage.reference_content;
              console.log('Using reference_content:', parsedContent);
            } catch (e) {
              console.error('Error parsing reference_content:', e);
            }
          }
          
          // If reference_content fails, try content field
          if (!parsedContent && llmPage.content) {
            try {
              parsedContent = typeof llmPage.content === 'string' 
                ? JSON.parse(llmPage.content) 
                : llmPage.content;
              console.log('Using content field:', parsedContent);
            } catch (e) {
              console.error('Error parsing content:', e);
            }
          }
          
          if (parsedContent) {
            setContent(parsedContent);
          } else {
            throw new Error('Unable to parse LLM developer page content');
          }
        } else {
          throw new Error('LLM developer page not found');
        }
      } catch (err) {
        console.error('Error fetching hire LLM developer content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading hire developer content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Content Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Content Available</h1>
          <p className="text-gray-600 dark:text-gray-400">The hire developer content is not yet available.</p>
        </div>
      </div>
    );
  }

  return <HireLLMDeveloperPage content={content} />;
}