import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Underline, Link, X, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Code, Eraser, Eye, FileText, Undo, Redo } from 'lucide-react';
import { InlineMarkdown } from '@/components/ui/inline-markdown';
import { cleanMarkdown } from '@/lib/markdown-cleaner';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

interface FormatToolbarProps {
  visible: boolean;
  position: { x: number; y: number };
  onFormat: (format: 'bold' | 'italic' | 'underline' | 'link' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code' | 'clear') => void;
  onClose: () => void;
}

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  selectedText: string;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onInsert, selectedText }) => {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState(selectedText);

  useEffect(() => {
    if (isOpen) {
      setLinkText(selectedText);
      setUrl('');
    }
  }, [isOpen, selectedText]);

  const handleInsert = () => {
    if (url.trim() && linkText.trim()) {
      onInsert(url.trim(), linkText.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Enter link text"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={handleInsert} disabled={!url.trim() || !linkText.trim()}>
            Insert Link
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormatToolbar: React.FC<FormatToolbarProps> = ({ visible, position, onFormat, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 flex flex-wrap items-center gap-1 max-w-sm"
      style={{
        left: position.x,
        top: position.y - 60,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Text formatting */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('bold')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('italic')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('underline')}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('h1')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('h2')}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('h3')}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists and extras */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('ul')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('ol')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('quote')}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('code')}
          className="h-8 w-8 p-0"
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('link')}
          className="h-8 w-8 p-0"
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onFormat('clear')}
          className="h-8 w-8 p-0"
          title="Clear Formatting"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8 p-0 ml-1 border-l border-gray-200"
          title="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  rows = 6,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getSelectionCoordinates = () => {
    if (!textareaRef.current) return { x: 0, y: 0 };

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return { x: 0, y: 0 };

    // Create a temporary div to measure text position
    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.font = style.font;
    div.style.fontSize = style.fontSize;
    div.style.lineHeight = style.lineHeight;
    div.style.padding = style.padding;
    div.style.border = style.border;
    div.style.width = `${textarea.clientWidth}px`;

    document.body.appendChild(div);

    const beforeSelection = value.substring(0, start);
    const selection = value.substring(start, end);

    div.textContent = beforeSelection;
    const beforeHeight = div.offsetHeight;

    div.textContent = beforeSelection + selection;
    const afterHeight = div.offsetHeight;

    document.body.removeChild(div);

    // Calculate approximate position
    const lineHeight = parseInt(style.lineHeight) || 20;
    const lines = beforeSelection.split('\n').length - 1;
    const approximateY = rect.top + (lines * lineHeight) + (lineHeight / 2);
    const approximateX = rect.left + rect.width / 2;

    return {
      x: approximateX,
      y: approximateY,
    };
  };

  const handleMouseUp = () => {
    if (!textareaRef.current || disabled) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selected = value.substring(start, end);
      setSelectedText(selected);
      setSelectionStart(start);
      setSelectionEnd(end);

      const coordinates = getSelectionCoordinates();
      setToolbarPosition(coordinates);
      setToolbarVisible(true);
    } else {
      setToolbarVisible(false);
    }
  };

  const handleDoubleClick = () => {
    if (disabled) return;
    handleMouseUp();
  };

  const addToHistory = (newValue: string) => {
    if (newValue !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleFormat = (format: 'bold' | 'italic' | 'underline' | 'link' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code' | 'clear') => {
    if (!textareaRef.current) return;

    if (format === 'link') {
      setLinkModalOpen(true);
      return;
    }

    let formattedText = '';
    const selected = selectedText;

    switch (format) {
      case 'bold':
        formattedText = `**${selected}**`;
        break;
      case 'italic':
        formattedText = `*${selected}*`;
        break;
      case 'underline':
        formattedText = `<u>${selected}</u>`;
        break;
      case 'h1':
        formattedText = `# ${selected}`;
        break;
      case 'h2':
        formattedText = `## ${selected}`;
        break;
      case 'h3':
        formattedText = `### ${selected}`;
        break;
      case 'ul':
        const bulletItems = selected.split('\n').map(line => line.trim() ? `- ${line.trim()}` : '').filter(Boolean);
        formattedText = bulletItems.length ? bulletItems.join('\n') : `- ${selected}`;
        break;
      case 'ol':
        const numberedItems = selected.split('\n').map((line, index) => line.trim() ? `${index + 1}. ${line.trim()}` : '').filter(Boolean);
        formattedText = numberedItems.length ? numberedItems.join('\n') : `1. ${selected}`;
        break;
      case 'quote':
        formattedText = `> ${selected}`;
        break;
      case 'code':
        formattedText = selected.includes('\n') ? `\`\`\`\n${selected}\n\`\`\`` : `\`${selected}\``;
        break;
      case 'clear':
        // Remove common markdown formatting
        formattedText = selected
          .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
          .replace(/\*(.*?)\*/g, '$1')     // Italic
          .replace(/<u>(.*?)<\/u>/g, '$1') // Underline
          .replace(/^#{1,6}\s/gm, '')      // Headings
          .replace(/^[-*+]\s/gm, '')       // Bullets
          .replace(/^\d+\.\s/gm, '')       // Numbers
          .replace(/^>\s/gm, '')           // Quotes
          .replace(/`(.*?)`/g, '$1')       // Inline code
          .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, '')) // Code blocks
          .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
        break;
    }

    const newValue = value.substring(0, selectionStart) + formattedText + value.substring(selectionEnd);
    onChange(newValue);
    addToHistory(newValue);

    // Update cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = selectionStart + formattedText.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);

    setToolbarVisible(false);
  };

  const handleLinkInsert = (url: string, linkText: string) => {
    if (!textareaRef.current) return;

    const linkMarkdown = `[${linkText}](${url})`;
    const newValue = value.substring(0, selectionStart) + linkMarkdown + value.substring(selectionEnd);
    onChange(newValue);

    // Update cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = selectionStart + linkMarkdown.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);

    setToolbarVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    // Clean the markdown when user is typing or pasting
    const cleanedValue = cleanMarkdown(rawValue);
    
    // Only update if the cleaned value is different from raw input
    // This prevents infinite loops but still cleans up bad formatting
    if (cleanedValue !== rawValue && cleanedValue.length > 0) {
      // Use setTimeout to avoid cursor position issues
      setTimeout(() => {
        if (textareaRef.current) {
          const cursorPos = textareaRef.current.selectionStart;
          onChange(cleanedValue);
          addToHistory(cleanedValue);
          // Restore cursor position
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = Math.min(cursorPos, cleanedValue.length);
              textareaRef.current.selectionEnd = Math.min(cursorPos, cleanedValue.length);
            }
          }, 0);
        }
      }, 100);
    } else {
      onChange(rawValue);
      addToHistory(rawValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Hide toolbar on typing
    if (toolbarVisible) {
      setToolbarVisible(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding toolbar to allow clicking on toolbar buttons
    setTimeout(() => {
      setToolbarVisible(false);
    }, 150);
  };

  // Render preview content using InlineMarkdown component
  const renderPreview = () => {
    if (!value.trim()) return <p className="text-gray-500 p-4 border rounded-md bg-gray-50 min-h-[100px]">No content to preview</p>;
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 min-h-[100px] prose prose-sm max-w-none">
        <InlineMarkdown className="text-sm text-gray-700 leading-relaxed">
          {value}
        </InlineMarkdown>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={showPreview ? "default" : "outline"}
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <Tabs value={showPreview ? "preview" : "edit"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" onClick={() => setShowPreview(false)}>
              <FileText className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="mt-4">
            {/* Persistent Formatting Toolbar */}
            <div className="border border-gray-200 rounded-lg bg-white mb-2">
              <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200">
                {/* Text formatting */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('bold')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('italic')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('underline')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('h1')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Heading 1"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('h2')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Heading 2"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('h3')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Heading 3"
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lists and extras */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('ul')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('ol')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('quote')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('code')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Code"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('link')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Add Link"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFormat('clear')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Clear Formatting"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onMouseUp={handleMouseUp}
                  onDoubleClick={handleDoubleClick}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={placeholder || "Start typing your content here..."}
                  rows={rows}
                  disabled={disabled}
                  className={cn(
                    "w-full rounded-none rounded-b-md border-0 bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
                    className
                  )}
                  style={{ minHeight: `${(rows || 6) * 1.5}rem` }}
                />
                
                {/* Selection-based toolbar still available for quick access */}
                <FormatToolbar
                  visible={toolbarVisible}
                  position={toolbarPosition}
                  onFormat={handleFormat}
                  onClose={() => setToolbarVisible(false)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPreview()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <LinkModal
          isOpen={linkModalOpen}
          onClose={() => setLinkModalOpen(false)}
          onInsert={handleLinkInsert}
          selectedText={selectedText}
        />

        {/* Enhanced Formatting Guide */}
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-gray-600 space-y-2">
              <p className="font-medium">Quick Formatting Guide:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <code className="bg-gray-100 px-1 rounded">**bold text**</code> - Bold
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">*italic text*</code> - Italic
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">&lt;u&gt;underlined&lt;/u&gt;</code> - Underline
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded"># Heading 1</code> - Large heading
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">## Heading 2</code> - Medium heading
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">- List item</code> - Bullet point
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">1. Numbered</code> - Numbered list
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">&gt; Quote</code> - Blockquote
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">`code`</code> - Inline code
                </div>
                <div>
                  <code className="bg-gray-100 px-1 rounded">[text](url)</code> - Link
                </div>
              </div>
              <p className="text-blue-600 mt-2">
                💡 Tip: Select any text and use the formatting toolbar for easy editing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};