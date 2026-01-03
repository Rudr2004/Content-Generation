import { storage } from "./storage";

const initialServices = [
  // AI & Machine Learning
  {
    title: "Generative AI Solutions",
    category: "AI & Machine Learning",
    subCategory: "Generative AI Solutions",
    content: `<h2>Transform Your Business with Generative AI</h2>
<p>Our Generative AI solutions harness the power of cutting-edge artificial intelligence to create content, automate processes, and drive innovation across your organization.</p>

<h3>Key Features</h3>
<ul>
<li>AI-driven content creation and automation</li>
<li>Predictive analytics and intelligent insights</li>
<li>Custom chatbots and virtual assistants</li>
<li>Advanced language models and text generation</li>
<li>Image and video generation capabilities</li>
</ul>

<h3>Technologies We Use</h3>
<p>TensorFlow, PyTorch, OpenAI GPT, Hugging Face Transformers, GANs, LangChain, Vector Databases</p>

<h3>Industries Served</h3>
<p>Healthcare, Finance, E-commerce, Education, Media & Entertainment, Manufacturing</p>`,
    excerpt: "AI-driven content creation, predictive analytics, and chatbots using TensorFlow, PyTorch, and GANs.",
    slug: "generative-ai-solutions",
    icon: "🧠",
    features: ["AI Content Creation", "Predictive Analytics", "Custom Chatbots", "Language Models"],
    technologies: ["TensorFlow", "PyTorch", "OpenAI GPT", "LangChain"],
    metaTitle: "Generative AI Solutions | GreenAppleX",
    metaDescription: "Transform your business with cutting-edge generative AI solutions. AI-driven content creation, predictive analytics, and intelligent automation.",
    keywords: "generative AI, AI development, content creation, chatbots, machine learning",
    canonicalUrl: "/services/generative-ai-solutions",
    ogTitle: "Generative AI Solutions - GreenAppleX",
    ogDescription: "Transform your business with cutting-edge generative AI solutions and intelligent automation.",
    status: "active",
    featured: true,
    startingPrice: "Starting from $25,000"
  },
  {
    title: "AI Development",
    category: "AI & Machine Learning", 
    subCategory: "AI Development",
    content: `<h2>Custom AI Development Services</h2>
<p>Leverage machine learning, deep learning, natural language processing, and computer vision to automate processes and gain valuable insights from your data.</p>

<h3>Our AI Capabilities</h3>
<ul>
<li>Machine Learning & Deep Learning</li>
<li>Natural Language Processing (NLP)</li>
<li>Computer Vision & Image Recognition</li>
<li>Predictive Analytics & Forecasting</li>
<li>Recommendation Systems</li>
<li>Process Automation & Optimization</li>
</ul>

<h3>Development Process</h3>
<p>Requirements Analysis → Data Collection & Preprocessing → Model Development → Training & Validation → Deployment → Monitoring & Optimization</p>`,
    excerpt: "Machine learning, deep learning, NLP, and computer vision for automation and analytics.",
    slug: "ai-development",
    icon: "🤖",
    features: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
    metaTitle: "AI Development Services | Custom Machine Learning Solutions",
    metaDescription: "Professional AI development services including machine learning, NLP, computer vision, and intelligent automation solutions.",
    keywords: "AI development, machine learning, deep learning, NLP, computer vision",
    canonicalUrl: "/services/ai-development",
    status: "active",
    featured: false,
    startingPrice: "Starting from $15,000"
  },
  // Web3 & Blockchain
  {
    title: "Web3 Development",
    category: "Web3 & Blockchain",
    subCategory: "Web3 Development", 
    content: `<h2>Leading Web3 Development Services</h2>
<p>Build the future of the internet with our comprehensive Web3 development services. We create decentralized applications, smart contracts, and blockchain solutions.</p>

<h3>Web3 Services</h3>
<ul>
<li>Decentralized Applications (dApps)</li>
<li>Smart Contract Development</li>
<li>NFT Marketplaces & Platforms</li>
<li>DeFi Protocol Development</li>
<li>Web3 Wallets & Integration</li>
<li>Blockchain Consulting</li>
</ul>

<h3>Blockchain Platforms</h3>
<p>Ethereum, Polygon, Solana, Binance Smart Chain, Avalanche, Cardano</p>`,
    excerpt: "Blockchain, smart contracts, NFTs, and DeFi solutions for decentralized applications.",
    slug: "web3-development",
    icon: "🔗",
    features: ["dApps", "Smart Contracts", "NFT Development", "DeFi Solutions"],
    technologies: ["Solidity", "Web3.js", "Ethers.js", "React", "Node.js"],
    metaTitle: "Web3 Development Services | Blockchain & dApp Development",
    metaDescription: "Professional Web3 development services for dApps, smart contracts, NFTs, and DeFi solutions on major blockchain platforms.",
    keywords: "web3 development, blockchain development, smart contracts, dApps, NFT development",
    canonicalUrl: "/services/web3-development",
    status: "active",
    featured: true,
    startingPrice: "Starting from $20,000"
  },
  // Mobile Development
  {
    title: "Mobile App Development",
    category: "Mobile Development",
    subCategory: "Mobile App Development",
    content: `<h2>Native & Cross-Platform Mobile Development</h2>
<p>Create exceptional mobile experiences with our comprehensive mobile app development services for iOS, Android, and cross-platform solutions.</p>

<h3>Mobile Development Services</h3>
<ul>
<li>Native iOS Development (Swift, Objective-C)</li>
<li>Native Android Development (Kotlin, Java)</li>
<li>Cross-Platform Development (React Native, Flutter)</li>
<li>Mobile UI/UX Design</li>
<li>App Store Optimization (ASO)</li>
<li>App Maintenance & Updates</li>
</ul>

<h3>App Categories</h3>
<p>E-commerce, Social Media, Healthcare, Finance, Education, Entertainment, Business Productivity</p>`,
    excerpt: "iOS, Android, and cross-platform apps using React Native, Flutter, and Xamarin.",
    slug: "mobile-app-development",
    icon: "📱",
    features: ["Native iOS", "Native Android", "Cross-Platform", "UI/UX Design"],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
    metaTitle: "Mobile App Development Services | iOS & Android Apps",
    metaDescription: "Professional mobile app development for iOS, Android, and cross-platform solutions using React Native and Flutter.",
    keywords: "mobile app development, iOS development, Android development, React Native, Flutter",
    canonicalUrl: "/services/mobile-app-development",
    status: "active",
    featured: true,
    startingPrice: "Starting from $15,000"
  },
  // Web Development
  {
    title: "Web Development",
    category: "Web Development",
    subCategory: "Web Development",
    content: `<h2>Full-Stack Web Development Services</h2>
<p>Build scalable, modern web applications with our comprehensive full-stack development services using cutting-edge technologies.</p>

<h3>Web Development Services</h3>
<ul>
<li>Custom Web Application Development</li>
<li>Frontend Development (React, Angular, Vue.js)</li>
<li>Backend Development (Node.js, Python, PHP)</li>
<li>Database Design & Integration</li>
<li>API Development & Integration</li>
<li>Progressive Web Apps (PWA)</li>
</ul>

<h3>Technologies & Frameworks</h3>
<p>React, Angular, Vue.js, Node.js, Python Django, PHP Laravel, MongoDB, PostgreSQL, MySQL</p>`,
    excerpt: "Full-stack development for custom web apps using PHP, .NET, and JavaScript.",
    slug: "web-development",
    icon: "🌐",
    features: ["Full-Stack Development", "Modern Frameworks", "API Integration", "Database Design"],
    technologies: ["React", "Node.js", "Python", "PostgreSQL"],
    metaTitle: "Web Development Services | Full-Stack Development",
    metaDescription: "Professional full-stack web development services using modern technologies like React, Node.js, Python, and cloud-native architectures.",
    keywords: "web development, full stack development, React development, Node.js development",
    canonicalUrl: "/services/web-development",
    status: "active",
    featured: false,
    startingPrice: "Starting from $10,000"
  },
  // Enterprise Solutions
  {
    title: "Custom Software Development",
    category: "Enterprise Solutions",
    subCategory: "Custom Software Development",
    content: `<h2>Enterprise Custom Software Solutions</h2>
<p>Develop bespoke software solutions tailored to your business needs with our enterprise-grade custom software development services.</p>

<h3>Custom Software Services</h3>
<ul>
<li>Enterprise Application Development</li>
<li>Business Process Automation</li>
<li>Legacy System Modernization</li>
<li>System Integration & APIs</li>
<li>Cloud-Native Development</li>
<li>Microservices Architecture</li>
</ul>

<h3>Industries We Serve</h3>
<p>Healthcare, Finance, Manufacturing, Retail, Education, Government, Logistics, Real Estate</p>`,
    excerpt: "Bespoke CRM, ERP, and industry-specific solutions using .NET, Java, and Python.",
    slug: "custom-software-development",
    icon: "💻",
    features: ["Enterprise Applications", "Process Automation", "System Integration", "Cloud-Native"],
    technologies: [".NET", "Java", "Python", "microservices"],
    metaTitle: "Custom Software Development | Enterprise Solutions",
    metaDescription: "Bespoke enterprise software development services including CRM, ERP, and industry-specific solutions using modern technologies.",
    keywords: "custom software development, enterprise software, business automation, system integration",
    canonicalUrl: "/services/custom-software-development",
    status: "active",
    featured: true,
    startingPrice: "Starting from $30,000"
  },
  // Cloud & DevOps
  {
    title: "Cloud Computing Services",
    category: "Cloud & DevOps",
    subCategory: "Cloud Computing Services",
    content: `<h2>Comprehensive Cloud Computing Solutions</h2>
<p>Accelerate your digital transformation with our cloud computing services across AWS, Azure, and Google Cloud platforms.</p>

<h3>Cloud Services</h3>
<ul>
<li>Cloud Migration & Strategy</li>
<li>Infrastructure as a Service (IaaS)</li>
<li>Platform as a Service (PaaS)</li>
<li>Software as a Service (SaaS)</li>
<li>Cloud Security & Compliance</li>
<li>Cost Optimization & Management</li>
</ul>

<h3>Cloud Platforms</h3>
<p>Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), IBM Cloud</p>`,
    excerpt: "AWS, Azure, and Google Cloud for scalable infrastructure.",
    slug: "cloud-computing-services",
    icon: "☁️",
    features: ["Cloud Migration", "Multi-Cloud", "Security", "Cost Optimization"],
    technologies: ["AWS", "Azure", "Google Cloud", "Kubernetes"],
    metaTitle: "Cloud Computing Services | AWS, Azure, Google Cloud",
    metaDescription: "Professional cloud computing services including cloud migration, infrastructure management, and optimization across major cloud platforms.",
    keywords: "cloud computing, AWS services, Azure cloud, Google Cloud, cloud migration",
    canonicalUrl: "/services/cloud-computing-services",
    status: "active",
    featured: false,
    startingPrice: "Starting from $8,000"
  }
];

export async function seedInitialServices() {
  console.log("Seeding initial services...");
  
  for (const serviceData of initialServices) {
    try {
      // Check if service already exists
      const existingServices = await storage.getAllServices();
      const exists = existingServices.some((s: any) => s.slug === serviceData.slug);
      
      if (!exists) {
        await storage.createService(serviceData);
        console.log(`✓ Created service: ${serviceData.title}`);
      } else {
        console.log(`- Service already exists: ${serviceData.title}`);
      }
    } catch (error) {
      console.error(`Error creating service ${serviceData.title}:`, error);
    }
  }
  
  console.log("Initial services seeding completed!");
}