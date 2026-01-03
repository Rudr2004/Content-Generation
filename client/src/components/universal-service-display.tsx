import React, { useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

// Import partner logos
import zebpayLogo from "@assets/1_1753792402610.png";
import borrowlandLogo from "@assets/2_1753792402610.png";
import mercedesBenzLogo from "@assets/3_1753792402610.png";
import spheriumLogo from "@assets/4_1753792402611.jpg";
import goldmanSachsLogo from "@assets/6_1753792706464.jpg";
import alacrityLogo from "@assets/7_1753792402611.png";
import mightyJaxxLogo from "@assets/8_1753792402611.png";
import docTraceLogo from "@assets/9_1753792402611.png";
import {
  CheckCircle,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Globe,
  Zap,
  Shield,
  Users,
  Target,
  Award,
  Building,
  Code,
  Cog,
  TrendingUp,
} from "lucide-react";
import {
  getProfileImageByGender,
  getGenderFromName,
} from "@/lib/profile-images";
import { ServiceCaseStudies } from "./service-case-studies";
import { SelectedCaseStudies } from "./selected-case-studies";
import { ReadingProgressBar } from "./ui/reading-progress-bar";
import { parseMarkdownToHtml, sanitizeServiceContent } from "@/lib/markdown-utils";

// Service Page Content Interface (matching AI generator structure)
interface ServicePageContent {
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
  technologyTools: Record<string, string[]>;
  process: Array<{
    step: string;
    description: string;
  }>;
  whyChooseUs: string[];
  trustSignals: {
    trustedBy: string[];
  };
  testimonials: Array<{
    quote: string;
    client: string;
    clientImage: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  finalCTA: {
    title: string;
    description: string;
    button: string;
  };
}

interface Service {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  subCategory?: string;
  caseStudyCategory?: string;
  technologies?: string[];
  aiTechnologies?: string[];
  startingPrice?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface UniversalServiceDisplayProps {
  service: Service;
}

// Parse service content into structured format
function parseServiceContent(service: Service): ServicePageContent {
  let structuredContent: ServicePageContent;

  try {
    // Try to parse as JSON first (for AI-generated content)
    let parsedContent;
    try {
      parsedContent = JSON.parse(service.content);
    } catch (jsonError) {
      console.warn("JSON parsing failed for service:", service.id, jsonError);
      // If JSON parsing fails, create a basic structure
      throw new Error("Invalid JSON format");
    }

    // Ensure parsedContent is valid
    if (!parsedContent || typeof parsedContent !== "object") {
      throw new Error("Invalid content structure");
    }

    // Check if it's the new AI-generated structure format
    if (parsedContent.heroSection?.headline) {
      // Map the new AI structure to our display structure
      structuredContent = {
        heroSection: {
          headline: sanitizeServiceContent(parsedContent.heroSection.headline),
          subheading: sanitizeServiceContent(parsedContent.heroSection.subheading || ''),
          ctaButton: parsedContent.heroSection.ctaButton || "Get Started Today",
        },
        introOverview: {
          paragraphs: parsedContent.introOverview?.paragraphs || [],
        },
        serviceOfferings: {
          title: parsedContent.serviceOfferings?.title || "Our Services",
          components: (() => {
            // Handle service offerings with robust parsing for admin-entered content
            const components =
              parsedContent.serviceOfferings?.components ||
              parsedContent.services ||
              [];

            // Ensure we have valid components array
            if (Array.isArray(components) && components.length > 0) {
              return components.map((component) => ({
                name:
                  component.name ||
                  component.title ||
                  component.service ||
                  "Service Name",
                description:
                  component.description ||
                  component.desc ||
                  component.details ||
                  "Service description",
              }));
            }

            // Service-specific default offerings if none exist
            const serviceTitle = (service.title || "").toLowerCase();
            if (
              serviceTitle.includes("agentic") ||
              serviceTitle.includes("autonomous")
            ) {
              return [
                {
                  name: "Autonomous AI Agents",
                  description:
                    "Intelligent agents that can perform complex tasks independently with minimal human intervention.",
                },
                {
                  name: "Multi-Agent Systems",
                  description:
                    "Coordinated networks of AI agents working together to solve complex business problems.",
                },
                {
                  name: "Task Automation",
                  description:
                    "Automated workflows that handle repetitive tasks and decision-making processes.",
                },
                {
                  name: "Intelligent Process Optimization",
                  description:
                    "AI-driven analysis and optimization of business processes for maximum efficiency.",
                },
              ];
            }

            // Default offerings
            return [
              {
                name: "Custom Solution Development",
                description:
                  "Tailored solutions designed to meet your specific business requirements and objectives.",
              },
              {
                name: "System Integration",
                description:
                  "Seamless integration with your existing systems and workflows for optimal performance.",
              },
              {
                name: "Training & Support",
                description:
                  "Comprehensive training and ongoing support to ensure successful implementation.",
              },
            ];
          })(),
        },
        technologyTools: (() => {
          // Handle technology tools with robust parsing
          const techTools =
            parsedContent.technologyStackSection?.stack ||
            parsedContent.technologyTools;

          // If tech tools exist and are properly formatted, use them directly
          if (
            techTools &&
            typeof techTools === "object" &&
            !Array.isArray(techTools)
          ) {
            const validatedTools: Record<string, string[]> = {};
            Object.entries(techTools).forEach(([category, technologies]) => {
              if (Array.isArray(technologies) && technologies.length > 0) {
                validatedTools[category] = technologies as string[];
              }
            });

            // If we have technology data, return it as-is instead of forcing specific categories
            if (Object.keys(validatedTools).length > 0) {
              return validatedTools;
            }
          }

          // Category-specific fallback based on service type
          const serviceTitle = (service.title || "").toLowerCase();
          if (serviceTitle.includes("blockchain")) {
            return {
              "Core Blockchain Technologies": [
                "Ethereum",
                "Solidity",
                "Web3.js",
                "Truffle",
                "Hardhat",
                "Ganache",
              ],
              "Smart Contract Platforms": [
                "Ethereum",
                "Polygon",
                "BSC",
                "Arbitrum",
                "Optimism",
                "Avalanche",
              ],
              "Development Frameworks": [
                "React",
                "Node.js",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Python",
              ],
              "Integration & APIs": [
                "Web3.py",
                "Ethers.js",
                "IPFS",
                "The Graph",
                "Moralis",
                "Alchemy",
              ],
              "Security & Testing": [
                "MythX",
                "Slither",
                "Securify",
                "OpenZeppelin",
                "Foundry",
                "Waffle",
              ],
              "Deployment & DevOps": [
                "AWS",
                "Docker",
                "Kubernetes",
                "GitHub Actions",
                "Vercel",
                "Netlify",
              ],
            };
          } else if (
            serviceTitle.includes("chatbot") ||
            serviceTitle.includes("ai")
          ) {
            return {
              "AI & NLP Frameworks": [
                "OpenAI GPT",
                "Google Dialogflow",
                "Microsoft Bot Framework",
                "Rasa",
                "LangChain",
                "Hugging Face",
              ],
              "Programming Languages": [
                "Python",
                "Node.js",
                "JavaScript",
                "TypeScript",
                "Java",
                "C#",
              ],
              "Cloud Platforms": [
                "AWS",
                "Google Cloud",
                "Microsoft Azure",
                "IBM Watson",
                "Heroku",
                "DigitalOcean",
              ],
              "Integration APIs": [
                "REST APIs",
                "GraphQL",
                "WebSocket",
                "Slack API",
                "WhatsApp API",
                "Facebook Messenger",
              ],
              "Database & Storage": [
                "MongoDB",
                "PostgreSQL",
                "Redis",
                "Firebase",
                "DynamoDB",
                "MySQL",
              ],
              "Development Tools": [
                "Docker",
                "Kubernetes",
                "Git",
                "Jenkins",
                "GitHub Actions",
                "Terraform",
              ],
            };
          } else if (
            serviceTitle.includes("llm") ||
            serviceTitle.includes("language")
          ) {
            return {
              "LLM Frameworks": [
                "OpenAI GPT-4",
                "Anthropic Claude",
                "LangChain",
                "LlamaIndex",
                "Hugging Face Transformers",
                "Haystack",
              ],
              "Machine Learning": [
                "TensorFlow",
                "PyTorch",
                "Scikit-learn",
                "XGBoost",
                "JAX",
                "MLflow",
              ],
              "Cloud AI Services": [
                "AWS SageMaker",
                "Google Vertex AI",
                "Azure OpenAI",
                "IBM Watson",
                "Databricks",
                "Weights & Biases",
              ],
              "Vector Databases": [
                "Pinecone",
                "Weaviate",
                "ChromaDB",
                "Milvus",
                "Qdrant",
                "Faiss",
              ],
              "Development Stack": [
                "Python",
                "FastAPI",
                "Docker",
                "Kubernetes",
                "Redis",
                "PostgreSQL",
              ],
              "Monitoring & Security": [
                "Langfuse",
                "NVIDIA NIM",
                "TensorRT",
                "Encryption",
                "Access Controls",
                "GDPR Compliance",
              ],
            };
          }

          // Default AI/Tech stack
          return {
            "AI Frameworks": [
              "LangChain",
              "LlamaIndex",
              "Hugging Face Transformers",
              "TensorFlow",
              "PyTorch",
            ],
            "Cloud Platforms": [
              "AWS SageMaker",
              "Google Cloud Vertex AI",
              "Microsoft Azure AI",
              "IBM Watson",
            ],
            "Integration & Deployment Tools": [
              "Docker",
              "Kubernetes",
              "CI/CD pipelines",
              "microservices architecture",
            ],
            "Programming Languages": [
              "Python",
              "JavaScript",
              "Go",
              "Java",
              "C++",
            ],
            Databases: ["SQL", "NoSQL", "AI-optimized data storage"],
            "Security & Key Management": [
              "Encryption",
              "Access controls",
              "GDPR compliance",
              "HIPAA compliance",
            ],
          };
        })(),
        process: parsedContent["development process"]?.process ||
          parsedContent.process || [
            {
              step: "Discovery Call",
              description:
                "In-depth consultation to understand your business challenges, objectives, and technical requirements for strategic alignment",
            },
            {
              step: "Project Estimate",
              description:
                "Detailed technical assessment, resource planning, and transparent cost estimation with defined timelines and milestones",
            },
            {
              step: "Training",
              description:
                "Custom model training using your proprietary data with advanced techniques for optimal performance and accuracy",
            },
            {
              step: "Execution",
              description:
                "Agile development methodology with regular updates, collaborative feedback, and iterative improvements",
            },
            {
              step: "Evaluation & Deployment",
              description:
                "Rigorous testing, performance validation, and secure production deployment with comprehensive documentation",
            },
            {
              step: "Feedback & Iterations",
              description:
                "Continuous monitoring, user feedback integration, and model refinement for ongoing optimization",
            },
          ],
        whyChooseUs: parsedContent.whyChooseUs?.whyChooseUs ||
          parsedContent.whyChooseUs || [
            "Advanced AI Capabilities - Leverage cutting-edge technologies to unlock new possibilities for your business operations",
            "Image Recognition & Processing - State-of-the-art computer vision solutions for automated image analysis, object detection, and visual data interpretation",
            "Large Language Models - Custom-built and fine-tuned language models capable of understanding, generating, and processing human language with remarkable accuracy",
            "Speech Recognition - Advanced voice processing systems with multi-language support, real-time transcription, and voice-to-text capabilities",
            "Natural Language Processing (NLP) - Advanced algorithms for text analysis, sentiment detection, entity recognition, and semantic understanding across multiple languages",
            "Machine Learning - Sophisticated ML algorithms including supervised, unsupervised, and reinforcement learning models optimized for your use cases",
          ],
        trustSignals: {
          trustedBy:
            parsedContent.trustSignals?.trustedBy ||
            parsedContent.trustSignals?.clients ||
            [],
        },
        testimonials: (() => {
          // Handle testimonials with robust parsing
          const testimonials =
            parsedContent.testimonials?.testimonials ||
            parsedContent.testimonials ||
            [];

          // Ensure we have valid testimonials array
          if (Array.isArray(testimonials) && testimonials.length > 0) {
            return testimonials.map((testimonial, index) => ({
              quote:
                testimonial.quote ||
                testimonial.testimonialText ||
                `Professional ${service.category || "service"} expertise with outstanding results.`,
              client:
                testimonial.client ||
                (testimonial.clientName && testimonial.clientCompany
                  ? `${testimonial.clientName}, ${testimonial.clientPosition || "Manager"} at ${testimonial.clientCompany}`
                  : `Client ${index + 1}, Professional Company`),
              clientImage: testimonial.clientImage || "",
            }));
          }

          // Fallback testimonials if none exist
          return [
            {
              quote:
                "Outstanding service quality and professional expertise. They delivered exactly what we needed on time and within budget.",
              client: "Client, CEO at TechVision Corp",
              clientImage: "",
            },
            {
              quote:
                "Exceptional results that exceeded our expectations. The team's technical knowledge and attention to detail were impressive.",
              client: "Client, CTO at Innovation Labs",
              clientImage: "",
            },
            {
              quote:
                "Professional, reliable, and innovative solutions. We saw immediate improvements in our operations after implementation.",
              client: "Client, VP of Operations at DataFlow Inc",
              clientImage: "",
            },
          ];
        })(),
        faqs: (() => {
          // Handle FAQs with robust parsing for admin-entered content
          const faqs = parsedContent.faqs?.faqs || parsedContent.faqs || [];

          // Ensure we have valid FAQs array
          if (Array.isArray(faqs) && faqs.length > 0) {
            return faqs.map((faq) => ({
              question: faq.question || faq.q || "FAQ Question",
              answer: faq.answer || faq.a || faq.response || "FAQ Answer",
            }));
          }

          // Service-specific default FAQs if none exist
          const serviceTitle = (service.title || "").toLowerCase();
          if (serviceTitle.includes("blockchain")) {
            return [
              {
                question: "How quickly can I launch a blockchain project?",
                answer:
                  "Many MVPs go live in 3-12 weeks depending on scope and integration points.",
              },
              {
                question: "Is blockchain suitable for my industry?",
                answer:
                  "Blockchain drives value across finance, logistics, healthcare, real estate, gaming, and more.",
              },
              {
                question: "How do you ensure my project's security?",
                answer:
                  "We follow best practices: code audits, encryption, key management, and compliance.",
              },
            ];
          } else if (
            serviceTitle.includes("chatbot") ||
            serviceTitle.includes("ai")
          ) {
            return [
              {
                question: "How quickly can you deploy an AI chatbot?",
                answer:
                  "Most chatbots are deployed within 2-4 weeks, depending on complexity and integrations.",
              },
              {
                question:
                  "Can the chatbot integrate with our existing systems?",
                answer:
                  "Yes, we specialize in seamless integration with CRM, helpdesk, and other business systems.",
              },
              {
                question: "What languages does the chatbot support?",
                answer:
                  "Our chatbots support 100+ languages with natural conversation capabilities.",
              },
            ];
          } else if (
            serviceTitle.includes("llm") ||
            serviceTitle.includes("language")
          ) {
            return [
              {
                question: "How long does LLM development take?",
                answer:
                  "Custom LLM development typically takes 4-8 weeks, depending on training data and complexity.",
              },
              {
                question: "Can you work with our proprietary data?",
                answer:
                  "Yes, we ensure complete data privacy and security with enterprise-grade encryption.",
              },
              {
                question:
                  "What's the difference between fine-tuning and building from scratch?",
                answer:
                  "Fine-tuning adapts existing models while building from scratch creates custom architectures for specific needs.",
              },
            ];
          }

          // Default FAQs for any service
          return [
            {
              question: "How do you ensure project success?",
              answer:
                "We follow proven methodologies with regular updates, testing, and client collaboration throughout development.",
            },
            {
              question: "What ongoing support do you provide?",
              answer:
                "We offer comprehensive maintenance, updates, and technical support post-launch.",
            },
            {
              question: "How do you handle data security?",
              answer:
                "We implement enterprise-grade security with encryption, access controls, and compliance certifications.",
            },
          ];
        })(),
        finalCTA: {
          title:
            parsedContent.finalCta?.headline ||
            parsedContent.finalCTA?.title ||
            "Get Started Today",
          description:
            parsedContent.finalCta?.description ||
            parsedContent.finalCTA?.description ||
            "Ready to transform your business?",
          button:
            parsedContent.finalCta?.button ||
            parsedContent.finalCTA?.button ||
            "Contact Us Now",
        },
      };

      return structuredContent;
    }

    // If it's already in the correct format, use it
    if (parsedContent.heroSection && parsedContent.serviceOfferings) {
      return parsedContent;
    }

    throw new Error("Unknown JSON structure");
  } catch (error) {
    // Fallback: Convert plain content to structured format
    const paragraphs = service.content
      .split("\n\n")
      .filter((p) => p.trim().length > 0)
      .slice(0, 2); // Take first 2 paragraphs for intro

    // Extract technologies from service data
    const allTechs = [
      ...(service.technologies || []),
      ...(service.aiTechnologies || []),
    ];

    // Generate structured content from plain text
    structuredContent = {
      heroSection: {
        headline: sanitizeServiceContent(service.title),
        subheading: sanitizeServiceContent(
          service.excerpt ||
          paragraphs[0] ||
          `Professional ${service.category || "development"} services tailored for your business needs.`
        ),
        ctaButton: "Get Started Today",
      },
      introOverview: {
        paragraphs:
          paragraphs.length > 0
            ? paragraphs
            : [
              service.content.substring(0, 300) + "...",
              "Our expert team delivers cutting-edge solutions designed to transform your business and drive measurable results.",
            ],
      },
      serviceOfferings: {
        title: `Our ${service.category || "Development"} Solutions`,
        components: [
          {
            name: `Custom ${service.category || "Development"}`,
            description:
              "Tailored solutions designed to meet your specific business requirements and objectives.",
          },
          {
            name: "Consultation & Strategy",
            description:
              "Expert guidance to help you make informed decisions and optimize your technology investments.",
          },
          {
            name: "Implementation & Integration",
            description:
              "Seamless deployment and integration with your existing systems and workflows.",
          },
          {
            name: "Support & Maintenance",
            description:
              "Ongoing support to ensure optimal performance and continuous improvement.",
          },
        ],
      },
      technologyTools: {
        CoreTechnologies: allTechs.slice(0, 3),
        PlatformsFrameworks: allTechs.slice(3, 6),
        IntegrationTools: allTechs.slice(6, 8),
        DeploymentEnvironments: ["AWS", "Azure", "Docker"],
      },
      process: [
        {
          step: "Discovery & Analysis",
          description:
            "We analyze your requirements and create a comprehensive project roadmap.",
        },
        {
          step: "Design & Planning",
          description:
            "Our team designs the optimal solution architecture and implementation plan.",
        },
        {
          step: "Development & Testing",
          description:
            "We build and rigorously test your solution to ensure quality and performance.",
        },
        {
          step: "Deployment & Launch",
          description:
            "Seamless deployment with full support during the launch phase.",
        },
        {
          step: "Ongoing Support",
          description:
            "Continuous monitoring, maintenance, and optimization of your solution.",
        },
      ],
      whyChooseUs: [
        "Proven track record with 500+ successful projects",
        "Expert team with 10+ years of industry experience",
        "Agile development methodology for faster delivery",
        "24/7 support and dedicated project management",
        "Competitive pricing with transparent cost structure",
      ],
      trustSignals: {
        trustedBy: [
          "Fortune 500 Companies",
          "Leading Startups",
          "Government Agencies",
        ],
      },
      testimonials: [
        {
          quote:
            "Outstanding service delivery and exceptional technical expertise. They exceeded our expectations.",
          client: "John Smith, CTO at TechCorp",
          clientImage:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        {
          quote:
            "Professional team that delivered on time and within budget. Highly recommend their services.",
          client: "Sarah Johnson, Project Manager at InnovateInc",
          clientImage:
            "https://images.unsplash.com/photo-1494790108755-2616b612b44b?w=150&h=150&fit=crop&crop=face",
        },
      ],
      faqs: [
        {
          question: "How long does the typical project take?",
          answer:
            "Project timelines vary based on scope and complexity, typically ranging from 4-12 weeks for most implementations.",
        },
        {
          question: "Do you provide ongoing support after deployment?",
          answer:
            "Yes, we offer comprehensive support packages including monitoring, maintenance, and feature updates.",
        },
        {
          question: "Can you integrate with our existing systems?",
          answer:
            "Absolutely. We specialize in seamless integration with existing infrastructure and third-party services.",
        },
        {
          question: "What is your development process?",
          answer:
            "We follow an agile methodology with regular sprints, continuous feedback, and iterative improvements throughout the project.",
        },
      ],
      finalCTA: {
        title: "Ready to Get Started?",
        description:
          "Let's discuss your project requirements and create a solution that drives results for your business.",
        button: "Contact Us Today",
      },
    };

    return structuredContent;
  }
}

export function UniversalServiceDisplay({
  service,
}: UniversalServiceDisplayProps) {
  const data = parseServiceContent(service);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Testimonials carousel with smooth scrolling
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  // Partners carousel with left-to-right autoplay
  const [partnersEmblaRef, partnersEmblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  const partners = [
    {
      name: "ZebPay",
      logo: (
        <img
          src={zebpayLogo}
          alt="ZebPay"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Borrowland",
      logo: (
        <img
          src={borrowlandLogo}
          alt="Borrowland"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Mercedes-Benz",
      logo: (
        <img
          src={mercedesBenzLogo}
          alt="Mercedes-Benz"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Spherium",
      logo: (
        <img
          src={spheriumLogo}
          alt="Spherium"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Goldman Sachs",
      logo: (
        <img
          src={goldmanSachsLogo}
          alt="Goldman Sachs"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Alacrity",
      logo: (
        <img
          src={alacrityLogo}
          alt="Alacrity"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Mighty Jaxx",
      logo: (
        <img
          src={mightyJaxxLogo}
          alt="Mighty Jaxx"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
    {
      name: "Doc Trace",
      logo: (
        <img
          src={docTraceLogo}
          alt="Doc Trace"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      ),
    },
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {(() => {
              const headline = sanitizeServiceContent(data.heroSection?.headline || service.title || '');
              // If sanitization removed everything, use a fallback
              const displayText = headline || service.title || 'Transform Your Business';
              return <span dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(displayText) }} />;
            })()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto"
          >
            {(() => {
              const subheading = sanitizeServiceContent(data.heroSection?.subheading || 
                "Professional development services tailored to your needs");
              // If sanitization removed everything, use a fallback
              const displayText = subheading || "Professional development services tailored to your needs";
              return <span dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(displayText) }} />;
            })()}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex justify-center w-full px-4">
              <Button
                onClick={scrollToContact}
                className="
      bg-gradient-to-r from-blue-600 to-purple-600 
      hover:from-blue-700 hover:to-purple-700 
      text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl 
      transform hover:scale-105 transition-all duration-300
      flex items-center justify-center text-center
      whitespace-normal break-words
      px-4 py-2 text-sm              /* Mobile default */
      sm:px-6 sm:py-3 sm:text-base   /* Small screens */
      md:px-8 md:py-4 md:text-lg     /* Desktop */
      max-w-full
    "
              >
                {data.heroSection?.ctaButton ||
                  "Get Started with Ethereum dApp Development"}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Overview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Development Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">
                Comprehensive Solutions
              </h3>

              <div className="mb-6 last:mb-0">
                <p 
                  className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHtml(Array.isArray(data.introOverview?.paragraphs) 
                      ? data.introOverview.paragraphs.join(' ') 
                      : data.introOverview?.paragraphs ||
                        "Professional development services tailored to your needs")
                  }}
                />
              </div>

              <div className="flex justify-center mt-10">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {data.serviceOfferings?.title || "Our Solutions"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.serviceOfferings?.components?.length > 0 
              ? data.serviceOfferings.components 
              : [
                  {
                    name: "Custom Solution Development",
                    description: "Tailored solutions designed to meet your specific business requirements and objectives."
                  },
                  {
                    name: "System Integration", 
                    description: "Seamless integration with your existing systems and workflows for optimal performance."
                  },
                  {
                    name: "Consultation & Strategy",
                    description: "Expert guidance and strategic planning to ensure project success from start to finish."
                  },
                  {
                    name: "Training & Support",
                    description: "Comprehensive training and ongoing support to ensure successful implementation."
                  }
                ]
            ).map((component, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors min-h-[60px] flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 inline-block mr-2 flex-shrink-0" />
                      <span 
                        className="leading-tight"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdownToHtml(component.name || '')
                        }}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-start">
                    <p 
                      className="text-gray-600 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHtml(component.description || '')
                      }}
                    />
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              <Building className="w-5 h-5 mr-2" />
              Trusted Partners
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Join the ranks of successful companies that have transformed their
              operations with our cutting-edge solutions and achieved
              unprecedented growth.
            </p>
          </div>

          <div className="overflow-hidden relative bg-white rounded-2xl shadow-lg border border-gray-100 py-12">
            <div className="embla" ref={partnersEmblaRef}>
              <div className="embla__container flex gap-12">
                {partners.concat(partners, partners).map((partner, index) => (
                  <div
                    key={index}
                    className="embla__slide flex-none flex items-center justify-center w-52 sm:w-60 md:w-72 lg:w-80 h-20 px-6 group"
                  >
                    <div className="opacity-70 hover:opacity-100 transition-all duration-500 flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm hover:shadow-lg p-6 group-hover:scale-110 transform border border-gray-100 hover:border-blue-200">
                      <span className="sr-only">{partner.name}</span>
                      {partner.logo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Gradient fades */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Technology Stack
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive technology ecosystem supporting scalable, secure,
              and high-performance AI solutions designed for modern enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(data.technologyTools || {}).map(
              ([category, technologies]) => {
                // Function to format category names from admin input
                const formatCategoryName = (categoryKey: string) => {
                  // If it's already a formatted name (contains spaces), return as is
                  if (categoryKey.includes(" ")) {
                    return categoryKey;
                  }

                  // Convert camelCase to readable format
                  return categoryKey
                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                    .trim();
                };

                return (
                  <Card
                    key={category}
                    className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-4 flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Code className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-300 min-h-[60px] flex items-center justify-center">
                        {formatCategoryName(category)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex-1">
                      <div className="grid gap-3">
                        {(Array.isArray(technologies) ? technologies : []).map(
                          (tech, index) => (
                            <div
                              key={index}
                              className="flex items-start p-3 rounded-lg bg-gray-50 group-hover:bg-white/80 transition-all duration-300 border border-transparent group-hover:border-blue-100"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 group-hover:scale-125 transition-transform duration-300 flex-shrink-0 mt-1"></div>
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300 text-sm leading-relaxed">
                                {tech}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Vertical Timeline Process Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-blue-300/15 to-cyan-300/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-blue-700 font-semibold text-xs sm:text-sm mb-4 sm:mb-6 shadow-lg border border-blue-200/50">
              <div className="flex items-center">
                <Cog className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin-slow" />
                <span className="font-bold">STEP-BY-STEP WORKFLOW</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              Our Development{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Process Flow
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Follow our systematic methodology that transforms ideas into
              digital success
            </p>
          </div>

          {/* Desktop/Tablet: Vertical Timeline Layout */}
          <div className="hidden md:block">
            <div className="relative max-w-5xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
              {/* Central Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-blue-200 via-purple-300 to-indigo-400 rounded-full shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
              </div>

              {/* Process Steps */}
              <div className="space-y-12 md:space-y-16 lg:space-y-20">
                {(Array.isArray(data.process) ? data.process : []).map(
                  (step: any, index: number) => {
                    const colors = [
                      {
                        gradient: "from-red-500 to-orange-500",
                        bg: "bg-red-500",
                        light: "from-red-50 to-orange-50",
                        border: "border-red-200",
                        text: "text-red-600",
                      },
                      {
                        gradient: "from-yellow-500 to-amber-500",
                        bg: "bg-yellow-500",
                        light: "from-yellow-50 to-amber-50",
                        border: "border-yellow-200",
                        text: "text-yellow-600",
                      },
                      {
                        gradient: "from-green-500 to-emerald-500",
                        bg: "bg-green-500",
                        light: "from-green-50 to-emerald-50",
                        border: "border-green-200",
                        text: "text-green-600",
                      },
                      {
                        gradient: "from-blue-500 to-cyan-500",
                        bg: "bg-blue-500",
                        light: "from-blue-50 to-cyan-50",
                        border: "border-blue-200",
                        text: "text-blue-600",
                      },
                      {
                        gradient: "from-purple-500 to-violet-500",
                        bg: "bg-purple-500",
                        light: "from-purple-50 to-violet-50",
                        border: "border-purple-200",
                        text: "text-purple-600",
                      },
                      {
                        gradient: "from-indigo-500 to-blue-500",
                        bg: "bg-indigo-500",
                        light: "from-indigo-50 to-blue-50",
                        border: "border-indigo-200",
                        text: "text-indigo-600",
                      },
                      {
                        gradient: "from-orange-500 to-red-500",
                        bg: "bg-orange-500",
                        light: "from-orange-50 to-red-50",
                        border: "border-orange-200",
                        text: "text-orange-600",
                      },
                    ];

                    const colorSet = colors[index % colors.length];
                    const isEven = index % 2 === 0;
                    const totalSteps = Array.isArray(data.process)
                      ? data.process.length
                      : 6;

                    return (
                      <div
                        key={index}
                        className="relative flex items-center group"
                      >
                        {/* Step Number Circle - Always in Center */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                          <div
                            className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full ${colorSet.bg} flex items-center justify-center text-white font-bold text-lg md:text-xl lg:text-2xl shadow-2xl border-3 md:border-4 border-white group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}
                          >
                            <span className="relative z-10">{index + 1}</span>
                            {/* Rotating ring effect */}
                            <div className="absolute inset-1 rounded-full border-2 border-white/30 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>

                          {/* Pulsing rings around circle */}
                          <div
                            className={`absolute -inset-1 md:-inset-2 rounded-full bg-gradient-to-br ${colorSet.gradient} opacity-20 animate-ping`}
                          ></div>
                          <div
                            className={`absolute -inset-2 md:-inset-4 rounded-full bg-gradient-to-br ${colorSet.gradient} opacity-10 animate-ping delay-500`}
                          ></div>
                        </div>

                        {/* Content Box - Alternating Left/Right */}
                        <div
                          className={`flex-1 ${isEven ? "pr-8 md:pr-12 lg:pr-16" : "pl-8 md:pl-12 lg:pl-16 flex justify-end"}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg ${isEven ? "" : "text-right"}`}
                          >
                            {/* Step Number Badge */}
                            <div
                              className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full ${colorSet.bg} text-white text-xs md:text-sm font-bold mb-3 md:mb-4 shadow-lg`}
                            >
                              <span className="mr-1 md:mr-2">0{index + 1}</span>
                              <span className="text-xs">STEP</span>
                            </div>

                            {/* Content Card */}
                            <div
                              className={`bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${colorSet.border} relative overflow-hidden group-hover:border-opacity-100`}
                            >
                              {/* Decorative Background Pattern */}
                              <div
                                className={`absolute ${isEven ? "top-0 right-0" : "top-0 left-0"} w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 bg-gradient-to-br ${colorSet.light} opacity-40 ${isEven ? "rounded-bl-full" : "rounded-br-full"} transform group-hover:scale-110 transition-transform duration-500`}
                              ></div>

                              {/* Content */}
                              <div className="relative z-10">
                                <h3
                                  className={`text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight ${isEven ? "" : "text-right"}`}
                                >
                                  {step.step || step.title}
                                </h3>
                                <p
                                  className={`text-gray-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6 ${isEven ? "" : "text-right"}`}
                                >
                                  {step.description}
                                </p>

                                {/* Progress Indicator */}
                                <div
                                  className={`flex items-center space-x-2 ${isEven ? "" : "justify-end"}`}
                                >
                                  <div className="text-xs text-gray-500 font-medium">
                                    {index + 1} of {totalSteps} steps
                                  </div>
                                  <div className="flex space-x-1">
                                    {Array.from({ length: totalSteps }).map(
                                      (_, i) => (
                                        <div
                                          key={i}
                                          className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 ${i <= index
                                            ? `bg-gradient-to-r ${colorSet.gradient}`
                                            : "bg-gray-300"
                                            }`}
                                        />
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Connector Line to Circle */}
                              <div
                                className={`hidden lg:block absolute top-1/2 ${isEven ? "-right-4 lg:-right-6" : "-left-4 lg:-left-6"} w-4 lg:w-6 h-0.5 bg-gradient-to-r ${colorSet.gradient} transform -translate-y-1/2`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Process Completion */}
              <div className="text-center mt-16 relative z-10">
                <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold shadow-lg border-2 border-green-200">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Project Delivered Successfully
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Optimized Vertical Timeline */}
          <div className="md:hidden">
            <div className="relative max-w-md mx-auto px-4 sm:px-6">
              {/* Mobile Vertical Line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-300 to-indigo-400 rounded-full shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
              </div>

              {/* Mobile Process Steps */}
              <div className="space-y-6 sm:space-y-8">
                {(Array.isArray(data.process) ? data.process : []).map(
                  (step: any, index: number) => {
                    const colors = [
                      {
                        gradient: "from-red-500 to-orange-500",
                        bg: "bg-red-500",
                        light: "from-red-50 to-orange-50",
                        border: "border-red-200",
                      },
                      {
                        gradient: "from-yellow-500 to-amber-500",
                        bg: "bg-yellow-500",
                        light: "from-yellow-50 to-amber-50",
                        border: "border-yellow-200",
                      },
                      {
                        gradient: "from-green-500 to-emerald-500",
                        bg: "bg-green-500",
                        light: "from-green-50 to-emerald-50",
                        border: "border-green-200",
                      },
                      {
                        gradient: "from-blue-500 to-cyan-500",
                        bg: "bg-blue-500",
                        light: "from-blue-50 to-cyan-50",
                        border: "border-blue-200",
                      },
                      {
                        gradient: "from-purple-500 to-violet-500",
                        bg: "bg-purple-500",
                        light: "from-purple-50 to-violet-50",
                        border: "border-purple-200",
                      },
                      {
                        gradient: "from-indigo-500 to-blue-500",
                        bg: "bg-indigo-500",
                        light: "from-indigo-50 to-blue-50",
                        border: "border-indigo-200",
                      },
                      {
                        gradient: "from-orange-500 to-red-500",
                        bg: "bg-orange-500",
                        light: "from-orange-50 to-red-50",
                        border: "border-orange-200",
                      },
                    ];

                    const colorSet = colors[index % colors.length];
                    const totalSteps = Array.isArray(data.process)
                      ? data.process.length
                      : 6;

                    return (
                      <div
                        key={index}
                        className="relative flex items-start group"
                      >
                        {/* Mobile Step Circle */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorSet.bg} flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 border-3 border-white group-hover:scale-105 transition-all duration-300 relative overflow-hidden flex-shrink-0`}
                        >
                          <span className="relative z-10 text-xs sm:text-sm">{index + 1}</span>
                          {/* Mobile pulsing ring */}
                          <div
                            className={`absolute -inset-1 rounded-full bg-gradient-to-br ${colorSet.gradient} opacity-20 animate-ping`}
                          ></div>
                        </div>

                        {/* Mobile Content */}
                        <div className="ml-3 sm:ml-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg flex-1 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden border-2 border-gray-100 group-hover:border-gray-200 min-w-0">
                          {/* Mobile Step Badge */}
                          <div
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full ${colorSet.bg} text-white text-xs font-bold mb-2 sm:mb-3 shadow-md`}
                          >
                            <span className="mr-1">0{index + 1}</span>
                            <span className="text-xs">STEP</span>
                          </div>

                          {/* Mobile Background Pattern */}
                          <div
                            className={`absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${colorSet.light} opacity-30 rounded-bl-full`}
                          ></div>

                          <div className="relative z-10">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-tight pr-3 sm:pr-4">
                              {step.step || step.title}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 pr-2">
                              {step.description}
                            </p>

                            {/* Mobile Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                              <div
                                className={`h-1.5 rounded-full bg-gradient-to-r ${colorSet.gradient} transition-all duration-700`}
                                style={{
                                  width: `${((index + 1) / totalSteps) * 100}%`,
                                }}
                              ></div>
                            </div>

                            <div className="text-xs text-gray-500 font-medium">
                              {index + 1} of {totalSteps} steps completed
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Mobile Completion Indicator */}
              <div className="text-center mt-8 sm:mt-12">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold shadow-lg border-2 border-green-200">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  Process Complete
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center mt-16 sm:mt-20 lg:mt-24">
            <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/50 max-w-3xl mx-auto relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Ready to Start Your Process?
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  Let's begin your digital transformation journey with our
                  proven methodology
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <button
                    className="group w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
                    onClick={scrollToContact}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Begin Your Journey
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl">
                    View Our Work
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring unmatched expertise and commitment to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(data.whyChooseUs) ? data.whyChooseUs : []).map(
              (reason: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-medium">
                      {typeof reason === "string"
                        ? reason.split(" - ")[0]
                        : reason.title}
                    </p>
                    {typeof reason === "string" && reason.includes(" - ") && (
                      <p className="text-gray-600 text-sm mt-1">
                        {reason.split(" - ")[1]}
                      </p>
                    )}
                    {typeof reason === "object" && reason.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {reason.description}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {((service as any).selectedCaseStudies || service.caseStudyCategory) && (
          <div className="mt-8">
            {/* Check for new selectedCaseStudies first, fallback to old caseStudyCategory */}
            {(service as any).selectedCaseStudies ? (
              <SelectedCaseStudies caseStudyIds={(service as any).selectedCaseStudies} />
            ) : (
              <ServiceCaseStudies categoryName={service.caseStudyCategory || service.category || ""} />
            )}
          </div>
        )}
      </div>

      {/* Client Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300">
              <Users className="w-5 h-5 mr-2" />
              Client's Feedback
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Real results from businesses that transformed their operations
              with our cutting-edge AI solutions and achieved unprecedented
              growth.
            </p>
          </div>

          <div className="relative">
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex gap-6 pb-4">
                {(Array.isArray(data.testimonials)
                  ? data.testimonials
                  : []
                ).map((testimonial, index) => {
                  // Generate consistent random ratings between 4.2 and 5.0
                  const baseRating = 4.2 + ((index * 0.13) % 0.8);
                  const overallRating = Math.round(baseRating * 10) / 10;
                  const qualityRating =
                    Math.round((4.2 + ((index * 0.17) % 0.8)) * 10) / 10;
                  const scheduleRating =
                    Math.round((4.2 + ((index * 0.21) % 0.8)) * 10) / 10;
                  const communicationRating =
                    Math.round((4.2 + ((index * 0.11) % 0.8)) * 10) / 10;

                  // Remove unused hardcoded profile images array to ensure sophisticated system is used
                  // All profile images now handled by getProfileImageByGender() for maximum variety

                  return (
                    <div
                      key={index}
                      className="embla__slide flex-none w-72 sm:w-80 md:w-96 lg:w-[420px] xl:w-[450px]"
                    >
                      <Card className="group h-full border-0 shadow-xl bg-gradient-to-br from-white via-white to-blue-50/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 rounded-3xl min-h-[300px] transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden backdrop-blur-sm border border-white/20">
                        <CardContent className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                          {/* Header with avatar, name and overall rating */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center">
                              {/* Professional Profile Image - Gender-Based Real Images */}
                              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mr-3 sm:mr-4 flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 ring-2 sm:ring-4 ring-white shadow-lg shadow-blue-200/50 relative">
                                <img
                                  src={(() => {
                                    // Use proper gender-based profile images
                                    const clientName =
                                      testimonial.client?.split(",")[0] ||
                                      `Client ${index + 1}`;
                                    const detectedGender =
                                      (testimonial as any).gender ||
                                      getGenderFromName(clientName);

                                    // Use the sophisticated profile image system with stable identifiers
                                    return (
                                      testimonial.clientImage ||
                                      getProfileImageByGender(
                                        detectedGender,
                                        `${clientName}_testimonial_${index}`,
                                        `Service_${service?.title || "Default"}_testimonial_${index}`,
                                      )
                                    );
                                  })()}
                                  alt={
                                    testimonial.client?.split(",")[0] ||
                                    "Client"
                                  }
                                  className="w-full h-full object-cover"
                                  loading="eager"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const clientName =
                                      testimonial.client?.split(",")[0] ||
                                      `Client ${index + 1}`;
                                    const detectedGender =
                                      (testimonial as any).gender ||
                                      getGenderFromName(clientName);

                                    // Fallback to different gender-based image with stable context
                                    target.src = getProfileImageByGender(
                                      detectedGender,
                                      `${clientName}_fallback_${index}`,
                                      `Service_Fallback_${service?.title || "Default"}_testimonial_${index}`,
                                    );
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-1">
                                  {testimonial.client?.split(",")[0] ||
                                    "Client Name"}
                                </h3>
                                <p className="text-xs sm:text-sm text-blue-600 font-semibold">
                                  {testimonial.client?.split(",")[0] ||
                                    "Client Name"}
                                </p>
                              </div>
                            </div>

                            {/* Overall Rating */}
                            <div className="flex items-center flex-col bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner">
                              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                {overallRating}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(overallRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Testimonial Quote */}
                          <blockquote className="text-gray-800 text-base sm:text-lg leading-relaxed flex-1 mb-6 sm:mb-8 font-medium relative">
                            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 text-2xl sm:text-4xl text-blue-200 font-serif">"</div>
                            <div className="relative z-10 pl-3 sm:pl-4">{testimonial.quote}</div>
                            <div className="absolute -bottom-2 sm:-bottom-4 -right-1 sm:-right-2 text-2xl sm:text-4xl text-blue-200 font-serif">"</div>
                          </blockquote>

                          {/* Rating Metrics - Enhanced Layout */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-blue-100">
                            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm">
                              <p className="text-xs text-blue-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">
                                Quality
                              </p>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {qualityRating}
                              </p>
                            </div>
                            <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm">
                              <p className="text-xs text-purple-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">
                                Timing
                              </p>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {scheduleRating}
                              </p>
                            </div>
                            <div className="text-center bg-gradient-to-br from-green-50 to-teal-50 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm">
                              <p className="text-xs text-green-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">
                                Support
                              </p>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                {communicationRating}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative flex items-center">
              {/* Left Arrow */}
              <button
                onClick={scrollPrev}
                className="
      absolute -left-3 sm:-left-5
      top-1/2 transform -translate-y-1/2
      bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-xl hover:shadow-2xl
      transition-all duration-300 z-10 hover:scale-110
      p-3 sm:p-4
    "
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollNext}
                className="
      absolute -right-3 sm:-right-5
      top-1/2 transform -translate-y-1/2
      bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-xl hover:shadow-2xl
      transition-all duration-300 z-10 hover:scale-110
      p-3 sm:p-4 
    "
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our services and process.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {(Array.isArray(data.faqs) ? data.faqs : []).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
