import OpenAI from "openai";
import { storeImagePermanently } from "./image-storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SEOBlogRequest {
  blogTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
}

interface SEOBlogResponse {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
}

export async function generateSEOBlog(request: SEOBlogRequest): Promise<SEOBlogResponse> {
  const { blogTitle, primaryKeyword, secondaryKeywords } = request;

  try {
    // Generate the blog content using OpenAI
    const blogContentResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content strategist and blog copywriter with 15+ years of experience. 
          You generate complete SEO-optimized blog content that ranks well on Google.
          
          Follow these guidelines:
          - Write 1000-1200 words in conversational, engaging style (8th-grade reading level)
          - Use the blog title as H1
          - Include primary keyword in first 100 words, H2/H3 headings, and conclusion
          - Sprinkle secondary keywords naturally throughout
          - Use short paragraphs (2-3 lines), bullet points, numbered lists
          - Include FAQ section with 2-3 FAQs targeting secondary keywords
          - Use clear H2/H3 sub-headings
          - Include concluding paragraph with CTA
          - Format content in HTML with proper heading tags
          
          Generate SEO elements:
          - Slug: SEO-friendly URL (lowercase, hyphens, using primary keyword)
          - Meta Title: Max 60 characters, include primary keyword
          - Meta Description: 150-160 characters, compelling, include primary keyword
          - Excerpt: 30-50 words summarizing the article
          - Keywords: Primary + secondary keywords as comma-separated string
          - Tags: 3-5 relevant tags for categorization
          
          Respond with JSON in this exact format:
          {
            "title": "Blog title",
            "slug": "seo-friendly-slug",
            "content": "HTML formatted content",
            "excerpt": "Brief summary",
            "metaTitle": "SEO meta title",
            "metaDescription": "SEO meta description",
            "keywords": "comma,separated,keywords",
            "tags": ["tag1", "tag2", "tag3"]
          }`
        },
        {
          role: "user",
          content: `Generate a complete SEO-optimized blog post:
          
          Blog Title: ${blogTitle}
          Primary Keyword: ${primaryKeyword}
          Secondary Keywords: ${secondaryKeywords.join(', ')}
          
          Please create comprehensive content following all SEO best practices.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const blogContent = JSON.parse(blogContentResponse.choices[0].message.content!);

    // Generate an image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, modern blog header image for an article titled "${blogTitle}". 
      The image should be clean, corporate, and relevant to ${primaryKeyword}. 
      Use a modern design with blue and purple gradient colors. 
      Make it suitable for a tech/business blog. 
      No text overlay needed. 
      Professional and minimalist style.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const temporaryImageUrl = imageResponse.data[0].url!;
    const imageAlt = `${blogTitle} - ${primaryKeyword} illustration`;

    // Store the DALL-E generated image permanently in AWS S3 and database
    let finalImageUrl = temporaryImageUrl;
    try {
      const storedImage = await storeImagePermanently(temporaryImageUrl, 'blog-', 'blog-images');
      finalImageUrl = storedImage.permanentUrl;
      console.log(`Blog image stored successfully in S3: ${finalImageUrl}`);
    } catch (error) {
      console.error('Failed to store image in S3, using temporary URL:', error);
      // Continue with temporary URL if S3 storage fails
    }

    return {
      title: blogContent.title,
      slug: blogContent.slug,
      content: blogContent.content,
      excerpt: blogContent.excerpt,
      metaTitle: blogContent.metaTitle,
      metaDescription: blogContent.metaDescription,
      keywords: blogContent.keywords,
      imageUrl: finalImageUrl,
      imageAlt,
      tags: blogContent.tags || ["AI", "Technology", "Business"]
    };
  } catch (error: any) {
    console.error('OpenAI API error in generateSEOBlog:', error);
    
    // Check if it's a quota/rate limit error
    if (error.status === 429 || error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details, or try again later.');
    }
    
    // For other errors, provide a generic message
    throw new Error('Failed to generate blog content with OpenAI. Please try again or contact support.');
  }
}

