import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate SEO keywords for hire developer pages
export async function generateHireDeveloperKeywords(title: string, region: string = "USA, Canada"): Promise<string[]> {
  try {
    const regions = region ? region.split(',').map(r => r.trim()).filter(Boolean) : ["USA", "Canada"];
    const regionList = regions.join(", ");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO keyword strategist specializing in hiring and recruitment keywords for ${regionList} markets.

CRITICAL: Extract the EXACT technology and location from the page title and generate keywords specifically for that combination.

For titles like "Hire LLM Developer in Austin" or "Hire React Developers in Toronto", generate keywords that match the EXACT title format:

📍 **Location Extraction Rules:**
- If title contains "in [City]" → use that specific city (e.g., "Austin", "Toronto", "New York")
- If title contains state/province → include it (e.g., "Austin Texas", "Toronto Ontario")
- Always include broader location terms (${regionList})
- Generate both city-specific AND country-wide variations for ${regionList}

🔧 **Technology Extraction Rules:**
- Extract exact technology from title (LLM, React, Python, Blockchain, etc.)
- Use both full terms and abbreviations where applicable
- Include related technology terms (e.g., for "LLM": AI, Machine Learning, ChatGPT, OpenAI)

✅ **Required Keyword Categories:**
1. **Exact Title Match**: Keywords that exactly match the title structure
2. **Location Variations**: City, state/province, country combinations
3. **Technology Variations**: Different ways to refer to the technology
4. **Commercial Intent**: hire, outsource, find, recruit, engage
5. **Experience Levels**: senior, junior, expert, experienced, freelance
6. **Service Types**: development, consulting, programming, engineering
7. **Company Types**: startup, enterprise, small business, agency
8. **Engagement Models**: remote, onsite, contract, full-time, part-time

**Example for "Hire LLM Developer in Austin":**
- "hire LLM developer Austin"
- "LLM developer Austin Texas" 
- "hire AI developer Austin"
- "machine learning developer Austin"
- "ChatGPT developer Austin"
- "hire LLM programmers Austin Texas"
- "Austin LLM development services"
- "expert LLM developers Austin"
- "senior AI developers Austin Texas"
- "hire remote LLM developers Austin"

Generate 25-30 highly relevant, title-specific keywords. Return as JSON: {"keywords": ["keyword1", "keyword2", ...]}`
        },
        {
          role: "user",
          content: `Generate SEO keywords for this EXACT hire developer page title: "${title}"

CRITICAL REQUIREMENTS:
1. If the title contains a specific city (e.g., "Los Angeles", "Austin", "Toronto"), generate keywords that include that EXACT city name
2. For "Hire LLM Developers in Los Angeles" - generate keywords like:
   - "hire LLM developers Los Angeles"
   - "LLM developers Los Angeles" 
   - "hire LLM developers in Los Angeles"
   - "Los Angeles LLM developers"
   - "LLM development Los Angeles"
   - "expert LLM developers Los Angeles"
   - "senior LLM developers Los Angeles"

3. Extract the exact technology term from title (LLM, React, Python, etc.) and use it consistently
4. Always include location variations: city only, city + state, and broader regions
5. Generate 25-30 keywords that match the title's specific format

Focus on the EXACT combination of technology + location from the title.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.keywords || [];
  } catch (error: any) {
    console.log("OpenAI API failed for hire developer keywords, using fallback:", error.message);
    return generateFallbackHireKeywords(title, region);
  }
}

