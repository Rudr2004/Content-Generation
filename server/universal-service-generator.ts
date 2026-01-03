import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

// Initialize OpenAI client only when needed and if API key is available
function getOpenAIClient(): OpenAI {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured. AI features are disabled.');
  }
  return openai;
}

// Universal Service Page Content Interface
export interface UniversalServiceContent {
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
    subtitle: string;
    components: Array<{
      name: string;
      description: string;
    }>;
  };
  trustSignals: {
    title: string;
    subtitle: string;
    metrics: Array<{
      label: string;
      value: string;
    }>;
  };
  capabilities: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  technicalFoundation: {
    title: string;
    subtitle: string;
    technologies: Array<{
      title: string;
      description: string;
    }>;
  };
  technologyTools: {
    categories: Array<{
      name: string;
      tools: string[];
    }>;
  };
  process: Array<{
    step: string;
    description: string;
  }>;
  whyChooseUs: string[];
  testimonials: Array<{
    quote: string;
    client: string;
    clientImage: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Generate universal service page content for any service type
 * Follows the exact same UI/UX structure as LLM Development Services
 */
export async function generateUniversalServiceContent(
  serviceName: string,
  targetAudience?: string,
  industryFocus?: string,
  seoKeywords?: string[]
): Promise<UniversalServiceContent> {
  
  try {
    const basePrompt = `Generate comprehensive service page content for: "${serviceName}"

CRITICAL REQUIREMENTS:
1. Follow the EXACT same structure as the LLM Development Services page
2. Maintain identical sections, order, and formatting
3. Adapt ONLY the content - never add or remove fields
4. Make it SEO-optimized, engaging, and professional
5. Target audience: ${targetAudience || 'businesses and enterprises'}
6. Industry focus: ${industryFocus || 'cross-industry'}
7. Primary keywords: ${seoKeywords?.join(', ') || serviceName}

RESPONSE FORMAT: Return ONLY valid JSON matching this exact structure:

{
  "heroSection": {
    "headline": "Service Name - Primary Value Proposition",
    "subheading": "Detailed description of transformation/benefits (2-3 sentences)",
    "ctaButton": "PRIMARY ACTION TEXT"
  },
  "introOverview": {
    "paragraphs": [
      "First paragraph: Overview of service and end-to-end solution approach",
      "Second paragraph: Specialization and custom approach details"
    ]
  },
  "serviceOfferings": {
    "title": "Service Category Title",
    "subtitle": "Descriptive subtitle about comprehensive solutions",
    "components": [
      {"name": "Core Service 1", "description": "Detailed description of primary service component"},
      {"name": "Consulting Service", "description": "Strategic guidance and consultation offering"},
      {"name": "Preparation Service", "description": "Data/requirement preparation and setup"},
      {"name": "Customization Service", "description": "Advanced customization and optimization"},
      {"name": "Development Service", "description": "End-to-end development and implementation"},
      {"name": "Integration Service", "description": "Integration with existing systems"},
      {"name": "Operations Service", "description": "Ongoing monitoring and optimization"}
    ]
  },
  "trustSignals": {
    "title": "Building Excellence Through Partnership",
    "subtitle": "Proven track record of delivering innovative solutions across industries worldwide",
    "metrics": [
      {"label": "Projects Completed", "value": "200+"},
      {"label": "Satisfied Clients", "value": "100+"},
      {"label": "Global Partners", "value": "120+"},
      {"label": "Years Experience", "value": "4+"},
      {"label": "Expert Developers", "value": "80+"}
    ]
  },
  "capabilities": {
    "title": "Advanced Service Capabilities",
    "subtitle": "Leverage cutting-edge technologies to unlock new possibilities for your business operations",
    "items": [
      {"title": "Primary Capability", "description": "Core technical capability description"},
      {"title": "Secondary Capability", "description": "Supporting technical capability"},
      {"title": "Additional Capability", "description": "Complementary service capability"}
    ]
  },
  "technicalFoundation": {
    "title": "Our Technical Foundation",
    "subtitle": "Built on proven methodologies and cutting-edge technologies for optimal performance",
    "technologies": [
      {"title": "Core Technology 1", "description": "Primary technology stack description"},
      {"title": "Core Technology 2", "description": "Secondary technology implementation"},
      {"title": "Advanced Feature 1", "description": "Specialized technical capability"},
      {"title": "Advanced Feature 2", "description": "Optimization and performance technology"},
      {"title": "Innovation Approach", "description": "Cutting-edge methodology and techniques"}
    ]
  },
  "technologyTools": {
    "categories": [
      {"name": "Primary Tools", "tools": ["Tool1", "Tool2", "Tool3", "Tool4", "Tool5"]},
      {"name": "Platforms", "tools": ["Platform1", "Platform2", "Platform3", "Platform4"]},
      {"name": "Development", "tools": ["DevTool1", "DevTool2", "DevTool3", "DevTool4"]},
      {"name": "Languages", "tools": ["Language1", "Language2", "Language3", "Language4"]},
      {"name": "Databases", "tools": ["DB1", "DB2", "DB3", "DB4"]},
      {"name": "Architecture", "tools": ["Arch1", "Arch2", "Arch3", "Arch4"]},
      {"name": "Specialized Tools", "tools": ["Spec1", "Spec2", "Spec3", "Spec4"]},
      {"name": "Deployment", "tools": ["Deploy1", "Deploy2", "Deploy3"]},
      {"name": "Monitoring", "tools": ["Monitor1", "Monitor2", "Monitor3"]},
      {"name": "Security", "tools": ["Security1", "Security2", "Security3", "Compliance"]}
    ]
  },
  "process": [
    {"step": "Discovery Phase", "description": "Initial consultation and requirement analysis"},
    {"step": "Planning Phase", "description": "Technical assessment and project planning"},
    {"step": "Development Phase", "description": "Core development and implementation"},
    {"step": "Implementation Phase", "description": "System deployment and integration"},
    {"step": "Testing Phase", "description": "Quality assurance and validation"},
    {"step": "Launch Phase", "description": "Go-live and optimization support"}
  ],
  "whyChooseUs": [
    "200+ successful projects delivered across diverse industries",
    "100+ trusted brands rely on our expertise and solutions",
    "120+ global partnerships for comprehensive support",
    "4+ years of specialized experience in the field",
    "80+ skilled developers and technical experts",
    "Enterprise-grade security and compliance standards",
    "End-to-end solutions from consultation to deployment",
    "Proven ROI improvement and business transformation"
  ],
  "testimonials": [
    {
      "quote": "Professional testimonial highlighting specific business impact and measurable results from the service",
      "client": "Client Name, Title at Company Name",
      "clientImage": "https://images.unsplash.com/photo-1494790108755-2616b612b44b?w=150&h=150&fit=crop&crop=face"
    },
    {
      "quote": "Second testimonial emphasizing technical excellence and strategic value delivered",
      "client": "Client Name, Role at Organization",
      "clientImage": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      "quote": "Third testimonial focusing on partnership quality and successful project delivery",
      "client": "Dr. Client Name, Position at Institute",
      "clientImage": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    }
  ],
  "faqs": [
    {"question": "How long does [service] typically take?", "answer": "Timeframe details with project variables and estimation approach"},
    {"question": "Can you integrate with our existing systems?", "answer": "Integration capabilities and compatibility details"},
    {"question": "What industries do you serve?", "answer": "Industry coverage and specialized solutions"},
    {"question": "How do you ensure security and compliance?", "answer": "Security protocols and compliance certifications"},
    {"question": "Do you provide ongoing support?", "answer": "Post-deployment support and maintenance details"},
    {"question": "What makes your approach different?", "answer": "Unique methodology and competitive advantages"},
    {"question": "What are the project requirements?", "answer": "Prerequisites and preparation requirements"}
  ]
}

CONTENT GUIDELINES:
- Write compelling, conversion-focused copy
- Use professional, authoritative tone
- Include specific technical details where relevant  
- Ensure all content is relevant to ${serviceName}
- Make testimonials realistic with specific business outcomes
- FAQs should address common concerns for this service type
- Technology tools should be authentic and industry-appropriate
- Process steps should reflect actual service delivery methodology

Generate content that follows this structure exactly but is fully customized for ${serviceName}.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: basePrompt }],
      max_tokens: 4000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate the JSON response
    const generatedContent: UniversalServiceContent = JSON.parse(responseContent);
    
    // Validate required structure
    if (!generatedContent.heroSection?.headline ||
        !generatedContent.serviceOfferings?.components ||
        !generatedContent.testimonials?.length) {
      throw new Error('Generated content missing required fields');
    }

    return generatedContent;

  } catch (error) {
    console.error('Error generating universal service content:', error);
    
    // Return fallback structure to prevent application crashes
    return generateFallbackContent(serviceName);
  }
}

/**
 * Generate fallback content structure when AI generation fails
 */
function generateFallbackContent(serviceName: string): UniversalServiceContent {
  return {
    heroSection: {
      headline: `Professional ${serviceName} Services`,
      subheading: `Transform your business with expert ${serviceName} solutions tailored to your specific requirements and goals.`,
      ctaButton: "GET STARTED"
    },
    introOverview: {
      paragraphs: [
        `Our comprehensive ${serviceName} solutions are designed to transform your business operations through cutting-edge technology and proven methodologies.`,
        `We specialize in delivering end-to-end solutions that are tailored to your specific business requirements and industry standards.`
      ]
    },
    serviceOfferings: {
      title: `Comprehensive ${serviceName} Solutions`,
      subtitle: "From consultation to deployment, we deliver end-to-end solutions that scale with your business growth",
      components: [
        { name: `${serviceName} Development`, description: "Custom development solutions tailored to your specific business requirements" },
        { name: `${serviceName} Consulting`, description: "Strategic guidance and expert consultation to maximize your investment" },
        { name: "Implementation Services", description: "Professional implementation and deployment with minimal business disruption" },
        { name: "Integration Solutions", description: "Seamless integration with your existing systems and workflows" },
        { name: "Support & Maintenance", description: "Ongoing support and maintenance to ensure optimal performance" }
      ]
    },
    trustSignals: {
      title: "Building Excellence Through Partnership",
      subtitle: "Proven track record of delivering innovative solutions across industries worldwide",
      metrics: [
        { label: "Projects Completed", value: "200+" },
        { label: "Satisfied Clients", value: "100+" },
        { label: "Global Partners", value: "120+" },
        { label: "Years Experience", value: "4+" },
        { label: "Expert Team", value: "80+" }
      ]
    },
    capabilities: {
      title: "Advanced Service Capabilities",
      subtitle: "Leverage cutting-edge technologies to unlock new possibilities for your business operations",
      items: [
        { title: "Custom Development", description: "Tailored solutions built to meet your specific business needs and requirements" },
        { title: "System Integration", description: "Seamless integration with existing business systems and third-party platforms" },
        { title: "Performance Optimization", description: "Advanced optimization techniques to maximize efficiency and performance" }
      ]
    },
    technicalFoundation: {
      title: "Our Technical Foundation",
      subtitle: "Built on proven methodologies and cutting-edge technologies for optimal performance",
      technologies: [
        { title: "Modern Architecture", description: "Scalable and maintainable architecture designed for long-term success" },
        { title: "Best Practices", description: "Industry best practices and proven methodologies for reliable delivery" },
        { title: "Quality Assurance", description: "Comprehensive testing and quality assurance processes" },
        { title: "Security Standards", description: "Enterprise-grade security protocols and compliance standards" },
        { title: "Continuous Innovation", description: "Ongoing research and adoption of emerging technologies" }
      ]
    },
    technologyTools: {
      categories: [
        { name: "Development Tools", tools: ["Modern Framework", "Development IDE", "Version Control", "Testing Tools"] },
        { name: "Cloud Platforms", tools: ["AWS", "Google Cloud", "Microsoft Azure", "Cloud Services"] },
        { name: "Databases", tools: ["SQL Database", "NoSQL Solutions", "Data Analytics", "Storage Solutions"] },
        { name: "Integration", tools: ["API Management", "Middleware", "ETL Tools", "Workflow Automation"] }
      ]
    },
    process: [
      { step: "Discovery", description: "Understand your requirements, goals, and technical constraints" },
      { step: "Planning", description: "Develop comprehensive project plan with timelines and milestones" },
      { step: "Development", description: "Build and develop your solution using best practices" },
      { step: "Testing", description: "Comprehensive testing and quality assurance validation" },
      { step: "Deployment", description: "Professional deployment with minimal business disruption" },
      { step: "Support", description: "Ongoing support and optimization for continued success" }
    ],
    whyChooseUs: [
      "200+ successful projects delivered across diverse industries",
      "100+ trusted brands rely on our expertise and solutions",
      "4+ years of specialized experience and proven track record",
      "80+ skilled professionals dedicated to your success",
      "Enterprise-grade security and compliance standards",
      "End-to-end solutions from consultation to deployment",
      "Proven ROI improvement and business transformation",
      "24/7 support and ongoing partnership commitment"
    ],
    testimonials: [
      {
        quote: "Their professional approach and technical expertise delivered exactly what we needed for our business transformation.",
        client: "Sarah Johnson, CTO at TechCorp",
        clientImage: "https://images.unsplash.com/photo-1494790108755-2616b612b44b?w=150&h=150&fit=crop&crop=face"
      },
      {
        quote: "Outstanding project delivery and ongoing support. They truly understand business requirements and technical challenges.",
        client: "Michael Chen, Director of Operations",
        clientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        quote: "Professional team with deep expertise. They delivered our solution on time and exceeded our expectations.",
        client: "Dr. Emily Watson, Head of Technology",
        clientImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      }
    ],
    faqs: [
      {
        question: `How long does ${serviceName} implementation typically take?`,
        answer: "Project timelines vary based on complexity and requirements, typically ranging from 2-6 months with detailed planning and regular milestones."
      },
      {
        question: "Can you integrate with our existing systems?",
        answer: "Yes, we specialize in seamless integration with existing business systems, platforms, and workflows with minimal disruption."
      },
      {
        question: "What industries do you serve?",
        answer: "We serve diverse industries including healthcare, finance, technology, manufacturing, and retail with specialized solutions."
      },
      {
        question: "How do you ensure project success?",
        answer: "Through proven methodologies, regular communication, comprehensive testing, and ongoing support throughout the project lifecycle."
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes, we offer comprehensive support, maintenance, and optimization services to ensure continued success after deployment."
      }
    ]
  };
}

/**
 * Generate SEO metadata for universal service pages
 */
export async function generateServiceSeoMeta(serviceName: string, content: UniversalServiceContent): Promise<{
  metaTitle: string;
  metaDescription: string;
}> {
  try {
    const prompt = `Generate SEO meta title and description for "${serviceName}" service page.

Hero: ${content.heroSection.headline}
Key Services: ${content.serviceOfferings.components.slice(0, 3).map(c => c.name).join(', ')}

Requirements:
- Meta title: 50-60 characters, include primary keyword "${serviceName}"
- Meta description: 150-160 characters, compelling with CTA
- Focus on business value and transformation
- Target North American market

Return JSON:
{
  "metaTitle": "title here",
  "metaDescription": "description here"
}`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) throw new Error('No SEO response from OpenAI');

    return JSON.parse(responseContent);
  } catch (error) {
    console.error('Error generating SEO meta:', error);
    return {
      metaTitle: `Professional ${serviceName} Services | GreenAppleX`,
      metaDescription: `Transform your business with expert ${serviceName} solutions. Professional development, proven results. Get started with our experienced team today.`
    };
  }
}