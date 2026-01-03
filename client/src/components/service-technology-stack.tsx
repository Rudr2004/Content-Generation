import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import {
  SiReact, SiAngular, SiHtml5, SiBootstrap, SiJavascript, SiCss3, SiLess, SiSass, SiJquery,
  SiCodeigniter, SiLaravel, SiNodedotjs, SiDjango, SiPhp,
  SiMysql, SiPostgresql, SiMongodb, SiOracle, SiMariadb, SiAmazondynamodb,
  SiAndroid, SiApple, SiIonic, SiFlutter, SiSwift,
  SiEthereum, SiSolidity, SiSolana, SiRust,
  SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiKeras, SiOpencv, SiGooglecloud, SiApache,
  SiDocker, SiKubernetes, SiJenkins, SiGitlab, SiGithubactions, SiTerraform, SiAnsible, SiNginx,
  SiAuth0, SiOkta, SiFirebase, SiCloudflare,
  SiNextdotjs, SiTypescript
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaCube, FaCoins, FaLink, FaDatabase, FaAws, FaShieldAlt, FaLock, FaKey, FaEye, FaServer } from "react-icons/fa";

interface TechnologyItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
}

const allTechnologies: TechnologyItem[] = [
  // AI/Machine Learning Technologies
  { id: "python", name: "Python", icon: <SiPython className="w-10 h-10 text-[#3776AB]" />, category: "Machine Learning" },
  { id: "tensorflow", name: "TensorFlow", icon: <SiTensorflow className="w-10 h-10 text-[#FF6F00]" />, category: "Machine Learning" },
  { id: "pytorch", name: "PyTorch", icon: <SiPytorch className="w-10 h-10 text-[#EE4C2C]" />, category: "Machine Learning" },
  { id: "openai", name: "OpenAI GPT-4", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">AI</div>, category: "Machine Learning" },
  { id: "langchain", name: "LangChain", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#1C3A5E] to-[#2D4F73] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">LC</div>, category: "Machine Learning" },
  { id: "transformers", name: "Transformers", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">HF</div>, category: "Machine Learning" },

  // Blockchain Technologies
  { id: "solidity", name: "Solidity", icon: <SiSolidity className="w-10 h-10 text-[#363636]" />, category: "Blockchain" },
  { id: "ethereum", name: "Ethereum", icon: <SiEthereum className="w-10 h-10 text-[#627EEA]" />, category: "Blockchain" },
  { id: "solana", name: "Solana", icon: <SiSolana className="w-10 h-10 text-[#9945FF]" />, category: "Blockchain" },
  { id: "rust", name: "Rust", icon: <SiRust className="w-10 h-10 text-[#000000]" />, category: "Blockchain" },
  { id: "hardhat", name: "Hardhat", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#F7DF1E] to-[#E6C91A] rounded-xl text-black flex items-center justify-center text-sm font-bold shadow-lg">HH</div>, category: "Blockchain" },
  { id: "truffle", name: "Truffle", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#5E464D] to-[#4A3A42] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">TR</div>, category: "Blockchain" },
  { id: "truffle-suite", name: "Truffle Suite", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#5E464D] to-[#4A3A42] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">TS</div>, category: "Blockchain" },
  { id: "web3js", name: "Web3.js", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#F16822] to-[#D85A1E] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">W3</div>, category: "Blockchain" },
  { id: "ethersjs", name: "Ethers.js", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#627EEA] to-[#4B6BC7] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Et</div>, category: "Blockchain" },
  { id: "hyperledger", name: "Hyperledger Fabric", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#2F3134] to-[#1A1D20] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">HF</div>, category: "Blockchain" },
  { id: "remix", name: "Remix IDE", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#1E1E1E] to-[#0A0A0A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">RE</div>, category: "Blockchain" },
  { id: "eos", name: "EOS.IO", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">EOS</div>, category: "Blockchain" },
  { id: "corda", name: "Corda", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#E0234E] to-[#C41E44] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">CO</div>, category: "Blockchain" },

  // Frontend Technologies
  { id: "react", name: "React", icon: <SiReact className="w-10 h-10 text-[#61DAFB]" />, category: "Frontend" },
  { id: "nextjs", name: "Next.js", icon: <SiNextdotjs className="w-10 h-10 text-[#000000]" />, category: "Frontend" },
  { id: "angular", name: "Angular", icon: <SiAngular className="w-10 h-10 text-[#DD0031]" />, category: "Frontend" },
  { id: "typescript", name: "TypeScript", icon: <SiTypescript className="w-10 h-10 text-[#3178C6]" />, category: "Frontend" },
  { id: "javascript", name: "JavaScript", icon: <SiJavascript className="w-10 h-10 text-[#F7DF1E]" />, category: "Frontend" },
  { id: "html5", name: "HTML5", icon: <SiHtml5 className="w-10 h-10 text-[#E34F26]" />, category: "Frontend" },
  { id: "css3", name: "CSS3", icon: <SiCss3 className="w-10 h-10 text-[#1572B6]" />, category: "Frontend" },
  { id: "tailwind", name: "Tailwind CSS", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">TW</div>, category: "Frontend" },

  // Backend Technologies
  { id: "nodejs", name: "Node.js", icon: <SiNodedotjs className="w-10 h-10 text-[#68A063]" />, category: "Backend" },
  { id: "express", name: "Express", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">EX</div>, category: "Backend" },
  { id: "django", name: "Django", icon: <SiDjango className="w-10 h-10 text-[#092E20]" />, category: "Backend" },
  { id: "laravel", name: "Laravel", icon: <SiLaravel className="w-10 h-10 text-[#FF2D20]" />, category: "Backend" },
  { id: "php", name: "PHP", icon: <SiPhp className="w-10 h-10 text-[#777BB4]" />, category: "Backend" },

  // Mobile Technologies
  { id: "react-native", name: "React Native", icon: <TbBrandReactNative className="w-10 h-10 text-[#61DAFB]" />, category: "Mobile" },
  { id: "flutter", name: "Flutter", icon: <SiFlutter className="w-10 h-10 text-[#02569B]" />, category: "Mobile" },
  { id: "dart", name: "Dart", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#0175C2] to-[#0066A1] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Da</div>, category: "Mobile" },
  { id: "expo", name: "Expo", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#000020] to-[#1A1A2E] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Ex</div>, category: "Mobile" },
  { id: "android", name: "Android", icon: <SiAndroid className="w-10 h-10 text-[#A4C639]" />, category: "Mobile" },
  { id: "ios", name: "iOS", icon: <SiApple className="w-10 h-10 text-[#000000]" />, category: "Mobile" },

  // Database Technologies
  { id: "postgresql", name: "PostgreSQL", icon: <SiPostgresql className="w-10 h-10 text-[#336791]" />, category: "Database" },
  { id: "mongodb", name: "MongoDB", icon: <SiMongodb className="w-10 h-10 text-[#4DB33D]" />, category: "Database" },
  { id: "redis", name: "Redis", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#DC382D] to-[#B8301F] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Re</div>, category: "Database" },
  { id: "mysql", name: "MySQL", icon: <SiMysql className="w-10 h-10 text-[#4479A1]" />, category: "Database" },

  // Cloud & DevOps Technologies
  { id: "aws", name: "AWS", icon: <FaAws className="w-10 h-10 text-[#FF9900]" />, category: "DevOps" },
  { id: "gcp", name: "Google Cloud", icon: <SiGooglecloud className="w-10 h-10 text-[#4285F4]" />, category: "DevOps" },
  { id: "docker", name: "Docker", icon: <SiDocker className="w-10 h-10 text-[#2496ED]" />, category: "DevOps" },
  { id: "kubernetes", name: "Kubernetes", icon: <SiKubernetes className="w-10 h-10 text-[#326CE5]" />, category: "DevOps" },
  { id: "terraform", name: "Terraform", icon: <SiTerraform className="w-10 h-10 text-[#623CE4]" />, category: "DevOps" },
  { id: "cloudformation", name: "CloudFormation", icon: <div className="w-10 h-10 bg-gradient-to-br from-[#FF9900] to-[#E6850A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">CF</div>, category: "DevOps" },
];

// Service category to technology mapping
const serviceToTechnologyMapping: Record<string, string[]> = {
  "AI & Machine Learning": ["Machine Learning", "Backend", "Database", "DevOps"],
  "Web3 & Blockchain": ["Blockchain", "Frontend", "Backend", "Database"],
  "Mobile Development": ["Mobile", "Backend", "Database", "DevOps"],
  "Web Development": ["Frontend", "Backend", "Database", "DevOps"],
  "Enterprise Solutions": ["Backend", "Database", "DevOps", "Frontend"],
  "Cloud & DevOps": ["DevOps", "Database", "Backend"],
};

// Function to extract technologies from HTML content
function extractTechnologiesFromContent(htmlContent?: string): string[] {
  if (!htmlContent) return [];
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Find the Technologies We Use section
  const techSections = Array.from(tempDiv.querySelectorAll('h3')).filter(h3 => 
    h3.textContent?.toLowerCase().includes('technologies') ||
    h3.textContent?.toLowerCase().includes('tech stack') ||
    h3.textContent?.toLowerCase().includes('tools')
  );
  
  const technologies: string[] = [];
  
  techSections.forEach(section => {
    // Get the next sibling elements (p and ul)
    let nextElement = section.nextElementSibling;
    while (nextElement && (nextElement.tagName === 'P' || nextElement.tagName === 'UL')) {
      if (nextElement.tagName === 'UL') {
        // Extract list items
        const listItems = Array.from(nextElement.querySelectorAll('li'));
        listItems.forEach(li => {
          const techName = li.textContent?.trim();
          if (techName) {
            technologies.push(techName);
          }
        });
      }
      nextElement = nextElement.nextElementSibling;
    }
  });
  
  return technologies;
}

interface ServiceTechnologyStackProps {
  serviceCategory: string;
  serviceTechnologies?: string[];
  aiTechnologies?: string[]; // AI-generated technologies
  serviceContent?: string; // Add service content to extract technologies
}

export function ServiceTechnologyStack({ serviceCategory, serviceTechnologies = [], aiTechnologies = [], serviceContent }: ServiceTechnologyStackProps) {
  // Extract technologies from content if serviceTechnologies is empty
  const extractedTechnologies = extractTechnologiesFromContent(serviceContent);
  
  // Show ONLY AI-generated technologies if they exist, otherwise fallback to others
  const finalTechnologies = aiTechnologies.length > 0 
    ? aiTechnologies 
    : serviceTechnologies.length > 0 
      ? serviceTechnologies 
      : extractedTechnologies;
  
  // Get relevant technology categories for this service
  const relevantCategories = serviceToTechnologyMapping[serviceCategory] || ["Frontend", "Backend"];

  // Create custom technology items for service-specific technologies with proper icons
  const createCustomTechnologyItems = (techNames: string[]): TechnologyItem[] => {
    const getProperIcon = (techName: string) => {
      const lowerName = techName.toLowerCase();
      
      // Check if this technology exists in our predefined list first
      const existingTech = allTechnologies.find(tech => 
        tech.name.toLowerCase() === lowerName ||
        lowerName.includes(tech.name.toLowerCase()) ||
        tech.name.toLowerCase().includes(lowerName)
      );
      
      if (existingTech) {
        return existingTech.icon;
      }
      
      // Comprehensive technology mappings with authentic icons and brand colors
      
      // Blockchain Platforms & Cryptocurrencies
      if (lowerName.includes('ethereum')) return <SiEthereum className="w-10 h-10 text-[#627EEA]" />;
      if (lowerName.includes('bitcoin')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F7931A] to-[#E6850A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">₿</div>;
      if (lowerName.includes('binance') || lowerName.includes('bsc')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F3BA2F] to-[#E6A91F] rounded-xl text-black flex items-center justify-center text-sm font-bold shadow-lg">BNB</div>;
      if (lowerName.includes('polygon') || lowerName.includes('matic')) return <div className="w-10 h-10 bg-gradient-to-br from-[#8247E5] to-[#7239D1] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⬟</div>;
      if (lowerName.includes('solana')) return <SiSolana className="w-10 h-10 text-[#9945FF]" />;
      if (lowerName.includes('cardano') || lowerName.includes('ada')) return <div className="w-10 h-10 bg-gradient-to-br from-[#0033AD] to-[#002A8F] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">₳</div>;
      if (lowerName.includes('polkadot') || lowerName.includes('dot')) return <div className="w-10 h-10 bg-gradient-to-br from-[#E6007A] to-[#CC0066] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">●</div>;
      if (lowerName.includes('cosmos') || lowerName.includes('atom')) return <div className="w-10 h-10 bg-gradient-to-br from-[#2E3148] to-[#1A1D2E] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⚛</div>;
      if (lowerName.includes('chainlink') || lowerName.includes('link')) return <div className="w-10 h-10 bg-gradient-to-br from-[#375BD2] to-[#2E4BC7] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🔗</div>;
      if (lowerName.includes('avalanche') || lowerName.includes('avax')) return <div className="w-10 h-10 bg-gradient-to-br from-[#E84142] to-[#D63031] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">▲</div>;
      if (lowerName.includes('near')) return <div className="w-10 h-10 bg-gradient-to-br from-[#00C08B] to-[#00A876] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Ⓝ</div>;
      if (lowerName.includes('fantom') || lowerName.includes('ftm')) return <div className="w-10 h-10 bg-gradient-to-br from-[#1969FF] to-[#1458E6] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">♦</div>;

      // Smart Contract Languages & Development
      if (lowerName.includes('solidity')) return <SiSolidity className="w-10 h-10 text-[#363636]" />;
      if (lowerName.includes('rust')) return <SiRust className="w-10 h-10 text-[#000000]" />;
      if (lowerName.includes('vyper')) return <div className="w-10 h-10 bg-gradient-to-br from-[#4B8BBE] to-[#306998] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🐍</div>;
      if (lowerName.includes('move')) return <div className="w-10 h-10 bg-gradient-to-br from-[#4285F4] to-[#3367D6] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">M</div>;

      // Development Tools & Frameworks
      if (lowerName.includes('truffle')) return <div className="w-10 h-10 bg-gradient-to-br from-[#5E464D] to-[#4A3A42] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🍄</div>;
      if (lowerName.includes('hardhat')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F7DF1E] to-[#E6C91A] rounded-xl text-black flex items-center justify-center text-sm font-bold shadow-lg">⛑</div>;
      if (lowerName.includes('remix')) return <div className="w-10 h-10 bg-gradient-to-br from-[#1E1E1E] to-[#0A0A0A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🎛</div>;
      if (lowerName.includes('ganache')) return <div className="w-10 h-10 bg-gradient-to-br from-[#E4A663] to-[#D4955A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🍫</div>;
      if (lowerName.includes('brownie')) return <div className="w-10 h-10 bg-gradient-to-br from-[#8B4513] to-[#704010] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🧁</div>;

      // Web3 Libraries & APIs
      if (lowerName.includes('web3.js') || lowerName.includes('web3js')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F16822] to-[#D85A1E] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">W3</div>;
      if (lowerName.includes('ethers.js') || lowerName.includes('ethersjs')) return <div className="w-10 h-10 bg-gradient-to-br from-[#627EEA] to-[#4B6BC7] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Ξ</div>;
      if (lowerName.includes('moralis')) return <div className="w-10 h-10 bg-gradient-to-br from-[#68D8F1] to-[#56C7E3] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🔷</div>;
      if (lowerName.includes('alchemy')) return <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⚗️</div>;
      if (lowerName.includes('infura')) return <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🌐</div>;

      // Enterprise Blockchain
      if (lowerName.includes('hyperledger')) return <div className="w-10 h-10 bg-gradient-to-br from-[#2F3134] to-[#1A1D20] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🏢</div>;
      if (lowerName.includes('corda')) return <div className="w-10 h-10 bg-gradient-to-br from-[#E0234E] to-[#C41E44] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⚡</div>;
      if (lowerName.includes('r3')) return <div className="w-10 h-10 bg-gradient-to-br from-[#E0234E] to-[#C41E44] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">R3</div>;
      if (lowerName.includes('quorum')) return <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">Q</div>;

      // Storage & IPFS
      if (lowerName.includes('ipfs')) return <div className="w-10 h-10 bg-gradient-to-br from-[#65C2CB] to-[#5AB3BC] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">📁</div>;
      if (lowerName.includes('filecoin')) return <div className="w-10 h-10 bg-gradient-to-br from-[#0090FF] to-[#0081E6] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⛰️</div>;
      if (lowerName.includes('arweave')) return <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🌐</div>;
      if (lowerName.includes('swarm')) return <div className="w-10 h-10 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🐝</div>;

      // Legacy Blockchain
      if (lowerName.includes('eos')) return <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🏛️</div>;
      if (lowerName.includes('tron')) return <div className="w-10 h-10 bg-gradient-to-br from-[#FF0013] to-[#E60012] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⚡</div>;
      if (lowerName.includes('stellar') || lowerName.includes('xlm')) return <div className="w-10 h-10 bg-gradient-to-br from-[#14B6CD] to-[#119DB1] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⭐</div>;
      if (lowerName.includes('ripple') || lowerName.includes('xrp')) return <div className="w-10 h-10 bg-gradient-to-br from-[#23292F] to-[#1A1F24] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">💧</div>;

      // AI/ML Technologies
      if (lowerName.includes('tensorflow')) return <SiTensorflow className="w-10 h-10 text-[#FF6F00]" />;
      if (lowerName.includes('pytorch')) return <SiPytorch className="w-10 h-10 text-[#EE4C2C]" />;
      if (lowerName.includes('python')) return <SiPython className="w-10 h-10 text-[#3776AB]" />;
      if (lowerName.includes('openai') || lowerName.includes('gpt')) return <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🤖</div>;
      if (lowerName.includes('langchain')) return <div className="w-10 h-10 bg-gradient-to-br from-[#1C3A5E] to-[#2D4F73] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🔗</div>;
      if (lowerName.includes('hugging') || lowerName.includes('transformers')) return <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🤗</div>;
      if (lowerName.includes('scikit') || lowerName.includes('sklearn')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F7931E] to-[#E6850A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🧪</div>;
      if (lowerName.includes('pandas')) return <div className="w-10 h-10 bg-gradient-to-br from-[#150458] to-[#0D0347] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🐼</div>;
      if (lowerName.includes('numpy')) return <div className="w-10 h-10 bg-gradient-to-br from-[#013243] to-[#012730] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🔢</div>;
      if (lowerName.includes('jupyter')) return <div className="w-10 h-10 bg-gradient-to-br from-[#F37626] to-[#E6690A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">📓</div>;
      if (lowerName.includes('keras')) return <div className="w-10 h-10 bg-gradient-to-br from-[#D00000] to-[#B70000] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">🧠</div>;

      // Web Technologies
      if (lowerName.includes('react')) return <SiReact className="w-10 h-10 text-[#61DAFB]" />;
      if (lowerName.includes('next.js') || lowerName.includes('nextjs')) return <SiNextdotjs className="w-10 h-10 text-[#000000]" />;
      if (lowerName.includes('vue')) return <div className="w-10 h-10 bg-gradient-to-br from-[#4FC08D] to-[#42A575] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">V</div>;
      if (lowerName.includes('angular')) return <SiAngular className="w-10 h-10 text-[#DD0031]" />;
      if (lowerName.includes('node.js') || lowerName.includes('nodejs')) return <SiNodedotjs className="w-10 h-10 text-[#68A063]" />;
      if (lowerName.includes('express')) return <div className="w-10 h-10 bg-gradient-to-br from-[#000000] to-[#333333] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">⚡</div>;

      // Cloud & Infrastructure
      if (lowerName.includes('aws') || lowerName.includes('amazon')) return <div className="w-10 h-10 bg-gradient-to-br from-[#FF9900] to-[#E6850A] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">☁️</div>;
      if (lowerName.includes('gcp') || lowerName.includes('google cloud')) return <div className="w-10 h-10 bg-gradient-to-br from-[#4285F4] to-[#3367D6] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">☁️</div>;
      if (lowerName.includes('azure') || lowerName.includes('microsoft')) return <div className="w-10 h-10 bg-gradient-to-br from-[#0078D4] to-[#0066B8] rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg">☁️</div>;
      if (lowerName.includes('docker')) return <SiDocker className="w-10 h-10 text-[#2496ED]" />;
      if (lowerName.includes('kubernetes')) return <SiKubernetes className="w-10 h-10 text-[#326CE5]" />;
      
      // Default fallback with first 2 letters
      const colors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600', 
        'from-green-500 to-green-600',
        'from-orange-500 to-orange-600',
        'from-red-500 to-red-600',
        'from-indigo-500 to-indigo-600',
        'from-pink-500 to-pink-600',
        'from-teal-500 to-teal-600'
      ];
      
      const colorIndex = techName.length % colors.length;
      const initials = techName.slice(0, 2).toUpperCase();
      
      return <div className={`w-10 h-10 bg-gradient-to-br ${colors[colorIndex]} rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-lg`}>
        {initials}
      </div>;
    };

    return techNames.map((techName, index) => ({
      id: `custom-${index}`,
      name: techName,
      icon: getProperIcon(techName),
      category: "Service-Specific"
    }));
  };

  // Get available categories - only show categories that have technologies
  const getAvailableCategories = () => {
    const categories = [];
    
    // Always add Service-Specific if we have extracted technologies
    if (finalTechnologies.length > 0) {
      categories.push("Service-Specific");
    }
    
    // Check which predefined categories actually have matching technologies
    if (finalTechnologies.length > 0) {
      // Find matching technologies for each category
      for (const category of relevantCategories) {
        const matchedTechs = allTechnologies.filter(tech => {
          if (tech.category !== category) return false;
          return finalTechnologies.some(serviceTech => {
            const serviceClean = serviceTech.toLowerCase().replace(/[^a-z0-9]/g, '');
            const techClean = tech.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return serviceClean.includes(techClean) || techClean.includes(serviceClean) ||
                   serviceTech.toLowerCase().includes(tech.name.toLowerCase());
          });
        });
        
        if (matchedTechs.length > 0) {
          categories.push(category);
        }
      }
    } else {
      // If no service-specific technologies, show relevant categories that have technologies
      for (const category of relevantCategories) {
        const availableTechs = allTechnologies.filter(tech => tech.category === category);
        if (availableTechs.length > 0) {
          categories.push(category);
        }
      }
    }
    
    return categories;
  };

  const availableCategories = getAvailableCategories();
  const initialCategory = availableCategories[0] || "Service-Specific";
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Filter technologies based on the service's specific technologies or category mapping
  const getFilteredTechnologies = () => {
    // If we have service-specific technologies, prioritize showing them
    if (finalTechnologies.length > 0) {
      if (activeCategory === "Service-Specific") {
        return createCustomTechnologyItems(finalTechnologies);
      }
      
      // Find matching technologies from predefined list
      const matchedTechs = allTechnologies.filter(tech => {
        if (tech.category !== activeCategory) return false;
        return finalTechnologies.some(serviceTech => {
          const serviceClean = serviceTech.toLowerCase().replace(/[^a-z0-9]/g, '');
          const techClean = tech.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return serviceClean.includes(techClean) || techClean.includes(serviceClean) ||
                 serviceTech.toLowerCase().includes(tech.name.toLowerCase());
        });
      });
      
      if (matchedTechs.length > 0) {
        return matchedTechs;
      }
    }

    // Fall back to category-based filtering
    return allTechnologies.filter(tech => 
      relevantCategories.includes(tech.category) && tech.category === activeCategory
    );
  };

  const filteredTechnologies = getFilteredTechnologies();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Leveraging cutting-edge technologies to deliver robust and scalable solutions for your {serviceCategory?.toLowerCase() || 'business'} needs
            </p>
          </motion.div>

          {/* Category Tabs - Only show if multiple categories available */}
          {availableCategories.length > 1 && (
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-16">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category === "Service-Specific" ? "Service Technologies" : category}
                </button>
              ))}
            </motion.div>
          )}

          {/* Technologies Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filteredTechnologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 transform hover:scale-105 hover:-translate-y-2 text-center min-h-[160px] flex flex-col justify-center overflow-hidden">
                  {/* Background gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-500">
                        {tech.icon}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 text-poppins leading-tight mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {tech.name}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Subtle pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full transform translate-x-16 -translate-y-16"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* If no technologies found, show a message */}
          {filteredTechnologies.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center py-16">
              <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 heading-georgia">
                  Technology Stack Coming Soon
                </h3>
                <p className="text-gray-600 text-poppins">
                  We're updating the technology stack for this service. Contact our team to learn about the specific technologies and tools we use for your project.
                </p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Contact Our Experts
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}