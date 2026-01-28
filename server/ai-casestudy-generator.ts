import { generateChatCompletion } from "./openai-client";
import type { IndividualCaseStudy, CaseStudyTestimonial } from "@shared/schema";

export async function generateCaseStudyContent(
  title: string,
  category: string = "AI Development", 
  industry?: string,
  projectCount?: number
) {
  try {
    const prompt = `
Generate comprehensive case study content following these exact guidelines:

**Title and Introduction:**
- Page Title: "${title}"
- Category: "${category}"
- Target Industry: ${industry || "Various Industries"}
- Number of Projects to Include: ${projectCount || 6}

**Content Structure Requirements:**

1. **Introduction Section:**
   - Write a clear introductory paragraph explaining the purpose of this case study page
   - Focus on showcasing ${category.toLowerCase()} expertise and client impact
   - Mention technology expertise and business outcomes

2. **Individual Case Studies (${projectCount || 6} different projects):**
   For each case study, provide:
   - Project/Client Name (MUST be anonymized like "Fortune 500 Fintech Company" or "Leading Healthcare Provider")
   - Location (different countries like USA, Canada, UK, etc.)
   - Industry (vary between Fintech, Healthcare, E-commerce, SaaS, etc.)
   - Summary (2-3 sentences describing problem solved and value delivered)
   - Technologies used (relevant to ${category})
   - Challenges faced
   - Solutions implemented  
   - Measured outcomes and benefits
   - Unique innovations or features (if applicable)
   - Project duration (e.g., "6 months", "12 weeks")
   - Team size (e.g., "8 developers", "5-person team")

3. **Client Testimonials (3-4 testimonials):**
   For each testimonial provide:
   - Client name (MUST use "Client" only - never use actual names)
   - Position/Title (CTO, CEO, Product Manager, etc.)
   - Company name (can be anonymized or descriptive)
   - Testimonial text (2-3 sentences, authentic and specific)
   - Rating (4-5 stars)
   - Which case study this relates to

4. **Closing Section:**
   - Concluding statement about GreenAppleX's expertise in ${category}
   - Call-to-action encouraging visitors to contact for similar projects

**Important Guidelines:**
- Make all content realistic and professional
- Use specific metrics and outcomes when possible
- Vary the industries and project types
- Keep testimonials authentic and credible
- Focus on business value and technical expertise
- Target audience: CTOs, IT managers, and business decision makers

Please return the content in this JSON format:
{
  "introTitle": "string",
  "introDescription": "string", 
  "caseStudies": [
    {
      "projectName": "string",
      "clientName": "string",
      "location": "string",
      "industry": "string", 
      "summary": "string",
      "technologies": ["array", "of", "strings"],
      "challenges": "string",
      "solutions": "string", 
      "outcomes": "string",
      "innovations": "string",
      "projectDuration": "string",
      "teamSize": "string"
    }
  ],
  "testimonials": [
    {
      "clientName": "string",
      "position": "string",
      "company": "string", 
      "testimonialText": "string",
      "rating": 5,
      "projectRelated": "string"
    }
  ],
  "closingStatement": "string",
  "ctaTitle": "string",
  "ctaDescription": "string"
}
`;

    const response = await generateChatCompletion([
      { role: "system", content: "You are a senior business and technology content writer specializing in case studies for enterprise software companies. Generate professional, credible content that showcases technical expertise and business outcomes." },
      { role: "user", content: prompt }
    ], {
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = JSON.parse(response.choices[0].message.content!);
    
    // Validate and structure the response
    return {
      introTitle: content.introTitle || title,
      introDescription: content.introDescription || "",
      caseStudies: JSON.stringify(content.caseStudies || []),
      testimonials: JSON.stringify(content.testimonials || []),
      closingStatement: content.closingStatement || "",
      ctaTitle: content.ctaTitle || "Ready to Start Your Project?",
      ctaDescription: content.ctaDescription || "Contact us to discuss how we can help you achieve similar results.",
      category,
      tags: JSON.stringify([category, industry].filter(Boolean)),
      metaTitle: `${title} | Case Studies | GreenAppleX`,
      metaDescription: content.introDescription?.substring(0, 160) || `Explore our ${category.toLowerCase()} case studies and success stories. See how GreenAppleX delivers exceptional results for clients.`,
      metaKeywords: `${category}, case studies, success stories, client projects, ${industry || 'technology solutions'}`.toLowerCase()
    };

  } catch (error) {
    console.error("Error generating case study content:", error);
    throw new Error("Failed to generate case study content with AI");
  }
}

export async function generateCaseStudyTitles(category: string = "AI Development") {
  try {
    const prompt = `
Generate 8 professional case study page titles for ${category} services. 
Focus on:
- Showcasing expertise and success stories
- Including industry-specific examples
- Emphasizing business outcomes
- Targeting business decision makers

Examples of good titles:
- "AI Development Case Studies and Success Stories"
- "Enterprise AI Implementation Success Stories" 
- "Web3 Development Case Studies: Transforming Industries"
- "Mobile App Development Success Stories and Client Results"

Return as a JSON array of strings:
["title1", "title2", "title3", ...]
`;

    const response = await generateChatCompletion([
      { role: "system", content: "You are a marketing and content strategist for a technology consulting company. Generate compelling, professional titles for case study pages." },
      { role: "user", content: prompt }
    ], {
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.titles || [];
    
  } catch (error) {
    console.error("Error generating case study titles:", error);
    throw new Error("Failed to generate case study titles");
  }
}