// Fallback keyword generation for hire developer pages
export function generateFallbackHireKeywords(title: string, region: string = "USA, Canada"): string[] {
  const baseTitle = title.toLowerCase();
  
  // Extract technology from title (supports various formats)
  const techMatch = baseTitle.match(/hire (\w+) developers?/) || 
                   baseTitle.match(/(\w+) developers?/) || 
                   baseTitle.match(/(\w+) development/);
  const technology = techMatch ? techMatch[1] : "software";
  
  // Extract location from title (supports "in City", "City", etc.)
  // Enhanced to handle multi-word cities like "Los Angeles", "New York", "San Francisco"
  const locationMatch = baseTitle.match(/in ([a-zA-Z\s]+?)(?:\s*$|\s+(?:developers?|development))/) || 
                       baseTitle.match(/([a-zA-Z\s]+?)(?:\s+developers?|\s+development)/);
  const location = locationMatch ? locationMatch[1].trim() : "";
  
  // Base keywords without location
  const baseKeywords = [
    `hire ${technology} developers`,
    `${technology} development services`,
    `expert ${technology} programmers`,
    `senior ${technology} developers`,
    `${technology} consulting services`,
    `outsource ${technology} development`,
    `${technology} development company`,
    `hire remote ${technology} developers`,
    `${technology} developers for hire`,
    `best ${technology} developers`,
    `${technology} development team`,
    `freelance ${technology} developers`,
    `${technology} programming services`,
    `custom ${technology} development`,
    `${technology} software development`,
    `hire dedicated ${technology} developers`,
    `${technology} development outsourcing`,
    `professional ${technology} developers`,
    `${technology} development agency`,
    `enterprise ${technology} development`,
    `startup ${technology} developers`,
    `contract ${technology} developers`,
    `full time ${technology} developers`
  ];
  
  // Add location-specific keywords if location is found
  if (location) {
    const locationKeywords = [
      `hire ${technology} developers ${location}`,
      `${technology} developers ${location}`,
      `${technology} development services ${location}`,
      `expert ${technology} developers ${location}`,
      `senior ${technology} programmers ${location}`,
      `${location} ${technology} development company`,
      `${technology} developers for hire ${location}`,
      `outsource ${technology} development ${location}`,
      `${location} ${technology} consulting services`,
      `hire ${technology} developers in ${location}`,
      `${technology} development team ${location}`,
      `freelance ${technology} developers ${location}`
    ];
    
    return [...locationKeywords, ...baseKeywords];
  }
  
  // Add region-specific keywords
  const regions = region ? region.split(',').map(r => r.trim()).filter(Boolean) : ["USA", "Canada"];
  const defaultLocationKeywords = regions.flatMap(r => [
    `hire ${technology} developers ${r}`,
    `${technology} developers ${r}`,
    `${technology} development services ${r}`,
    `hire ${technology} developers in ${r}`
  ]);
  
  return [...defaultLocationKeywords, ...baseKeywords];
}

interface HireDeveloperRequest {
  developerType: string;
  location: string;
  primarySkills?: string;
  experienceLevel?: string;
  projectTypes?: string;
  companySize?: string;
  budget?: string;
  timeline?: string;
  referenceContent?: string;
  metrics?: {
    projects: string;
    years: string;
    revenue: string;
    clients: string;
  };
  trustBadges?: string[];
}

interface HireDeveloperResponse {
  title: string;
  slug: string;
  heroSubtitle: string;
  heroDescription: string;
  whyHireTitle: string;
  whyHireDescription: string;
  whyHirePoints: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  servicesTitle: string;
  servicesDescription: string;
  servicesOffered: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  technologyStack: {
    description: string;
    categories: Array<{
      name: string;
      technologies: string[];
    }>;
  };
  faqTitle: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  developerType: string;
  location: string;
}

export async function generateHireDeveloperTitles(
  developerType: string,
  targetMarket: string = "USA & Canada"
): Promise<string[]> {
  try {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Generate 8 professional, SEO-optimized page titles for hiring ${developerType} developers targeting ${targetMarket} market.

Requirements:
- Include variations with "Hire", "Expert", "Dedicated", "Offshore"
- Target businesses looking to hire developers
- Include location terms (USA, Canada, North America)
- Make titles compelling and search-friendly
- Focus on business benefits and expertise
- Length: 50-60 characters optimal for SEO

Examples for reference:
- "Hire Expert ${developerType} Developers in USA & Canada"
- "Dedicated ${developerType} Development Team - North America"
- "Offshore ${developerType} Developers for USA Businesses"

Generate 8 unique, professional titles in JSON format: {"titles": ["title1", "title2", ...]}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 800,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return result.titles || [];

  } catch (error: any) {
    console.error("Error generating hire developer titles:", error);
    throw new Error("Failed to generate titles: " + (error?.message || "Unknown error"));
  }
}

