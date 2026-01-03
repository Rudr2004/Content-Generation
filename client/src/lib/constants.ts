export const COMPANY_INFO = {
  name: "GreenAppleX",
  tagline: "Transformative Digital Solutions",
  description: "GreenAppleX delivers transformative solutions in generative AI, Web3, mobile apps, custom software, and digital transformation, empowering startups and enterprises to lead their industries.",
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
    id: "mobile-app",
    icon: "📱",
    title: "Mobile App Development",
    description: "Native iOS and Android applications with React Native, Flutter, and Swift. Delivering exceptional user experiences across all mobile platforms.",
    features: ["Native iOS & Android", "React Native & Flutter", "App Store Optimization"],
    color: "from-green-apple to-apple-teal"
  },
  {
    id: "digital-transformation",
    icon: "🔄",
    title: "Digital Transformation",
    description: "Modernize your business processes with cloud migration, system integration, and digital strategy consulting for competitive advantage.",
    features: ["Cloud Migration", "System Integration", "Process Automation"],
    color: "from-apple-teal to-apple-cyan"
  },
  {
    id: "web3",
    icon: "🔗",
    title: "Web3 & Blockchain",
    description: "Decentralized applications, smart contracts, NFT marketplaces, and blockchain solutions for the future of digital business.",
    features: ["Smart Contracts", "DeFi Applications", "NFT Platforms"],
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "gen-ai",
    icon: "🧠",
    title: "Enterprise AI Development",
    description: "Custom AI solutions, generative AI development, machine learning consulting, and AI automation services for enterprises. LLM integration, AI agents, and intelligent automation platforms.",
    features: ["Custom LLM Development", "AI Agent Development", "Enterprise AI Integration", "Machine Learning Consulting"],
    color: "from-orange-500 to-red-500"
  },
  {
    id: "custom-software",
    icon: "💻",
    title: "Custom Software Development",
    description: "Bespoke software development using modern technologies like React, Python, Node.js, and cloud-native architectures. Enterprise software solutions for scalable business growth.",
    features: ["Full-Stack Development", "Enterprise Software Solutions", "API Development", "Cloud-Native Architecture"],
    color: "from-indigo-600 to-blue-600"
  },
  {
    id: "enterprise",
    icon: "🏢",
    title: "Enterprise Solutions",
    description: "Scalable enterprise applications, ERP systems, and business intelligence solutions for large organizations and corporations.",
    features: ["ERP Systems", "Business Intelligence", "Data Analytics"],
    color: "from-green-600 to-teal-600"
  }
];

export const STATS = [
  { label: "Years Experience", value: "3+", color: "text-green-apple" },
  { label: "Expert Developers", value: "200+", color: "text-apple-teal" },
  { label: "Projects Delivered", value: "500+", color: "text-green-apple" },
  { label: "Happy Clients", value: "150+", color: "text-apple-teal" }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "John Smith",
    role: "CTO",
    // company: "TechCorp Inc.",
    avatar: "JS",
    gender: "male",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "GreenAppleX transformed our entire digital infrastructure. Their team's expertise in AI and mobile development exceeded our expectations. The project was delivered on time and within budget.",
    rating: 4.9
  },
  
  {
    id: 2,
    name: "Robert Brown",
    role: "VP Operations",
    // company: "Healthcare Plus",
    avatar: "RB",
    gender: "male",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "The custom software solution GreenAppleX developed for us has revolutionized our operations. Their attention to detail and commitment to quality is unmatched.",
    rating: 4.8
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Chief Innovation Officer",
    // company: "Global Dynamics",
    avatar: "SW",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "The AI solutions developed by GreenAppleX have significantly improved our operational efficiency. Their deep understanding of machine learning and data analytics is exceptional.",
    rating: 4.7
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Director of Technology",
    // company: "InnovateFlow",
    avatar: "MC",
    gender: "male",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Our mobile app development project with GreenAppleX exceeded all expectations. The user experience is flawless and the performance is outstanding across all platforms.",
    rating: 4.6
  },
  {
    id: 5,
    name: "Emily Davis",
    role: "CEO",
    // company: "NextGen Solutions",
    avatar: "ED",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "GreenAppleX delivered a comprehensive digital transformation that revolutionized our business processes. Their team is professional, skilled, and truly understands enterprise needs.",
    rating: 4.9
  },
  
  {
    id: 6,
    name: "Lisa Thompson",
    role: "Head of Digital Strategy",
    // company: "FutureLogistics",
    avatar: "LT",
    gender: "female",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    content: "Working with GreenAppleX on our custom software development was seamless. They delivered exactly what we needed, on schedule, and with exceptional quality throughout the project.",
    rating: 4.5
  }
];
