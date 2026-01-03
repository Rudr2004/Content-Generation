import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { parseMarkdownToHtml } from "@/lib/markdown-utils";
import { 
  Brain, 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Settings,
  MessageSquare,
  Wrench,
  Globe,
  CheckCircle,
  Star,
  Users,
  Clock,
  TrendingUp,
  ChevronRight,
  Quote,
  Phone,
  Search,
  UserCheck,
  Play
} from "lucide-react";

interface HireLLMDeveloperPageProps {
  content: {
    hero_section: {
      headline: string;
      subheading: string;
      primary_cta: string;
    };
    intro_overview: string;
    why_hire: string[];
    hiring_models: Array<{
      model: string;
      description: string;
      best_for: string;
    }>;
    skills_expertise: {
      technical_skills: string[];
      soft_skills: string[];
    };
    technology_stack: {
      languages: string[];
      frameworks_libraries: string[];
      databases: string[];
      tools_platforms: string[];
    };
    hiring_process: Array<{
      step: string;
      description: string;
    }>;
    testimonials: Array<{
      quote: string;
      client: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    final_cta: {
      headline: string;
      button_text: string;
    };
  };
}

export function HireLLMDeveloperPage({ content }: HireLLMDeveloperPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleCTAClick = () => {
    // Scroll to contact form or redirect to contact page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Redirect to contact page
      window.location.href = '/contact';
    }
  };