export async function generateHireDeveloperContent(request: HireDeveloperRequest): Promise<HireDeveloperResponse> {
  const { 
    developerType, 
    location, 
    primarySkills, 
    experienceLevel, 
    projectTypes, 
    companySize, 
    budget, 
    timeline,
    referenceContent,
    metrics,
    trustBadges 
  } = request;

  // Generate content following the NEW structured guidelines exactly
  const contentResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert content generator for the Hire Developer CMS following the comprehensive structured guidelines.

🎯 **CRITICAL REQUIREMENT**: Generate COMPLETE content with ALL required arrays fully populated. Every section must be comprehensive and professional.

⚠️ **MANDATORY ARRAY COMPLETENESS**:
- whyHirePoints MUST contain EXACTLY 6 items (no more, no less)
- servicesOffered MUST contain EXACTLY 6 items (no more, no less)  
- faqs MUST contain EXACTLY 5 items (no more, no less)
- technologyStack.categories MUST contain EXACTLY 4 categories with 6-8 technologies each

📐 **Required Sections (Must Include All - COMPLETE ARRAYS REQUIRED):**

### 1. Hero Section
- **Title**: "Hire [Developer Type]"
- **Hero Subtitle**: 2-3 professional sentences describing business value, modern solutions, and enterprise-grade quality
- **Hero Description**: 2-3 lines describing business value (cost efficiency, automation, scalability)

### 2. Key Skills and Qualifications of Our [Type] Developers
- **Section Title**: "Key Skills and Qualifications of Our [Type] Developers"
- **Introduction**: Professional paragraph about developer expertise
- **EXACTLY 6 Key Skills** with consistent icon mapping (REQUIRED - DO NOT GENERATE LESS THAN 6):
  1. Brain: Core technology/framework expertise
  2. Code: Programming/development skills  
  3. Database: Data/integration capabilities
  4. Shield: Security/compliance knowledge
  5. Zap: Performance/optimization skills
  6. Settings: Architecture/system design

### 3. What Our [Type] Developers Can Do for You
- **Section Title**: "What Our [Type] Developers Can Do for You"  
- **Introduction**: Paragraph highlighting business impact and solutions
- **EXACTLY 6 Services** with consistent icon mapping (REQUIRED - DO NOT GENERATE LESS THAN 6):
  1. MessageSquare: Consultation services
  2. Code: Integration services
  3. Wrench: Custom development
  4. Zap: Core development/implementation
  5. Settings: Fine-tuning/optimization
  6. Globe: Advanced features/plugins

### 4. Technology Stack
- **Section Title**: "Technology Stack"
- **Description**: Professional intro about modern tools and enterprise solutions
- **EXACTLY 4 Categories** with 6-8 technologies each (REQUIRED):
  - Each category must be specific to the developer type (not generic)
  - Must include the most relevant and current technologies

### 5. Frequently Asked Questions
- **Section Title**: "Frequently Asked Questions"
- **EXACTLY 5 FAQs** covering (REQUIRED - DO NOT GENERATE LESS THAN 5):
  1. Cost and pricing considerations
  2. Timeline and project duration
  3. Technical expertise and qualifications
  4. Support and maintenance
  5. Hiring process and getting started

🧠 **STRICT COMPLETION RULES:**
- Every array in the JSON response MUST be complete
- No partial arrays or single items allowed
- All 6 skills must be unique and specific to the developer type
- All 6 services must be unique and business-focused
- All 5 FAQs must be comprehensive and helpful
- Use professional, business-focused language throughout
- Focus on enterprise-grade solutions and business value

⛔ **VALIDATION REQUIREMENTS:**
Before responding, verify that your JSON contains:
- whyHirePoints: exactly 6 objects with icon, title, description
- servicesOffered: exactly 6 objects with icon, title, description
- faqs: exactly 5 objects with question, answer
- technologyStack.categories: exactly 4 categories with 6-8 technologies each

RESPOND WITH JSON IN THIS EXACT FORMAT:
{
  "title": "Hire [Type] Developers",
  "slug": "hire-[type]-developers",
  "heroSubtitle": "Professional 2-3 sentence description emphasizing business value and enterprise solutions",
  "heroDescription": "2-3 lines describing how these developers provide value to businesses (cost efficiency, automation, scalability)",
  "whyHireTitle": "Key Skills and Qualifications of Our [Type] Developers",
  "whyHireDescription": "Professional paragraph about developer expertise and capabilities",
  "whyHirePoints": [
    {"icon": "Brain", "title": "Core Technology Expertise", "description": "Deep expertise in primary technology/framework specific to [Type]"},
    {"icon": "Code", "title": "Advanced Programming Skills", "description": "Expert-level programming capabilities and best practices"},
    {"icon": "Database", "title": "Data Integration & Management", "description": "Database design, integration, and data management expertise"},
    {"icon": "Shield", "title": "Security & Compliance", "description": "Security best practices and compliance knowledge"},
    {"icon": "Zap", "title": "Performance Optimization", "description": "Performance tuning and optimization skills"},
    {"icon": "Settings", "title": "System Architecture & Design", "description": "Scalable system design and architecture expertise"}
  ],
  "servicesTitle": "What Our [Type] Developers Can Do for You",
  "servicesDescription": "Professional paragraph highlighting business impact and comprehensive solutions",
  "servicesOffered": [
    {"icon": "MessageSquare", "title": "[Type] Strategy & Consultation", "description": "Expert guidance, strategy planning, and technical consultation"},
    {"icon": "Code", "title": "System Integration & APIs", "description": "Seamless integration with existing systems and third-party APIs"},
    {"icon": "Wrench", "title": "Custom [Type] Development", "description": "Tailored solutions built to your specific business requirements"},
    {"icon": "Zap", "title": "[Type] Application Development", "description": "Core application development and feature implementation"},
    {"icon": "Settings", "title": "Performance & Optimization", "description": "System optimization, performance tuning, and scalability improvements"},
    {"icon": "Globe", "title": "Advanced Features & Plugins", "description": "Enhanced functionality, custom plugins, and advanced feature development"}
  ],
  "technologyStack": {
    "description": "Our [Type] developers leverage modern, enterprise-grade technologies and tools to deliver cutting-edge solutions that meet industry standards.",
    "categories": [
      {"name": "Core Technologies", "technologies": ["List 6-8 primary frameworks/languages specific to this developer type"]},
      {"name": "Development Tools", "technologies": ["List 6-8 development tools and platforms specific to this type"]},
      {"name": "Infrastructure & DevOps", "technologies": ["List 6-8 deployment and infrastructure tools for this type"]},
      {"name": "Specialized Tools", "technologies": ["List 6-8 specialized tools unique to this developer type"]}
    ]
  },
  "faqTitle": "Frequently Asked Questions",
  "faqs": [
    {"question": "How much does it cost to hire [Type] developers?", "answer": "Our [Type] developer rates are competitive and depend on project complexity, timeline, and specific requirements. We offer flexible engagement models including hourly, project-based, and dedicated team options. Contact us for a detailed quote tailored to your needs."},
    {"question": "What is the typical timeline for [Type] development projects?", "answer": "Project timelines vary based on scope and complexity. Simple [Type] projects typically take 4-8 weeks, while complex enterprise solutions may require 3-6 months. We provide detailed project timelines during our initial consultation."},
    {"question": "What qualifications do your [Type] developers have?", "answer": "Our [Type] developers have 5+ years of experience, relevant certifications, and proven track records with successful projects. They undergo rigorous technical assessments and stay updated with the latest industry trends and technologies."},
    {"question": "Do you provide ongoing support and maintenance?", "answer": "Yes, we offer comprehensive post-development support including bug fixes, feature updates, performance monitoring, and technical maintenance. We provide various support packages to meet your long-term needs."},
    {"question": "How do I get started with hiring [Type] developers?", "answer": "Getting started is simple: contact us for a free consultation, share your project requirements, and we'll match you with the right [Type] developers. We'll provide a detailed proposal and can begin development within 1-2 weeks."}
  ],
  "metaTitle": "Hire Expert [Type] Developers | Professional [Type] Development",
  "metaDescription": "Hire skilled [Type] developers for your project. Expert team, proven results, competitive rates. Get your [Type] solution built right.",
  "primaryKeyword": "hire [type] developers",
  "secondaryKeywords": "[type] development, [type] programmers, [type] development services, expert [type] developers",
  "developerType": "[Type]",
  "location": "USA & Canada"
}`
      },
      {
        role: "user",
        content: `Generate COMPLETE content for: "${developerType} Developers"
        
        Location: ${location || 'USA & Canada'}
        ${primarySkills ? `Primary Skills: ${primarySkills}` : ''}
        ${experienceLevel ? `Experience Level: ${experienceLevel}` : ''}
        ${referenceContent ? `
📚 **REFERENCE CONTENT TO EXTRACT INFORMATION FROM**:
${referenceContent}

⚡ **REFERENCE CONTENT INSTRUCTIONS**:
- Use the reference content above to extract specific technologies, services, processes, and benefits
- Adapt the language style and tone to match the reference content where appropriate
- Extract real project examples, metrics, and case studies if mentioned
- Use industry-specific terminology and technical details from the reference content
- Maintain the professional business-focused approach while incorporating reference insights
` : ''}
        
        🚨 **CRITICAL COMPLETENESS REQUIREMENTS**:
        - whyHirePoints MUST contain ALL 6 skills - not 1, not 3, but ALL 6
        - servicesOffered MUST contain ALL 6 services - not 1, not 4, but ALL 6
        - faqs MUST contain ALL 5 questions - not 1, not 3, but ALL 5
        - technologyStack.categories MUST contain ALL 4 categories with 6-8 technologies each
        
        **Technology Stack Specificity Requirements**:
        - Generate technologies that are SPECIFIC to ${developerType} development
        - DO NOT use generic categories like "Machine Learning", "Backend", "Database", "DevOps" for all types
        - For Blockchain developers: Include Solidity, Ethereum, Hyperledger, Web3.js, Truffle, Hardhat, MetaMask, etc.
        - For Mobile developers: Include React Native, Flutter, Swift, Kotlin, Xamarin, Ionic, Firebase, etc.
        - For AI/ML developers: Include TensorFlow, PyTorch, OpenAI, Hugging Face, scikit-learn, Pandas, etc.
        - For Frontend developers: Include React, Vue, Angular, TypeScript, Webpack, Vite, Next.js, etc.
        - For Backend developers: Include Node.js, Python, Java, PostgreSQL, MongoDB, Redis, Docker, etc.
        - Each developer type should have UNIQUE and SPECIFIC technology stacks
        
        **Content Quality Requirements**:
        - Each skill description should be 15-25 words explaining specific expertise
        - Each service description should be 15-25 words explaining business value
        - Each FAQ answer should be 40-60 words providing comprehensive information
        - All content should be professional, business-focused, and conversion-oriented
        
        **Final Validation**: Before submitting your response, verify:
        ✅ whyHirePoints has exactly 6 complete objects
        ✅ servicesOffered has exactly 6 complete objects  
        ✅ faqs has exactly 5 complete objects
        ✅ technologyStack.categories has exactly 4 categories with multiple technologies
        
        Generate the complete structured content following the exact JSON format specified above.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 8000
  });

  const generatedContent = JSON.parse(contentResponse.choices[0].message.content!);

  // Debug logging to track what AI generates vs what we complete
  console.log('AI Generated whyHirePoints count:', generatedContent.whyHirePoints?.length || 0);
  console.log('AI Generated servicesOffered count:', generatedContent.servicesOffered?.length || 0);
  console.log('AI Generated faqs count:', generatedContent.faqs?.length || 0);

  // Validate and complete arrays to ensure they have the required number of items
  const completeContent = ensureCompleteArrays(generatedContent, developerType);
  
  // Debug logging to verify completion
  console.log('After completion whyHirePoints count:', completeContent.whyHirePoints?.length || 0);
  console.log('After completion servicesOffered count:', completeContent.servicesOffered?.length || 0);
  console.log('After completion faqs count:', completeContent.faqs?.length || 0);

  return {
    title: completeContent.title,
    slug: completeContent.slug,
    heroSubtitle: completeContent.heroSubtitle,
    heroDescription: completeContent.heroDescription,
    whyHireTitle: completeContent.whyHireTitle,
    whyHireDescription: completeContent.whyHireDescription,
    whyHirePoints: completeContent.whyHirePoints,
    servicesTitle: completeContent.servicesTitle,
    servicesDescription: completeContent.servicesDescription,
    servicesOffered: completeContent.servicesOffered,
    technologyStack: completeContent.technologyStack,
    faqTitle: completeContent.faqTitle,
    faqs: completeContent.faqs,
    metaTitle: completeContent.metaTitle,
    metaDescription: completeContent.metaDescription,
    primaryKeyword: completeContent.primaryKeyword,
    secondaryKeywords: completeContent.secondaryKeywords,
    developerType: completeContent.developerType || developerType,
    location: completeContent.location || location || 'USA & Canada'
  };
}

