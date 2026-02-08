export const COMPANY_INFO = {
  name: "Bootsolo",
  tagline: "Marketing for Solopreneurs & Lean Tech Founders",
  description: "Bootsolo is your lean marketing partner. We deliver brand strategy, website design, content marketing, SEO, and paid ads—built for solopreneurs and lean tech founders who need results, not bureaucracy.",
  email: "sales@greenapplex.com",
  phone: "(617) 946-6898",
  address: "732 Princeton Blvd apt 7, Lowell, MA 01851",
  website: "https://www.greenapplex.com",
  social: {
    twitter: "https://x.com/_greenapplex",
    linkedin: "https://www.linkedin.com/company/greenapplex"
  }
};

export const ALL_SERVICES = [
  // AI & Machine Learning
  { id: "generative-ai-solutions", title: "Generative AI Solutions", category: "AI & Machine Learning", icon: "🧠", description: "AI-driven content creation, predictive analytics, and chatbots using TensorFlow, PyTorch, and GANs.", href: "/genai-service" },
  { id: "ai-development", title: "AI Development", category: "AI & Machine Learning", icon: "🤖", description: "Machine learning, deep learning, NLP, and computer vision for automation and analytics.", href: "/services/ai-development" },
  { id: "data-science-services", title: "Data Science Services", category: "AI & Machine Learning", icon: "📊", description: "Data analytics, big data (Hadoop, Spark), and visualization (Tableau, Power BI).", href: "/services/data-science-services" },
  { id: "big-data-development", title: "Big Data Development", category: "AI & Machine Learning", icon: "📈", description: "Hadoop, Spark, and data warehousing (Snowflake, Redshift).", href: "/services/big-data-development" },

  // Web3 & Blockchain
  { id: "web3-development", title: "Web3 Development", category: "Web3 & Blockchain", icon: "🔗", description: "Blockchain, smart contracts, NFTs, and DeFi solutions for decentralized applications.", href: "/services/web3-development" },
  { id: "blockchain-development", title: "Blockchain Development", category: "Web3 & Blockchain", icon: "⛓️", description: "Ethereum, Hyperledger, Solana, and smart contract development for DeFi and NFTs.", href: "/services/blockchain-development" },

  // Mobile Development
  { id: "mobile-app-development", title: "Mobile App Development", category: "Mobile Development", icon: "📱", description: "iOS, Android, and cross-platform apps using React Native, Flutter, and Xamarin.", href: "/services/mobile-app-development" },
  { id: "ar-vr-development", title: "AR/VR Development", category: "Mobile Development", icon: "🥽", description: "Unity and Unreal Engine for gaming and virtual experiences.", href: "/services/ar-vr-development" },
  { id: "game-development", title: "Game Development", category: "Mobile Development", icon: "🎮", description: "Mobile and AR/VR games using Unity and Unreal Engine.", href: "/services/game-development" },

  // Web Development
  { id: "web-development", title: "Web Development", category: "Web Development", icon: "🌐", description: "Full-stack development for custom web apps using PHP, .NET, and JavaScript.", href: "/services/web-development" },
  { id: "frontend-development", title: "Frontend Development", category: "Web Development", icon: "🖥️", description: "User-friendly interfaces using React, Angular, Vue.js, and JavaScript.", href: "/services/frontend-development" },
  { id: "backend-development", title: "Backend Development", category: "Web Development", icon: "⚙️", description: "Scalable systems using Node.js, Python, PHP, and .NET.", href: "/services/backend-development" },
  { id: "api-development", title: "API Development", category: "Web Development", icon: "🔌", description: "REST, GraphQL, and gRPC for seamless integrations.", href: "/services/api-development" },
  { id: "cms-development", title: "CMS Development", category: "Web Development", icon: "📝", description: "WordPress, Drupal, and Sitecore for content management.", href: "/services/cms-development" },
  { id: "ecommerce-development", title: "E-commerce Development", category: "Web Development", icon: "🛒", description: "Platforms like Magento, Shopify, and WooCommerce for online stores.", href: "/services/ecommerce-development" },

  // Enterprise Solutions
  { id: "custom-software-development", title: "Custom Software Development", category: "Enterprise Solutions", icon: "💻", description: "Bespoke CRM, ERP, and industry-specific solutions using .NET, Java, and Python.", href: "/services/custom-software-development" },
  { id: "digital-transformation-consulting", title: "Digital Transformation Consulting", category: "Enterprise Solutions", icon: "🔄", description: "IoT, cloud computing, and blockchain for business modernization.", href: "/services/digital-transformation-consulting" },
  { id: "crm-development", title: "CRM Development", category: "Enterprise Solutions", icon: "👥", description: "Salesforce, HubSpot, and Zoho for customer relationship management.", href: "/services/crm-development" },
  { id: "erp-development", title: "ERP Development", category: "Enterprise Solutions", icon: "🏢", description: "SAP, Oracle NetSuite, and Odoo for enterprise resource planning.", href: "/services/erp-development" },
  { id: "saas-development", title: "SaaS Development", category: "Enterprise Solutions", icon: "☁️", description: "Scalable SaaS platforms for various industries.", href: "/services/saas-development" },
  { id: "it-consulting", title: "IT Consulting", category: "Enterprise Solutions", icon: "💼", description: "Strategic consulting for technology adoption and digital transformation.", href: "/services/it-consulting" },

  // Cloud & DevOps
  { id: "cloud-computing-services", title: "Cloud Computing Services", category: "Cloud & DevOps", icon: "☁️", description: "AWS, Azure, and Google Cloud for scalable infrastructure.", href: "/services/cloud-computing-services" },
  { id: "devops-services", title: "DevOps Services", category: "Cloud & DevOps", icon: "🔧", description: "CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS and Azure.", href: "/services/devops-services" },

  // Automation & Testing
  { id: "rpa-services", title: "RPA (Robotic Process Automation)", category: "Automation & Testing", icon: "🤖", description: "UiPath, Automation Anywhere, and Blue Prism for process automation.", href: "/services/rpa-services" },
  { id: "automation-testing", title: "Automation Testing", category: "Automation & Testing", icon: "🧪", description: "Test automation using Selenium, Appium, and JMeter for quality assurance.", href: "/services/automation-testing" },
  { id: "low-code-development", title: "Low-Code Development", category: "Automation & Testing", icon: "⚡", description: "Platforms like OutSystems and Mendix for rapid development.", href: "/services/low-code-development" },

  // IoT & Security
  { id: "iot-development", title: "IoT Development", category: "IoT & Security", icon: "📡", description: "MQTT, AWS IoT, and Azure IoT for smart devices in retail and healthcare.", href: "/services/iot-development" },
  { id: "embedded-systems-development", title: "Embedded Systems Development", category: "IoT & Security", icon: "🔌", description: "C, C++, and firmware for IoT and automotive solutions.", href: "/services/embedded-systems-development" },
  { id: "cybersecurity-services", title: "Cybersecurity Services", category: "IoT & Security", icon: "🔒", description: "Secure coding and threat management for data protection.", href: "/services/cybersecurity-services" },

  // Design & UX
  { id: "ui-ux-design", title: "UI/UX Design", category: "Design & UX", icon: "🎨", description: "User-centric design for web and mobile apps.", href: "/services/ui-ux-design" }
];

