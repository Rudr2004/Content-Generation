import OpenAI from 'openai';

// Initialize OpenAI client only when needed and API key is available
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not configured');
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  return openai;
}

export interface ServicePageContent {
  heroSection: {
    headline: string;
    subheading: string;
    ctaButton: string;
  };
  introOverview: {
    paragraphs: string[];
  };
  serviceOfferings: {
    title: string;
    components: ServiceComponent[];
  };
  technologyTools: {
    coreTechnologies: string[];
    platformsFrameworks: string[];
    integrationTools: string[];
    deploymentEnvironments: string[];
  };
  process: ProcessStep[];
  whyChooseUs: string[];
  trustSignals: {
    trustedBy: string[];
  };
  testimonials: ServiceTestimonial[];
  faqs: ServiceFAQ[];
  finalCTA: {
    headline: string;
    button: string;
  };
}

export interface ServiceComponent {
  name: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  description: string;
}

export interface ServiceTestimonial {
  quote: string;
  client: string;
  clientImage: string;
  gender?: string; // 'male' | 'female' - for proper profile image assignment
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

/**
 * Scrape and summarize content from a reference URL
 */
export async function scrapeAndSummarizeUrl(url: string): Promise<string> {
  try {
    // Simple URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    // For demo purposes, return a placeholder summary
    // In production, implement proper web scraping with cheerio
    const summaryPrompt = `Create a brief 2-3 sentence summary for the reference URL: ${url}
    
    Focus on extracting the main service or product offering that would be relevant for content generation.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: summaryPrompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    return response.choices[0].message.content || 'Content summary not available';
  } catch (error) {
    console.error('Error processing URL:', error);
    return 'Unable to process content from the provided URL';
  }
}

/**
 * Generate SEO keywords for a service
 */
export async function generateSeoKeywords(serviceName: string, referenceContent?: string, region: string = "USA, Canada"): Promise<{
  primaryKeyword: string;
  secondaryKeywords: string[];
}> {
  try {
    const regions = region ? region.split(',').map(r => r.trim()).filter(Boolean) : ["USA", "Canada"];
    const regionList = regions.join(", ");
    
    const prompt = `Generate SEO keywords for a service page about "${serviceName}" targeting ONLY ${regionList} markets.

CRITICAL REGION REQUIREMENTS - MUST FOLLOW STRICTLY:
1. ONLY use regions from this exact list: ${regionList}
2. NEVER include USA, Canada, or any other regions unless they are explicitly in the list above
3. If the region is "India, Australia", generate keywords ONLY for India and Australia
4. DO NOT add "USA" or "Canada" to any keywords
5. All location-based keywords must use ONLY: ${regions.map(r => r.trim()).join(', ')}

${referenceContent ? `Reference content context: ${referenceContent}` : ''}

EXAMPLES FOR ${regionList}:
${regions.map(r => {
  const rLower = r.trim().toLowerCase();
  if (rLower.includes('india')) {
    return `- For India: "${serviceName} India", "${serviceName} services Mumbai", "${serviceName} Delhi", "${serviceName} Bangalore", "best ${serviceName} company India"`;
  } else if (rLower.includes('australia')) {
    return `- For Australia: "${serviceName} Australia", "${serviceName} services Sydney", "${serviceName} Melbourne", "${serviceName} Brisbane", "top ${serviceName} providers Australia"`;
  }
  return `- For ${r.trim()}: "${serviceName} ${r.trim()}", "${serviceName} services ${r.trim()}"`;
}).join('\n')}

Provide:
1. One primary keyword (2-4 words, high-intent) - MUST include region from ${regionList}
2. 5-7 secondary keywords (related terms, long-tail variations) - MUST use ONLY regions from ${regionList}

Focus on business-oriented, high-intent keywords that potential clients in ${regionList} would search for.
Include location-specific variations using ONLY the specified regions.

Return as JSON:
{
  "primaryKeyword": "primary keyword here (must include region from ${regionList})",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert specializing in generating region-specific keywords for technology services.

CRITICAL REGION COMPLIANCE RULES:
1. ONLY use regions from the provided list: ${regionList}
2. NEVER include USA, Canada, or any other regions unless they are explicitly in the provided list
3. If the region is "India, Australia", generate keywords ONLY for India and Australia
4. All location-based keywords must use ONLY: ${regions.map(r => r.trim()).join(', ')}
5. Include major cities from the specified regions only (e.g., for India: Mumbai, Delhi, Bangalore; for Australia: Sydney, Melbourne, Brisbane)
6. Generate keywords that are specific, actionable, and optimized for search engines in the target regions.`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    // Clean up potential markdown formatting and extra text
    let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Find JSON object boundaries
    const jsonStart = cleanContent.indexOf('{');
    const jsonEnd = cleanContent.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      cleanContent = cleanContent.substring(jsonStart, jsonEnd);
    }
    
    const result = JSON.parse(cleanContent);
    
    // Post-process: Filter out USA/Canada keywords if not in region list
    const regionLower = region.toLowerCase();
    const hasUSA = regionLower.includes('usa') || regionLower.includes('united states');
    const hasCanada = regionLower.includes('canada');
    
    // Filter primary keyword
    if (result.primaryKeyword) {
      const pkLower = result.primaryKeyword.toLowerCase();
      // Check for combined phrases first
      if ((!hasUSA || !hasCanada) && (
        pkLower.includes('usa canada') ||
        pkLower.includes('usa, canada') ||
        pkLower.includes('usa & canada') ||
        pkLower.includes('usa and canada')
      )) {
        // Replace with first region
        const firstRegion = regions[0] || '';
        result.primaryKeyword = result.primaryKeyword
          .replace(/\bUSA\s+Canada\b/gi, firstRegion)
          .replace(/\bUSA,\s+Canada\b/gi, firstRegion)
          .replace(/\bUSA\s+&\s+Canada\b/gi, firstRegion)
          .replace(/\bUSA\s+and\s+Canada\b/gi, firstRegion);
      }
      if (!hasUSA && (
        pkLower.includes(' usa') || 
        pkLower.includes('usa ') || 
        pkLower.endsWith(' usa') || 
        pkLower.startsWith('usa ') ||
        pkLower.includes('united states') ||
        /\busa\b/i.test(result.primaryKeyword) ||
        /\bunited\s+states\b/i.test(result.primaryKeyword)
      )) {
        // Replace USA with first region
        const firstRegion = regions[0] || '';
        result.primaryKeyword = result.primaryKeyword.replace(/\bUSA\b/gi, firstRegion).replace(/\bUnited States\b/gi, firstRegion);
      }
      if (!hasCanada && (
        pkLower.includes(' canada') || 
        pkLower.includes('canada ') || 
        pkLower.endsWith(' canada') || 
        pkLower.startsWith('canada ') ||
        /\bcanada\b/i.test(result.primaryKeyword)
      )) {
        // Replace Canada with first region
        const firstRegion = regions[0] || '';
        result.primaryKeyword = result.primaryKeyword.replace(/\bCanada\b/gi, firstRegion);
      }
    }
    
    // Filter secondary keywords
    if (result.secondaryKeywords && Array.isArray(result.secondaryKeywords)) {
      result.secondaryKeywords = result.secondaryKeywords
        .map((kw: string) => {
          const kwLower = kw.toLowerCase();
          // Remove if contains "USA Canada" or "USA, Canada" as combined phrase
          if ((!hasUSA || !hasCanada) && (
            kwLower.includes('usa canada') ||
            kwLower.includes('usa, canada') ||
            kwLower.includes('usa & canada') ||
            kwLower.includes('usa and canada')
          )) {
            return null;
          }
          // Remove if contains USA and USA is not in region (check for various patterns)
          if (!hasUSA && (
            kwLower.includes(' usa') || 
            kwLower.includes('usa ') || 
            kwLower.endsWith(' usa') || 
            kwLower.startsWith('usa ') || 
            kwLower.includes('united states') ||
            /\busa\b/i.test(kw) ||
            /\bunited\s+states\b/i.test(kw)
          )) {
            return null;
          }
          // Remove if contains Canada and Canada is not in region (check for various patterns)
          if (!hasCanada && (
            kwLower.includes(' canada') || 
            kwLower.includes('canada ') || 
            kwLower.endsWith(' canada') || 
            kwLower.startsWith('canada ') ||
            /\bcanada\b/i.test(kw)
          )) {
            return null;
          }
          return kw;
        })
        .filter((kw: string | null) => kw !== null) as string[];
    }
    
    return result;
  } catch (error) {
    console.error('Error generating SEO keywords:', error);
    // Fallback keywords - region-aware
    const regions = region ? region.split(',').map(r => r.trim()).filter(Boolean) : [];
    const regionLower = region.toLowerCase();
    const hasUSA = regionLower.includes('usa') || regionLower.includes('united states');
    const hasCanada = regionLower.includes('canada');
    const regionSuffix = regions.length > 0 ? ` ${regions[0]}` : '';
    
    const fallbackKeywords = [
      `${serviceName} services${regionSuffix}`,
      `${serviceName} development${regionSuffix}`,
      `${serviceName} solutions${regionSuffix}`,
      `${serviceName} consulting${regionSuffix}`,
      `professional ${serviceName}${regionSuffix}`,
      `${serviceName} company${regionSuffix}`
    ];
    
    // Only add USA/Canada if they're in the region list
    if (hasUSA) {
      fallbackKeywords.push(`${serviceName} services USA`);
    }
    if (hasCanada) {
      fallbackKeywords.push(`${serviceName} services Canada`);
    }
    
    return {
      primaryKeyword: fallbackKeywords[0] || `${serviceName} services`,
      secondaryKeywords: fallbackKeywords.slice(1)
    };
  }
}

/**
 * Generate comprehensive service page content following the 8-section structure
 */
export async function generateServicePageContent(
  serviceName: string,
  referenceContent?: string,
  referenceUrl?: string,
  rawData?: string,
  seoKeywords?: string[]
): Promise<ServicePageContent> {
  try {
    // Process reference URL if provided
    let urlSummary = '';
    if (referenceUrl) {
      try {
        urlSummary = await scrapeAndSummarizeUrl(referenceUrl);
      } catch (error) {
        console.warn('Failed to process reference URL:', error);
        urlSummary = `Reference URL provided: ${referenceUrl}`;
      }
    }

    // Process reference content to extract structure and style
    let referenceAnalysis = '';
    if (referenceContent) {
      try {
        // Try to parse as JSON first (structured content)
        const parsedRef = JSON.parse(referenceContent);
        
        // Analyze the structure
        const sections = Object.keys(parsedRef);
        referenceAnalysis = `REFERENCE CONTENT STRUCTURE ANALYSIS:
Structure follows ${sections.length} main sections: ${sections.join(', ')}

Key Content Patterns:
- Hero Section: ${parsedRef.heroSection ? 'Present with headline/subheading/CTA structure' : 'Not structured'}
- Service Offerings: ${parsedRef.serviceOfferings ? `Contains ${parsedRef.serviceOfferings.components?.length || 0} components` : 'Not present'}
- Technology Focus: ${parsedRef.technologyTools ? 'Organized by technology categories' : 'No specific tech structure'}
- Process Steps: ${parsedRef.process ? `${parsedRef.process.length} step process` : 'No defined process'}
- Testimonials: ${parsedRef.testimonials ? `${parsedRef.testimonials.length} client testimonials` : 'No testimonials'}
- FAQs: ${parsedRef.faqs ? `${parsedRef.faqs.length} questions answered` : 'No FAQ section'}

IMPORTANT: Generate content that follows this EXACT structural pattern but adapted for ${serviceName}.

REFERENCE CONTENT SAMPLE:
${JSON.stringify(parsedRef, null, 2).substring(0, 3000)}...`;
        
      } catch {
        // Handle plain text reference content
        // Analyze structure from plain text reference content
        const lines = referenceContent.split('\n').filter(line => line.trim());
        const structuredSections: Array<{title: string, content: string[]}> = [];
        let currentSection: {title: string, content: string[]} | null = null;
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          // Detect section headers (all caps, short lines, or lines ending with colon)
          if (trimmed.length < 80 && (trimmed === trimmed.toUpperCase() || trimmed.endsWith(':'))) {
            if (currentSection) structuredSections.push(currentSection);
            currentSection = { title: trimmed, content: [] };
          } else if (currentSection) {
            currentSection.content.push(trimmed);
          } else {
            // First section without header
            if (!currentSection) currentSection = { title: 'Introduction', content: [] };
            currentSection.content.push(trimmed);
          }
        }
        if (currentSection) structuredSections.push(currentSection);
        
        referenceAnalysis = `REFERENCE CONTENT STRUCTURE ANALYSIS:
Content follows ${structuredSections.length} main sections with detailed business-focused approach.

Detected Section Structure:
${structuredSections.map((s, i) => `${i + 1}. ${s.title} (${s.content.length} elements)`).join('\n')}

Content Pattern Analysis:
- Opening: Strong value proposition with specific benefits
- Services: Detailed component breakdown with clear descriptions  
- Technology: Comprehensive tech stack with categorization
- Process: Step-by-step methodology explanation
- Social Proof: Client testimonials with specific results/metrics
- Support: FAQ section addressing common concerns
- CTA: Clear call-to-action with proposal request

CRITICAL: Generate content that mirrors this exact structural depth and business-focused tone for ${serviceName}.

REFERENCE CONTENT SAMPLE:
${referenceContent.substring(0, 3000)}...`;
      }
    }

    // Combine reference materials for context
    const contextualInfo = [
      referenceAnalysis || '',
      urlSummary ? `URL CONTENT ANALYSIS: ${urlSummary}` : '',
      rawData ? `ADDITIONAL DATA: ${rawData}` : ''
    ].filter(Boolean).join('\n\n');

    const structureTemplate = `Generate comprehensive service page content for "${serviceName}" following this EXACT structure format.

${contextualInfo ? `CONTEXT TO CONSIDER:\n${contextualInfo}\n\nCRITICAL INSTRUCTION: If reference content is provided above, you MUST analyze its exact structure, tone, and style patterns. Generate content that mirrors the reference material's approach while adapting it for ${serviceName}. If the reference shows specific section lengths, formatting patterns, or content depth, replicate those characteristics precisely.\n` : ''}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no markdown, no explanations, no extra text
2. Follow the exact structure below with all required fields
3. Replace all {{placeholders}} with actual content for ${serviceName}
4. Generate realistic but fictional client testimonials and company names
5. Create 4-5 relevant FAQs with detailed answers
6. Make content professional, benefits-focused, and conversion-optimized
7. IF reference content is provided, match its content depth, section complexity, and overall approach while maintaining the JSON structure
8. Ensure all generated content maintains consistency with the reference material's quality and professional standards

EXACT JSON STRUCTURE TO FOLLOW:
{
  "heroSection": {
    "headline": "{{Primary benefit or transformation}} with our {{Service Name}}",
    "subheading": "Helping {{Target Audience}} achieve {{Key Result}} through {{Short Service Pitch}}",
    "ctaButton": "{{Primary Call to Action}}"
  },
  "introOverview": {
    "paragraphs": ["{{Paragraph 1}}", "{{Paragraph 2}}"]
  },
  "serviceOfferings": {
    "title": "Our End-to-End {{Service Name}} Solutions",
    "components": [
      {
        "name": "{{Component 1 Name}}",
        "description": "{{Brief description of how it works and benefit}}"
      },
      {
        "name": "{{Component 2 Name}}",
        "description": "{{Brief description}}"
      },
      {
        "name": "{{Component 3 Name}}",
        "description": "{{Brief description}}"
      },
      {
        "name": "{{Optional Extra Component}}",
        "description": "{{Brief description}}"
      }
    ]
  },
  "technologyTools": {
    "Core Technologies": ["{{Tech 1}}", "{{Tech 2}}"],
    "Platforms Frameworks": ["{{Framework 1}}", "{{Framework 2}}"],
    "Integration Tools": ["{{Tool 1}}", "{{Tool 2}}"],
    "Deployment Environments": ["{{Environment 1}}", "{{Environment 2}}"]
  },
  "process": [
    {
      "step": "Discovery & Strategy",
      "description": "{{Short Description}}"
    },
    {
      "step": "Planning & Estimation",
      "description": "{{Short Description}}"
    },
    {
      "step": "Design & Development",
      "description": "{{Short Description}}"
    },
    {
      "step": "Testing & Optimization",
      "description": "{{Short Description}}"
    },
    {
      "step": "Deployment & Support",
      "description": "{{Short Description}}"
    }
  ],
  "whyChooseUs": [
    "{{Unique Selling Point 1}}",
    "{{Unique Selling Point 2}}",
    "{{Unique Selling Point 3}}",
    "{{Unique Selling Point 4}}"
  ],
  "trustSignals": {
    "trustedBy": ["{{Client Logo/Name 1}}", "{{Client Logo/Name 2}}"]
  },
  "testimonials": [
    {
      "quote": "{{Client Quote}}",
      "client": "{{Client Name, Position}}",
      "clientImage": "{{Image URL}}"
    },
    {
      "quote": "{{Client Quote}}",
      "client": "{{Client Name, Position}}",
      "clientImage": "{{Image URL}}"
    }
  ],
  "faqs": [
    {
      "question": "{{FAQ 1}}",
      "answer": "{{Answer 1}}"
    },
    {
      "question": "{{FAQ 2}}",
      "answer": "{{Answer 2}}"
    },
    {
      "question": "{{FAQ 3}}",
      "answer": "{{Answer 3}}"
    },
    {
      "question": "{{FAQ 4}}",
      "answer": "{{Answer 4}}"
    }
  ],
  "finalCTA": {
    "headline": "Ready to {{Benefit}} with {{Service Name}}?",
    "button": "{{CTA Text}}"
  }
}`;

    const prompt = `You are a professional content writer specializing in B2B service pages. Generate comprehensive content for a "${serviceName}" service page.

REFERENCE CONTENT ANALYSIS INSTRUCTIONS:
If reference content is provided in the context above, you MUST:
1. Identify the exact content structure and formatting patterns from the reference
2. Replicate the same section depth, detail level, and professional tone
3. Use similar heading styles, paragraph lengths, and technical depth
4. Match the business-focused approach and value proposition style
5. Generate content that follows the reference's organizational pattern while adapting it for ${serviceName}

${structureTemplate}

CONTEXT:
Service Name: ${serviceName}
${referenceContent ? `Reference Content Summary: ${referenceContent}` : ''}
${rawData ? `Admin Raw Data: ${rawData}` : ''}
${seoKeywords ? `SEO Keywords: ${seoKeywords.join(', ')}` : ''}

CRITICAL INSTRUCTIONS:
1. Replace ALL {{placeholders}} with actual content for "${serviceName}"
2. Generate authentic, professional content targeting USA/Canada business decision makers
3. Focus on specific business value, transformation, and measurable outcomes
4. Create realistic but fictional testimonials with specific client names and positions
5. Generate relevant FAQs that address common service inquiries
6. Make content benefits-first and conversion-optimized
7. Include relevant technologies and tools for the specific service
8. Ensure trust signals reflect credible industry clients
9. Optimize content for the provided SEO keywords naturally
10. Return ONLY the JSON object - no markdown formatting, explanations, or extra text

RESPONSE FORMAT: Pure JSON object only, starting with { and ending with }`;

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7
    });

    let content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    // Clean up potential markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse and validate JSON
    const parsedContent = JSON.parse(content);
    
    // Validate required sections for new structure
    const requiredSections = [
      'heroSection', 'introOverview', 'serviceOfferings', 'technologyTools',
      'process', 'whyChooseUs', 'trustSignals', 'testimonials', 'faqs', 'finalCTA'
    ];

    for (const section of requiredSections) {
      if (!parsedContent[section]) {
        throw new Error(`Missing required section: ${section}`);
      }
    }

    // Validate nested required fields
    if (!parsedContent.heroSection?.headline || !parsedContent.heroSection?.subheading) {
      throw new Error('Missing required heroSection fields: headline or subheading');
    }

    if (!parsedContent.introOverview?.paragraphs || !Array.isArray(parsedContent.introOverview.paragraphs)) {
      throw new Error('Missing required introOverview paragraphs array');
    }

    if (!parsedContent.serviceOfferings?.components || !Array.isArray(parsedContent.serviceOfferings.components)) {
      throw new Error('Missing required serviceOfferings components array');
    }
    
    return parsedContent;
  } catch (error) {
    console.error('Error generating service page content:', error);
    throw new Error(`Failed to generate service page content: ${(error as Error).message}`);
  }
}

/**
 * Generate SEO meta information for service page
 */
export async function generateSeoMeta(serviceName: string, content: ServicePageContent): Promise<{
  metaTitle: string;
  metaDescription: string;
}> {
  try {
    const prompt = `Generate SEO meta title and description for a "${serviceName}" service page.

Hero Headline: ${content.heroSection.headline}
Hero Subheading: ${content.heroSection.subheading}
Key Components: ${content.serviceOfferings.components.map(c => c.name).join(', ')}

Requirements:
- Meta title: 50-60 characters, include primary keyword, compelling
- Meta description: 150-160 characters, actionable, include CTA
- Focus on business value and conversions
- Target USA/Canada market

Return as JSON:
{
  "metaTitle": "title here",
  "metaDescription": "description here"
}`;

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) throw new Error('No response from OpenAI');

    const cleanContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Error generating SEO meta:', error);
    return {
      metaTitle: `Professional ${serviceName} Services | GreenAppleX`,
      metaDescription: `Transform your business with expert ${serviceName} services. Professional solutions, proven results. Get started today with our experienced team.`
    };
  }
}