export async function generateSEOKeywords(blogTitle: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO keyword strategist specializing in USA and Canada markets. 
          Generate high-quality SEO keywords that are:
          
          ✅ Mix of informational and commercial intent keywords
          ✅ Geographically targeted for USA and Canada
          ✅ Naturally relevant to the blog title
          ✅ Varied in style (question-based, benefit-focused, commercial/buyer-focused)
          ✅ Realistic search terms people actually use
          
          Include different types:
          - Primary keywords (main topic)
          - Secondary keywords (related concepts)
          - Long-tail keywords (specific phrases)
          - Question-based keywords (how, what, why, when)
          - Commercial intent keywords (best, top, review, compare)
          - Location-based keywords (USA, Canada, American, Canadian)
          - Benefits-focused keywords (advantages, benefits, solutions)
          
          Generate at least 20-25 keywords. Return as a JSON array of strings.
          
          Example styles:
          - "how [topic] works in USA"
          - "best [topic] solutions Canada"
          - "[topic] benefits for businesses"
          - "top [topic] companies USA"
          - "[topic] implementation guide"
          - "why [topic] matters for Canadian businesses"
          
          Respond with JSON: {"keywords": ["keyword1", "keyword2", ...]}
          `
        },
        {
          role: "user",
          content: `Generate SEO keywords for this blog title: "${blogTitle}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.keywords || [];
  } catch (error: any) {
    console.log("OpenAI API failed for SEO keywords, using fallback keywords:", error.message);
    
    // Generate fallback SEO keywords based on blog title
    const fallbackKeywords = generateFallbackSEOKeywords(blogTitle);
    return fallbackKeywords;
  }
}

// Fallback blog generation when OpenAI API is unavailable
function generateFallbackBlog(request: SEOBlogRequest): SEOBlogResponse {
  const { blogTitle, primaryKeyword, secondaryKeywords } = request;
  
  // Create slug from title
  const slug = blogTitle.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Generate structured content
  const content = generateFallbackContent(blogTitle, primaryKeyword, secondaryKeywords);
  
  // Create excerpt from content
  const excerpt = `Discover comprehensive insights about ${primaryKeyword} and how it can transform your business operations. Learn about implementation strategies, benefits, and best practices.`;
  
  // Generate meta fields
  const metaTitle = blogTitle.length > 60 ? blogTitle.substring(0, 57) + "..." : blogTitle;
  const metaDescription = `Complete guide to ${primaryKeyword}. Learn implementation strategies, benefits, and best practices for ${secondaryKeywords.slice(0, 2).join(' and ')}.`;
  
  // Use a placeholder image URL (you could replace with a default image from your assets)
  const imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80";
  const imageAlt = `${blogTitle} - Professional illustration`;
  
  // Generate relevant tags
  const tags = generateFallbackTags(primaryKeyword, secondaryKeywords);
  
  return {
    title: blogTitle,
    slug,
    content,
    excerpt,
    metaTitle,
    metaDescription,
    keywords: `${primaryKeyword}, ${secondaryKeywords.join(', ')}`,
    imageUrl,
    imageAlt,
    tags
  };
}

