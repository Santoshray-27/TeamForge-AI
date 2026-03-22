export interface HackathonDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  requiredSkills: string[];
  niceToHave: string[];
  requiredRoles: string[];
  checklist: ChecklistItem[];
  avgTeamSize: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  priority: "critical" | "high" | "medium" | "low";
  resources?: string[];
}

export const hackathonDomains: HackathonDomain[] = [
  {
    id: "ai-ml",
    name: "AI/ML",
    icon: "🤖",
    color: "from-purple-500 to-indigo-600",
    description: "Build intelligent systems using machine learning and AI techniques",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Data Science"],
    niceToHave: ["CUDA", "HuggingFace", "MLOps", "Computer Vision", "NLP"],
    requiredRoles: ["ML Engineer", "Data Scientist", "Backend Developer"],
    avgTeamSize: 3,
    difficulty: "Advanced",
    checklist: [
      { id: "c1", category: "Team", item: "Team has at least one ML engineer", priority: "critical" },
      { id: "c2", category: "Team", item: "Access to GPU resources (Colab/Kaggle)", priority: "critical" },
      { id: "c3", category: "Data", item: "Dataset identified and accessible", priority: "critical" },
      { id: "c4", category: "Data", item: "Data preprocessing pipeline ready", priority: "high" },
      { id: "c5", category: "Technical", item: "Model architecture decided", priority: "high" },
      { id: "c6", category: "Technical", item: "Evaluation metrics defined", priority: "high" },
      { id: "c7", category: "Technical", item: "Baseline model implemented", priority: "medium" },
      { id: "c8", category: "Demo", item: "Interactive demo planned", priority: "medium" },
      { id: "c9", category: "Demo", item: "Inference API ready", priority: "medium" },
      { id: "c10", category: "Business", item: "Real-world use case defined", priority: "high" },
    ],
  },
  {
    id: "web3",
    name: "Web3/Blockchain",
    icon: "⛓️",
    color: "from-yellow-500 to-orange-600",
    description: "Build decentralized applications on blockchain platforms",
    requiredSkills: ["Solidity", "Web3.js", "React", "Smart Contracts"],
    niceToHave: ["IPFS", "Ethers.js", "Hardhat", "OpenZeppelin", "The Graph"],
    requiredRoles: ["Blockchain Developer", "Full-stack Developer"],
    avgTeamSize: 4,
    difficulty: "Expert",
    checklist: [
      { id: "c1", category: "Technical", item: "Smart contracts written and tested", priority: "critical" },
      { id: "c2", category: "Technical", item: "Testnet deployment ready", priority: "critical" },
      { id: "c3", category: "Team", item: "Solidity developer on team", priority: "critical" },
      { id: "c4", category: "Technical", item: "Wallet integration complete", priority: "high" },
      { id: "c5", category: "Security", item: "Smart contract audit done", priority: "high" },
      { id: "c6", category: "Frontend", item: "Web3 frontend connected", priority: "high" },
      { id: "c7", category: "Technical", item: "Gas optimization considered", priority: "medium" },
      { id: "c8", category: "Business", item: "Tokenomics model defined", priority: "medium" },
    ],
  },
  {
    id: "fintech",
    name: "FinTech",
    icon: "💰",
    color: "from-green-500 to-emerald-600",
    description: "Innovative financial technology solutions and payment systems",
    requiredSkills: ["Python", "React", "Node.js", "SQL", "REST API"],
    niceToHave: ["Blockchain", "ML", "Data Science", "Security"],
    requiredRoles: ["Backend Developer", "Frontend Developer", "Business Analyst"],
    avgTeamSize: 4,
    difficulty: "Intermediate",
    checklist: [
      { id: "c1", category: "Compliance", item: "Regulatory compliance considered", priority: "critical" },
      { id: "c2", category: "Security", item: "Financial data encryption implemented", priority: "critical" },
      { id: "c3", category: "Technical", item: "Payment gateway integrated", priority: "high" },
      { id: "c4", category: "Technical", item: "Transaction logging implemented", priority: "high" },
      { id: "c5", category: "Business", item: "Business model defined", priority: "high" },
      { id: "c6", category: "Demo", item: "Live demo with test transactions", priority: "medium" },
    ],
  },
  {
    id: "healthtech",
    name: "HealthTech",
    icon: "🏥",
    color: "from-red-500 to-pink-600",
    description: "Technology solutions for healthcare, medical, and wellness",
    requiredSkills: ["Python", "React", "Node.js", "Data Science"],
    niceToHave: ["ML", "IoT", "Mobile", "HIPAA compliance"],
    requiredRoles: ["ML Engineer", "Frontend Developer", "Backend Developer"],
    avgTeamSize: 4,
    difficulty: "Intermediate",
    checklist: [
      { id: "c1", category: "Compliance", item: "HIPAA/privacy compliance addressed", priority: "critical" },
      { id: "c2", category: "Medical", item: "Medical expert consulted", priority: "critical" },
      { id: "c3", category: "Technical", item: "Secure health data handling", priority: "high" },
      { id: "c4", category: "UX", item: "Accessible UI for all users", priority: "high" },
      { id: "c5", category: "Demo", item: "Working prototype with test data", priority: "medium" },
    ],
  },
  {
    id: "edtech",
    name: "EdTech",
    icon: "📚",
    color: "from-blue-500 to-cyan-600",
    description: "Educational technology platforms and learning tools",
    requiredSkills: ["React", "Node.js", "Python", "SQL"],
    niceToHave: ["ML", "Mobile", "Gamification", "Analytics"],
    requiredRoles: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
    avgTeamSize: 4,
    difficulty: "Beginner",
    checklist: [
      { id: "c1", category: "UX", item: "Intuitive learning interface designed", priority: "critical" },
      { id: "c2", category: "Technical", item: "Content management system ready", priority: "high" },
      { id: "c3", category: "Technical", item: "Progress tracking implemented", priority: "high" },
      { id: "c4", category: "Business", item: "Target audience identified", priority: "high" },
      { id: "c5", category: "Demo", item: "Sample content populated", priority: "medium" },
    ],
  },
  {
    id: "social-impact",
    name: "Social Impact",
    icon: "🌍",
    color: "from-teal-500 to-green-600",
    description: "Technology for social good, environment, and community",
    requiredSkills: ["React", "Node.js", "Mobile", "Data Science"],
    niceToHave: ["GIS", "IoT", "Blockchain", "ML"],
    requiredRoles: ["Full-stack Developer", "UI/UX Designer", "Product Manager"],
    avgTeamSize: 4,
    difficulty: "Beginner",
    checklist: [
      { id: "c1", category: "Impact", item: "Clear social problem identified", priority: "critical" },
      { id: "c2", category: "Impact", item: "Target beneficiaries defined", priority: "critical" },
      { id: "c3", category: "Technical", item: "Offline-capable if needed", priority: "high" },
      { id: "c4", category: "Business", item: "Sustainability plan outlined", priority: "high" },
      { id: "c5", category: "Demo", item: "Impact metrics defined", priority: "medium" },
    ],
  },
  {
    id: "iot",
    name: "IoT & Hardware",
    icon: "🔌",
    color: "from-orange-500 to-amber-600",
    description: "Internet of Things and embedded systems solutions",
    requiredSkills: ["C++", "Python", "React", "Node.js"],
    niceToHave: ["MQTT", "Raspberry Pi", "Arduino", "ML", "Embedded Systems"],
    requiredRoles: ["Embedded Engineer", "Backend Developer", "Frontend Developer"],
    avgTeamSize: 4,
    difficulty: "Expert",
    checklist: [
      { id: "c1", category: "Hardware", item: "Hardware components sourced", priority: "critical" },
      { id: "c2", category: "Technical", item: "Firmware/embedded code ready", priority: "critical" },
      { id: "c3", category: "Technical", item: "Data transmission working", priority: "high" },
      { id: "c4", category: "Technical", item: "Real-time dashboard implemented", priority: "high" },
      { id: "c5", category: "Demo", item: "Live hardware demo ready", priority: "critical" },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "🔒",
    color: "from-gray-500 to-slate-700",
    description: "Security tools, ethical hacking, and privacy solutions",
    requiredSkills: ["Python", "C++", "Network Security", "Cryptography"],
    niceToHave: ["Machine Learning", "Blockchain", "Penetration Testing", "OSINT"],
    requiredRoles: ["Security Engineer", "Backend Developer"],
    avgTeamSize: 3,
    difficulty: "Expert",
    checklist: [
      { id: "c1", category: "Team", item: "Security expert on team", priority: "critical" },
      { id: "c2", category: "Ethical", item: "Ethical use case clearly defined", priority: "critical" },
      { id: "c3", category: "Technical", item: "Vulnerability detection working", priority: "high" },
      { id: "c4", category: "Technical", item: "Exploit/defense demo ready", priority: "high" },
      { id: "c5", category: "Demo", item: "Safe sandboxed demo environment", priority: "critical" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming & AR/VR",
    icon: "🎮",
    color: "from-violet-500 to-purple-700",
    description: "Game development, AR/VR, and immersive experiences",
    requiredSkills: ["Unity", "C#", "JavaScript", "3D Modeling"],
    niceToHave: ["ARKit", "WebXR", "Blender", "Shader Programming", "Physics"],
    requiredRoles: ["Game Developer", "3D Artist", "Frontend Developer"],
    avgTeamSize: 4,
    difficulty: "Advanced",
    checklist: [
      { id: "c1", category: "Technical", item: "Game engine selected and set up", priority: "critical" },
      { id: "c2", category: "Assets", item: "Core game assets ready", priority: "high" },
      { id: "c3", category: "Technical", item: "Core gameplay loop implemented", priority: "critical" },
      { id: "c4", category: "UX", item: "Intuitive controls designed", priority: "high" },
      { id: "c5", category: "Demo", item: "Playable demo ready", priority: "critical" },
    ],
  },
  {
    id: "open-source",
    name: "Open Source",
    icon: "💻",
    color: "from-indigo-500 to-blue-600",
    description: "Contribute to or build open source projects and developer tools",
    requiredSkills: ["Git", "JavaScript", "Python", "Documentation"],
    niceToHave: ["CI/CD", "Testing", "DevOps", "Community Management"],
    requiredRoles: ["Backend Developer", "Frontend Developer", "DevOps Engineer"],
    avgTeamSize: 3,
    difficulty: "Intermediate",
    checklist: [
      { id: "c1", category: "Documentation", item: "README and docs complete", priority: "critical" },
      { id: "c2", category: "Technical", item: "Tests written (>80% coverage)", priority: "high" },
      { id: "c3", category: "Technical", item: "CI/CD pipeline set up", priority: "high" },
      { id: "c4", category: "Community", item: "Contributing guide created", priority: "medium" },
      { id: "c5", category: "License", item: "License chosen and added", priority: "critical" },
    ],
  },
];
