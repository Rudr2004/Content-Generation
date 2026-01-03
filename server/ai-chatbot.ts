import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Website context and knowledge base
const WEBSITE_CONTEXT = `
GreenAppleX is a leading technology company that delivers transformative solutions in:

SERVICES:
1. AI & Machine Learning
   - Custom AI Development
   - Machine Learning Consulting
   - Generative AI Solutions
   - AI Model Training & Deployment
   - Computer Vision & NLP
   - AI-powered Business Intelligence

2. Web3 & Blockchain
   - Blockchain Development
   - Smart Contract Development
   - DeFi Solutions
   - NFT Marketplace Development
   - Cryptocurrency Solutions
   - Web3 Integration

3. Mobile Development
   - iOS App Development
   - Android App Development
   - Cross-platform Development
   - Mobile App Design
   - App Store Optimization

4. Web Development
   - Custom Web Applications
   - E-commerce Solutions
   - Progressive Web Apps
   - API Development
   - Full-stack Development

5. Enterprise Solutions
   - Digital Transformation
   - Custom Software Development
   - Cloud Solutions
   - Enterprise Architecture
   - Legacy System Modernization

6. Cloud & DevOps
   - Cloud Migration
   - DevOps Implementation
   - Infrastructure as Code
   - CI/CD Pipeline Setup
   - Cloud Security

TECHNOLOGIES:
Frontend: React, Angular, Vue.js, HTML5, CSS3, JavaScript, TypeScript
Backend: Node.js, Python, PHP, Java, .NET, Ruby
Mobile: iOS, Android, React Native, Flutter, Ionic
Database: MySQL, PostgreSQL, MongoDB, Redis
Cloud: AWS, Azure, Google Cloud, Docker, Kubernetes
Blockchain: Ethereum, Hyperledger, Solidity, Web3.js

COMPANY INFO:
- Founded: 2016
- Employees: 200+
- Location: Los Angeles, CA (12200 W. Olympic Blvd. Ste. 140, Los Angeles, CA 90064)
- Phone: +1 (424) 404-9371
- Email: sales@greenapplex.com
- Website: www.greenapplex.com

CLIENTS: Bank of America, Mercedes-Benz, Goldman Sachs, Georgia Tech, Zebpay

PRICING: Custom pricing based on project requirements. Contact for consultation.

PROCESS:
1. Streamlined Project Initiation
2. Prototyping and Model Development
3. Rigorous Quality Testing
4. Seamless Deployment and Integration
5. Proactive Continuous Monitoring
6. Data Driven Performance Optimization
`;

export async function generateChatResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for GreenAppleX, a technology company specializing in AI, Web3, mobile apps, and custom software development. 

Your role is to:
1. Answer questions about GreenAppleX services, technologies, and capabilities
2. Provide helpful information about our solutions
3. Guide users toward appropriate services based on their needs
4. Be professional, knowledgeable, and enthusiastic about our offerings
5. If asked about pricing, direct users to contact sales for a custom quote
6. If asked about specific project requirements, suggest scheduling a consultation

Use this context about our company:
${WEBSITE_CONTEXT}

Keep responses concise but informative. Be friendly and professional. Always stay focused on GreenAppleX services and capabilities.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}