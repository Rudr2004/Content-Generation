import React, { useEffect, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink, 
  Star,
  Clock,
  CheckCircle,
  ArrowLeft,
  Eye,
  Phone,
  Mail,
  Award,
  Zap,
  Users,
  Shield,
  TrendingUp,
  Globe,
  Code,
  Settings,
  ChevronRight,
  Quote
} from "lucide-react";
import { format } from "date-fns";

interface ServiceTestimonial {
  id: number;
  clientName: string;
  clientCompany: string;
  clientPosition: string;
  testimonialText: string;
  rating: number;
}

interface ServicePage {
  id: number;
  title: string;
  slug: string;
  subcategoryId: number;
  status: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  content?: string;
  price?: string;
  categoryId: number;
  subcategoryId: number;
  status: string;
  technologies?: string[];
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceContentDisplayProps {
  page: ServicePage;
  service?: Service;
  onBack?: () => void;
  className?: string;
}

export default function ServiceContentDisplay({ 
  page, 
  service, 
  onBack,
  className 
}: ServiceContentDisplayProps) {
  const [testimonials, setTestimonials] = useState<ServiceTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const readingProgress = useScrollProgress();
  
  const hasContent = service?.content || page?.content;
  const displayContent = service?.content || page?.content || '';
  const displayTitle = service?.title || page?.title || 'Service Page';
  const displayDescription = service?.description || 'Service information';

  // Fetch testimonials for this service
  useEffect(() => {
    if (service?.id) {
      fetch(`/api/services/${service.id}/testimonials`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTestimonials(data.testimonials);
          }
        })
        .catch(error => console.error('Error fetching testimonials:', error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [service?.id]);

  // Reading progress is now handled by the optimized useScrollProgress hook

  // Generate avatar URL based on client name
  const generateAvatarUrl = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&font-size=0.6&rounded=true&format=png`;
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className={`min-h-screen bg-white ${className}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-purple-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-20">
          {onBack && (
            <div className="mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Services</span>
              </Button>
            </div>
          )}
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              LLM Development Services -<br />
              Transform Your Business with Custom<br />
              AI Solutions
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Transform your business operations through intelligent, AI-powered<br />
              language models designed specifically for your industry requirements.
            </p>
            
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold">
              REQUEST CONSULTATION →
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            From ideation to deployment, we deliver end-to-end custom AI solutions that scale with 
            your business growth. Our comprehensive LLM development solutions are designed to 
            transform your business operations through intelligent, AI-powered language models.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We specialize in creating custom model architecture design and development tailored to 
            your specific business requirements and domain expertise.
          </p>
        </div>

        {/* Our Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive LLM Development Solutions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLM Development Services</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Custom model architecture design and development tailored to your specific 
                  business requirements and domain expertise
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLM Consulting Services</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Strategic guidance and roadmap development to maximize ROI from your AI 
                  investments with expert consultation
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">Data Preparation & Annotation</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  High-quality dataset creation, cleaning, and labeling services to ensure 
                  optimal model performance and accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLM Fine-Tuning Services</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Advanced parameter optimization and model customization using cutting-edge 
                  techniques like QLoRA and Spectrum for superior results
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLM App Development</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  End-to-end application development integrating LLM capabilities into user-friendly, 
                  production-ready solutions
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLM Model Integration</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Seamless integration of language models into existing business systems with 
                  minimal disruption and maximum efficiency
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="font-bold text-gray-900">LLMOps & Monitoring</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Continuous performance monitoring, automated retraining workflows, and 
                  enterprise-grade observability solutions
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <p className="text-gray-600 text-lg">We leverage cutting-edge technologies to deliver robust, scalable solutions.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">AI Frameworks</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">LangChain</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hugging Face Transformers</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">TensorFlow</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">PyTorch</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Cloud Platforms</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">AWS SageMaker</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Google Cloud Vertex AI</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Microsoft Azure AI</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">IBM Watson</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Integration & Deployment</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Docker</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Kubernetes</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">CI/CD Pipelines</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Microservices Architecture</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Programming Languages</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Python</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">JavaScript</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Go</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Java</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">C++</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mt-12">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Databases</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">SQL/NoSQL</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">AI-Optimized Storage</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Advanced Data Solutions</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Neural Networks</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Transformer Models</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">CNNs</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">RNNs</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Attention Mechanisms</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Vector Databases</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pinecone</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Weaviate</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">ChromaDB</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Milvus</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Serving & Inference</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">NVIDIA NIM</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">vLLM</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">TensorRT</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Observability</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Langfuse</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">MLflow</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Monitoring</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Analytics</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Security & Key Management</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enterprise Security</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Encryption</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Access Controls</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GDPR/HIPAA Compliance</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Partners Logo Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted By</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Empowering Global Brands and Startups to Drive Innovation and Success with 
                our unparalleled expertise and commitment to excellence
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity">
              {/* Partner logos - using placeholder for professional brands */}
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Disney</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Microsoft</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">IBM</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">AWS</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Google</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Oracle</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Tesla</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                <span className="text-gray-500 font-semibold text-sm">Netflix</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Apps & Digital Products Delivered</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Apps Development Agency Awards</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Global Brands Trust Us</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4+</div>
                <div className="text-blue-100">Years of Proven Success</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">80+</div>
                <div className="text-blue-100">In-house AI Specialists</div>
              </div>
            </div>
          </div>
        </section>

        {/* Achieve More Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold mb-2">BE DIGITALLY INTELLIGENT</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Achieve More With Our AI Expertise</h2>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                GreenAppleX develops advanced language models that think, learn, and create like humans. 
                Our models are like seeds, planted with care and nurtured with expertise. Our expertise 
                turns ideas into intelligent solutions, blending deep understanding with practical results 
                to shape the future of AI.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Image Recognition & Processing</h3>
                <p className="text-gray-600">
                  DALL-E, Stable Diffusion, and MidJourney are top tools that leverage artificial 
                  intelligence to generate and edit images. They offer powerful capabilities for 
                  creating unique visuals, enhancing creativity, and transforming ideas into 
                  artistic representations through advanced algorithms.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Large Language Models</h3>
                <p className="text-gray-600">
                  GPT 3.0 and 3.5, LLaMA by Meta, Turing-NLG, Claude, BLOOM, and GPT-NeoX are 
                  leading advanced language models. Each offers distinct capabilities for generating 
                  and understanding text, contributing to diverse applications in natural language 
                  processing and artificial intelligence development.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Speech Recognition</h3>
                <p className="text-gray-600">
                  Whisper is a prominent tool designed for speech-to-text conversion. It excels 
                  at transcribing spoken language into written text, making it valuable for 
                  applications such as creating subtitles, accessibility features, and processing 
                  spoken content into a readable format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold mb-2">GAIN A COMPETITIVE EDGE</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose GreenAppleX As Your <span className="text-blue-600">Custom LLM Development Company?</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-8">
                We provide advanced large language model development solutions for startups, enterprises, 
                SMEs, governments, and more. Our expertise in AI development services positions us as a 
                top provider in the large language model development industry.
              </p>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                Our custom LLMs (Large Language Models) are designed to learn from new data and trends, 
                so they're always relevant and deliver accurate results with continuous updates.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Trusted by Fortune 500 Companies</h3>
                    <p className="text-gray-600 text-sm">
                      We're trusted by a wide range of clients—from innovative startups to Fortune 500 
                      companies—because of our reliable, cutting-edge solutions and proven track record.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Scalable Solutions</h3>
                    <p className="text-gray-600 text-sm">
                      Our custom LLM services are built to scale with your data and user interactions, 
                      making them ideal for businesses of any size, especially those with growing needs.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Private & Secure Deployment</h3>
                    <p className="text-gray-600 text-sm">
                      We offer on-premise and private cloud deployment options for our language models, 
                      so your sensitive data stays protected and under your control.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Custom Training on Your Data</h3>
                    <p className="text-gray-600 text-sm">
                      We customize and train our language models using your own data, which improves 
                      the accuracy and relevance of the results for your unique business needs.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Industry-Leading Security</h3>
                    <p className="text-gray-600 text-sm">
                      We implement industry-leading data security protocols, ensuring your information 
                      is always safe, secure, and compliant with the latest standards.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">End-to-End Development</h3>
                    <p className="text-gray-600 text-sm">
                      From consultation to deployment and ongoing support, we provide comprehensive 
                      LLM development services that cover every aspect of your AI implementation.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold mb-2">HOW DO WE DO IT?</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Approach to LLM Development</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Structured approach ensuring successful delivery from concept to production with 
                proven methodology and cutting-edge technologies for optimal performance.
              </p>
            </div>
          
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</div>
                    <h3 className="font-bold text-gray-900">Discovery Call</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    In-depth consultation to understand your business challenges, objectives, and 
                    technical requirements for strategic alignment
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</div>
                    <h3 className="font-bold text-gray-900">Project Estimate</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Detailed technical assessment, resource planning, and transparent cost 
                    estimation with defined timelines and milestones
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</div>
                    <h3 className="font-bold text-gray-900">Training</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Custom model training using your proprietary data with advanced techniques 
                    for optimal performance and accuracy
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">4</div>
                    <h3 className="font-bold text-gray-900">Execution</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Agile development methodology with regular updates, collaborative feedback 
                    and iterative improvements
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">5</div>
                    <h3 className="font-bold text-gray-900">Evaluation & Deployment</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Rigorous testing, performance validation, and secure production deployment 
                    with comprehensive documentation
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">6</div>
                    <h3 className="font-bold text-gray-900">Feedback & Iterations</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Continuous monitoring, user feedback integration, and model refinement 
                    for ongoing optimization
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Exploring success stories. Read GreenAppleX's real-world examples showing how LLM 
                development empowers profitable and non-profitable industries with their custom apps 
                for better outcomes and efficiency.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Enterprise CRM</h3>
                  <p className="text-gray-600 mb-4">
                    Developed a smart CRM platform with custom LLM integration that automates customer 
                    interactions and provides intelligent insights for sales teams.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">AI Development</Badge>
                    <Badge variant="outline" className="text-xs">Enterprise Solutions</Badge>
                    <Badge variant="outline" className="text-xs">Custom LLM</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare AI Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    Created an intelligent healthcare assistant using fine-tuned language models 
                    for patient support and medical documentation automation.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Healthcare AI</Badge>
                    <Badge variant="outline" className="text-xs">Fine-tuning</Badge>
                    <Badge variant="outline" className="text-xs">HIPAA Compliant</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Financial AI Advisor</h3>
                  <p className="text-gray-600 mb-4">
                    Built a sophisticated financial advisory platform powered by custom LLMs 
                    for personalized investment recommendations and risk analysis.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">FinTech</Badge>
                    <Badge variant="outline" className="text-xs">Risk Analysis</Badge>
                    <Badge variant="outline" className="text-xs">Real-time Processing</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">E-commerce Personalization</h3>
                  <p className="text-gray-600 mb-4">
                    Implemented advanced personalization engine using large language models 
                    to enhance customer experience and boost conversion rates.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">E-commerce</Badge>
                    <Badge variant="outline" className="text-xs">Personalization</Badge>
                    <Badge variant="outline" className="text-xs">ML Integration</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Document Analyzer</h3>
                  <p className="text-gray-600 mb-4">
                    Developed an intelligent document analysis system for law firms using 
                    specialized LLMs trained on legal corpora for contract review and analysis.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Legal Tech</Badge>
                    <Badge variant="outline" className="text-xs">Document Analysis</Badge>
                    <Badge variant="outline" className="text-xs">Specialized Training</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Educational AI Tutor</h3>
                  <p className="text-gray-600 mb-4">
                    Created an adaptive learning platform with custom LLMs that provides 
                    personalized tutoring and educational content generation for students.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">EdTech</Badge>
                    <Badge variant="outline" className="text-xs">Adaptive Learning</Badge>
                    <Badge variant="outline" className="text-xs">Content Generation</Badge>
                  </div>
                  <Button variant="outline" size="sm">View Case Study</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
                <p className="text-gray-600 text-lg">Real results from industry leaders who have transformed their operations with our LLM solutions.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <Card key={testimonial.id} className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src={generateAvatarUrl(testimonial.clientName)} 
                            alt={testimonial.clientName}
                          />
                          <AvatarFallback>
                            {testimonial.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{testimonial.clientName}</div>
                          <div className="text-sm text-gray-600">{testimonial.clientPosition}</div>
                          <div className="text-sm text-blue-600 font-medium">{testimonial.clientCompany}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{testimonial.rating.toFixed(1)}</div>
                          {renderStarRating(testimonial.rating)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 italic">"{testimonial.testimonialText}"</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-gray-900">Quality</div>
                          <div className="text-gray-600">{testimonial.rating.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Schedule & Timing</div>
                          <div className="text-gray-600">{(testimonial.rating - 0.1).toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Communication</div>
                          <div className="text-gray-600">{(testimonial.rating - 0.2).toFixed(1)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQs</h2>
              <p className="text-gray-600 text-lg">Common Questions Answered - Expert insights into LLM development and implementation</p>
            </div>
          
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">How long does custom LLM development typically take?</h3>
                  <p className="text-gray-600">Most projects complete within 3-6 months depending on complexity and data requirements.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Can you integrate LLMs with our existing business systems?</h3>
                  <p className="text-gray-600">Yes, we specialize in seamless integration with CRM, ERP, and other enterprise platforms.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What industries do you serve for LLM development?</h3>
                  <p className="text-gray-600">We serve healthcare, finance, legal, manufacturing, retail, and technology sectors with specialized solutions.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">How do you ensure data privacy and security?</h3>
                  <p className="text-gray-600">We implement enterprise-grade security protocols with encryption, access controls, and compliance certifications.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you provide ongoing support after deployment?</h3>
                  <p className="text-gray-600">Yes, we offer comprehensive maintenance, monitoring, and optimization services post-deployment.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What's the difference between fine-tuning and building from scratch?</h3>
                  <p className="text-gray-600">Fine-tuning adapts existing models to your needs while building from scratch creates completely custom architectures.</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Can you handle multilingual LLM requirements?</h3>
                  <p className="text-gray-600">Absolutely, our solutions support over 100 languages with cultural context understanding.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}