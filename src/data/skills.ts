export const technicalSkills = [
  // Frontend
  "React", "Vue.js", "Angular", "Next.js", "Svelte", "TypeScript", "JavaScript",
  "HTML5", "CSS3", "Tailwind CSS", "SASS", "Three.js", "WebGL", "GSAP",
  // Backend
  "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Go", "Rust",
  "GraphQL", "REST API", "gRPC", "WebSockets", "Microservices",
  // Mobile
  "React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android",
  // ML/AI
  "Python", "TensorFlow", "PyTorch", "Scikit-learn", "HuggingFace", "CUDA",
  "Computer Vision", "NLP", "Reinforcement Learning", "Data Science", "MLOps",
  // Web3
  "Solidity", "Web3.js", "Ethers.js", "IPFS", "Hardhat", "Smart Contracts",
  // DevOps
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra",
  // Security
  "Cryptography", "Network Security", "Penetration Testing", "OWASP",
];

export const softSkills = [
  "Leadership", "Communication", "Problem Solving", "Critical Thinking",
  "Creativity", "Teamwork", "Time Management", "Adaptability", "Mentoring",
  "Public Speaking", "Networking", "Project Management", "Agile", "Scrum",
  "Product Thinking", "User Research", "Entrepreneurship", "Pitching",
  "Analytical Thinking", "Documentation", "Persistence", "Empathy",
];

export const tools = [
  "Git", "GitHub", "GitLab", "Figma", "Adobe XD", "Sketch", "VS Code",
  "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions",
  "Jira", "Notion", "Slack", "Linear", "Postman", "Insomnia",
  "Jupyter", "Colab", "WandB", "MLflow", "Weights & Biases",
  "Hardhat", "Truffle", "MetaMask", "Remix", "OpenZeppelin",
  "Firebase", "Supabase", "PlanetScale", "Vercel", "Netlify",
  "Android Studio", "Xcode", "TestFlight", "Fastlane", "Expo",
  "Burp Suite", "Wireshark", "Metasploit", "Kali Linux",
  "Prometheus", "Grafana", "Datadog", "Sentry", "New Relic",
];

export const roles = [
  "Frontend Developer", "Backend Developer", "Full-stack Developer",
  "Mobile Developer", "ML Engineer", "Data Scientist", "DevOps Engineer",
  "UI/UX Designer", "Product Manager", "Blockchain Developer",
  "Security Engineer", "Cloud Architect", "Research Engineer",
  "Technical Lead", "Entrepreneur", "Business Analyst",
];

export const skillColors: Record<string, string> = {
  // Languages
  "Python": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "JavaScript": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "TypeScript": "bg-blue-600/20 text-blue-400 border-blue-600/30",
  "Go": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Rust": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Solidity": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  // Frameworks
  "React": "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  "Vue.js": "bg-green-500/20 text-green-300 border-green-500/30",
  "Flutter": "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "TensorFlow": "bg-orange-400/20 text-orange-300 border-orange-400/30",
  "PyTorch": "bg-red-500/20 text-red-300 border-red-500/30",
  // Default
  "default": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

export function getSkillColor(skill: string): string {
  return skillColors[skill] || skillColors["default"];
}
