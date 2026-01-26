// SEO utilities and constants for automated on-page optimization

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

// Primary target keywords based on 2025 trending B2B AI keywords
export const PRIMARY_KEYWORDS = [
  "AI development services",
  "enterprise AI solutions",
  "custom software development",
  "generative AI development",
  "machine learning consulting",
  "AI automation services",
  "digital transformation",
  "custom AI development company",
  "enterprise AI consulting",
  "AI-powered business solutions"
];

// Long-tail high-converting keywords
export const LONG_TAIL_KEYWORDS = [
  "AI development services for enterprises",
  "custom AI software development company",
  "enterprise AI solution development",
  "bespoke AI application development",
  "machine learning consulting services",
  "AI-powered business automation",
  "custom enterprise software solutions",
  "scalable AI development services",
  "AI integration services",
  "generative AI consulting"
];

// Industry-specific keywords for targeting
export const INDUSTRY_KEYWORDS = [
  "AI development for healthcare",
  "fintech AI development",
  "retail AI solutions",
  "manufacturing AI automation",
  "logistics AI development",
  "AI for supply chain management",
  "healthcare AI software development",
  "financial services AI development"
];

// Location-based keywords for local SEO
// Location-based keywords for local SEO - Base templates to be localized
export const LOCATION_KEYWORDS = [
  "Custom software development",
  "generative AI development company",
  "hire mobile app developers",
  "Top mobile app developers",
  "web3 development company",
  "AI and Web3 solutions",
  "AI and blockchain solutions",
  "Blockchain development firm",
  "Digital transformation consulting",
  "Enterprise AI services",
  "Generative AI development",
  "Hire AI developers",
  "Web3 development company",
  "Web3 development services",
  "affordable Web3 development",
  "best custom software development",
  "blockchain dapp development",
  "blockchain development firm",
  "enterprise web3 solutions",
  "hire web3 developers",
  "web3 consulting firm"
];

