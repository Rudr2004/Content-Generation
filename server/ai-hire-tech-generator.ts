import { getOpenAIClient, isOpenAIAvailable } from './openai-client';

export interface TechnologyStack {
  frontend: string[];
  backend: string[];
  devops: string[];
  machineLearning: string[];
  database: string[];
  mobile: string[];
  informationSecurity: string[];
}

export interface HireTechTestimonial {
  clientName: string;
  clientCompany: string;
  clientIndustry: string;
  testimonialText: string;
  projectType: string;
}

export interface HireTechContent {
  technologyStack: TechnologyStack;
  testimonials: HireTechTestimonial[];
}

/**
 * Generate technology stack and testimonials for a specific technology/developer type
 */
export async function generateHireTechContent(technology: string): Promise<HireTechContent> {
  try {
    // Check if OpenAI is available
    if (!isOpenAIAvailable()) {
      console.log(`OpenAI not available for ${technology}, using fallback content`);
      return generateFallbackContent(technology);
    }

    const openai = getOpenAIClient();
    const prompt = `You are generating content for a "Hire ${technology} Developer" landing page.

1. Technology Stack:
Generate a categorized list of the most relevant and modern tools, libraries, and technologies used by ${technology} developers. The structure must be:

- Frontend: (if applicable to ${technology})
- Backend: (if applicable to ${technology})
- DevOps: (deployment, CI/CD, monitoring tools)
- Machine Learning: (ML frameworks and tools if applicable to ${technology})
- Database: (database technologies used with ${technology})
- Mobile: (mobile development tools if applicable to ${technology})
- Information Security: (security tools and practices for ${technology})

Only include technologies commonly used in real-world ${technology} projects. Keep it precise and avoid filler. Include 3-5 items per relevant category.

2. Client Testimonials:
Write exactly 3 short client testimonials (each 30–50 words) for successful ${technology} developer hires. Each testimonial should:
- Mention the client type or industry (e.g., fintech startup, e-commerce brand)
- Highlight the developer's expertise in ${technology}
- Be unique and not generic
- Include realistic client names and company names
IMPORTANT: Use only clearly gendered names to avoid confusion.
MALE NAMES: Michael, David, James, Robert, John, William, Richard, Christopher, Matthew, Anthony, Daniel, Mark, Steven, Paul, Andrew, Joshua, Kenneth, Kevin, Brian, George
FEMALE NAMES: Sarah, Jennifer, Lisa, Nancy, Karen, Betty, Helen, Sandra, Donna, Carol, Ruth, Sharon, Michelle, Laura, Emily, Kimberly, Deborah, Dorothy, Amy, Angela

Return the response in this exact JSON format:
{
  "technologyStack": {
    "frontend": ["tool1", "tool2", ...],
    "backend": ["tool1", "tool2", ...],
    "devops": ["tool1", "tool2", ...],
    "machineLearning": ["tool1", "tool2", ...],
    "database": ["tool1", "tool2", ...],
    "mobile": ["tool1", "tool2", ...],
    "informationSecurity": ["tool1", "tool2", ...]
  },
  "testimonials": [
    {
      "clientName": "Full Name",
      "clientCompany": "Company Name", 
      "clientIndustry": "Industry",
      "testimonialText": "testimonial text here (30-50 words)",
      "projectType": "specific project type"
    },
    {
      "clientName": "Full Name 2",
      "clientCompany": "Company Name 2", 
      "clientIndustry": "Industry 2",
      "testimonialText": "testimonial text here (30-50 words)",
      "projectType": "specific project type"
    },
    {
      "clientName": "Full Name 3",
      "clientCompany": "Company Name 3", 
      "clientIndustry": "Industry 3",
      "testimonialText": "testimonial text here (30-50 words)",
      "projectType": "specific project type"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter and developer hiring consultant. Generate realistic, specific technology stacks and authentic client testimonials for developer hiring pages. Always return valid JSON."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Clean and parse the JSON response - remove markdown formatting if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsedContent = JSON.parse(cleanContent);
    
    // Validate the structure
    if (!parsedContent.technologyStack || !parsedContent.testimonials) {
      throw new Error('Invalid content structure from OpenAI');
    }

    return parsedContent as HireTechContent;

  } catch (error) {
    console.error('Error generating hire tech content:', error);
    
    // Return fallback content if OpenAI fails
    return generateFallbackContent(technology);
  }
}

/**
 * Generate fallback content when OpenAI is not available
 */
function generateFallbackContent(technology: string): HireTechContent {
  // Generic fallback - in production, you might want more specific fallbacks per technology
  return {
    technologyStack: {
      frontend: [`${technology} UI`, "HTML5", "CSS3", "JavaScript"],
      backend: [`${technology} Core`, "REST APIs", "Database Integration"],
      devops: ["Git", "Docker", "CI/CD", "Cloud Deployment"],
      machineLearning: [`${technology} ML`, "Data Processing", "Model Training"],
      database: ["PostgreSQL", "MongoDB", "Redis"],
      mobile: [`${technology} Mobile`, "React Native", "Flutter"],
      informationSecurity: ["Authentication", "Encryption", "Security Testing"]
    },
    testimonials: [
      {
        clientName: "Sarah Wilson",
        clientCompany: "TechStart Inc",
        clientIndustry: "Technology",
        testimonialText: `Our ${technology} developer delivered exceptional results, implementing complex features with clean, maintainable code that exceeded our expectations.`,
        projectType: `${technology} Application Development`
      },
      {
        clientName: "Michael Rodriguez", 
        clientCompany: "InnovateCorp",
        clientIndustry: "E-commerce",
        testimonialText: `The ${technology} expertise was evident from day one. They built a scalable solution that improved our system performance by 40%.`,
        projectType: `${technology} Platform Migration`
      },
      {
        clientName: "Jennifer Thompson",
        clientCompany: "DataFlow Solutions", 
        clientIndustry: "FinTech",
        testimonialText: `Professional, skilled, and responsive. Our ${technology} project was completed on time with excellent code quality and thorough documentation.`,
        projectType: `${technology} Integration Project`
      }
    ]
  };
}