// Function to ensure all arrays have the required number of items
function ensureCompleteArrays(content: any, developerType: string): any {
  const devType = developerType.replace(' Developers', '').replace(' Developer', '');
  
  // Ensure whyHirePoints has exactly 6 items
  const requiredSkills = [
    { icon: "Brain", title: `Core ${devType} Expertise`, description: `Deep expertise in ${devType.toLowerCase()} technologies, frameworks, and industry best practices.` },
    { icon: "Code", title: "Advanced Programming Skills", description: `Expert-level programming capabilities with proven track record in ${devType.toLowerCase()} development.` },
    { icon: "Database", title: "Data Integration & Management", description: "Comprehensive database design, integration, and data management expertise for scalable solutions." },
    { icon: "Shield", title: "Security & Compliance", description: "Strong focus on security best practices, compliance standards, and data protection protocols." },
    { icon: "Zap", title: "Performance Optimization", description: "Advanced performance tuning, optimization techniques, and scalability implementation skills." },
    { icon: "Settings", title: "System Architecture & Design", description: "Expertise in designing scalable, robust system architectures and technical infrastructure." }
  ];
  
  // Ensure servicesOffered has exactly 6 items
  const requiredServices = [
    { icon: "MessageSquare", title: `${devType} Strategy & Consultation`, description: "Expert guidance, strategic planning, and technical consultation for your project requirements." },
    { icon: "Code", title: "System Integration & APIs", description: "Seamless integration with existing systems, third-party services, and API development." },
    { icon: "Wrench", title: `Custom ${devType} Development`, description: "Tailored solutions built specifically for your business requirements and technical specifications." },
    { icon: "Zap", title: `${devType} Application Development`, description: "Core application development, feature implementation, and functionality enhancement services." },
    { icon: "Settings", title: "Performance & Optimization", description: "System optimization, performance tuning, scalability improvements, and efficiency enhancements." },
    { icon: "Globe", title: "Advanced Features & Plugins", description: "Enhanced functionality development, custom plugins, and advanced feature implementation." }
  ];
  
  // Ensure faqs has exactly 5 items
  const requiredFaqs = [
    { 
      question: `How much does it cost to hire ${devType.toLowerCase()} developers?`, 
      answer: `Our ${devType.toLowerCase()} developer rates are competitive and depend on project complexity, timeline, and specific requirements. We offer flexible engagement models including hourly, project-based, and dedicated team options. Contact us for a detailed quote tailored to your needs.` 
    },
    { 
      question: `What is the typical timeline for ${devType.toLowerCase()} development projects?`, 
      answer: `Project timelines vary based on scope and complexity. Simple ${devType.toLowerCase()} projects typically take 4-8 weeks, while complex enterprise solutions may require 3-6 months. We provide detailed project timelines during our initial consultation.` 
    },
    { 
      question: `What qualifications do your ${devType.toLowerCase()} developers have?`, 
      answer: `Our ${devType.toLowerCase()} developers have 5+ years of experience, relevant certifications, and proven track records with successful projects. They undergo rigorous technical assessments and stay updated with the latest industry trends and technologies.` 
    },
    { 
      question: "Do you provide ongoing support and maintenance?", 
      answer: "Yes, we offer comprehensive post-development support including bug fixes, feature updates, performance monitoring, and technical maintenance. We provide various support packages to meet your long-term needs." 
    },
    { 
      question: `How do I get started with hiring ${devType.toLowerCase()} developers?`, 
      answer: `Getting started is simple: contact us for a free consultation, share your project requirements, and we'll match you with the right ${devType.toLowerCase()} developers. We'll provide a detailed proposal and can begin development within 1-2 weeks.` 
    }
  ];

  // Complete arrays with fallback if insufficient items
  const whyHirePointsCompleted = completeArray(content.whyHirePoints || [], requiredSkills, 6);
  const servicesOfferedCompleted = completeArray(content.servicesOffered || [], requiredServices, 6);
  const faqsCompleted = completeArray(content.faqs || [], requiredFaqs, 5);
  
  // Final validation and logging
  console.log(`FINAL VALIDATION - whyHirePoints: ${whyHirePointsCompleted.length} items`);
  console.log(`FINAL VALIDATION - servicesOffered: ${servicesOfferedCompleted.length} items`);
  console.log(`FINAL VALIDATION - faqs: ${faqsCompleted.length} items`);
  
  if (whyHirePointsCompleted.length !== 6) {
    console.error(`ERROR: whyHirePoints should have 6 items but has ${whyHirePointsCompleted.length}`);
  }
  if (servicesOfferedCompleted.length !== 6) {
    console.error(`ERROR: servicesOffered should have 6 items but has ${servicesOfferedCompleted.length}`);
  }
  if (faqsCompleted.length !== 5) {
    console.error(`ERROR: faqs should have 5 items but has ${faqsCompleted.length}`);
  }
  
  const completedContent = {
    ...content,
    whyHirePoints: whyHirePointsCompleted,
    servicesOffered: servicesOfferedCompleted,
    faqs: faqsCompleted,
    technologyStack: {
      description: content.technologyStack?.description || `Our ${devType.toLowerCase()} developers leverage modern, enterprise-grade technologies and tools to deliver cutting-edge solutions that meet industry standards.`,
      categories: content.technologyStack?.categories || [
        { name: "Core Technologies", technologies: [`${devType}`, "JavaScript", "TypeScript", "Python", "Node.js", "React"] },
        { name: "Development Tools", technologies: ["Git", "Docker", "VS Code", "Webpack", "Babel", "ESLint"] },
        { name: "Infrastructure & DevOps", technologies: ["AWS", "Azure", "Kubernetes", "Jenkins", "CI/CD", "Monitoring"] },
        { name: "Specialized Tools", technologies: ["Testing Frameworks", "API Tools", "Database Tools", "Analytics", "Security Tools", "Performance Tools"] }
      ]
    },
    whyHireTitle: content.whyHireTitle || `Key Skills and Qualifications of Our ${devType} Developers`,
    servicesTitle: content.servicesTitle || `What Our ${devType} Developers Can Do for You`,
    faqTitle: content.faqTitle || "Frequently Asked Questions"
  };

  return completedContent;
}

