/**
 * Link Scanner Utility for Backlinks Management
 * Extracts and parses links from HTML content with context
 */
import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';

export interface ExtractedLink {
  linkId: string;
  href: string;
  anchorText: string;
  title?: string;
  rel?: string[];
  target?: string;
  contextBefore: string;
  contextAfter: string;
  position: number;
  isInternal: boolean;
  isExternal: boolean;
}

export interface ScanResult {
  links: ExtractedLink[];
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
}

/**
 * Extract all links from HTML content with surrounding context
 */
export function scanHTMLForLinks(htmlContent: string, baseUrl: string = 'https://greenapplex.com'): ScanResult {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return { links: [], totalLinks: 0, internalLinks: 0, externalLinks: 0 };
  }

  const $ = cheerio.load(htmlContent);
  const extractedLinks: ExtractedLink[] = [];
  let position = 0;

  $('a[href]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr('href') || '';
    
    // Skip empty or javascript: links
    if (!href || href.startsWith('javascript:') || href === '#') {
      return;
    }

    // Get anchor text
    const anchorText = $link.text().trim() || href;
    
    // Get other attributes
    const title = $link.attr('title');
    const relAttr = $link.attr('rel');
    const rel = relAttr ? relAttr.split(' ').filter(Boolean) : [];
    const target = $link.attr('target');

    // Determine if link is internal or external
    const isInternal = href.startsWith('/') || href.startsWith(baseUrl) || href.startsWith('.');
    const isExternal = href.startsWith('http') && !href.startsWith(baseUrl);

    // Get surrounding context (50 chars before and after)
    const parent = $link.parent();
    const fullText = parent.text() || '';
    const linkText = $link.text() || '';
    const linkIndex = fullText.indexOf(linkText);
    
    const contextBefore = linkIndex > 0 
      ? fullText.substring(Math.max(0, linkIndex - 50), linkIndex).trim()
      : '';
    
    const contextAfter = linkIndex >= 0
      ? fullText.substring(linkIndex + linkText.length, Math.min(fullText.length, linkIndex + linkText.length + 50)).trim()
      : '';

    extractedLinks.push({
      linkId: randomUUID(),
      href: normalizeUrl(href, baseUrl),
      anchorText,
      title,
      rel,
      target,
      contextBefore,
      contextAfter,
      position: position++,
      isInternal,
      isExternal
    });
  });

  return {
    links: extractedLinks,
    totalLinks: extractedLinks.length,
    internalLinks: extractedLinks.filter(l => l.isInternal).length,
    externalLinks: extractedLinks.filter(l => l.isExternal).length
  };
}

/**
 * Normalize URL to full absolute URL
 */
function normalizeUrl(url: string, baseUrl: string): string {
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Protocol-relative URL
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  // Absolute path
  if (url.startsWith('/')) {
    return baseUrl + url;
  }
  
  // Relative path - for now just prepend base
  return baseUrl + '/' + url;
}

/**
 * Update links in HTML content
 * Replaces old href with new href and optionally updates anchor text
 */
export function updateLinksInHTML(
  htmlContent: string,
  updates: { oldHref: string; newHref?: string; newAnchorText?: string; position: number }[]
): string {
  if (!htmlContent || !updates || updates.length === 0) {
    return htmlContent;
  }

  const $ = cheerio.load(htmlContent);
  let currentPosition = 0;

  $('a[href]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr('href') || '';
    
    // Find matching update
    const update = updates.find(u => 
      u.position === currentPosition && 
      (href === u.oldHref || normalizeUrl(href, 'https://greenapplex.com') === u.oldHref)
    );

    if (update) {
      // Update href if provided
      if (update.newHref) {
        $link.attr('href', update.newHref);
      }
      
      // Update anchor text if provided
      if (update.newAnchorText) {
        $link.text(update.newAnchorText);
      }
    }

    currentPosition++;
  });

  return $.html();
}

/**
 * Remove specific links from HTML content
 * Options: remove-link (keep text) or remove-all (remove entire link and text)
 */
export function removeLinksFromHTML(
  htmlContent: string,
  positions: number[],
  mode: 'remove-link' | 'remove-all' = 'remove-link'
): string {
  if (!htmlContent || !positions || positions.length === 0) {
    return htmlContent;
  }

  const $ = cheerio.load(htmlContent);
  let currentPosition = 0;

  $('a[href]').each((_, element) => {
    const $link = $(element);
    
    if (positions.includes(currentPosition)) {
      if (mode === 'remove-link') {
        // Keep the text, remove the link
        const text = $link.text();
        $link.replaceWith(text);
      } else {
        // Remove both link and text
        $link.remove();
      }
    }

    currentPosition++;
  });

  return $.html();
}

/**
 * Compare two HTML contents and find link differences
 */
export function detectLinkChanges(
  oldHtml: string,
  newHtml: string,
  baseUrl: string = 'https://greenapplex.com'
): {
  added: ExtractedLink[];
  removed: ExtractedLink[];
  modified: ExtractedLink[];
} {
  const oldLinks = scanHTMLForLinks(oldHtml, baseUrl).links;
  const newLinks = scanHTMLForLinks(newHtml, baseUrl).links;

  const added: ExtractedLink[] = [];
  const removed: ExtractedLink[] = [];
  const modified: ExtractedLink[] = [];

  // Find added and modified links
  newLinks.forEach(newLink => {
    const oldLink = oldLinks.find((ol, idx) => 
      idx === newLink.position && ol.position === newLink.position
    );

    if (!oldLink) {
      added.push(newLink);
    } else if (
      oldLink.href !== newLink.href || 
      oldLink.anchorText !== newLink.anchorText
    ) {
      modified.push(newLink);
    }
  });

  // Find removed links
  oldLinks.forEach(oldLink => {
    const newLink = newLinks.find((nl, idx) => 
      idx === oldLink.position && nl.position === oldLink.position
    );

    if (!newLink) {
      removed.push(oldLink);
    }
  });

  return { added, removed, modified };
}