// Page-specific SEO metadata
export const SEO_PAGES: Record<string, SEOMetadata> = {
  home: {
    title: "GreenAppleX - AI & Web3 Development Company USA",
    description: "Top AI & Web3 development company USA. Hire expert developers for AI, blockchain, and mobile apps. 500+ projects delivered.",
    keywords: [
      "Custom software development",
      "generative AI development company",
      "hire mobile app developers",
      "Web3 development company",
      "AI and Web3 solutions",
      "Enterprise AI services",
      "blockchain development firm",
      "digital transformation consulting",
      "hire AI developers",
      "web3 development services",
      "React Native app development",
      "Top mobile app developers"
    ],
    ogTitle: "GreenAppleX - AI & Web3 Development Company USA",
    ogDescription: "Leading AI development company USA delivering Web3 solutions. Hire top developers for AI, mobile apps, and blockchain. 500+ projects delivered.",
    canonicalUrl: "https://greenapplex.com/"
  },

  services: {
    title: "AI Development Services USA | Web3 & Custom Software",
    description: "Enterprise AI services USA, Web3 development Canada. Hire AI developers, blockchain specialists, mobile app developers. Affordable solutions.",
    keywords: [
      "Enterprise AI services",
      "Web3 development services",
      "custom software development",
      "generative AI development",
      "hire AI developers",
      "blockchain development firm",
      "digital transformation consulting",
      "affordable Web3 development",
      "hire mobile app developers",
      "blockchain dapp development",
      "web3 consulting firm",
      "enterprise web3 solutions",
      "best custom software development"
    ],
    ogTitle: "AI Development Services USA | Web3 & Enterprise Solutions",
    ogDescription: "Enterprise AI services USA, Web3 development Canada. Hire AI developers, blockchain specialists, mobile app developers. Expert solutions.",
    canonicalUrl: "https://greenapplex.com/services"
  },

  about: {
    title: "About GreenAppleX - Leading AI Development Company",
    description: "Premier AI development company with 8+ years experience. 200+ expert developers, 500+ projects in AI, Web3, mobile, and enterprise solutions.",
    keywords: [
      "AI development company",
      "GreenAppleX company",
      "enterprise AI consulting",
      "custom software development team",
      "AI development expertise",
      "transformative digital solutions",
      "Web3 development company"
    ],
    canonicalUrl: "https://greenapplex.com/about"
  },

  portfolio: {
    title: "AI Development Portfolio - Enterprise Projects",
    description: "Explore our portfolio of successful AI projects, Web3 solutions, mobile apps, and digital transformation. 500+ completed projects.",
    keywords: [
      "AI development portfolio",
      "enterprise AI projects",
      "AI case studies",
      "custom software projects",
      "AI development examples",
      "enterprise AI solutions",
      "Web3 project portfolio",
      "mobile app portfolio"
    ],
    canonicalUrl: "https://greenapplex.com/portfolio"
  },

  insights: {
    title: "AI Insights & Tech Trends | InfranautX",
    description: "Latest AI development insights, enterprise trends, generative AI, Web3, and software best practices from InfranautX.",
    keywords: [
      "AI development insights",
      "enterprise AI trends",
      "generative AI blog",
      "AI development best practices",
      "machine learning insights",
      "AI technology trends"
    ],
    canonicalUrl: "https://greenapplex.com/insights"
  },

  blog: {
    title: "AutoGen vs LangGraph: AI Agent Framework Comparison",
    description: "Comprehensive comparison of AutoGen vs LangGraph for multi-agent AI development. Expert analysis of features and real-world applications.",
    keywords: [
      "AutoGen vs LangGraph",
      "AI agent development",
      "multi-agent frameworks",
      "AI development comparison",
      "enterprise AI frameworks",
      "AI agent consulting"
    ],
    canonicalUrl: "https://greenapplex.com/blog"
  },

  contact: {
    title: "Contact Green Apple | Free AI Consultation",
    description: "Contact Green Apple for enterprise AI development and custom software. Get a free consultation and project quote. 24/7 support.",
    keywords: [
      "AI development consultation",
      "enterprise AI quote",
      "custom software consultation",
      "AI development contact",
      "AI project quote",
      "enterprise AI consulting"
    ],
    canonicalUrl: "https://greenapplex.com/contact"
  },
  "hire-developers": {
    title: "Hire Skilled Developers from $2890/mo | Green Apple",
    description: "Hire pre-vetted AI, mobile app, Web3, and full-stack developers. Flexible engagement models, 30-day risk-free trial, NDA protection.",
    keywords: [
      "hire developers",
      "hire AI developers",
      "hire mobile app developers",
      "hire Web3 developers",
      "dedicated development team",
      "offshore developers",
      "software development outsourcing"
    ],
    canonicalUrl: "https://greenapplex.com/hire-developers"
  },

  "privacy-policy": {
    title: "Privacy Policy | GreenAppleX - Data Security",
    description: "GreenAppleX Privacy Policy: Learn about our data security measures, NDA agreements, and commitment to protecting client confidentiality.",
    keywords: [
      "privacy policy",
      "data security",
      "confidentiality agreement",
      "NDA protection",
      "client data security",
      "software development privacy",
      "data protection policy",
      "information security"
    ],
    ogTitle: "Privacy Policy - GreenAppleX Data Security & Confidentiality",
    ogDescription: "Learn about GreenAppleX's commitment to data security, confidentiality agreements, and privacy protection measures for all client projects.",
    canonicalUrl: "https://greenapplex.com/privacy-policy"
  },

  "case-studies": {
    title: "AI Development Case Studies & Success Stories",
    description: "Explore GreenAppleX's AI development case studies. Real-world AI projects for education, healthcare, fintech, and enterprise clients.",
    keywords: [
      "AI development case studies",
      "AI project success stories",
      "enterprise AI projects",
      "AI development portfolio",
      "machine learning case studies",
      "AI implementation examples",
      "custom AI solutions",
      "AI development results",
      "AI project outcomes",
      "enterprise AI consulting",
      "AI transformation stories",
      "real-world AI applications"
    ],
    ogTitle: "AI Development Case Studies & Success Stories",
    ogDescription: "Discover how GreenAppleX delivered successful AI solutions for education, healthcare, fintech, and enterprise clients with measurable results.",
    canonicalUrl: "https://greenapplex.com/case-studies"
  },

  "ai-services": {
    title: "Custom Generative AI Development Services USA",
    description: "Custom generative AI development services USA. Expert AI consulting, model development, chatbot building, enterprise AI integration.",
    keywords: [
      "custom generative AI development",
      "AI development services",
      "generative AI consulting",
      "custom AI model development",
      "AI chatbot development",
      "enterprise AI integration",
      "GPT development services",
      "Claude AI development",
      "Gemini AI implementation",
      "AI automation services",
      "machine learning consulting",
      "AI solution development"
    ],
    ogTitle: "Custom Generative AI Development Services | Expert AI",
    ogDescription: "Transform your business with custom generative AI solutions. Expert development in GPT, Claude, Gemini with full lifecycle support.",
    canonicalUrl: "https://greenapplex.com/genai-service"
  }
};