// Helper function to ensure an array has the required number of items
function completeArray<T>(existing: T[], fallback: T[], requiredLength: number): T[] {
  // Always start with an empty array and force the required length
  const result: T[] = [];
  
  // First, add existing items (up to required length)
  for (let i = 0; i < Math.min(existing.length, requiredLength); i++) {
    result.push(existing[i]);
  }
  
  // Then, fill remaining spots with fallback items
  for (let i = result.length; i < requiredLength; i++) {
    const fallbackIndex = i % fallback.length;
    result.push(fallback[fallbackIndex]);
  }
  
  console.log(`completeArray: existing=${existing.length}, fallback=${fallback.length}, required=${requiredLength}, result=${result.length}`);
  
  // GUARANTEE exactly the required length
  return result.slice(0, requiredLength);
}



export async function regenerateHireDeveloperContent(
  developerType: string, 
  location: string, 
  primarySkills: string
): Promise<{ content: string; metaTitle: string; metaDescription: string; keywords: string; skills: string[] }> {
  try {
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content strategist specializing in developer hiring pages.
          Create conversion-focused, SEO-optimized content that convinces clients to hire developers.
          
          Follow these guidelines:
          - Write 1200-1500 words in professional, persuasive style
          - Structure with clear H2/H3 headings
          - Include sections: Why Hire [Developer Type], Process, Skills, Portfolio, Pricing, FAQ
          - Use bullet points and numbered lists
          - Include strong CTAs and trust signals
          - Format content in HTML with proper heading tags
          
          Return response as JSON with: content, metaTitle, metaDescription, keywords, skills`
        },
        {
          role: "user",
          content: `Generate hire developer content for:
          Developer Type: ${developerType}
          Location: ${location}
          Primary Skills: ${primarySkills}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const contentResult = JSON.parse(contentResponse.choices[0].message.content || "{}");
    
    return {
      content: contentResult.content || "",
      metaTitle: contentResult.metaTitle || "",
      metaDescription: contentResult.metaDescription || "",
      keywords: contentResult.keywords || "",
      skills: contentResult.skills || []
    };
  } catch (error: any) {
    console.log("OpenAI API failed for hire developer content regeneration, using fallback content:", error.message);
    
    // Generate fallback content
    const fallbackContent = generateFallbackHireContent(developerType, location, primarySkills);
    return fallbackContent;
  }
}

