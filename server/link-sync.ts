import { load as cheerioLoad } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import type { IStorage } from './storage';

export interface ExtractedLink {
  url: string;
  displayText: string;
  position: number;
}

export class LinkSyncManager {
  private storage: IStorage;
  private siteOrigin: string;

  constructor(storage: IStorage, siteOrigin: string = 'https://www.greenapplex.com') {
    this.storage = storage;
    this.siteOrigin = siteOrigin;
  }

  /**
   * Normalize a URL for consistent comparison
   * CRITICAL: Always returns pathname-only format for internal links to prevent duplicates
   */
  normalizeUrl(url: string): string {
    try {
      // Handle empty or invalid URLs
      if (!url || typeof url !== 'string') return '';
      
      // Ignore mailto, tel, javascript: URLs
      if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) {
        return '';
      }

      // Handle relative URLs - already in canonical form
      if (url.startsWith('/')) {
        return url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
      }

      // Handle full URLs
      const urlObj = new URL(url);
      const siteHost = new URL(this.siteOrigin).hostname.toLowerCase();
      
      // If this is an internal link (same host), return pathname-only canonical form
      if (urlObj.hostname.toLowerCase() === siteHost) {
        return urlObj.pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
      }
      
      // For external links, return full URL (lowercase hostname, no trailing slash, no query/hash)
      return `${urlObj.protocol}//${urlObj.hostname.toLowerCase()}${urlObj.pathname}`.replace(/\/+$/, '');
    } catch (e) {
      // If URL parsing fails, return cleaned version
      return url.split('?')[0].split('#')[0].replace(/\/+$/, '');
    }
  }

  /**
   * Determine if a URL is internal or external
   */
  getLinkType(url: string): 'internal' | 'external' {
    if (url.startsWith('/')) return 'internal';
    try {
      const urlObj = new URL(url);
      const siteHost = new URL(this.siteOrigin).hostname.toLowerCase();
      return urlObj.hostname.toLowerCase() === siteHost ? 'internal' : 'external';
    } catch {
      return 'external';
    }
  }

  /**
   * Extract links from HTML content
   */
  extractLinksFromHtml(html: string): ExtractedLink[] {
    if (!html) return [];
    
    const links: ExtractedLink[] = [];
    const $ = cheerioLoad(html);
    
    $('a[href]').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (href && href !== '#') {
        const normalized = this.normalizeUrl(href);
        if (normalized) {
          links.push({
            url: normalized,
            displayText: text || href,
            position: index
          });
        }
      }
    });
    
    return links;
  }

  /**
   * Extract links from Markdown content
   */
  extractLinksFromMarkdown(markdown: string): ExtractedLink[] {
    if (!markdown) return [];
    
    const links: ExtractedLink[] = [];
    // Match markdown links: [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let position = 0;
    
    while ((match = markdownLinkRegex.exec(markdown)) !== null) {
      const text = match[1];
      const url = match[2];
      const normalized = this.normalizeUrl(url);
      
      if (normalized) {
        links.push({
          url: normalized,
          displayText: text,
          position: position++
        });
      }
    }
    
    // Also match HTML links within markdown
    const htmlLinks = this.extractLinksFromHtml(markdown);
    links.push(...htmlLinks.map(link => ({
      ...link,
      position: position++
    })));
    
    return links;
  }

  /**
   * Extract links from content based on format
   */
  extractLinks(content: string, format: 'html' | 'markdown' = 'html'): ExtractedLink[] {
    if (format === 'markdown') {
      return this.extractLinksFromMarkdown(content);
    }
    return this.extractLinksFromHtml(content);
  }

  /**
   * Upsert a central link record
   * IMPORTANT: Checks for unique combination of (targetUrl + displayText)
   * Same URL with different anchor text should be separate records
   */
  async upsertCentralLink(url: string, displayText: string, category?: string): Promise<string> {
    const normalized = this.normalizeUrl(url);
    const linkType = this.getLinkType(normalized);
    const finalDisplayText = displayText || url;
    
    // Check if the exact combination of URL + displayText already exists
    // This allows the same URL with different anchor text to be separate records
    const allLinksForUrl = await this.storage.getCentralLinksByTargetUrl(normalized);
    const existing = allLinksForUrl.find(link => link.displayText === finalDisplayText);
    
    if (existing) {
      // Return existing link ID only if both URL AND displayText match
      return existing.linkId;
    }
    
    // Create new link - same URL with different displayText will be a separate record
    const linkId = uuidv4();
    
    try {
      await this.storage.createCentralLink({
        linkId,
        targetUrl: normalized,
        displayText: finalDisplayText,
        linkType,
        category: category || 'content',
        status: 'active',
        validationStatus: 'pending',
        isTracked: true,
        priority: 5
      });
      
      return linkId;
    } catch (error: any) {
      // Handle race condition: if another process created the same link
      // Re-fetch and return the existing linkId
      if (error.code === '23505') { // Unique constraint violation
        const refetchedLinks = await this.storage.getCentralLinksByTargetUrl(normalized);
        const refetchedExisting = refetchedLinks.find(link => link.displayText === finalDisplayText);
        if (refetchedExisting) {
          return refetchedExisting.linkId;
        }
      }
      throw error;
    }
  }

  /**
   * Upsert a link usage mapping
   */
  async upsertLinkUsage(params: {
    linkId: string;
    contentType: 'blog' | 'service' | 'hire' | 'case-study' | 'service-detail' | 'industry';
    contentId: string | number;
    contentTitle: string;
    fieldName: string;
    position: number;
  }): Promise<void> {
    const { linkId, contentType, contentId, contentTitle, fieldName, position } = params;
    
    try {
      // Check if usage already exists
      const existingUsages = await this.storage.getLinkUsagesByContent(contentType, contentId);
      const existingUsage = existingUsages.find(
        u => u.linkId === linkId && u.fieldName === fieldName
      );
      
      if (existingUsage) {
        // Update existing usage
        await this.storage.updateLinkUsage(existingUsage.id, {
          isActive: true,
          syncStatus: 'synced',
          position
        });
      } else {
        // Create new usage
        await this.storage.createLinkUsage({
          linkId,
          contentType,
          contentId,
          contentTitle,
          fieldName,
          usageType: 'content',
          position,
          isActive: true,
          syncStatus: 'synced'
        });
      }
    } catch (error: any) {
      // If it's a duplicate key error, silently ignore it (means another process already created it)
      if (error?.code === '23505') {
        console.log(`[LinkSync] Duplicate link usage already exists for ${linkId} in ${contentType} ${contentId}, skipping`);
        return;
      }
      throw error;
    }
  }

  /**
   * Sync links for a specific content item
   * This is the main function to call after content is saved
   */
  async syncLinksForContent(
    contentType: 'blog' | 'service' | 'hire' | 'case-study' | 'service-detail' | 'industry',
    contentId: string | number,
    content: string,
    contentTitle: string,
    fieldName: string = 'content',
    format: 'html' | 'markdown' = 'html'
  ): Promise<{ added: number; removed: number }> {
    console.log(`[LinkSync] Syncing links for ${contentType} ${contentId} (${contentTitle})`);
    
    // Extract links from content
    const extractedLinks = this.extractLinks(content, format);
    console.log(`[LinkSync] Found ${extractedLinks.length} links in content`);
    
    // Get existing usages for this content
    const existingUsages = await this.storage.getLinkUsagesByContent(contentType, contentId);
    const existingLinkIds = new Set(existingUsages.map(u => u.linkId));
    
    // Track changes
    let added = 0;
    let removed = 0;
    
    // Upsert links and create/update usages
    const currentLinkIds = new Set<string>();
    
    for (const link of extractedLinks) {
      try {
        // Upsert central link
        const linkId = await this.upsertCentralLink(
          link.url,
          link.displayText,
          contentType
        );
        currentLinkIds.add(linkId);
        
        // Always upsert usage mapping (will reactivate if previously inactive)
        const wasExisting = existingLinkIds.has(linkId);
        // Convert MongoDB ObjectId string to numeric hash for storage
        let storageContentId: string | number = contentId;
        if (typeof contentId === 'string' && /^[0-9a-fA-F]{24}$/.test(contentId)) {
          // For MongoDB ObjectId strings, convert to numeric hash for legacy compatibility
          storageContentId = parseInt(contentId.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0;
        }
        await this.upsertLinkUsage({
          linkId,
          contentType,
          contentId: storageContentId,
          contentTitle,
          fieldName,
          position: link.position
        });
        
        // Count as added only if it's a new link
        if (!wasExisting) {
          added++;
        }
      } catch (error) {
        console.error(`[LinkSync] Error processing link ${link.url}:`, error);
      }
    }
    
    // Mark removed links as inactive
    for (const usage of existingUsages) {
      if (!currentLinkIds.has(usage.linkId)) {
        await this.storage.updateLinkUsage(usage.id, {
          isActive: false,
          syncStatus: 'synced'
        });
        removed++;
      }
    }
    
    console.log(`[LinkSync] Sync complete: ${added} added, ${removed} removed`);
    return { added, removed };
  }

  /**
   * Propagate link changes back to content
   * This is called when a link is modified in the Backlinks tab
   */
  async propagateLinksToContent(
    linkId: string,
    newUrl?: string,
    newDisplayText?: string
  ): Promise<{ updated: number; errors: string[] }> {
    console.log(`[LinkSync] Propagating link changes for ${linkId}`);
    
    // Get the link details
    const link = await this.storage.getCentralLink(linkId);
    if (!link) {
      throw new Error(`Link not found: ${linkId}`);
    }
    
    const oldUrl = link.targetUrl;
    const oldDisplayText = link.displayText;
    
    // Get all usages of this link
    const usages = await this.storage.getLinkUsagesByLink(linkId);
    console.log(`[LinkSync] Found ${usages.length} usages to update`);
    
    const errors: string[] = [];
    let updated = 0;
    
    for (const usage of usages) {
      try {
        // Load the content
        let content: any;
        let updateMethod: any;
        
        switch (usage.contentType) {
          case 'blog':
            content = await this.storage.getBlogPost(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateBlogPost(id, data);
            break;
          case 'service':
            content = await this.storage.getService(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateService(id, data);
            break;
          case 'hire':
            content = await this.storage.getHirePage(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateHirePage(id, data);
            break;
          case 'case-study':
            content = await this.storage.getCaseStudyPage(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateCaseStudyPage(id, data);
            break;
          default:
            console.log(`[LinkSync] Skipping unsupported content type: ${usage.contentType}`);
            continue;
        }
        
        if (!content) {
          errors.push(`Content not found: ${usage.contentType} ${usage.contentId}`);
          continue;
        }
        
        // Get the field content
        const fieldContent = content[usage.fieldName || 'content'];
        if (!fieldContent) {
          errors.push(`Field not found: ${usage.fieldName} in ${usage.contentType} ${usage.contentId}`);
          continue;
        }
        
        // Replace the link in content
        let updatedContent = fieldContent;
        const isHtmlContent = updatedContent.includes('<a ') || updatedContent.includes('<h1') || updatedContent.includes('<p>');
        
        if (newUrl && newUrl !== oldUrl) {
          const oldUrlVariants = this.getUrlVariants(oldUrl);
          
          // Replace URL in Markdown links (do this first to avoid markdown corruption)
          for (const variant of oldUrlVariants) {
            const escapedUrl = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            updatedContent = updatedContent.replace(
              new RegExp(`\\]\\(${escapedUrl}\\)`, 'g'),
              `](${newUrl})`
            );
          }
          
          // Replace URL in HTML links (only if content has HTML)
          if (isHtmlContent) {
            for (const variant of oldUrlVariants) {
              updatedContent = updatedContent.replace(
                new RegExp(`href="${variant}"`, 'g'),
                `href="${newUrl}"`
              );
            }
          }
        }
        
        if (newDisplayText && newDisplayText !== oldDisplayText) {
          // This is trickier - we'd need to parse and update text nodes
          // For now, we'll skip display text updates in content
          console.log(`[LinkSync] Skipping display text update in content`);
        }
        
        // Update the content if changed
        if (updatedContent !== fieldContent) {
          await updateMethod(usage.contentId, {
            [usage.fieldName || 'content']: updatedContent
          });
          updated++;
        }
      } catch (error: any) {
        console.error(`[LinkSync] Error updating ${usage.contentType} ${usage.contentId}:`, error);
        errors.push(`${usage.contentType} ${usage.contentId}: ${error.message}`);
      }
    }
    
    console.log(`[LinkSync] Propagation complete: ${updated} updated, ${errors.length} errors`);
    return { updated, errors };
  }

  /**
   * Generate URL variants for matching (handles different formats)
   */
  private getUrlVariants(url: string): string[] {
    const variants = [url];
    
    // Add with trailing slash if missing
    if (!url.endsWith('/')) {
      variants.push(url + '/');
    } else {
      // Add without trailing slash if present
      variants.push(url.replace(/\/$/, ''));
    }
    
    // If it's a pathname, also add absolute URL version
    if (url.startsWith('/')) {
      variants.push(`${this.siteOrigin}${url}`);
      variants.push(`${this.siteOrigin}${url}/`);
    }
    
    // If it's an absolute URL, also add pathname-only version
    try {
      const urlObj = new URL(url);
      const siteHost = new URL(this.siteOrigin).hostname.toLowerCase();
      if (urlObj.hostname.toLowerCase() === siteHost) {
        variants.push(urlObj.pathname);
        variants.push(urlObj.pathname.replace(/\/$/, ''));
      }
    } catch (e) {
      // Not a valid URL, skip
    }
    
    // Remove duplicates
    return [...new Set(variants)];
  }

  /**
   * Remove links from content when deleted
   * Converts linked text back to plain text
   */
  async removeLinksFromContent(linkId: string): Promise<{ updated: number; errors: string[] }> {
    console.log(`[LinkSync] Removing links from content for ${linkId}`);
    
    // Get the link details
    const link = await this.storage.getCentralLink(linkId);
    if (!link) {
      throw new Error(`Link not found: ${linkId}`);
    }
    
    const targetUrl = link.targetUrl;
    const urlVariants = this.getUrlVariants(targetUrl);
    console.log(`[LinkSync] URL variants to match:`, urlVariants);
    
    // Get all usages of this link
    const usages = await this.storage.getLinkUsagesByLink(linkId);
    console.log(`[LinkSync] Found ${usages.length} usages to remove`);
    
    const errors: string[] = [];
    let updated = 0;
    
    for (const usage of usages) {
      try {
        // Load the content
        let content: any;
        let updateMethod: any;
        
        switch (usage.contentType) {
          case 'blog':
            content = await this.storage.getBlogPost(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateBlogPost(id, data);
            break;
          case 'service':
            content = await this.storage.getService(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateService(id, data);
            break;
          case 'hire':
            content = await this.storage.getHirePage(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateHirePage(id, data);
            break;
          case 'case-study':
            content = await this.storage.getCaseStudyPage(usage.contentId);
            updateMethod = (id: number, data: any) => this.storage.updateCaseStudyPage(id, data);
            break;
          default:
            console.log(`[LinkSync] Skipping unsupported content type: ${usage.contentType}`);
            continue;
        }
        
        if (!content) {
          errors.push(`Content not found: ${usage.contentType} ${usage.contentId}`);
          continue;
        }
        
        // Get the field content
        const fieldContent = content[usage.fieldName || 'content'];
        if (!fieldContent) {
          errors.push(`Field not found: ${usage.fieldName} in ${usage.contentType} ${usage.contentId}`);
          continue;
        }
        
        let updatedContent = fieldContent;
        const isHtmlContent = updatedContent.includes('<a ') || updatedContent.includes('<h1') || updatedContent.includes('<p>');
        
        // First, remove Markdown links (do this before HTML parsing to avoid corruption)
        for (const variant of urlVariants) {
          const escapedUrl = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedContent = updatedContent.replace(
            new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}\\)`, 'g'),
            '$1'
          );
        }
        
        // Only parse as HTML if content actually contains HTML tags
        if (isHtmlContent) {
          // Remove HTML links - convert <a href="URL">text</a> to just text
          const $ = cheerioLoad(updatedContent);
          
          for (const variant of urlVariants) {
            $(`a[href="${variant}"]`).each((i, elem) => {
              const linkText = $(elem).text();
              $(elem).replaceWith(linkText);
            });
          }
          
          updatedContent = $.html();
        }
        
        // Update the content if changed
        if (updatedContent !== fieldContent) {
          await updateMethod(usage.contentId, {
            [usage.fieldName || 'content']: updatedContent
          });
          updated++;
          console.log(`[LinkSync] Removed link from ${usage.contentType} ${usage.contentId}`);
        }
      } catch (error: any) {
        console.error(`[LinkSync] Error removing link from ${usage.contentType} ${usage.contentId}:`, error);
        errors.push(`${usage.contentType} ${usage.contentId}: ${error.message}`);
      }
    }
    
    console.log(`[LinkSync] Link removal complete: ${updated} updated, ${errors.length} errors`);
    return { updated, errors };
  }
}
