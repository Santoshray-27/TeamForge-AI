export interface LearningResource {
  id: string;
  title: string;
  type: "video" | "article" | "course" | "practice" | "book" | "documentation";
  url: string;
  duration?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skill: string;
  platform?: string;
  rating?: number;
  free: boolean;
}

export interface LearningPath {
  skill: string;
  targetRole: string;
  shortTerm: LearningStep[];
  longTerm: LearningStep[];
  practiceProjects: PracticeProject[];
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: "critical" | "high" | "medium" | "low";
  resources: LearningResource[];
  completed?: boolean;
}

export interface PracticeProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
}

export const learningResources: LearningResource[] = [
  // React
  { id: "r1", title: "React Official Tutorial", type: "documentation", url: "https://react.dev", duration: "4h", difficulty: "Beginner", skill: "React", platform: "React.dev", rating: 5, free: true },
  { id: "r2", title: "Full React Course - freeCodeCamp", type: "video", url: "https://youtube.com", duration: "12h", difficulty: "Beginner", skill: "React", platform: "YouTube", rating: 4.8, free: true },
  { id: "r3", title: "React Hooks Deep Dive", type: "course", url: "https://epicreact.dev", duration: "8h", difficulty: "Intermediate", skill: "React", platform: "Epic React", rating: 4.9, free: false },
  
  // TypeScript
  { id: "r4", title: "TypeScript Handbook", type: "documentation", url: "https://typescriptlang.org", duration: "6h", difficulty: "Beginner", skill: "TypeScript", platform: "TypeScript.org", rating: 4.7, free: true },
  { id: "r5", title: "TypeScript with React", type: "course", url: "https://frontendmasters.com", duration: "5h", difficulty: "Intermediate", skill: "TypeScript", platform: "Frontend Masters", rating: 4.8, free: false },
  
  // Python
  { id: "r6", title: "Python for Everybody", type: "course", url: "https://coursera.org", duration: "20h", difficulty: "Beginner", skill: "Python", platform: "Coursera", rating: 4.8, free: true },
  { id: "r7", title: "Automate the Boring Stuff", type: "book", url: "https://automatetheboringstuff.com", difficulty: "Beginner", skill: "Python", free: true },
  
  // Machine Learning
  { id: "r8", title: "ML Course by Andrew Ng", type: "course", url: "https://coursera.org", duration: "60h", difficulty: "Intermediate", skill: "Machine Learning", platform: "Coursera", rating: 4.9, free: true },
  { id: "r9", title: "Fast.ai Practical Deep Learning", type: "course", url: "https://fast.ai", duration: "40h", difficulty: "Intermediate", skill: "TensorFlow", platform: "Fast.ai", rating: 4.8, free: true },
  { id: "r10", title: "PyTorch Tutorial", type: "documentation", url: "https://pytorch.org", duration: "8h", difficulty: "Intermediate", skill: "PyTorch", platform: "PyTorch.org", rating: 4.7, free: true },
  
  // Node.js
  { id: "r11", title: "Node.js Complete Guide", type: "course", url: "https://udemy.com", duration: "30h", difficulty: "Intermediate", skill: "Node.js", platform: "Udemy", rating: 4.7, free: false },
  { id: "r12", title: "Node.js Official Docs", type: "documentation", url: "https://nodejs.org", duration: "4h", difficulty: "Beginner", skill: "Node.js", platform: "Node.js", rating: 4.5, free: true },
  
  // Solidity
  { id: "r13", title: "CryptoZombies - Learn Solidity", type: "practice", url: "https://cryptozombies.io", duration: "10h", difficulty: "Beginner", skill: "Solidity", platform: "CryptoZombies", rating: 4.8, free: true },
  { id: "r14", title: "Solidity by Example", type: "documentation", url: "https://solidity-by-example.org", duration: "5h", difficulty: "Intermediate", skill: "Solidity", free: true },
  
  // Docker
  { id: "r15", title: "Docker for Beginners", type: "course", url: "https://docker.com", duration: "6h", difficulty: "Beginner", skill: "Docker", platform: "Docker", rating: 4.6, free: true },
  { id: "r16", title: "Docker & Kubernetes Masterclass", type: "course", url: "https://udemy.com", duration: "25h", difficulty: "Advanced", skill: "Kubernetes", platform: "Udemy", rating: 4.7, free: false },
  
  // Go
  { id: "r17", title: "A Tour of Go", type: "practice", url: "https://go.dev/tour", duration: "4h", difficulty: "Beginner", skill: "Go", platform: "Go.dev", rating: 4.8, free: true },
  { id: "r18", title: "Learn Go with Tests", type: "article", url: "https://quii.gitbook.io", duration: "20h", difficulty: "Intermediate", skill: "Go", free: true },
  
  // Flutter
  { id: "r19", title: "Flutter Official Codelabs", type: "practice", url: "https://flutter.dev/docs/codelabs", duration: "8h", difficulty: "Beginner", skill: "Flutter", platform: "Flutter.dev", rating: 4.7, free: true },
  { id: "r20", title: "Flutter & Dart Course", type: "course", url: "https://udemy.com", duration: "28h", difficulty: "Intermediate", skill: "Flutter", platform: "Udemy", rating: 4.6, free: false },
];

export const generateLearningPath = (missingSkills: string[]): LearningPath[] => {
  return missingSkills.map(skill => ({
    skill,
    targetRole: "Full-stack Developer",
    shortTerm: [
      {
        id: `st-${skill}-1`,
        title: `${skill} Fundamentals`,
        description: `Get started with ${skill} basics and core concepts`,
        estimatedTime: "8-12 hours",
        priority: "critical" as const,
        resources: learningResources.filter(r => r.skill === skill && r.difficulty === "Beginner").slice(0, 2),
      },
      {
        id: `st-${skill}-2`,
        title: `${skill} in Practice`,
        description: `Build your first project using ${skill}`,
        estimatedTime: "10-15 hours",
        priority: "high" as const,
        resources: learningResources.filter(r => r.skill === skill && r.difficulty === "Intermediate").slice(0, 2),
      },
    ],
    longTerm: [
      {
        id: `lt-${skill}-1`,
        title: `Advanced ${skill}`,
        description: `Master advanced ${skill} patterns and best practices`,
        estimatedTime: "20-30 hours",
        priority: "medium" as const,
        resources: learningResources.filter(r => r.skill === skill && r.difficulty === "Advanced").slice(0, 2),
      },
    ],
    practiceProjects: [
      {
        id: `pp-${skill}-1`,
        title: `Build a ${skill} Starter App`,
        description: `Create a full-featured app using ${skill} to solidify your knowledge`,
        skills: [skill],
        difficulty: "Intermediate",
        estimatedTime: "15-20 hours",
      },
    ],
  }));
};