// Fallback content generation function
function generateFallbackHireContent(
  developerType: string, 
  location: string, 
  primarySkills: string
): { content: string; metaTitle: string; metaDescription: string; keywords: string; skills: string[] } {
  const devType = developerType.replace(' Developers', '').replace(' Developer', '');
  const skills = primarySkills ? primarySkills.split(',').map(s => s.trim()) : [];
  
  const content = `
    <h1>Hire ${developerType}</h1>
    
    <h2>Why Choose Our ${devType} Development Team?</h2>
    <p>Looking to hire expert ${developerType.toLowerCase()}? Our experienced team specializes in delivering high-quality ${devType.toLowerCase()} solutions that drive business growth and innovation.</p>
    
    <h3>Key Benefits</h3>
    <ul>
      <li>10+ years of ${devType.toLowerCase()} development experience</li>
      <li>Proven track record with 500+ successful projects</li>
      <li>Expert team of certified ${devType.toLowerCase()} specialists</li>
      <li>Agile development methodology</li>
      <li>24/7 support and maintenance</li>
      <li>Cost-effective solutions</li>
    </ul>
    
    <h2>Our ${devType} Development Services</h2>
    <p>We offer comprehensive ${devType.toLowerCase()} development services ${location !== 'Global' ? `in ${location}` : 'worldwide'}, including:</p>
    
    <h3>Core Services</h3>
    <ul>
      <li>Custom ${devType.toLowerCase()} application development</li>
      <li>System architecture and design</li>
      <li>Integration and migration services</li>
      <li>Quality assurance and testing</li>
      <li>Maintenance and support</li>
      <li>Consulting and strategy</li>
    </ul>
    
    ${primarySkills ? `<h2>Technical Expertise</h2>
    <p>Our ${developerType.toLowerCase()} are proficient in: ${primarySkills}</p>` : ''}
    
    <h2>Our Development Process</h2>
    <ol>
      <li><strong>Discovery & Planning:</strong> We analyze your requirements and create a detailed project roadmap</li>
      <li><strong>Design & Architecture:</strong> Our experts design scalable and robust solutions</li>
      <li><strong>Development:</strong> Agile development with regular updates and feedback</li>
      <li><strong>Testing & QA:</strong> Comprehensive testing to ensure quality and performance</li>
      <li><strong>Deployment:</strong> Smooth deployment and go-live support</li>
      <li><strong>Support:</strong> Ongoing maintenance and support services</li>
    </ol>
    
    <h2>Why Businesses Choose Us</h2>
    <ul>
      <li>Industry-leading expertise in ${devType.toLowerCase()} development</li>
      <li>Flexible engagement models (dedicated team, project-based, hourly)</li>
      <li>Transparent communication and regular progress updates</li>
      <li>Competitive pricing with no hidden costs</li>
      <li>ISO certified development processes</li>
      <li>Strong focus on security and compliance</li>
    </ul>
    
    <h3>Frequently Asked Questions</h3>
    <h4>How much does it cost to hire ${developerType.toLowerCase()}?</h4>
    <p>The cost depends on project complexity, timeline, and requirements. Contact us for a detailed quote tailored to your specific needs.</p>
    
    <h4>What is the typical timeline for ${devType.toLowerCase()} development projects?</h4>
    <p>Project timelines vary based on scope and complexity, typically ranging from 4-16 weeks for most ${devType.toLowerCase()} projects.</p>
    
    <h4>Do you provide post-development support?</h4>
    <p>Yes, we offer comprehensive post-development support, maintenance, and enhancement services to ensure your solution continues to perform optimally.</p>
    
    <h2>Ready to Get Started?</h2>
    <p>Transform your business with our expert ${developerType.toLowerCase()}. Contact us today for a free consultation and project estimate.</p>
    
    <p><strong>Get in touch now</strong> and let's discuss how our ${devType.toLowerCase()} expertise can help achieve your business goals.</p>
  `;

  return {
    content: content.trim(),
    metaTitle: `Hire ${developerType} | Expert ${devType} Development Team`,
    metaDescription: `Hire expert ${developerType.toLowerCase()} for your project. Experienced team, proven results, competitive rates. Get started today!`,
    keywords: `hire ${developerType.toLowerCase()}, ${devType.toLowerCase()} developers, ${devType.toLowerCase()} development services, ${devType.toLowerCase()} team`,
    skills: skills.length > 0 ? skills : [`${devType}`, 'Problem Solving', 'Team Collaboration', 'Project Management']
  };
}