  const stepIcons = [Phone, Search, UserCheck, Play];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              <span 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHtml(content.hero_section?.headline || content.heroSection?.title || "Hire Expert LLM Developers to Build Advanced AI Solutions")
                }}
              />
            </h1>
            <p 
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(content.hero_section?.subheading || content.heroSection?.heroSubtitle || "Get top-tier LLM developers on-demand to accelerate your AI and NLP projects.")
              }}
            />
            <div className="mt-10 flex items-center justify-center gap-x-6 px-4 sm:px-0">
              <Button 
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto max-w-xs sm:max-w-none rounded-full font-semibold"
              >
                <span className="truncate">
                  {content.hero_section?.primary_cta || content.heroSection?.ctaText || "Hire Now"}
                </span>
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Users, label: "250+ Developers", description: "Expert Team" },
              { icon: Clock, label: "72 Hours", description: "Quick Matching" },
              { icon: TrendingUp, label: "95% Success", description: "Client Satisfaction" },
              { icon: Shield, label: "NDA Protected", description: "Data Security" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Overview */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
            {content.intro_overview || content.heroSection?.heroDescription || "Hire LLM developers to harness the full potential of large language models with expertise in custom model training, fine-tuning, and AI solution development tailored to your business needs."}
          </p>
        </div>
      </section>

      {/* Why Hire Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Our LLM Developers
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Industry-leading expertise in large language model development
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(content.why_hire || content.keySkillsSection?.whyHirePoints?.map(point => point.description) || [
              "Deep expertise in developing sophisticated algorithms and custom large language models",
              "Prioritize code quality with rigorous standards, reviews, and testing",
              "Flexible, agile team adaptable to evolving project requirements",
              "Seamless integration of large language models with existing systems",
              "Reduced project risks with highly experienced, pre-vetted engineers",
              "Rapid deployments ensuring timely delivery of AI solutions"
            ]).map((reason, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Models */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Flexible Hiring Models
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choose the engagement model that best fits your project needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {(content.hiring_models || [
              {
                model: "Contract Basis",
                description: "Hire LLM developers to work full-time on a contract basis with managed hiring and post-hiring formalities.",
                best_for: "Projects requiring flexible, short-to-medium term engagements."
              },
              {
                model: "Permanent Hire",
                description: "Option to hire developers permanently after an initial contract period.",
                best_for: "Long-term, in-house roles for sustained AI development."
              },
              {
                model: "Outsourced Recruitment",
                description: "Outsource your recruitment process to streamline hiring of the right LLM developers.",
                best_for: "Businesses looking to offload recruitment management."
              }
            ]).map((model, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white">
                    {model.model}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{model.description}</p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Best for:</strong> {model.best_for}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Skills & Expertise
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Comprehensive skill set for advanced AI development
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Technical Skills */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(content.skills_expertise?.technical_skills || [
                    "Large Language Model Development and Fine-Tuning",
                    "Natural Language Processing (NLP) and Reinforcement Learning",
                    "Data Collection, Annotation, and Preprocessing",
                    "Machine Translation, Sentiment Analysis, and Text Classification"
                  ]).map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(content.skills_expertise?.soft_skills || [
                    "Adaptability to evolving project requirements",
                    "Strong communication and collaboration",
                    "Problem-solving and analytical thinking"
                  ]).map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Technology Stack
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Cutting-edge technologies for robust AI solutions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Languages", items: content.technology_stack?.languages || [], icon: Code, color: "blue" },
              { title: "Frameworks", items: content.technology_stack?.frameworks_libraries || [], icon: Wrench, color: "purple" },
              { title: "Databases", items: content.technology_stack?.databases || [], icon: Database, color: "green" },
              { title: "Tools", items: content.technology_stack?.tools_platforms || [], icon: Settings, color: "orange" }
            ].map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className={`h-5 w-5 text-${category.color}-500`} />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <Badge key={itemIndex} variant="secondary" className="mr-2 mb-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Hiring Process
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Simple 4-step process to get your perfect developer
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {(content.hiring_process || [
              {
                step: "Exploratory Call",
                description: "Set up an exploratory call to deeply understand your needs and objectives."
              },
              {
                step: "Profile Matching",
                description: "Get access to deeply vetted LLM developer profiles that perfectly match your requirements."
              },
              {
                step: "Selection",
                description: "Interact and select the top vetted LLM developers that fit your project needs."
              },
              {
                step: "Onboarding & Kickoff",
                description: "Kick start your project immediately while we handle onboarding formalities."
              }
            ]).map((step, index) => {
              const IconComponent = stepIcons[index] || Settings;
              return (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {index + 1}. {step.step}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Trusted by companies worldwide
            </p>
          </div>
          <div className="space-y-8">
            {(content.testimonials || [
              {
                quote: "They have such a wide variety of qualified LLM engineers, and they responded to my request very quickly.",
                client: "Andile Ngcaba, Chairman at Convergence Partners Investments"
              },
              {
                quote: "We thought hiring 100+ engineers would be extremely hard, but they delivered on time with experienced and communicative engineers. Post-sales support is amazing.",
                client: "Sarah Johnson, CTO at TechVenture Inc."
              }
            ]).map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <Quote className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-sm font-medium text-gray-900 dark:text-white">
                        — {testimonial.client}
                      </cite>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Get answers to common questions about hiring LLM developers
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {(content.faqs || [
              {
                question: "How soon can I hire an LLM developer?",
                answer: "You can receive profiles of pre-vetted LLM developers within 72 hours after sharing your requirements."
              },
              {
                question: "What experience do your LLM developers have?",
                answer: "Our developers have extensive experience ranging from 4 to 8+ years specializing in NLP, model fine-tuning, sentiment analysis, and domain-specific AI solutions."
              },
              {
                question: "What are your hiring models?",
                answer: "We offer contract hires, permanent hires after a trial period, and recruitment outsourcing."
              },
              {
                question: "How do you ensure data security?",
                answer: "Our developers strictly adhere to NDA agreements and legal standards to maintain high data security and project integrity."
              }
            ]).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            {content.final_cta?.headline || "Hire the Best LLM Developers for Your Next AI Project"}
          </h2>
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto max-w-xs sm:max-w-none rounded-full"
          >
            <span className="truncate">
              {content.final_cta?.button_text || "Get Started"}
            </span>
            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          </Button>
        </div>
      </section>
    </div>
  );
}