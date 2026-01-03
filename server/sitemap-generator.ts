import fs from 'fs';
import path from 'path';
import type { IStorage } from './storage';

export class SitemapGenerator {
  private storage: IStorage;
  private baseUrl: string;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.baseUrl = 'https://greenapplex.com';
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private createUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
    return `  <url>
    <loc>${this.baseUrl}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  async generateSitemap(): Promise<void> {
    try {
      const currentDate = this.getCurrentDate();
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${this.baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>${this.baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${this.baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>


  <url>
    <loc>${this.baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Services Main Page -->
  <url>
    <loc>${this.baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;

      // Get all active services
      const services = await this.storage.getAllServices();
      if (services && services.length > 0) {
        sitemap += "  <!-- Individual Service Pages -->\n";
        for (const service of services) {
          if (service.slug) {
            sitemap += this.createUrlEntry(
              `/services/${service.slug}`,
              currentDate,
              'monthly',
              '0.7'
            ) + '\n\n';
          }
        }
      }

      // Get all active hire developer pages
      const hirePages = await this.storage.getAllHirePages();
      if (hirePages && hirePages.length > 0) {
        sitemap += "  <!-- Hire Developer Pages -->\n";
        for (const hirePage of hirePages) {
          if (hirePage.slug) {
            sitemap += this.createUrlEntry(
              `/hire-developers/${hirePage.slug}`,
              currentDate,
              'monthly',
              '0.7'
            ) + '\n\n';
          }
        }
      }

      // Case Studies Main Page
      sitemap += `  <!-- Case Studies Main Page -->
  <url>
    <loc>${this.baseUrl}/case-studies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;

      // Get all published case study pages
      const caseStudyPages = await this.storage.getPublishedCaseStudyPages();
      if (caseStudyPages && caseStudyPages.length > 0) {
        sitemap += "  <!-- Individual Case Studies -->\n";
        for (const caseStudy of caseStudyPages) {
          if (caseStudy.slug) {
            sitemap += this.createUrlEntry(
              `/case-studies/${caseStudy.slug}`,
              currentDate,
              'monthly',
              '0.6'
            ) + '\n\n';
          }
        }
      }

      // Blog Main Page
      sitemap += `  <!-- Blog Main Page -->
  <url>
    <loc>${this.baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

`;

      // Get all published blog posts
      const blogPosts = await this.storage.getBlogPosts();
      const publishedPosts = blogPosts?.filter(post => post.status === 'published') || [];
      
      if (publishedPosts.length > 0) {
        sitemap += "  <!-- Individual Blog Posts -->\n";
        for (const post of publishedPosts) {
          if (post.slug) {
            sitemap += this.createUrlEntry(
              `/blog/${post.slug}`,
              currentDate,
              'monthly',
              '0.5'
            ) + '\n\n';
          }
        }
      }

      // Close the sitemap
      sitemap += '</urlset>';

      // Write to the client/public directory
      const sitemapPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
      
      // Ensure the directory exists
      const sitemapDir = path.dirname(sitemapPath);
      if (!fs.existsSync(sitemapDir)) {
        fs.mkdirSync(sitemapDir, { recursive: true });
      }

      // Write the sitemap file
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      
      console.log('✅ Sitemap updated successfully:', sitemapPath);
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
      throw error;
    }
  }

  // Helper method to update sitemap asynchronously (fire and forget)
  updateSitemapAsync(): void {
    this.generateSitemap().catch(error => {
      console.error('Background sitemap update failed:', error);
    });
  }

  // Selective sitemap update method
  async updateSelectiveSections(sections: string[] = []): Promise<{ 
    updatedSections: string[]; 
    timestamp: string;
    totalUpdatedPages: number; 
  }> {
    try {
      const currentDate = this.getCurrentDate();
      let totalUpdatedPages = 0;
      const updatedSections: string[] = [];

      // Start with base sitemap structure
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${this.baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>${this.baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${this.baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${this.baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

`;

      // Services section
      if (sections.length === 0 || sections.includes('services')) {
        sitemap += `  <!-- Services Main Page -->
  <url>
    <loc>${this.baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;
        
        const services = await this.storage.getAllServices();
        if (services && services.length > 0) {
          sitemap += "  <!-- Individual Service Pages -->\n";
          for (const service of services) {
            if (service.slug) {
              sitemap += this.createUrlEntry(
                `/services/${service.slug}`,
                currentDate,
                'monthly',
                '0.7'
              ) + '\n\n';
              totalUpdatedPages++;
            }
          }
        }
        updatedSections.push('services');
      }

      // Hire pages section
      if (sections.length === 0 || sections.includes('hire')) {
        const hirePages = await this.storage.getAllHirePages();
        if (hirePages && hirePages.length > 0) {
          sitemap += "  <!-- Hire Developer Pages -->\n";
          for (const hirePage of hirePages) {
            if (hirePage.slug) {
              sitemap += this.createUrlEntry(
                `/hire-developers/${hirePage.slug}`,
                currentDate,
                'monthly',
                '0.7'
              ) + '\n\n';
              totalUpdatedPages++;
            }
          }
        }
        updatedSections.push('hire');
      }

      // Case studies section
      if (sections.length === 0 || sections.includes('case-studies')) {
        sitemap += `  <!-- Case Studies Main Page -->
  <url>
    <loc>${this.baseUrl}/case-studies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;
        
        const caseStudyPages = await this.storage.getPublishedCaseStudyPages();
        if (caseStudyPages && caseStudyPages.length > 0) {
          sitemap += "  <!-- Individual Case Studies -->\n";
          for (const caseStudy of caseStudyPages) {
            if (caseStudy.slug) {
              sitemap += this.createUrlEntry(
                `/case-studies/${caseStudy.slug}`,
                currentDate,
                'monthly',
                '0.6'
              ) + '\n\n';
              totalUpdatedPages++;
            }
          }
        }
        updatedSections.push('case-studies');
      }

      // Blog section
      if (sections.length === 0 || sections.includes('blog')) {
        sitemap += `  <!-- Blog Main Page -->
  <url>
    <loc>${this.baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

`;
        
        const blogPosts = await this.storage.getBlogPosts();
        const publishedPosts = blogPosts?.filter(post => post.status === 'published') || [];
        
        if (publishedPosts.length > 0) {
          sitemap += "  <!-- Individual Blog Posts -->\n";
          for (const post of publishedPosts) {
            if (post.slug) {
              sitemap += this.createUrlEntry(
                `/blog/${post.slug}`,
                currentDate,
                'monthly',
                '0.5'
              ) + '\n\n';
              totalUpdatedPages++;
            }
          }
        }
        updatedSections.push('blog');
      }

      // Close the sitemap
      sitemap += '</urlset>';

      // Write to the client/public directory
      const sitemapPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
      
      // Ensure the directory exists
      const sitemapDir = path.dirname(sitemapPath);
      if (!fs.existsSync(sitemapDir)) {
        fs.mkdirSync(sitemapDir, { recursive: true });
      }

      // Write the sitemap file
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      
      console.log(`✅ Sitemap updated selectively: ${updatedSections.join(', ')} - ${totalUpdatedPages} pages`);
      
      return {
        updatedSections,
        timestamp: new Date().toISOString(),
        totalUpdatedPages
      };
      
    } catch (error) {
      console.error('❌ Error updating sitemap selectively:', error);
      throw error;
    }
  }
}

// Utility function to create sitemap generator instance
export function createSitemapGenerator(storage: IStorage): SitemapGenerator {
  return new SitemapGenerator(storage);
}