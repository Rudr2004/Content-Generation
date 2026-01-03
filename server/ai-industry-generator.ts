import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IndustryContentRequest {
  industryType: string;
  primaryFocus: string;
  geographicFocus?: string;
  companySize?: string;
  challenges?: string;
  solutions?: string;
  targetAudience?: string;
  businessModel?: string;
}

export interface IndustryContentResponse {
  heroSection: {
    title: string;
    heroSubtitle: string;
    heroDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  overview: {
    title: string;
    introduction: string;
    industryMetrics: Array<{
      icon: string;
      value: string;
      label: string;
    }>;
  };
  industriesDetail: {
    title: string;
    industries: Array<{
      icon: string;
      name: string;
      description: string;
    }>;
  };
  technologyStack: {
    title: string;
    categories: Array<{
      name: string;
      technologies: string[];
    }>;
  };
  engagementProcess: {
    title: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  whyChooseUs: {
    title: string;
    introduction: string;
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    image?: string;
    rating: number;
    content: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  focusKeyword: string;
}

/**
 * Generate SEO-optimized keywords for industry pages
 */
export async function generateIndustryKeywords(title: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO keyword strategist specializing in industry and business sector keywords.

CRITICAL: Extract the EXACT industry and focus area from the page title and generate keywords specifically for that combination.

For titles like "Fintech Solutions" or "Healthcare Technology", generate keywords that match the EXACT title format:

🏭 **Industry Extraction Rules:**
- If title contains specific industry (Fintech, Healthcare, Manufacturing, etc.) → use that exact industry term
- Include both broad industry terms and specific sub-sectors
- Generate both formal and informal variations (e.g., "financial technology" and "fintech")
- Include related industry terms and synonyms

🎯 **Focus Area Extraction Rules:**
- Extract exact focus from title (Solutions, Technology, Services, Development, etc.)
- Include related service terms and offerings
- Use both service and outcome-focused terms

✅ **Required Keyword Categories:**
1. **Exact Title Match**: Keywords that exactly match the title structure
2. **Industry Variations**: Different ways to refer to the industry
3. **Service Variations**: Different ways to describe the offerings
4. **Commercial Intent**: solutions, services, consulting, development, systems
5. **Business Types**: enterprise, startup, SMB, corporation, agency
6. **Technology Focus**: digital transformation, innovation, automation, AI
7. **Outcome Focus**: growth, efficiency, optimization, competitive advantage
8. **Geographic**: USA, North America, global, international

**Example for "Fintech Solutions":**
- "fintech solutions"
- "financial technology services"
- "fintech development"
- "financial software solutions"
- "banking technology"
- "payment processing solutions"
- "fintech consulting services"
- "financial innovation"
- "digital banking solutions"
- "fintech startup solutions"

Generate 25-30 highly relevant, industry-specific keywords. Return as JSON: {"keywords": ["keyword1", "keyword2", ...]}`
        },
        {
          role: "user",
          content: `Generate SEO keywords for this EXACT industry page title: "${title}"

CRITICAL REQUIREMENTS:
- Focus on the EXACT industry mentioned in the title
- Include service/solution-focused keywords
- Cover different business sizes and markets
- Include both technical and business-focused terms
- Ensure high commercial intent keywords

Return only the JSON with keywords array.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.keywords || [];
  } catch (error: any) {
    console.log("OpenAI API failed for industry keywords, using fallback:", error.message);
    return generateFallbackIndustryKeywords(title);
  }
}

function generateFallbackIndustryKeywords(title: string): string[] {
  const words = title.toLowerCase().split(/\s+/);
  const industry = words[0];
  
  return [
    `${industry} solutions`,
    `${industry} services`,
    `${industry} technology`,
    `${industry} consulting`,
    `${industry} development`,
    `digital ${industry}`,
    `${industry} innovation`,
    `${industry} transformation`,
    `${industry} automation`,
    `${industry} software`,
    `${industry} systems`,
    `enterprise ${industry}`,
    `${industry} company`,
    `${industry} experts`,
    `professional ${industry}`
  ];
}

/**
 * Generate multiple title suggestions for industry pages
 */
export async function generateIndustryTitles(industryType: string, market: string = "Global"): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert content strategist specializing in B2B industry page titles.

Generate 20 compelling, SEO-optimized title variations for industry pages targeting the ${market} market.

Requirements:
1. Focus on the specific industry: ${industryType}
2. Include variations for different angles (solutions, services, consulting, development)
3. Mix broad and specific approaches
4. Include outcome-focused titles
5. Ensure commercial intent and professional tone
6. Vary length from 3-8 words
7. Include both service-focused and industry-focused titles

Title Categories to Include:
- Direct Service: "[Industry] Solutions", "[Industry] Services"
- Outcome-Focused: "[Industry] Digital Transformation", "[Industry] Innovation"
- Technology-Focused: "[Industry] Technology Solutions", "[Industry] Software"
- Process-Focused: "[Industry] Consulting", "[Industry] Development"
- Market-Focused: "Enterprise [Industry]", "[Industry] for Startups"

Return as JSON array: {"titles": ["title1", "title2", ...]}`
        },
        {
          role: "user",
          content: `Generate industry page titles for: ${industryType} (Market: ${market})`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.titles || [];
  } catch (error: any) {
    console.log("OpenAI API failed for industry titles, using fallback:", error.message);
    return [
      `${industryType} Solutions`,
      `${industryType} Services`,
      `${industryType} Technology`,
      `Digital ${industryType}`,
      `${industryType} Consulting`
    ];
  }
}

/**
 * Generate comprehensive industry page content following the structured format
 */
export async function generateIndustryContent(request: IndustryContentRequest): Promise<IndustryContentResponse> {
  const { 
    industryType, 
    primaryFocus, 
    geographicFocus, 
    companySize, 
    challenges, 
    solutions,
    targetAudience,
    businessModel
  } = request;

  try {
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert B2B content generator for industry solution pages following comprehensive structured guidelines.

🎯 **CRITICAL REQUIREMENT**: Generate COMPLETE content with ALL required arrays fully populated. Every section must be comprehensive and professional.

⚠️ **MANDATORY ARRAY COMPLETENESS**:
- industryMetrics MUST contain EXACTLY 4 items (no more, no less)
- industries MUST contain EXACTLY 6 items (no more, no less)
- technologyStack.categories MUST contain EXACTLY 4 categories with 6-8 technologies each
- engagementProcess.steps MUST contain EXACTLY 5 steps (no more, no less)
- benefits MUST contain EXACTLY 6 items (no more, no less)
- testimonials MUST contain EXACTLY 3 items (no more, no less)
- faqs MUST contain EXACTLY 5 items (no more, no less)

📐 **Required Sections (Must Include All - COMPLETE ARRAYS REQUIRED):**

### 1. Hero Section
- **Title**: Focus on the industry type and primary value proposition
- **Hero Subtitle**: 2-3 professional sentences describing business transformation and competitive advantages
- **Hero Description**: 2-3 lines describing digital transformation impact and business outcomes
- **CTA Primary**: Action-oriented button text
- **CTA Secondary**: Secondary action option

### 2. Overview Section
- **Section Title**: "Why [Industry] Needs Digital Transformation"
- **Introduction**: Professional paragraph about industry challenges and opportunities
- **EXACTLY 4 Industry Metrics** with consistent icon mapping:
  1. TrendingUp: Market growth/size metric
  2. Users: Customer/user base metric
  3. DollarSign: Revenue/cost impact metric
  4. Clock: Efficiency/speed improvement metric

### 3. Industries Detail Section
- **Section Title**: "Industries We Serve"
- **EXACTLY 6 Industry Sub-sectors** with consistent icon mapping:
  1. Building2: Enterprise/Corporate
  2. Factory: Manufacturing/Production
  3. Heart: Healthcare/Wellness
  4. GraduationCap: Education/Training
  5. ShoppingCart: Retail/Commerce
  6. Globe: Technology/Digital

### 4. Technology Stack
- **Section Title**: "Our Technology Stack"
- **EXACTLY 4 Technology Categories** with 6-8 technologies each:
  1. Frontend Technologies
  2. Backend & Cloud
  3. Data & Analytics
  4. Integration & DevOps

### 5. Engagement Process
- **Section Title**: "Our Proven Process"
- **EXACTLY 5 Process Steps**:
  1. Discovery & Assessment
  2. Strategy & Planning
  3. Development & Implementation
  4. Testing & Optimization
  5. Launch & Support

### 6. Why Choose Us
- **Section Title**: "Why Choose Us for [Industry] Solutions"
- **Introduction**: Paragraph about competitive advantages
- **EXACTLY 6 Benefits** with consistent icon mapping:
  1. Award: Industry expertise and recognition
  2. Shield: Security and compliance
  3. Zap: Performance and efficiency
  4. Clock: Speed and agility
  5. Users: Team and support quality
  6. TrendingUp: Results and ROI

### 7. Testimonials
- **EXACTLY 3 Client Testimonials** with:
  - Professional names and positions
  - Real company names (can be generic but professional)
  - 5-star ratings
  - Detailed, specific feedback

### 8. FAQs
- **EXACTLY 5 Frequently Asked Questions** covering:
  - Implementation timeline
  - Technology requirements
  - Cost and pricing
  - Support and maintenance
  - Industry-specific compliance

### 9. SEO Elements
- **Meta Title**: 50-60 characters, industry-focused
- **Meta Description**: 150-160 characters, compelling with benefits
- **Keywords**: Comma-separated list of 15-20 relevant keywords
- **Focus Keyword**: Primary SEO keyword for the page

**Response Format**: Return ONLY valid JSON matching the IndustryContentResponse interface exactly.`
        },
        {
          role: "user",
          content: `Generate comprehensive industry page content for:

Industry Type: ${industryType}
Primary Focus: ${primaryFocus}
Geographic Focus: ${geographicFocus || 'Global'}
Company Size: ${companySize || 'All Sizes'}
Key Challenges: ${challenges || 'Digital transformation, efficiency, competition'}
Key Solutions: ${solutions || 'Technology solutions, process optimization, digital innovation'}
Target Audience: ${targetAudience || 'Business leaders, IT decision makers'}
Business Model: ${businessModel || 'B2B services and solutions'}

Create content that positions us as the leading provider of ${primaryFocus} for the ${industryType} industry, highlighting our expertise, proven process, and successful outcomes.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4500
    });

    const result = JSON.parse(contentResponse.choices[0].message.content!);
    return result as IndustryContentResponse;
  } catch (error: any) {
    console.error("Error generating industry content:", error);
    throw new Error(`Failed to generate industry content: ${error.message}`);
  }
}

/**
 * Generate industry-specific technology content
 */
export async function generateIndustryTechContent(industryType: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert technology consultant specializing in industry-specific technology stacks and solutions.

Generate comprehensive technology stack and testimonial content for the ${industryType} industry.

Requirements:
1. Create 4 technology categories with 6-8 relevant technologies each
2. Include modern, industry-specific technologies
3. Generate 2 realistic testimonials from ${industryType} industry professionals
4. Focus on technologies that solve real industry challenges

Return JSON format:
{
  "technologyStack": {
    "categories": [
      {
        "name": "category name",
        "technologies": ["tech1", "tech2", ...]
      }
    ]
  },
  "testimonials": [
    {
      "name": "Professional Name",
      "position": "Job Title",
      "company": "Company Name",
      "rating": 5,
      "content": "Detailed testimonial content"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Generate technology stack and testimonials for the ${industryType} industry.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error: any) {
    console.error("Error generating industry tech content:", error);
    throw new Error(`Failed to generate tech content: ${error.message}`);
  }
}