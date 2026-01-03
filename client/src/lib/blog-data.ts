export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  author: string;
  categoryColor: string;
  slug: string;
  featured?: boolean;
}

export const BLOG_CATEGORIES = [
  { name: "All", value: "all", color: "bg-gray-100 text-gray-800" },
  { name: "AI/ML", value: "ai-ml", color: "bg-orange-100 text-orange-800" },
  { name: "Web3", value: "web3", color: "bg-purple-100 text-purple-800" },
  { name: "Mobile", value: "mobile", color: "bg-blue-100 text-blue-800" },
  { name: "Software Engineering", value: "software-engineering", color: "bg-green-100 text-green-800" },
  { name: "Digital Transformation", value: "digital-transformation", color: "bg-indigo-100 text-indigo-800" },
  { name: "Cloud & DevOps", value: "cloud-devops", color: "bg-cyan-100 text-cyan-800" },
  { name: "Security", value: "security", color: "bg-red-100 text-red-800" },
  { name: "Design & UX", value: "design-ux", color: "bg-pink-100 text-pink-800" }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Autogen vs LangGraph: A Deep Dive into Multi-Agent Workflows",
    description: "This blog compares the two powerful and leading multi-agent frameworks: Autogen and LangGraph, across their core capabilities like architecture, memory management, tool integration, and deployment.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "ai-ml",
    tags: ["AI", "Machine Learning", "Multi-Agent", "Autogen", "LangGraph", "Frameworks"],
    readTime: "10 min read",
    date: "July 04, 2025",
    author: "Manushi Khambholja",
    categoryColor: "bg-orange-100 text-orange-800",
    slug: "autogen-vs-langgraph-multi-agent-workflows",
    featured: true
  },
  {
    id: "2",
    title: "The Future of Generative AI in Business Applications",
    description: "Explore how generative AI is transforming business processes and creating new opportunities for innovation in 2024 and beyond.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "ai-ml",
    tags: ["Generative AI", "Business Applications", "Innovation", "Automation", "LLM"],
    readTime: "8 min read",
    date: "Dec 15, 2024",
    author: "Sarah Johnson",
    categoryColor: "bg-orange-100 text-orange-800",
    slug: "future-generative-ai-business-applications",
    featured: true
  },
  {
    id: "3",
    title: "Cross-Platform Development: React Native vs Flutter in 2024",
    description: "A comprehensive comparison of the two leading cross-platform frameworks and how to choose the right one for your project.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "mobile",
    tags: ["React Native", "Flutter", "Cross-Platform", "Mobile Development", "Framework Comparison"],
    readTime: "7 min read",
    date: "Dec 12, 2024",
    author: "Michael Chen",
    categoryColor: "bg-blue-100 text-blue-800",
    slug: "react-native-vs-flutter-2024-comparison"
  },
  {
    id: "4",
    title: "Building Secure DeFi Applications: Best Practices and Security Considerations",
    description: "Learn the essential security practices and architecture patterns for developing robust decentralized finance applications.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "web3",
    tags: ["DeFi", "Web3", "Blockchain", "Security", "Smart Contracts", "Cryptocurrency"],
    readTime: "9 min read",
    date: "Dec 10, 2024",
    author: "Alex Rodriguez",
    categoryColor: "bg-purple-100 text-purple-800",
    slug: "building-secure-defi-applications"
  },
  {
    id: "5",
    title: "Microservices Architecture: Design Patterns and Implementation Strategies",
    description: "Deep dive into microservices architecture patterns, best practices, and implementation strategies for scalable enterprise applications.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "software-engineering",
    tags: ["Microservices", "Architecture", "Design Patterns", "Scalability", "Enterprise", "Backend"],
    readTime: "12 min read",
    date: "Dec 08, 2024",
    author: "David Kim",
    categoryColor: "bg-green-100 text-green-800",
    slug: "microservices-architecture-design-patterns"
  },
  {
    id: "6",
    title: "Digital Transformation: From Legacy Systems to Modern Cloud Architecture",
    description: "A comprehensive guide to modernizing legacy systems and embracing cloud-native architectures for digital transformation.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "digital-transformation",
    tags: ["Digital Transformation", "Legacy Systems", "Cloud Migration", "Modernization", "Architecture"],
    readTime: "10 min read",
    date: "Dec 05, 2024",
    author: "Emily Davis",
    categoryColor: "bg-indigo-100 text-indigo-800",
    slug: "digital-transformation-legacy-to-cloud"
  },
  {
    id: "7",
    title: "Kubernetes Security: Best Practices for Production Deployments",
    description: "Essential security practices and configuration strategies for deploying and managing Kubernetes clusters in production environments.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "cloud-devops",
    tags: ["Kubernetes", "Security", "DevOps", "Cloud", "Production", "Deployment"],
    readTime: "11 min read",
    date: "Dec 03, 2024",
    author: "James Wilson",
    categoryColor: "bg-cyan-100 text-cyan-800",
    slug: "kubernetes-security-production-best-practices"
  },
  {
    id: "8",
    title: "Zero Trust Architecture: Implementation Guide for Modern Applications",
    description: "Learn how to implement Zero Trust security architecture for modern applications with practical examples and best practices.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "security",
    tags: ["Zero Trust", "Security", "Architecture", "Cybersecurity", "Authentication", "Authorization"],
    readTime: "13 min read",
    date: "Dec 01, 2024",
    author: "Lisa Thompson",
    categoryColor: "bg-red-100 text-red-800",
    slug: "zero-trust-architecture-implementation-guide"
  },
  {
    id: "9",
    title: "User Experience Design for AI-Powered Applications",
    description: "Explore UX design principles and patterns specifically tailored for AI-powered applications and machine learning interfaces.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "design-ux",
    tags: ["UX Design", "AI", "Machine Learning", "User Interface", "Design Patterns", "User Experience"],
    readTime: "9 min read",
    date: "Nov 28, 2024",
    author: "Sophie Martinez",
    categoryColor: "bg-pink-100 text-pink-800",
    slug: "ux-design-ai-powered-applications"
  },
  {
    id: "10",
    title: "Progressive Web Apps: The Future of Mobile-First Development",
    description: "Understand how Progressive Web Apps (PWAs) are revolutionizing mobile development with native-like experiences.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "mobile",
    tags: ["PWA", "Progressive Web Apps", "Mobile Development", "Web Technologies", "Performance"],
    readTime: "8 min read",
    date: "Nov 25, 2024",
    author: "Robert Garcia",
    categoryColor: "bg-blue-100 text-blue-800",
    slug: "progressive-web-apps-mobile-development"
  },
  {
    id: "11",
    title: "Smart Contract Development: Solidity Best Practices and Security Patterns",
    description: "Master Solidity development with comprehensive best practices, security patterns, and optimization techniques for smart contracts.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "web3",
    tags: ["Smart Contracts", "Solidity", "Blockchain", "Web3", "Security", "Ethereum"],
    readTime: "14 min read",
    date: "Nov 22, 2024",
    author: "Daniel Lee",
    categoryColor: "bg-purple-100 text-purple-800",
    slug: "smart-contract-solidity-best-practices"
  },
  {
    id: "12",
    title: "Machine Learning Operations (MLOps): Production-Ready ML Pipelines",
    description: "Build scalable and reliable machine learning pipelines with MLOps practices, monitoring, and continuous integration.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "ai-ml",
    tags: ["MLOps", "Machine Learning", "Production", "ML Pipelines", "DevOps", "Monitoring"],
    readTime: "11 min read",
    date: "Nov 20, 2024",
    author: "Anna Petrov",
    categoryColor: "bg-orange-100 text-orange-800",
    slug: "mlops-production-ml-pipelines"
  }
];

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === "all") {
    return BLOG_POSTS;
  }
  return BLOG_POSTS.filter(post => post.category === category);
}

export function getBlogsByTag(tag: string): BlogPost[] {
  return BLOG_POSTS.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getFeaturedBlogs(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.featured);
}

export function getRecentBlogs(count: number = 6): BlogPost[] {
  return BLOG_POSTS.slice(0, count);
}