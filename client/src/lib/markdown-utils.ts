/**
 * Utility functions for parsing markdown-style formatting to HTML using marked
 */
import { marked } from 'marked';

// Configure marked with custom renderer for better styling
const renderer = new marked.Renderer();

// Custom link renderer to add styling and target="_blank"
renderer.link = function({ href, title, tokens }: { href: string; title?: string | null; tokens: any[] }) {
  const text = this.parser.parseInline(tokens);
  const titleAttr = title ? ` title="${title}"` : '';
  
  return `<a href="${href}"  rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium"${titleAttr}>${text}</a>`;
};

// Custom heading renderer with styling
renderer.heading = function({ tokens, depth }: { tokens: any[]; depth: number }) {
  const text = this.parser.parseInline(tokens);
  const headingClasses = {
    1: 'text-3xl font-bold text-gray-900 mb-6 mt-8 heading-georgia',
    2: 'text-2xl font-bold text-gray-900 mb-4 mt-6 heading-georgia border-b border-gray-200 pb-2',
    3: 'text-xl font-bold text-gray-900 mb-3 mt-5 heading-georgia',
    4: 'text-lg font-bold text-gray-900 mb-2 mt-4 heading-georgia',
    5: 'text-base font-bold text-gray-900 mb-2 mt-3 heading-georgia',
    6: 'text-sm font-bold text-gray-900 mb-2 mt-2 heading-georgia'
  };
  
  const className = headingClasses[depth as keyof typeof headingClasses] || headingClasses[3];
  return `<h${depth} class="${className}">${text}</h${depth}>`;
};

// Custom paragraph renderer
renderer.paragraph = function({ tokens }: { tokens: any[] }) {
  const text = this.parser.parseInline(tokens);
  return `<p class="mb-4 text-base leading-[1.7] text-gray-700">${text}</p>`;
};

// Custom list renderers
renderer.list = function(token: any) {
  const ordered = token.ordered;
  const body = token.items.map((item: any) => this.listitem(item)).join('');
  const tag = ordered ? 'ol' : 'ul';
  const className = ordered 
    ? 'my-4 space-y-2 list-decimal list-inside text-gray-700'
    : 'my-4 space-y-2 list-disc list-inside text-gray-700';
  return `<${tag} class="${className}">${body}</${tag}>`;
};

renderer.listitem = function(item: any) {
  const text = item.tokens.map((token: any) => this.parser.parseInline([token])).join('');
  return `<li class="my-1">${text}</li>`;
};

// Custom blockquote renderer
renderer.blockquote = function({ tokens }: { tokens: any[] }) {
  const quote = this.parser.parse(tokens);
  return `<blockquote class="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-r-xl my-6 italic text-gray-700">${quote}</blockquote>`;
};

// Custom code block renderer
renderer.code = function({ text, lang }: { text: string; lang?: string; escaped?: boolean }) {
  return `<pre class="bg-gray-900 text-white p-6 rounded-xl overflow-x-auto my-6"><code class="font-mono">${text}</code></pre>`;
};

// Custom inline code renderer
renderer.codespan = function({ text }: { text: string }) {
  return `<code class="bg-blue-50 text-blue-800 px-2 py-1 rounded-md text-sm font-mono border border-blue-200">${text}</code>`;
};

// Custom strong (bold) renderer
renderer.strong = function({ tokens }: { tokens: any[] }) {
  const text = this.parser.parseInline(tokens);
  return `<strong class="font-semibold text-gray-900">${text}</strong>`;
};

// Custom emphasis (italic) renderer
renderer.em = function({ tokens }: { tokens: any[] }) {
  const text = this.parser.parseInline(tokens);
  return `<em class="italic text-gray-700">${text}</em>`;
};

// Configure marked options
marked.setOptions({
  renderer: renderer,
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  pedantic: false // Not too strict
});

/**
 * Converts markdown-style links [text](url) to HTML anchor tags
 * @param text - The text containing markdown-style links
 * @returns HTML string with converted links
 */
export function parseMarkdownLinks(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  // Use marked to parse just the links
  return marked.parseInline(text) as string;
}

// Clean title text by removing HTML tags, URLs, and markdown formatting
export function cleanTitleText(title: string): string {
  if (!title) return '';
  
  let cleaned = title;
  
  // Remove HTML tags first
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Handle the exact pattern from the screenshot: "Hire [Expert] (https://greenapplex.com/)Blockchain"
  // Remove [text] patterns first
  cleaned = cleaned.replace(/\[([^\]]*)\]/g, '');
  
  // Remove (URL) patterns - handle the exact format
  cleaned = cleaned.replace(/\(https?:\/\/[^)]*\)/g, '');
  cleaned = cleaned.replace(/\(www\.[^)]*\)/g, '');
  cleaned = cleaned.replace(/\([^)]*\.com[^)]*\)/g, '');
  cleaned = cleaned.replace(/\([^)]*\.org[^)]*\)/g, '');
  cleaned = cleaned.replace(/\([^)]*\.net[^)]*\)/g, '');
  
  // Remove markdown links [text](url) - keep only the text part
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  
  // Remove any remaining brackets or parentheses completely
  cleaned = cleaned.replace(/[\[\]()]/g, '');
  
  // Clean up multiple spaces and normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Sanitizes service headline/subheading content by removing HTML code snippets
 * and extracting only meaningful text content
 */
