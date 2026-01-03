import type { HirePage } from "@shared/schema";

export interface AIHireContentRequest {
  developerType: string;
  location?: string;
  companySectors?: string[];
}

export interface AIHireContentResponse {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  whyHireTitle: string;
  whyHireDescription: string;
  whyHirePoints: {
    icon: string;
    title: string;
    description: string;
  }[];
  servicesTitle: string;
  servicesDescription: string;
  servicesOffered: {
    icon: string;
    title: string;
    description: string;
  }[];
  technologyStack: {
    description: string;
    categories: {
      name: string;
      technologies: string[];
    }[];
  };
  testimonials: {
    clientName: string;
    clientCompany: string;
    clientPosition: string;
    testimonialText: string;
    rating: number;
  }[];
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  developerType: string;
  location: string;
}

export async function generateHireDeveloperContent(request: AIHireContentRequest): Promise<AIHireContentResponse> {
  const { developerType, location = "USA & Canada", companySectors = ["startups", "enterprises"] } = request;

  const prompt = `Generate comprehensive hire developer page content for "${developerType}" developers. 

Requirements:
- Target market: ${location}
- Target sectors: ${companySectors.join(", ")}
- Professional, conversion-focused tone
- SEO-optimized content
- Include specific technologies and real-world benefits

Generate JSON with this exact structure:
{
  "heroTitle": "Professional title (under 60 chars)",
  "heroSubtitle": "Compelling subtitle highlighting expertise",
  "heroDescription": "2-3 sentences describing value proposition and expertise",
  "whyHireTitle": "Section title for key skills/qualifications",
  "whyHireDescription": "2 sentences explaining developer expertise and value",
  "whyHirePoints": [
    {
      "icon": "Code|Zap|Shield|Settings|Users|Brain|Star|Cpu", 
      "title": "Skill title (3-4 words)",
      "description": "Brief description (1 sentence)"
    }
    // Generate 4-6 points
  ],
  "servicesTitle": "What Our [Type] Developers Can Do for You",
  "servicesDescription": "2-3 sentences about services and capabilities",
  "servicesOffered": [
    {
      "icon": "MessageSquare|Code|Wrench|Zap|Settings|Globe",
      "title": "Service name",
      "description": "Service description (1 sentence)"
    }
    // Generate 6 services
  ],
  "technologyStack": {
    "description": "Our [Type] Developers utilize cutting-edge technologies...",
    "categories": [
      {
        "name": "Category name (e.g., 'Core Technologies')",
        "technologies": ["Tech1", "Tech2", "Tech3", "Tech4", "Tech5"]
      }
      // Generate 3-4 relevant technology categories
    ]
  },
  "testimonials": [
    {
      "clientName": "Realistic American/Canadian name",
      "clientCompany": "Professional company name",
      "clientPosition": "CTO|VP Engineering|Tech Lead|CEO|Founder",
      "testimonialText": "2-3 sentences about specific results and expertise (40-60 words)",
      "rating": 5
    }
    // Generate 3 testimonials
  ],
  "metaTitle": "Hire Expert [Type] Developers | ${location}",
  "metaDescription": "Hire top [Type] Developers in ${location} for [specific benefits]. [Call to action] (140-160 chars)",
  "primaryKeyword": "[Type] Developers",
  "secondaryKeywords": "hire [type] developers, [type] development services, [related keywords]",
  "developerType": "${developerType} Developers",
  "location": "${location}"
}

Make the content specific to ${developerType} development, including relevant technologies, frameworks, and industry-specific benefits.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: 'system',
          content: 'You are an expert content strategist specializing in developer hiring and technical recruitment. Generate professional, conversion-focused content that highlights technical expertise and business value.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);

  return content;
}

export async function generateTestimonials(developerType: string, count: number = 3): Promise<AIHireContentResponse['testimonials']> {
  const prompt = `Generate ${count} realistic client testimonials for hiring ${developerType} developers.

Each testimonial should:
- Use realistic American/Canadian names
- Include professional company names (tech-focused)
- Mention specific technical benefits and results
- Be 40-60 words each
- Focus on business impact and technical expertise

Return as JSON with this exact structure:
{
  "testimonials": [
    {
      "clientName": "string",
      "clientCompany": "string", 
      "clientPosition": "string",
      "testimonialText": "string",
      "rating": 5
    }
  ]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  return result.testimonials || [];
}