// Generate meta keywords string
export function generateMetaKeywords(keywords: string[]): string {
  return keywords.join(", ");
}

/**
 * Generates dynamic SEO keywords by combining base keywords with target regions and industries.
 * @param baseKeywords Array of base keywords (e.g., "AI Development", "Custom Software")
 * @param targetRegions Comma-separated string of regions (e.g., "USA, Canada, UK")
 * @param industryFocus Comma-separated string of industries (e.g., "Healthcare, Finance")
 * @returns Combined and deduplicated array of localized keywords
 */
export function generateDynamicKeywords(
  baseKeywords: string[],
  targetRegions: string | undefined,
  industryFocus?: string
): string[] {
  const regions = targetRegions ? targetRegions.split(',').map(r => r.trim()).filter(Boolean) : [];

  // If no regions configured, returns base keywords to avoid empty bias
  if (regions.length === 0) return baseKeywords;

  const localizedKeywords: string[] = [];

  // Add base keywords first
  localizedKeywords.push(...baseKeywords);

  // Generate localized versions for high-value keywords
  // We don't want to explode the count too much, so we limit to primary base keywords usually, 
  // but here we will try to localize the passed list.
  baseKeywords.forEach(keyword => {
    regions.forEach(region => {
      // Avoid redundancy like "Custom Software Development USA USA" if keyword already contains it
      const cleanRegion = region.replace(/[^a-zA-Z0-9 ]/g, ''); // Simple cleanup
      if (!keyword.toLowerCase().includes(cleanRegion.toLowerCase())) {
        localizedKeywords.push(`${keyword} ${region}`);
        localizedKeywords.push(`${keyword} in ${region}`);
      }
    });
  });

  // Unique and limit count to avoid stuffing
  return Array.from(new Set(localizedKeywords)).slice(0, 40); // Limit to reasonable meta tag length approx
}

// Generate optimized title with keyword placement
export function optimizeTitle(baseTitle: string, primaryKeyword: string): string {
  if (baseTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return baseTitle;
  }
  return `${primaryKeyword} | ${baseTitle}`;
}

// Generate SEO-optimized description
export function optimizeDescription(description: string, keywords: string[]): string {
  let optimized = description;

  // Ensure primary keyword is in first 160 characters
  const primaryKeyword = keywords[0];
  if (!optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    optimized = `${primaryKeyword} - ${optimized}`;
  }

  // Truncate to optimal length
  if (optimized.length > 155) {
    optimized = optimized.substring(0, 152) + "...";
  }

  return optimized;
}

// Update document head with SEO metadata
export function updateSEOMetadata(pageKey: string): void {
  const seo = SEO_PAGES[pageKey];
  if (!seo) return;

  // Update title
  document.title = seo.title;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', seo.description);
  }

  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', generateMetaKeywords(seo.keywords));
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', seo.canonicalUrl || window.location.href);

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', seo.ogTitle || seo.title);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', seo.ogDescription || seo.description);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', seo.canonicalUrl || window.location.href);
  }

  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', seo.ogTitle || seo.title);
  }

  const twitterDesc = document.querySelector('meta[property="twitter:description"]');
  if (twitterDesc) {
    twitterDesc.setAttribute('content', seo.ogDescription || seo.description);
  }
}

