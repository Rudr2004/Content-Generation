import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load service structure at runtime
const getServiceStructure = () => {
  try {
    const structurePath = join(process.cwd(), 'shared/service-page-structure.json');
    const structureContent = readFileSync(structurePath, 'utf-8');
    return JSON.parse(structureContent);
  } catch (error) {
    console.error('Error loading service structure:', error);
    return {
      servicePageStructure: {
        sections: [],
        contentGuidelines: {
          tone: "Professional, results-oriented, client-focused",
          target: "USA/Canada business decision makers",
          approach: "Benefits-first, evidence-backed, conversion-optimized",
          wordCount: "2000-2500 words total across all sections",
          formatting: "Scannable content with clear value propositions"
        }
      }
    };
  }
};

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export interface GeneratedServiceContent {
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
    components: Array<{
      name: string;
      description: string;
    }>;
  };
  technologyTools: {
    coreTechnologies: string[];
    platformsFrameworks: string[];
    integrationTools: string[];
    deploymentEnvironments: string[];
  };
  processMethodology: {
    process: Array<{
      step: string;
      description: string;
    }>;
  };
  whyChooseUs: {
    whyChooseUs: string[];
  };
  trustSignals: {
    trustedBy: string[];
  };
  testimonials: {
    testimonials: Array<{
      quote: string;
      client: string;
      clientImage: string;
    }>;
  };
  faqs: {
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  finalCta: {
    headline: string;
    button: string;
  };
}

export async function generateServiceContentFromReference(
  serviceName: string,
  category: string,
  referenceContent: string
): Promise<GeneratedServiceContent> {
  const prompt = `You are an expert service page content creator for GreenAppleX, a digital transformation company.

Create comprehensive service page content for "${serviceName}" in the "${category}" category based STRICTLY on the following reference content. Use the EXACT content, structure, and information from this reference:

=== REFERENCE CONTENT TO FOLLOW ===
${referenceContent}
=== END REFERENCE CONTENT ===

CRITICAL INSTRUCTIONS:
1. Use the EXACT headlines, descriptions, and structure from the reference content above
2. Adapt the content specifically for GreenAppleX but maintain the SAME messaging and offerings
3. Extract technology stack, services, process steps, and FAQs DIRECTLY from the reference content
4. Keep the SAME tone, style, and value propositions as shown in the reference
5. Do NOT create new content - transform the reference content into the required JSON structure

Required JSON Response Structure:
{
  "heroSection": {
    "headline": "Extract headline from reference content",
    "subheading": "Extract subheading from reference content", 
    "ctaButton": "Extract CTA from reference content"
  },
  "introOverview": {
    "paragraphs": ["Extract overview paragraphs from reference content"]
  },
  "serviceOfferings": {
    "title": "Extract service title from reference content",
    "components": [{"name": "service name", "description": "service description"}]
  },
  "technologyTools": {
    "coreTechnologies": ["extract from reference"],
    "platformsFrameworks": ["extract from reference"],
    "integrationTools": ["extract from reference"], 
    "deploymentEnvironments": ["extract from reference"]
  },
  "processMethodology": {
    "process": [{"step": "step name", "description": "step description"}]
  },
  "whyChooseUs": {
    "whyChooseUs": ["extract reasons from reference content"]
  },
  "trustSignals": {
    "trustedBy": ["extract company names or metrics from reference"]
  },
  "testimonials": {
    "testimonials": [{"quote": "extract testimonials", "client": "client name", "clientImage": "placeholder"}]
  },
  "faqs": {
    "faqs": [{"question": "extract questions", "answer": "extract answers"}]
  },
  "finalCta": {
    "headline": "extract final CTA headline",
    "button": "extract CTA button text"
  }
}

Return ONLY the JSON structure with content extracted directly from the reference material.`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert B2B service page content creator. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    // Parse and validate the JSON response
    const parsedContent = JSON.parse(content);
    
    // Ensure all required sections are present
    const requiredSections = [
      'heroSection', 'introOverview', 'serviceOfferings', 'technologyTools',
      'processMethodology', 'whyChooseUs', 'trustSignals', 'testimonials',
      'faqs', 'finalCta'
    ];

    for (const section of requiredSections) {
      if (!parsedContent[section]) {
        throw new Error(`Missing required section: ${section}`);
      }
    }

    return parsedContent as GeneratedServiceContent;
  } catch (error) {
    console.error('Error generating service content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate service content: ${errorMessage}`);
  }
}

