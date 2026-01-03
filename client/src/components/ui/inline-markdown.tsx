import ReactMarkdown from 'react-markdown';
import { cleanMarkdown, isValidMarkdown } from '@/lib/markdown-cleaner';

interface InlineMarkdownProps {
  children: string;
  className?: string;
}

/**
 * Renders markdown content with inline formatting only (bold, italic, links)
 * Preserves parent typography classes without adding heading or paragraph styles
 * Automatically cleans and normalizes markdown input
 */
export function InlineMarkdown({ children, className }: InlineMarkdownProps) {
  if (!children || typeof children !== 'string') {
    return null;
  }

  // Clean the markdown to fix common spacing issues
  const cleanedMarkdown = cleanMarkdown(children);

  // If markdown is invalid, show cleaned plain text
  if (!isValidMarkdown(cleanedMarkdown)) {
    console.warn('Invalid markdown detected, showing plain text:', children);
    return <span className={className}>{cleanedMarkdown.replace(/[*_`#\[\]()]/g, '')}</span>;
  }

  return (
    <span className={className}>
      <ReactMarkdown
        components={{
          // Remove paragraph wrapper - just return the children
          p: ({ children }) => <>{children}</>,

          // Remove heading styling - just return the text content
          h1: ({ children }) => <>{children}</>,
          h2: ({ children }) => <>{children}</>,
          h3: ({ children }) => <>{children}</>,
          h4: ({ children }) => <>{children}</>,
          h5: ({ children }) => <>{children}</>,
          h6: ({ children }) => <>{children}</>,

          // Keep inline formatting with minimal styling
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),

          // Style links to be consistent but distinguishable
          a: ({ href, children }) => (
            <a
              href={href}
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              {children}
            </a>
          ),

          // Keep lists but with minimal styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,

          // Remove code block styling - just return text
          pre: ({ children }) => <>{children}</>,
          code: ({ children, className }) => {
            // Check if it's inline code (no className) vs code block
            if (!className) {
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            // For code blocks, just return the text
            return <>{children}</>;
          },

          // Remove blockquote styling
          blockquote: ({ children }) => <>{children}</>,

          // Remove break styling
          br: () => <br />,

          // Remove hr styling  
          hr: () => null,

          // Remove image rendering for security
          img: () => null,
        }}
        // Disable HTML parsing for security
        disallowedElements={['script', 'iframe', 'object', 'embed']}
        unwrapDisallowed={true}
      >
        {cleanedMarkdown}
      </ReactMarkdown>
    </span>
  );
}