// Structured data for different content types
export const STRUCTURED_DATA = {
  // Service page structured data
  service: (serviceName: string, description: string) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Green Apple",
      "url": "https://greenapplex.com"
    },
    "areaServed": "North America",
    "serviceType": "Technology Services"
  }),

  // Blog article structured data
  article: (title: string, description: string, publishDate: string, author: string) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Green Apple",
      "logo": {
        "@type": "ImageObject",
        "url": "https://greenapplex.com/logo.png"
      }
    },
    "datePublished": publishDate,
    "dateModified": publishDate
  }),

  // FAQ structured data
  faq: (questions: Array<{ question: string, answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  })
};

// Add structured data to page
export function addStructuredData(data: any): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function generateSEOReport(): { score: number; recommendations: string[] } {
  let score = 0;
  const recommendations: string[] = [];

  // Check title tag
  const title = document.title;
  if (title && title.length >= 30 && title.length <= 60) {
    score += 15;
  } else {
    recommendations.push('Optimize title tag length (30-60 characters)');
  }

  // Check meta description
  const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (metaDescription && metaDescription.content.length >= 120 && metaDescription.content.length <= 160) {
    score += 15;
  } else {
    recommendations.push('Optimize meta description length (120-160 characters)');
  }

  // Check headings
  const h1 = document.querySelector('h1');
  if (h1) {
    score += 10;
  } else {
    recommendations.push('Add H1 heading to the page');
  }

  const h2s = document.querySelectorAll('h2');
  if (h2s.length >= 2) {
    score += 10;
  } else {
    recommendations.push('Add more H2 headings for better structure');
  }

  // Check images alt text
  const images = document.querySelectorAll('img');
  let imagesWithAlt = 0;
  images.forEach(img => {
    if (img.getAttribute('alt')) {
      imagesWithAlt++;
    }
  });

  if (images.length === imagesWithAlt) {
    score += 15;
  } else {
    recommendations.push('Add alt text to all images');
  }

  // Check internal links
  const internalLinks = document.querySelectorAll('a[href^="/"]');
  if (internalLinks.length >= 5) {
    score += 10;
  } else {
    recommendations.push('Add more internal links');
  }

  // Check structured data
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    score += 15;
  } else {
    recommendations.push('Add structured data (JSON-LD)');
  }

  // Check mobile responsiveness
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    score += 10;
  } else {
    recommendations.push('Add viewport meta tag for mobile optimization');
  }

  // Check page speed indicators
  if (document.readyState === 'complete') {
    score += 10;
  }

  return { score, recommendations };
}

// Performance optimization for SEO
export const SEO_PERFORMANCE = {
  // Lazy load images with proper alt text
  optimizeImages: () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.alt) {
        const src = img.src;
        if (src.includes('ai') || src.includes('artificial')) {
          img.alt = 'AI development services illustration';
        } else if (src.includes('software') || src.includes('code')) {
          img.alt = 'Custom software development';
        } else {
          img.alt = 'Green Apple technology solutions';
        }
      }
    });
  },

  // Add proper heading hierarchy
  optimizeHeadings: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent?.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') || `heading-${index}`;
        heading.id = text;
      }
    });
  }
};

// Keyword density optimization
export function optimizeKeywordDensity(content: string, targetKeywords: string[]): string {
  let optimized = content;
  const wordCount = content.split(/\s+/).length;
  const targetDensity = 0.015; // 1.5% keyword density

  targetKeywords.forEach(keyword => {
    const currentCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const targetCount = Math.round(wordCount * targetDensity);

    // If keyword density is too low, suggest natural placement opportunities
    if (currentCount < targetCount) {
      console.log(`Consider adding "${keyword}" ${targetCount - currentCount} more times naturally in content`);
    }
  });

  return optimized;
}