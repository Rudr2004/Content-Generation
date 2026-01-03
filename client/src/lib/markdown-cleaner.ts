/**
 * Utility functions to clean and normalize markdown input
 * Fixes common issues like spaces in markdown syntax
 */

/**
 * Cleans markdown text by normalizing spacing and fixing common issues
 * Examples:
 * - "** word **" → "**word**"
 * - "* text *" → "*text*" 
 * - "[ link ]( url )" → "[link](url)"
 */
export function cleanMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Fix bold formatting: ** word ** → **word**
  cleaned = cleaned.replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**');
  
  // Fix italic formatting: * word * → *word*
  cleaned = cleaned.replace(/\*\s+([^*]+?)\s+\*/g, '*$1*');
  
  // Fix underline formatting: __ word __ → __word__
  cleaned = cleaned.replace(/__\s+([^_]+?)\s+__/g, '__$1__');
  
  // Fix links: [ text ]( url ) → [text](url)
  cleaned = cleaned.replace(/\[\s*([^\]]+?)\s*\]\s*\(\s*([^)]+?)\s*\)/g, '[$1]($2)');
  
  // Fix code: ` code ` → `code`
  cleaned = cleaned.replace(/`\s+([^`]+?)\s+`/g, '`$1`');
  
  // Fix multiple spaces around markdown
  cleaned = cleaned.replace(/\*\*\s*\*\*/g, ''); // Remove empty bold
  cleaned = cleaned.replace(/\*\s*\*/g, ''); // Remove empty italic
  cleaned = cleaned.replace(/__\s*__/g, ''); // Remove empty underline
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Validates if markdown syntax is properly formed
 * Returns true if the markdown appears to be valid
 */
export function isValidMarkdown(text: string): boolean {
  if (!text) return true;
  
  // Check for unclosed bold markers
  const boldCount = (text.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) return false;
  
  // Check for unclosed italic markers (but exclude bold markers)
  const textWithoutBold = text.replace(/\*\*[^*]*\*\*/g, '');
  const italicCount = (textWithoutBold.match(/\*/g) || []).length;
  if (italicCount % 2 !== 0) return false;
  
  // Check for unclosed underline markers
  const underlineCount = (text.match(/__/g) || []).length;
  if (underlineCount % 2 !== 0) return false;
  
  return true;
}

/**
 * Removes all markdown formatting and returns plain text
 */
export function stripMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/__(.*?)__/g, '$1')     // Remove underline
    .replace(/`(.*?)`/g, '$1')       // Remove inline code
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, '')) // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/^#{1,6}\s/gm, '')      // Remove headings
    .replace(/^[-*+]\s/gm, '')       // Remove bullet lists
    .replace(/^\d+\.\s/gm, '')       // Remove numbered lists
    .replace(/^>\s/gm, '')           // Remove blockquotes
    .trim();
}