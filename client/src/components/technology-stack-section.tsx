import { motion } from "framer-motion";
import { useState } from "react";
import {
  SiReact, SiAngular, SiHtml5, SiBootstrap, SiJavascript, SiCss3, SiLess, SiSass, SiJquery,
  SiCodeigniter, SiLaravel, SiNodedotjs, SiDjango, SiPhp,
  SiMysql, SiPostgresql, SiMongodb, SiOracle, SiMariadb, SiAmazondynamodb,
  SiAndroid, SiApple, SiIonic, SiFlutter, SiSwift,
  SiEthereum, SiSolidity, SiSolana, SiRust,
  SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiJupyter, SiKeras, SiOpencv, SiGooglecloud, SiApache,
  SiDocker, SiKubernetes, SiJenkins, SiGitlab, SiGithubactions, SiTerraform, SiAnsible, SiNginx,
  SiAuth0, SiOkta, SiFirebase, SiCloudflare,
  SiNextdotjs
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaCube, FaCoins, FaLink, FaDatabase, FaAws, FaShieldAlt, FaLock, FaKey, FaEye, FaServer } from "react-icons/fa";

interface TechnologyItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
}

const technologies: TechnologyItem[] = [

  // Machine Learning - 8 technologies
  {
    id: "python",
    name: "Python",
    icon: <SiPython className="w-8 h-8 text-[#3776AB]" />,
    category: "Machine Learning"
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    icon: <SiTensorflow className="w-8 h-8 text-[#FF6F00]" />,
    category: "Machine Learning"
  },
  {
    id: "pytorch",
    name: "PyTorch",
    icon: <SiPytorch className="w-8 h-8 text-[#EE4C2C]" />,
    category: "Machine Learning"
  },
  {
    id: "scikit-learn",
    name: "Scikit-Learn",
    icon: <SiScikitlearn className="w-8 h-8 text-[#F7931E]" />,
    category: "Machine Learning"
  },
  {
    id: "jupyter",
    name: "Jupyter",
    icon: <SiJupyter className="w-8 h-8 text-[#F37626]" />,
    category: "Machine Learning"
  },
  {
    id: "keras",
    name: "Keras",
    icon: <SiKeras className="w-8 h-8 text-[#D00000]" />,
    category: "Machine Learning"
  },
  {
    id: "opencv",
    name: "OpenCV",
    icon: <SiOpencv className="w-8 h-8 text-[#5C3EE8]" />,
    category: "Machine Learning"
  },
  {
    id: "apache-spark",
    name: "Apache Spark",
    icon: <SiApache className="w-8 h-8 text-[#E25A1C]" />,
    category: "Machine Learning"
  },

  // Blockchain - 7 technologies
  {
    id: "solana",
    name: "Solana",
    icon: <SiSolana className="w-8 h-8 text-[#9945FF]" />,
    category: "Blockchain"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: <SiEthereum className="w-8 h-8 text-[#627EEA]" />,
    category: "Blockchain"
  },
  {
    id: "hyperledger",
    name: "Hyperledger",
    icon: <FaCube className="w-8 h-8 text-[#2F3134]" />,
    category: "Blockchain"
  },
  {
    id: "gochain",
    name: "GoChain",
    icon: <FaLink className="w-8 h-8 text-[#2E7D32]" />,
    category: "Blockchain"
  },
  {
    id: "corda",
    name: "Corda",
    icon: <FaCube className="w-8 h-8 text-[#ED1C24]" />,
    category: "Blockchain"
  },
  {
    id: "solidity",
    name: "Solidity",
    icon: <SiSolidity className="w-8 h-8 text-[#363636]" />,
    category: "Blockchain"
  },
  {
    id: "oneledger",
    name: "OneLedger",
    icon: <FaLink className="w-8 h-8 text-[#4ECDC4]" />,
    category: "Blockchain"
  },
  {
    id: "erc20",
    name: "ERC-20",
    icon: <FaCoins className="w-8 h-8 text-[#627EEA]" />,
    category: "Blockchain"
  },

  // Frontend - 8 technologies
  {
    id: "react",
    name: "React",
    icon: <SiReact className="w-8 h-8 text-[#61DAFB]" />,
    category: "Frontend"
  },
  { id: "nextjs", name: "Next.js", icon: <SiNextdotjs className="w-8 h-8 text-[#61DAFB]" />, category: "Frontend" },
  {
    id: "angular",
    name: "Angular",
    icon: <SiAngular className="w-8 h-8 text-[#DD0031]" />,
    category: "Frontend"
  },
  {
    id: "html5",
    name: "HTML5",
    icon: <SiHtml5 className="w-8 h-8 text-[#E34F26]" />,
    category: "Frontend"
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: <SiBootstrap className="w-8 h-8 text-[#7952B3]" />,
    category: "Frontend"
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <SiJavascript className="w-8 h-8 text-[#F7DF1E]" />,
    category: "Frontend"
  },
  {
    id: "css3",
    name: "CSS3",
    icon: <SiCss3 className="w-8 h-8 text-[#1572B6]" />,
    category: "Frontend"
  },
  {
    id: "less",
    name: "Less",
    icon: <SiLess className="w-8 h-8 text-[#1d365d]" />,
    category: "Frontend"
  },
  {
    id: "sass",
    name: "Sass",
    icon: <SiSass className="w-8 h-8 text-[#CF649A]" />,
    category: "Frontend"
  },
  {
    id: "jquery",
    name: "jQuery",
    icon: <SiJquery className="w-8 h-8 text-[#0769AD]" />,
    category: "Frontend"
  },

  // Backend - 5 technologies
  {
    id: "codeigniter",
    name: "CodeIgniter",
    icon: <SiCodeigniter className="w-8 h-8 text-[#EE4323]" />,
    category: "Backend"
  },

  {
    id: "nodejs",
    name: "Node.js",
    icon: <SiNodedotjs className="w-8 h-8 text-[#68A063]" />,
    category: "Backend"
  },
  {
    id: "django",
    name: "Django",
    icon: <SiDjango className="w-8 h-8 text-[#092E20]" />,
    category: "Backend"
  },
  {
    id: "rust",
    name: "Rust",
    icon: <SiRust className="w-8 h-8 text-[#000000]" />,
    category: "Backend"
  },
  {
    id: "php",
    name: "PHP",
    icon: <SiPhp className="w-8 h-8 text-[#777BB4]" />,
    category: "Backend"
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: <SiLaravel className="w-8 h-8 text-[#FF2D20]" />,
    category: "Backend"
  },

  // Database - 7 technologies
  {
    id: "mysql",
    name: "MySQL",
    icon: <SiMysql className="w-8 h-8 text-[#4479A1]" />,
    category: "Database"
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    icon: <FaDatabase className="w-8 h-8 text-[#CC2927]" />,
    category: "Database"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: <SiPostgresql className="w-8 h-8 text-[#336791]" />,
    category: "Database"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: <SiMongodb className="w-8 h-8 text-[#4DB33D]" />,
    category: "Database"
  },
  {
    id: "oracle",
    name: "Oracle Database",
    icon: <SiOracle className="w-8 h-8 text-[#F80000]" />,
    category: "Database"
  },
  {
    id: "mariadb",
    name: "MariaDB",
    icon: <SiMariadb className="w-8 h-8 text-[#003545]" />,
    category: "Database"
  },
  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    icon: <SiAmazondynamodb className="w-8 h-8 text-[#FF9900]" />,
    category: "Database"
  },

  // Mobile - 5 technologies
  {
    id: "android",
    name: "Android",
    icon: <SiAndroid className="w-8 h-8 text-[#A4C639]" />,
    category: "Mobile"
  },
  {
    id: "ios",
    name: "iOS",
    icon: <SiApple className="w-8 h-8 text-[#000000]" />,
    category: "Mobile"
  },
  {
    id: "swift",
    name: "Swift",
    icon: <SiSwift className="w-8 h-8 text-[#FA7343]" />,
    category: "Mobile"
  },
  {
    id: "react-native",
    name: "React Native",
    icon: <TbBrandReactNative className="w-8 h-8 text-[#61DAFB]" />,
    category: "Mobile"
  },
  {
    id: "ionic",
    name: "Ionic",
    icon: <SiIonic className="w-8 h-8 text-[#3880FF]" />,
    category: "Mobile"
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: <SiFlutter className="w-8 h-8 text-[#02569B]" />,
    category: "Mobile"
  },

  // DevOps -10 technologies
  {
    id: "aws",
    name: "AWS",
    icon: <FaAws className="w-8 h-8 text-[#FF9900]" />,
    category: "DevOps"
  },
  {
    id: "gcp",
    name: "Google Cloud",
    icon: <SiGooglecloud className="w-8 h-8 text-[#4285F4]" />,
    category: "DevOps"
  },
  {
    id: "docker",
    name: "Docker",
    icon: <SiDocker className="w-8 h-8 text-[#2496ED]" />,
    category: "DevOps"
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    icon: <SiKubernetes className="w-8 h-8 text-[#326CE5]" />,
    category: "DevOps"
  },
  {
    id: "jenkins",
    name: "Jenkins",
    icon: <SiJenkins className="w-8 h-8 text-[#D33833]" />,
    category: "DevOps"
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: <SiGitlab className="w-8 h-8 text-[#FCA326]" />,
    category: "DevOps"
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    icon: <SiGithubactions className="w-8 h-8 text-[#2088FF]" />,
    category: "DevOps"
  },
  {
    id: "terraform",
    name: "Terraform",
    icon: <SiTerraform className="w-8 h-8 text-[#623CE4]" />,
    category: "DevOps"
  },
  {
    id: "ansible",
    name: "Ansible",
    icon: <SiAnsible className="w-8 h-8 text-[#EE0000]" />,
    category: "DevOps"
  },
  {
    id: "nginx",
    name: "Nginx",
    icon: <SiNginx className="w-8 h-8 text-[#009639]" />,
    category: "DevOps"
  },

  // Information Security - 8 technologies
  {
    id: "auth0",
    name: "Auth0",
    icon: <SiAuth0 className="w-8 h-8 text-[#EB5424]" />,
    category: "Information Security"
  },
  {
    id: "okta",
    name: "Okta",
    icon: <SiOkta className="w-8 h-8 text-[#007DC1]" />,
    category: "Information Security"
  },
  {
    id: "firebase-auth",
    name: "Firebase Auth",
    icon: <SiFirebase className="w-8 h-8 text-[#FFCA28]" />,
    category: "Information Security"
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    icon: <SiCloudflare className="w-8 h-8 text-[#F38020]" />,
    category: "Information Security"
  },
  {
    id: "ssl-tls",
    name: "SSL/TLS",
    icon: <FaLock className="w-8 h-8 text-[#4CAF50]" />,
    category: "Information Security"
  },
  {
    id: "penetration-testing",
    name: "Penetration Testing",
    icon: <FaShieldAlt className="w-8 h-8 text-[#FF5722]" />,
    category: "Information Security"
  },
  {
    id: "vulnerability-assessment",
    name: "Vulnerability Assessment",
    icon: <FaEye className="w-8 h-8 text-[#9C27B0]" />,
    category: "Information Security"
  },
  {
    id: "security-monitoring",
    name: "Security Monitoring",
    icon: <FaServer className="w-8 h-8 text-[#607D8B]" />,
    category: "Information Security"
  },

];

const categories = [
  "Machine Learning",
  "Blockchain",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Information Security",
];


export function TechnologyStackSection() {
  const [activeCategory, setActiveCategory] = useState("Frontend");

  const filteredTechnologies = technologies.filter(tech => tech.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 heading-georgia">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
            Leveraging cutting-edge technologies to build scalable, performant, and innovative solutions
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {filteredTechnologies.map((tech, index) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:scale-105 text-center">
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-poppins">
                  {tech.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}