function generateFallbackContent(title: string, primaryKeyword: string, secondaryKeywords: string[]): string {
  const sections = [
    `<h1>${title}</h1>`,
    `<p>In today's rapidly evolving digital landscape, <strong>${primaryKeyword}</strong> has emerged as a crucial component for businesses seeking to enhance their operational efficiency and competitive edge. This comprehensive guide explores the key aspects, implementation strategies, and transformative potential of ${primaryKeyword}.</p>`,
    
    `<h2>Understanding ${primaryKeyword}</h2>`,
    `<p>${primaryKeyword} represents a fundamental shift in how modern businesses approach their operational challenges. By leveraging advanced methodologies and proven strategies, organizations can unlock new levels of performance and achieve sustainable growth.</p>`,
    `<p>Key characteristics of effective ${primaryKeyword} include:</p>`,
    `<ul>`,
    `<li><strong>Scalability:</strong> Ability to grow and adapt with business requirements</li>`,
    `<li><strong>Integration:</strong> Seamless connectivity with existing systems and processes</li>`,
    `<li><strong>Performance:</strong> Measurable improvements in efficiency and outcomes</li>`,
    `<li><strong>Security:</strong> Robust protection of data and business operations</li>`,
    `</ul>`,
    
    `<h2>Implementation Strategies</h2>`,
    `<p>Successful implementation of ${primaryKeyword} requires a systematic approach that considers both technical requirements and business objectives. Organizations should focus on the following key areas:</p>`,
    
    `<h3>Planning and Assessment</h3>`,
    `<p>Before implementing ${primaryKeyword}, conduct a thorough assessment of current capabilities, resource requirements, and expected outcomes. This foundation ensures alignment between ${secondaryKeywords[0] || 'business goals'} and technical implementation.</p>`,
    
    `<h3>Technology Selection</h3>`,
    `<p>Choose technologies and platforms that support ${secondaryKeywords[1] || 'scalable solutions'} while maintaining compatibility with existing infrastructure. Consider factors such as performance, cost-effectiveness, and long-term viability.</p>`,
    
    `<h2>Benefits and Advantages</h2>`,
    `<p>Organizations implementing ${primaryKeyword} can expect to see significant improvements across multiple areas:</p>`,
    `<ul>`,
    `<li><strong>Operational Efficiency:</strong> Streamlined processes and reduced manual overhead</li>`,
    `<li><strong>Cost Optimization:</strong> Better resource utilization and reduced operational expenses</li>`,
    `<li><strong>Enhanced Performance:</strong> Improved speed, accuracy, and reliability of business operations</li>`,
    `<li><strong>Competitive Advantage:</strong> Ability to respond quickly to market changes and opportunities</li>`,
    `</ul>`,
    
    `<h2>Best Practices and Considerations</h2>`,
    `<p>To maximize the value of ${primaryKeyword}, organizations should adhere to industry best practices and consider the following guidelines:</p>`,
    `<ol>`,
    `<li><strong>Start with Clear Objectives:</strong> Define specific, measurable goals for ${primaryKeyword} implementation</li>`,
    `<li><strong>Invest in Training:</strong> Ensure team members have the necessary skills and knowledge</li>`,
    `<li><strong>Monitor and Optimize:</strong> Continuously evaluate performance and make improvements</li>`,
    `<li><strong>Security First:</strong> Implement robust security measures from the beginning</li>`,
    `</ol>`,
    
    `<h2>Future Outlook and Trends</h2>`,
    `<p>The landscape of ${primaryKeyword} continues to evolve, with emerging technologies and methodologies offering new opportunities for innovation. Key trends to watch include ${secondaryKeywords.slice(0, 3).join(', ')}, and the increasing integration of artificial intelligence and machine learning capabilities.</p>`,
    
    `<h2>Getting Started</h2>`,
    `<p>Ready to implement ${primaryKeyword} in your organization? Begin by assessing your current capabilities, defining clear objectives, and developing a comprehensive implementation strategy. Consider partnering with experienced professionals who can guide you through the process and ensure optimal results.</p>`,
    
    `<p><strong>Contact our experts today to learn how ${primaryKeyword} can transform your business operations and drive sustainable growth.</strong></p>`
  ];
  
  return sections.join('\n\n');
}

function generateFallbackTags(primaryKeyword: string, secondaryKeywords: string[]): string[] {
  const baseTags = ['Business', 'Technology', 'Innovation'];
  const keywordTags = [primaryKeyword, ...secondaryKeywords.slice(0, 2)];
  return [...baseTags, ...keywordTags].slice(0, 5);
}

function generateFallbackSEOKeywords(blogTitle: string): string[] {
  const titleWords = blogTitle.toLowerCase().split(' ')
    .filter(word => word.length > 2 && !['the', 'and', 'for', 'with', 'you', 'how', 'what', 'why', 'when'].includes(word));
  
  const fallbackKeywords = [
    ...titleWords.map(word => `${word} solutions`),
    ...titleWords.map(word => `best ${word} practices`),
    ...titleWords.map(word => `${word} implementation guide`),
    ...titleWords.map(word => `professional ${word} services`),
    ...titleWords.map(word => `${word} benefits for business`),
    'digital transformation solutions',
    'enterprise technology consulting',
    'business process optimization',
    'professional services USA',
    'technology implementation Canada',
    'business efficiency solutions',
    'digital innovation strategies',
    'enterprise software solutions',
    'business growth strategies',
    'professional consulting services'
  ];
  
  return [...new Set(fallbackKeywords)].slice(0, 25);
}