export function sanitizeServiceContent(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  let sanitized = text;
  
  // First, try to extract meaningful content from meta description if HTML code is present
  // Pattern: "Transform Your Business with ```html <!DOCTYPE... <meta name="description" content="ACTUAL TEXT" ..."
  const metaDescInHtml = sanitized.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescInHtml && metaDescInHtml[1]) {
    // If we found a meta description in HTML, use that as the content
    return metaDescInHtml[1].trim();
  }
  
  // Extract content from any content attribute in meta tags
  const contentAttrMatch = sanitized.match(/content=["']([^"']+)["']/i);
  if (contentAttrMatch && contentAttrMatch[1] && contentAttrMatch[1].length > 10) {
    // If content attribute has substantial text, use it
    const extracted = contentAttrMatch[1].trim();
    if (extracted && !extracted.includes('<!DOCTYPE') && !extracted.includes('<html')) {
      return extracted;
    }
  }
  
  // Remove everything after "with" if followed by HTML code patterns
  sanitized = sanitized.replace(/\bwith\s+```?html[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/\bwith\s+<!DOCTYPE[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/\bwith\s+<html[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/\bwith\s+<meta[\s\S]*$/gi, '');
  
  // Remove HTML code blocks (like <!DOCTYPE html>, <html>, <head>, etc.)
  // Pattern: matches code blocks starting with ```html or containing DOCTYPE/html tags
  sanitized = sanitized.replace(/```html[\s\S]*?```/gi, '');
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '');
  
  // Remove HTML document structure tags and everything after them
  sanitized = sanitized.replace(/<!DOCTYPE[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/<html[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/<head[\s\S]*$/gi, '');
  sanitized = sanitized.replace(/<body[\s\S]*$/gi, '');
  
  // Remove HTML document structure tags (standalone)
  sanitized = sanitized.replace(/<!DOCTYPE\s+html[^>]*>/gi, '');
  sanitized = sanitized.replace(/<html[^>]*>/gi, '');
  sanitized = sanitized.replace(/<\/html>/gi, '');
  sanitized = sanitized.replace(/<head[^>]*>/gi, '');
  sanitized = sanitized.replace(/<\/head>/gi, '');
  sanitized = sanitized.replace(/<body[^>]*>/gi, '');
  sanitized = sanitized.replace(/<\/body>/gi, '');
  
  // Remove meta tags and their content
  sanitized = sanitized.replace(/<meta[^>]*>/gi, '');
  
  // Remove script and style tags with their content
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove all remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  sanitized = sanitized.replace(/&nbsp;/g, ' ');
  sanitized = sanitized.replace(/&amp;/g, '&');
  sanitized = sanitized.replace(/&lt;/g, '<');
  sanitized = sanitized.replace(/&gt;/g, '>');
  sanitized = sanitized.replace(/&quot;/g, '"');
  sanitized = sanitized.replace(/&#39;/g, "'");
  sanitized = sanitized.replace(/&apos;/g, "'");
  
  // Remove any remaining code block markers
  sanitized = sanitized.replace(/```/g, '');
  sanitized = sanitized.replace(/`/g, '');
  
  // Clean up multiple spaces and normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Remove leading/trailing whitespace
  sanitized = sanitized.trim();
  
  // If the result is empty or just whitespace, return empty (let fallback handle it)
  if (!sanitized || sanitized.length < 3) {
    return '';
  }
  
  return sanitized;
}

/**
 * Enhanced function to handle rich text editor output with both HTML tags and markdown
 * Processes the text to render properly as HTML with styling
 * @param text - The text containing HTML tags and/or markdown formatting
 * @returns HTML string with converted formatting
 * Updated: Sept 30, 2025 - Fixed blog HTML corruption patterns
 */
export function parseMarkdownToHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  try {
    let processed = text;
    
    // ALWAYS convert markdown links to HTML, regardless of whether HTML tags are present
    // This fixes the issue where [text](url) appears as raw text in blog content
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors">$1</a>');
    
    // Check if content already contains HTML tags
    const hasHtmlTags = /<[^>]+>/g.test(processed);
    if (hasHtmlTags) {
      // Content already contains HTML - return with links converted
      return processed;
    }
    
    // Only apply other markdown processing if no HTML tags are present
    // Handle HTML underline tags - show line below the word
    processed = processed.replace(/<u>/g, '<span style="text-decoration: underline;">');
    processed = processed.replace(/<\/u>/g, '</span>');
    
    // Handle bold markdown - word becomes font-bold
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: bold;">$1</strong>');
    
    // Handle italic markdown - word becomes properly italic
    processed = processed.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em style="font-style: italic;">$1</em>');
    
    // Handle line breaks
    processed = processed.replace(/\n/g, '<br>');
    
    return processed;
  } catch (error) {
    console.warn('Rich text parsing error:', error);
    return text;
  }
}



/**
 * Simple function to get HTML string for rendering
 * Use with dangerouslySetInnerHTML in components
 * @param content - The markdown content to render
 * @returns HTML string ready for dangerouslySetInnerHTML
 */
export function getMarkdownHtml(content: string): string {
  return parseMarkdownToHtml(content);
}

/**
 * Safely parses JSON string with error handling
 * Returns default value if parsing fails or input is invalid
 * @param jsonString - The JSON string to parse
 * @param defaultValue - The default value to return if parsing fails
 * @returns Parsed JSON object or default value
 */
export function safeJsonParse<T = any>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }
  
  const trimmed = jsonString.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '') {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(trimmed);
    return parsed as T;
  } catch (error) {
    console.warn('JSON parse error:', error, 'Input:', jsonString);
    return defaultValue;
  }
}