export async function generateServiceMetadata(
  serviceName: string,
  category: string,
  generatedContent: GeneratedServiceContent | { heroSection: { headline: string }; serviceOfferings: { title: string }; whyChooseUs: string[] | { whyChooseUs: string[] } }
): Promise<{
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  keywords: string;
}> {
  // Extract whyChooseUs array - handle both formats
  const whyChooseUsArray = Array.isArray(generatedContent.whyChooseUs) 
    ? generatedContent.whyChooseUs 
    : (generatedContent.whyChooseUs as any).whyChooseUs || [];

  const prompt = `Generate SEO metadata for a service page about "${serviceName}" in the "${category}" category.

Service details:
- Hero headline: ${generatedContent.heroSection.headline}
- Main offering: ${generatedContent.serviceOfferings.title}
- Key benefits: ${whyChooseUsArray.slice(0, 2).join(', ')}

Generate:
1. Meta title (50-60 characters, include service name and main benefit)
2. Meta description (150-160 characters, compelling and action-oriented)
3. Primary keyword (main search term for this service)
4. Secondary keywords (3-5 related terms, comma-separated)
5. Keywords (10-15 relevant keywords, comma-separated)

Target: USA/Canada business decision makers searching for this service.

Return as JSON with fields: metaTitle, metaDescription, primaryKeyword, secondaryKeywords, keywords`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No metadata generated from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating service metadata:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate service metadata: ${errorMessage}`);
  }
}

// Load hire developer structure
const getHireDeveloperStructure = () => {
  try {
    // Use relative path from current working directory
    const structurePath = join(process.cwd(), 'shared/hire-developer-page-structure.json');
    const structureContent = readFileSync(structurePath, 'utf-8');
    return JSON.parse(structureContent);
  } catch (error) {
    console.error('Error loading hire developer structure:', error);
    // Return fallback structure matching the new format
    return {
      "title": "Hire [Developer Type] Developers",
      "slug": "hire-[developer-type]-developers",
      "heroSection": {
        "title": "Hire [Developer Type]",
        "heroSubtitle": "Professional developers providing enterprise-grade solutions",
        "heroDescription": "Transform your business with expert developers who deliver results",
        "ctaText": "Hire Developers",
        "stats": ["250+ Developers", "24/7 Technical Support", "95% Client Retention Rate"]
      },
      "keySkillsSection": {
        "whyHireTitle": "Key Skills and Qualifications of Our [Developer Type] Developers",
        "whyHireDescription": "Professional expertise and capabilities",
        "whyHirePoints": [
          {"icon": "Brain", "title": "Core Technology", "description": "Expertise in primary technology"},
          {"icon": "Code", "title": "Programming Skills", "description": "Advanced programming capabilities"},
          {"icon": "Database", "title": "Data Integration", "description": "Database expertise"},
          {"icon": "Shield", "title": "Security", "description": "Security knowledge"},
          {"icon": "Zap", "title": "Performance", "description": "Optimization skills"},
          {"icon": "Settings", "title": "Architecture", "description": "System design"}
        ]
      }
    };
  }
};

export async function generateHireDeveloperFromReference(
  referenceContent: string,
  developerType: string,
  location: string = "USA & Canada"
): Promise<any> {
  const structure = getHireDeveloperStructure();
  
  // Clean markdown formatting from reference content
  const cleanedReference = referenceContent
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const prompt = `You are an expert content strategist specialized in creating hire developer content following the exact 4-section structured guidelines. Analyze the provided reference content and generate comprehensive hire developer page content.

REFERENCE CONTENT TO ANALYZE:
${cleanedReference}

CRITICAL REQUIREMENT: Generate content that follows the exact structure and formatting used by the existing hire developer pages for complete consistency.

Required Sections (Must Include All):

### 1. Hero Section
- **Title**: "Hire ${developerType}"
- **Hero Subtitle**: 2-3 professional sentences describing business value, modern solutions, and enterprise-grade quality
- **Hero Description**: 2-3 lines describing how these developers provide value to businesses
- **CTA Text**: "Hire Developers" 
- **3 Professional Stats**: "250+ Developers", "24/7 Technical Support", "95% Client Retention Rate"

### 2. Key Skills and Qualifications of Our ${developerType} Developers
- **Section Title**: "Key Skills and Qualifications of Our ${developerType} Developers"
- **Introduction**: Professional paragraph about developer expertise
- **6 Key Skills** with consistent icon mapping:
  - Brain: Core technology/framework expertise
  - Code: Programming/development skills  
  - Database: Data/integration capabilities
  - Shield: Security/compliance knowledge
  - Zap: Performance/optimization skills
  - Settings: Architecture/system design

### 3. What Our ${developerType} Developers Can Do for You
- **Section Title**: "What Our ${developerType} Developers Can Do for You"  
- **Introduction**: Paragraph highlighting business impact and solutions
- **6 Services** with consistent icon mapping:
  - MessageSquare: Consultation services
  - Code: Integration services
  - Wrench: Custom development
  - Zap: Core development/implementation
  - Settings: Fine-tuning/optimization
  - Globe: Advanced features/plugins

### 4. Technology Stack
- **Section Title**: "Technology Stack"
- **Description**: Professional intro about modern tools and enterprise solutions
- **4 Categories**: Core Technologies, Development Tools, Infrastructure, Specialized Tools
- **Technologies**: 6-8 relevant technologies per category for ${developerType} development

RESPOND WITH JSON IN THIS EXACT FORMAT:
{
  "title": "Hire ${developerType} Developers",
  "slug": "hire-${developerType.toLowerCase()}-developers",
  "heroSection": {
    "title": "Hire ${developerType}",
    "heroSubtitle": "Professional 2-3 sentence description emphasizing business value and enterprise solutions",
    "heroDescription": "2-3 lines describing how these developers provide value to businesses (cost efficiency, automation, scalability)",
    "ctaText": "Hire Developers",
    "stats": ["250+ Developers", "24/7 Technical Support", "95% Client Retention Rate"]
  },
  "keySkillsSection": {
    "whyHireTitle": "Key Skills and Qualifications of Our ${developerType} Developers",
    "whyHireDescription": "Professional paragraph about developer expertise and capabilities",
    "whyHirePoints": [
      {"icon": "Brain", "title": "Core Technology", "description": "Expertise in primary technology/framework"},
      {"icon": "Code", "title": "Programming Skills", "description": "Advanced programming capabilities"},
      {"icon": "Database", "title": "Data Integration", "description": "Database and integration expertise"},
      {"icon": "Shield", "title": "Security", "description": "Security and compliance knowledge"},
      {"icon": "Zap", "title": "Performance", "description": "Optimization and performance skills"},
      {"icon": "Settings", "title": "Architecture", "description": "System design and architecture"}
    ]
  },
  "servicesSection": {
    "servicesTitle": "What Our ${developerType} Developers Can Do for You",
    "servicesDescription": "Professional paragraph highlighting business impact and solutions",
    "servicesOffered": [
      {"icon": "MessageSquare", "title": "${developerType} Consultation", "description": "Expert guidance and strategy"},
      {"icon": "Code", "title": "${developerType} Integration", "description": "Seamless system integration"},
      {"icon": "Wrench", "title": "Custom ${developerType} Development", "description": "Tailored solutions"},
      {"icon": "Zap", "title": "${developerType} Implementation", "description": "Core development services"},
      {"icon": "Settings", "title": "Optimization Services", "description": "Performance tuning"},
      {"icon": "Globe", "title": "Advanced Features", "description": "Enhanced functionality"}
    ]
  },
  "technologyStack": {
    "title": "Technology Stack",
    "description": "Professional intro about modern tools and enterprise solutions specific to ${developerType} development",
    "categories": [
      {"name": "Core Technologies", "technologies": ["primary frameworks/languages specific to ${developerType}"]},
      {"name": "Development Tools", "technologies": ["tools and platforms specific to ${developerType}"]},
      {"name": "Infrastructure", "technologies": ["deployment and infrastructure tools for ${developerType}"]},
      {"name": "Specialized Tools", "technologies": ["specialized tools unique to ${developerType}"]}
    ]
  },
  "seoMetadata": {
    "metaTitle": "SEO optimized title under 60 characters",
    "metaDescription": "SEO optimized description under 160 characters",
    "primaryKeyword": "main SEO keyword",
    "secondaryKeywords": "comma-separated secondary keywords",
    "location": "${location}"
  }
}

Return ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text.`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist. Generate comprehensive hire developer content following the exact 4-section structured guidelines. Return only valid JSON without any markdown formatting or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    // Parse and clean the JSON response
    let parsedContent;
    try {
      // Remove any potential markdown formatting that might have slipped through
      const cleanedContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw content:', content);
      throw new Error("Invalid JSON response from AI");
    }

    return parsedContent;
  } catch (error) {
    console.error('Error generating hire developer content from reference:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate hire developer content: ${errorMessage}`);
  }
}