export const SERVICES = [
  {
    id: "brand-strategy",
    icon: "🎯",
    title: "Brand Strategy",
    description: "Positioning, messaging, and visual identity that connects with your ideal customers.",
    features: ["Brand Voice & Messaging", "Visual Identity", "Competitive Positioning"],
    color: "from-green-apple to-apple-teal"
  },
  {
    id: "website-design",
    icon: "🌐",
    title: "Website Design & Development",
    description: "High-converting websites built for solopreneurs. Fast, clean, and focused on conversions.",
    features: ["Landing Pages", "Portfolio Sites", "SaaS Marketing Sites"],
    color: "from-apple-teal to-apple-cyan"
  },
  {
    id: "content-marketing",
    icon: "✍️",
    title: "Content Marketing",
    description: "Blog posts, guides, and lead magnets that build authority and drive organic traffic.",
    features: ["SEO-Optimized Content", "Lead Magnets", "Content Strategy"],
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "seo",
    icon: "📈",
    title: "SEO & Organic Growth",
    description: "Technical SEO, keyword research, and content optimization to rank for terms that matter.",
    features: ["Keyword Research", "On-Page SEO", "Technical SEO Audits"],
    color: "from-orange-500 to-red-500"
  },
  {
    id: "social-media",
    icon: "📱",
    title: "Social Media Marketing",
    description: "Strategic social presence that builds community and drives engagement.",
    features: ["Content Calendars", "Community Management", "Paid Social"],
    color: "from-indigo-600 to-blue-600"
  },
  {
    id: "email-marketing",
    icon: "📧",
    title: "Email Marketing & Automations",
    description: "Nurture sequences, newsletters, and automation flows that convert subscribers.",
    features: ["Welcome Sequences", "Newsletter Strategy", "Drip Campaigns"],
    color: "from-green-600 to-teal-600"
  },
  {
    id: "paid-ads",
    icon: "💰",
    title: "Paid Ads (PPC)",
    description: "Google Ads, Meta, and LinkedIn campaigns optimized for lean budgets.",
    features: ["Google Ads", "Meta Ads", "LinkedIn Ads"],
    color: "from-blue-600 to-cyan-600"
  }
];

export const STATS = [
  { label: "Solopreneurs Helped", value: "50+", color: "text-green-apple" },
  { label: "Avg. ROI on Campaigns", value: "3x", color: "text-apple-teal" },
  { label: "Strategy Turnaround", value: "72h", color: "text-green-apple" },
  { label: "Lean & Focused", value: "100%", color: "text-apple-teal" }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Solopreneur, SaaS Founder",
    avatar: "SM",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Bootsolo understood exactly what I needed—no enterprise bloat, just focused marketing that actually moved the needle. My website and content strategy have been game-changers.",
    rating: 4.9
  },
  {
    id: 2,
    name: "James K.",
    role: "Tech Founder",
    avatar: "JK",
    gender: "male",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Lean, transparent, and results-driven. Bootsolo helped us launch our brand and SEO strategy without the usual agency overhead. Highly recommend for any lean startup.",
    rating: 4.8
  },
  {
    id: 3,
    name: "Maria L.",
    role: "Consultant & Coach",
    avatar: "ML",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Finally, a marketing partner that gets solopreneurs. The content and email strategy they built for me has tripled my inbound leads. Worth every penny.",
    rating: 4.7
  },
  {
    id: 4,
    name: "David R.",
    role: "Indie Hacker",
    avatar: "DR",
    gender: "male",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Bootsolo helped me go from zero to a professional brand and landing page in weeks. Their paid ads setup delivered ROI from day one.",
    rating: 4.9
  },
  {
    id: 5,
    name: "Emma T.",
    role: "CEO, B2B Startup",
    avatar: "ET",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "We needed marketing that could scale with us. Bootsolo delivered strategy, content, and campaigns that grew alongside our team. Exactly what lean tech founders need.",
    rating: 4.8
  }
];