export async function regenerateContent(blogTitle: string, primaryKeyword: string, secondaryKeywords: string[]): Promise<{ content: string; excerpt: string; metaTitle: string; metaDescription: string; keywords: string; tags: string[] }> {
  try {
    const blogContentResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content strategist. Generate fresh, unique blog content that is different from previous versions while maintaining SEO best practices.
          
          Guidelines:
          - Write 1000-1200 words of engaging, SEO-optimized content
          - Use HTML formatting with proper H2/H3 headings
          - Include primary keyword naturally throughout
          - Incorporate secondary keywords contextually
          - Create compelling, unique content structure
          - Add FAQ section with 2-3 relevant questions
          - Include call-to-action at the end
          - Format as clean HTML
          
          Generate SEO elements:
          - Excerpt: 30-50 word summary
          - Meta Title: Max 60 characters with primary keyword
          - Meta Description: 150-160 characters, compelling
          - Keywords: Primary + secondary keywords as comma-separated string
          - Tags: 3-5 relevant tags for categorization
          
          Return response as JSON with: content, excerpt, metaTitle, metaDescription, keywords, tags`
        },
        {
          role: "user",
          content: `Generate SEO-optimized blog content for:
          Title: "${blogTitle}"
          Primary Keyword: "${primaryKeyword}"
          Secondary Keywords: ${secondaryKeywords.join(", ")}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const contentResult = JSON.parse(blogContentResponse.choices[0].message.content || "{}");
    
    return {
      content: contentResult.content || "",
      excerpt: contentResult.excerpt || "",
      metaTitle: contentResult.metaTitle || "",
      metaDescription: contentResult.metaDescription || "",
      keywords: contentResult.keywords || "",
      tags: contentResult.tags || []
    };
  } catch (error: any) {
    console.error("OpenAI API failed for content regeneration:", error.message);
    throw new Error('Failed to regenerate content with OpenAI. Please try again when API quota is available.');
  }
}

export async function regenerateImage(blogTitle: string, primaryKeyword: string): Promise<{ imageUrl: string; imageAlt: string }> {
  // Generate image using DALL-E
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Create a professional, modern blog header image for "${blogTitle}". The image should be:
    - Clean, minimalist design
    - Professional and business-appropriate
    - Related to ${primaryKeyword}
    - High-quality, suitable for blog post header
    - Engaging and visually appealing
    - No text overlays
    - 16:9 aspect ratio ideal for blog headers`,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  const temporaryImageUrl = imageResponse.data[0].url || "";
  const imageAlt = `Professional illustration representing ${blogTitle} - ${primaryKeyword}`;
  
  // Store the regenerated image permanently in AWS S3 and database
  let finalImageUrl = temporaryImageUrl;
  try {
    const storedImage = await storeImagePermanently(temporaryImageUrl, 'blog-regen-', 'blog-images');
    finalImageUrl = storedImage.permanentUrl;
    console.log(`Regenerated blog image stored successfully in S3: ${finalImageUrl}`);
  } catch (error) {
    console.error('Failed to store regenerated image in S3, using temporary URL:', error);
    // Continue with temporary URL if S3 storage fails
  }
  
  return {
    imageUrl: finalImageUrl,
    imageAlt
  };
}

interface BlogTitleRequest {
  marketTrends?: string;
  techType: string;
  blogType: string;
  existingTitles?: string;
}

export async function generateBlogTitles(request: BlogTitleRequest): Promise<{ titles: string[] }> {
  try {
    const { marketTrends, techType, blogType, existingTitles } = request;

    // Map tech types to readable names
    const techTypeMap: Record<string, string> = {
      "ai-ml": "AI & Machine Learning",
      "web2": "Web 2.0",
      "web3": "Web3 & Blockchain",
      "mobile": "Mobile Development",
      "cloud": "Cloud Computing",
      "data": "Data Science & Analytics",
      "cybersecurity": "Cybersecurity",
      "devops": "DevOps & Infrastructure",
      "ecommerce": "E-commerce",
      "fintech": "FinTech & Financial Technology"
    };

    const techName = techTypeMap[techType] || techType;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert content strategist specializing in creating compelling, SEO-optimized blog titles for technology and business content.
          
          Create titles that are:
          - Attention-grabbing and click-worthy
          - SEO-friendly with relevant keywords
          - Professional yet engaging
          - Targeted at business decision-makers
          - 50-65 characters for optimal SEO
          - Unique and avoiding clichés
          
          Blog types and their characteristics:
          - "educational": How-to guides, tutorials, explainers
          - "thought-leadership": Industry insights, trends, opinions
          - "case-study": Success stories, implementations, results
          - "comparison": Product comparisons, alternatives, reviews
          - "listicle": Top X lists, best practices, tips
          - "how-to": Step-by-step guides, instructions
          
          Consider current market trends: ${marketTrends || "general technology adoption"}
          Avoid these existing titles: ${existingTitles || "none"}
          
          Generate 8 unique, compelling blog titles. Respond with JSON: {"titles": ["title1", "title2", ...]}
          `
        },
        {
          role: "user",
          content: `Generate ${blogType} blog titles about ${techName}. Focus on practical, business-oriented content that would appeal to executives and decision-makers.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 800
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return { titles: result.titles || [] };
  } catch (error: any) {
    console.log("OpenAI API failed for blog titles, using fallback titles:", error.message);
    
    // Generate fallback titles
    const fallbackTitles = generateFallbackBlogTitles(request);
    return { titles: fallbackTitles };
  }
}

function generateFallbackBlogTitles(request: BlogTitleRequest): string[] {
  const { techType, blogType } = request;
  
  const techTypeMap: Record<string, string> = {
    "ai-ml": "AI & Machine Learning",
    "web2": "Web 2.0",
    "web3": "Web3 & Blockchain", 
    "mobile": "Mobile Development",
    "cloud": "Cloud Computing",
    "data": "Data Science & Analytics",
    "cybersecurity": "Cybersecurity",
    "devops": "DevOps & Infrastructure",
    "ecommerce": "E-commerce",
    "fintech": "FinTech & Financial Technology"
  };

  const techName = techTypeMap[techType] || techType;

  const fallbackTitleTemplates: Record<string, string[]> = {
    "educational": [
      `Understanding ${techName}: A Complete Business Guide`,
      `${techName} Fundamentals for Modern Enterprises`,
      `Essential ${techName} Concepts Every Leader Should Know`,
      `Mastering ${techName} for Business Success`,
      `${techName} Explained: From Basics to Implementation`,
      `Complete Introduction to ${techName} Solutions`,
      `${techName} 101: Everything You Need to Know`,
      `Building Success with ${techName} Technologies`
    ],
    "thought-leadership": [
      `The Future of ${techName} in Enterprise`,
      `Why ${techName} is Reshaping Modern Business`,
      `${techName} Trends Transforming Industries`,
      `Strategic Advantages of ${techName} Adoption`,
      `${techName}: The Next Frontier for Business Growth`,
      `Innovation Through ${techName} Implementation`,
      `${techName} Revolution: What It Means for Leaders`,
      `Preparing for the ${techName}-Driven Future`
    ],
    "case-study": [
      `How Companies Achieve Success with ${techName}`,
      `Real-World ${techName} Implementation Stories`,
      `${techName} Success: Lessons from Leading Enterprises`,
      `Transforming Business Operations with ${techName}`,
      `${techName} ROI: Proven Results from Implementation`,
      `Case Study: ${techName} Drives Business Growth`,
      `Success Stories: ${techName} in Action`,
      `From Challenge to Success: ${techName} Solutions`
    ],
    "comparison": [
      `${techName} vs Traditional Solutions: Complete Analysis`,
      `Choosing the Right ${techName} Platform for Your Business`,
      `${techName} Options Compared: Features and Benefits`,
      `Best ${techName} Solutions for Enterprise Needs`,
      `${techName} Platform Comparison: Making the Right Choice`,
      `Evaluating ${techName} Vendors: A Detailed Comparison`,
      `${techName} Solutions: Which Option Fits Your Business?`,
      `Comprehensive ${techName} Platform Review`
    ],
    "listicle": [
      `Top 10 ${techName} Benefits for Modern Businesses`,
      `5 Essential ${techName} Strategies for Success`,
      `7 Key ${techName} Trends to Watch This Year`,
      `Best Practices for ${techName} Implementation`,
      `10 Reasons Your Business Needs ${techName}`,
      `Essential ${techName} Tools for Enterprise Success`,
      `Top ${techName} Use Cases Driving Business Value`,
      `Critical ${techName} Factors for Implementation Success`
    ],
    "how-to": [
      `Beginner's Guide to ${techName} Implementation`,
      `Comprehensive ${techName} Strategy for Businesses`,
      `Professional ${techName} Guide for Decision Makers`,
      `Complete ${techName} Roadmap for Modern Enterprises`,
      `Essential ${techName} Knowledge for Business Growth`,
      `How to Implement ${techName} in Your Business`,
      `Step-by-Step ${techName} Integration Guide`,
      `How to Choose the Right ${techName} Solution`
    ]
  };

  return fallbackTitleTemplates[blogType] || fallbackTitleTemplates["educational"];
}