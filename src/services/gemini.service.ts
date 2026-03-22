// ─── CONFIG ─────────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── CORE HELPERS ───────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) return fallback;

    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch {
    return fallback;
  }
}

// ─── CHATBOT ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const HACKATHON_SYSTEM_PROMPT = `You are HackBot, an expert AI assistant for TeamForge AI — a platform that helps students find teammates and win hackathons.

You specialize in:
1. Hackathon strategies & tips for winning
2. Team formation advice (roles, skills, compatibility)
3. Technology recommendations for different hackathon domains (AI/ML, Web3, FinTech, HealthTech, IoT, AR/VR, Gaming, EdTech, Climate, Social Impact)
4. Learning resources and upskilling paths
5. GitHub profile optimization
6. Project ideation and execution advice
7. Pitch deck and presentation tips
8. Time management during 24-48 hour hackathons

IMPORTANT RULES:
- Only answer questions related to hackathons, team building, technology skills, coding, and career development
- If asked about unrelated topics (politics, sports, entertainment, etc.), politely redirect to hackathon topics
- Be encouraging, concise, and actionable
- Use emojis occasionally to keep responses engaging
- Keep responses under 300 words unless a detailed technical explanation is needed
- Always sign off as "HackBot 🤖"`;

// ─── BUILT-IN FALLBACK RESPONSES ────────────────────────────────────────────────

const FALLBACK_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['win', 'winning', 'champion', 'beat', 'first place', 'top', 'prize'],
    response: `🏆 **How to Win Hackathons**

Here are the key strategies that separate winners from participants:

**1. Sharp Problem Statement**
Spend the first hour defining *who* suffers from *what* and *why now*. Judges reward insight over features.

**2. Working Demo Beats Perfect Code**
A polished MVP wins over a half-built complex system every time. Focus on the ONE flow that WOWs judges.

**3. Nail the Presentation**
80% of your score is how you communicate. Practice: Problem → Solution → Live Demo → Impact in 2 minutes.

**4. Right Team Roles**
You need a builder (engineer), a designer (UX), and a storyteller (presenter). Overlap kills speed.

**5. Use Existing APIs**
Stripe, Gemini AI, Supabase, Firebase — ship production-ready features in hours, not days.

**6. Sleep at Least 4 Hours**
Sleep-deprived teams make poor decisions and give shaky presentations.

💡 **Pro tip**: Submit early! Last-minute submissions always break under pressure.

HackBot 🤖`,
  },
  {
    keywords: ['team', 'teammate', 'members', 'team size', 'how many', 'roles', 'formation'],
    response: `👥 **Building the Perfect Hackathon Team**

**Ideal Size**: 3–4 people
- 2 = too much to build alone
- 5+ = communication overhead slows you down

**Core Roles to Fill**:
- 🛠️ **Backend Dev** — data, APIs, integrations
- 🎨 **Frontend/UX Dev** — interface and experience
- 🤖 **AI/ML or Domain Expert** — the technical differentiator
- 🎤 **Presenter/PM** — defines scope, pitches to judges

**Compatibility Tips**:
- Mix complementary skills, not identical ones
- Agree on tech stack in the first 30 minutes
- Set a decision-maker to break ties fast
- Align on communication tools upfront (Discord? Slack?)

💡 Use **TeamForge AI's matching** to find teammates by skills and working style!

HackBot 🤖`,
  },
  {
    keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'llm', 'gemini', 'openai', 'neural', 'chatgpt'],
    response: `🤖 **AI/ML Hackathon Tech Stack**

**Recommended Stack**:
- **LLMs**: Google Gemini API (free tier!), OpenAI GPT-4o, Groq llama-3 (ultra-fast, free)
- **Vector DB**: Pinecone, Weaviate, or Supabase pgvector
- **ML Framework**: PyTorch / scikit-learn / HuggingFace Transformers
- **Backend**: FastAPI (Python) or Node.js + Express
- **Frontend**: React + Vite + TailwindCSS
- **Deploy**: Vercel (frontend) + Railway/Render (backend)

**Quick Wins**:
- RAG (Retrieval-Augmented Generation) for domain-specific Q&A
- LangChain or LlamaIndex for multi-step AI workflows
- HuggingFace models for vision, NLP, or audio specialization

**Winning Formula**: Real problem + live AI demo + clear user story = impressed judges.

HackBot 🤖`,
  },
  {
    keywords: ['web3', 'blockchain', 'crypto', 'nft', 'solidity', 'ethereum', 'defi', 'smart contract'],
    response: `🔗 **Web3 Hackathon Must-Haves**

**Essential Stack**:
- Contracts: Solidity + Hardhat or Foundry
- Frontend: ethers.js / wagmi + viem + React
- Wallet: MetaMask + WalletConnect
- Testnet: Sepolia (Ethereum), Mumbai (Polygon)
- Storage: IPFS via Pinata
- Indexing: The Graph

**What Judges Look For**:
1. A real-world use case (not just another token)
2. A working on-chain demo (not a mockup)
3. UX that hides blockchain complexity from users

**Fast Start**: Scaffold-ETH 2 bootstraps a full-stack dApp in minutes. Use OpenZeppelin for standard templates.

**Hot Domains 2025**: ZK proofs, onchain gaming, real-world asset tokenization, cross-chain tooling.

HackBot 🤖`,
  },
  {
    keywords: ['pitch', 'presentation', 'demo', 'judges', 'slides', 'present', 'pitch deck'],
    response: `📊 **Winning Pitch & Presentation Tips**

**The 3-Minute Formula**:
⏱️ **Min 1 — Hook**: Shocking stat or 10-sec real story. Never start with "Hi we are Team X..."
⏱️ **Min 2 — Demo**: Show ONE user journey end-to-end. Live demo > slides > video.
⏱️ **Min 3 — Impact**: Market size, traction (mock users count!), clear next step.

**Slide Deck** (5–7 slides max):
1. Problem + emotional hook
2. Solution (one line)
3. How it works (architecture/flow)
4. Live demo screenshot or GIF
5. Impact & metrics
6. Team (why YOU can build this)

**🚨 Common Mistakes**: Reading slides, jargon overload, no live demo, no clear problem.

HackBot 🤖`,
  },
  {
    keywords: ['time', 'schedule', '24 hour', '48 hour', 'manage', 'timeline', 'plan', 'strategy', 'hours'],
    response: `⚡ **48-Hour Hackathon Timeline**

🔴 **Hour 0–2: Align** — Finalize problem, agree on stack, set up Git.
🟡 **Hour 2–8: Build Core** — Backend skeleton + key frontend screens.
🟢 **Hour 8–20: Connect & Polish** — Link frontend ↔ backend, add your AI/special feature, build the demo flow.
🔵 **Hour 20–28: Buffer & Sleep** — Code freeze. Sleep 4–6 hours. Non-negotiable.
🟣 **Hour 28–40: Presentation** — 5-slide deck, backup demo video, practice pitch 3× with a timer.
🏁 **Hour 40–48: Submit & Rest** — Submit early, never at the last minute.

💡 **Rule**: Code for the demo, not for production. One slick feature beats ten broken ones.

HackBot 🤖`,
  },
  {
    keywords: ['github', 'profile', 'portfolio', 'repo', 'repository', 'commit', 'open source', 'contributions'],
    response: `🐙 **GitHub Profile Optimization**

**Profile Essentials**:
- Professional avatar + bio mentioning your stack
- 6 pinned repos — your best, most complete projects
- A profile README (create a repo with your GitHub username)
- Consistent commit activity (green squares matter!)

**Repo Best Practices**:
- Every repo needs: description, tech stack, setup steps, demo GIF
- Add topic tags (react, machine-learning, etc.)
- Use GitHub Actions for CI/CD
- Include a live demo link in the description

**What Impresses**:
- Clean, meaningful commit messages
- Architecture diagram in README
- Open-source contributions to known projects

💡 Try our **GitHub Analyzer** for an AI-powered profile audit!

HackBot 🤖`,
  },
  {
    keywords: ['learn', 'skill', 'upskill', 'resource', 'tutorial', 'course', 'study', 'beginner', 'start', 'roadmap'],
    response: `📚 **Fast Learning Paths by Role**

🛠️ **Full-Stack Dev** (4–6 weeks):
- react.dev + Node.js docs
- Build: todo app → real-time chat

🤖 **AI/ML Engineer** (4–8 weeks):
- fast.ai — practical deep learning
- Google AI Studio — free Gemini API playground
- Build: image classifier → LLM chatbot

🎨 **Designer** (2–4 weeks):
- Figma (free) for wireframes and prototypes
- Build: a mobile app mockup for a real problem

🔗 **Web3 Dev** (6–8 weeks):
- CryptoZombies — learn Solidity through games
- Scaffold-ETH — full-stack dApp starter

💡 Use our **Upskilling page** for an AI-personalized roadmap based on YOUR skills!

HackBot 🤖`,
  },
  {
    keywords: ['idea', 'project', 'build', 'what to build', 'inspiration', 'domain', 'trending'],
    response: `💡 **Hackathon Project Ideas That Win**

**Formula**: Real Problem × Achievable in 48h × Impressive Demo

🏥 **HealthTech**: AI symptom checker, mental health journaling + sentiment analysis, medication tracker.
🌍 **Climate**: Carbon footprint from purchases, satellite deforestation analysis, smart transport routing.
💰 **FinTech**: AI advisor for Gen Z, micro-loan eligibility predictor, smart expense splitter.
🎓 **EdTech**: Quiz generator from YouTube videos, peer-tutor matcher, AI code reviewer for beginners.
🤝 **Social Impact**: Disaster relief coordination, accessibility tool for visually impaired, local food rescue.

**Pitch Formula**: "We help [specific person] do [specific thing] X times faster using [your tech]."

HackBot 🤖`,
  },
  {
    keywords: ['stack', 'react', 'node', 'python', 'javascript', 'typescript', 'framework', 'backend', 'frontend', 'technology', 'tech stack'],
    response: `💻 **Best Hackathon Tech Stacks**

**Speed-Optimized Full-Stack** (recommended for most hackathons):
- 🎨 **Frontend**: React + Vite + TailwindCSS
- ⚙️ **Backend**: Node.js + Express OR FastAPI (Python for AI)
- 🗄️ **DB**: Supabase (Postgres + Auth + Storage, free tier)
- 🤖 **AI**: Google Gemini API or Groq (llama-3, ultra-fast, free)
- 🚀 **Deploy**: Vercel (frontend, 2-min deploys) + Railway (backend)

**🚨 Golden Rule**: Use tech you already know! A hackathon is NOT the time to learn a new framework from scratch.

**Quick Start**: \`npm create vite@latest\` + Supabase = auth, DB, and file storage in under 10 minutes.

HackBot 🤖`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start', 'what can you do', 'who are you', 'introduce'],
    response: `Hey there! 👋 I'm **HackBot** 🤖 — your AI-powered hackathon expert!

I can help you with:
• 🏆 **Winning strategies** — what separates winners from participants
• 👥 **Team formation** — ideal roles, size, and compatibility tips
• 💻 **Tech stack advice** — AI/ML, Web3, FinTech, full-stack recommendations
• 📊 **Pitch & presentation** — how to WOW judges in 3 minutes
• ⏰ **Time management** — 24h/48h hackathon schedules that work
• 🐙 **GitHub optimization** — make your profile stand out to teammates
• 📚 **Learning paths** — fastest route to any tech role
• 💡 **Project ideas** — trending domains and winning formulas

Just ask me anything hackathon-related! 🚀

HackBot 🤖`,
  },
];

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const { keywords, response } of FALLBACK_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return response;
  }
  return `Great question! 🤖 While I'm running in offline mode, here are quick hackathon essentials:

🏆 **Top Tips**:
• Build a working MVP — a live demo beats a perfect codebase
• Use existing APIs (Gemini, Stripe, Supabase) to ship 10× faster
• Practice your 2-minute pitch more than you write code
• Sleep at least 4 hours — tired teams give shaky demos
• Ideal team: 3–4 people with complementary skills

💬 Try asking me about: **winning strategies**, **team formation**, **AI/ML stacks**, **Web3**, **pitch tips**, **time management**, **GitHub**, or **project ideas**!

HackBot 🤖`;
}

export async function chatWithHackBot(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  const conversationHistory = messages.slice(-8).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const fullConversation = [
    { role: 'user', parts: [{ text: HACKATHON_SYSTEM_PROMPT }] },
    {
      role: 'model',
      parts: [
        {
          text: "Understood! I'm HackBot, your hackathon expert assistant. I'm here to help you build winning teams and crush hackathons! 🚀",
        },
      ],
    },
    ...conversationHistory,
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: fullConversation,
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API unavailable (status', response.status, '), using built-in response.');
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      getFallbackResponse(userMessage)
    );
  } catch {
    console.warn('Gemini API error, using built-in response.');
    return getFallbackResponse(userMessage);
  }
}

// ─── TEAM CHEMISTRY ─────────────────────────────────────────────────────────────

export interface TeamChemistryResult {
  overallScore: number;
  winProbability: number;
  innovationPotential: string;
  collaborationScore: number;
  technicalBalance: number;
  creativeScore: number;
  leadershipScore: number;
  communicationScore: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  workingStyle: string;
  aiInsights: string;
  teamPersonality: string;
  riskFactors: string[];
}

const defaultChemistry: TeamChemistryResult = {
  overallScore: 72,
  winProbability: 58,
  innovationPotential: 'Medium',
  collaborationScore: 75,
  technicalBalance: 70,
  creativeScore: 65,
  leadershipScore: 68,
  communicationScore: 72,
  strengthAreas: ['Technical Depth', 'Problem Solving', 'Diverse Skill Set'],
  weaknessAreas: ['Limited Design Skills', 'Leadership Gap'],
  workingStyle: 'Collaborative',
  aiInsights:
    'This team has solid technical foundations with complementary skills. Focus on clear role definition and daily standups to maximize output during the hackathon.',
  teamPersonality: 'The Builders',
  riskFactors: ['Tight timeline', 'Skill overlap in frontend'],
};

export async function analyzeTeamChemistry(
  teamMembers: Array<{
    name: string;
    skills: { technical: string[]; soft: string[] };
    preferences: { roles: string[] };
  }>
): Promise<TeamChemistryResult> {
  const teamSummary = teamMembers
    .map(
      (m) =>
        `${m.name}: Technical[${m.skills.technical.join(', ')}], Soft[${m.skills.soft.join(', ')}], Roles[${m.preferences.roles.join(', ')}]`
    )
    .join('\n');

  const prompt = `You are a hackathon team analyst. Analyze this team and return ONLY a valid JSON object (no markdown, no code blocks):

Team Members:
${teamSummary}

Return this exact JSON structure with realistic values:
{
  "overallScore": <number 60-95>,
  "winProbability": <number 40-85>,
  "innovationPotential": "<High|Medium|Low>",
  "collaborationScore": <number 60-95>,
  "technicalBalance": <number 50-95>,
  "creativeScore": <number 50-90>,
  "leadershipScore": <number 50-90>,
  "communicationScore": <number 60-95>,
  "strengthAreas": ["<area1>", "<area2>", "<area3>"],
  "weaknessAreas": ["<area1>", "<area2>"],
  "workingStyle": "<Collaborative|Structured|Agile|Creative>",
  "aiInsights": "<2-3 sentences of personalized AI insight about this specific team>",
  "teamPersonality": "<The Innovators|The Builders|The Disruptors|The Hackers|The Strategists>",
  "riskFactors": ["<risk1>", "<risk2>"]
}`;

  try {
    const text = await callGemini(prompt);
    return safeJsonParse(text, defaultChemistry);
  } catch {
    return defaultChemistry;
  }
}

// ─── GAP ANALYSIS ───────────────────────────────────────────────────────────────

export interface GapAnalysisResult {
  criticalGaps: Array<{
    skill: string;
    priority: 'high' | 'medium';
    reason: string;
  }>;
  niceToHave: Array<{
    skill: string;
    priority: 'medium' | 'low';
    reason: string;
  }>;
  readinessScore: number;
  aiSummary: string;
  recommendedRoles: string[];
}

const defaultGapResult: GapAnalysisResult = {
  criticalGaps: [
    {
      skill: 'Machine Learning',
      priority: 'high',
      reason: 'Core requirement for AI/ML hackathon',
    },
    {
      skill: 'Cloud Deployment',
      priority: 'high',
      reason: 'Needed to demonstrate scalability',
    },
    {
      skill: 'Data Pipeline',
      priority: 'medium',
      reason: 'Required for processing large datasets',
    },
  ],
  niceToHave: [
    {
      skill: 'MLOps',
      priority: 'medium',
      reason: 'Would improve model deployment workflow',
    },
    {
      skill: 'Data Visualization',
      priority: 'low',
      reason: 'Helps in presenting results effectively',
    },
  ],
  readinessScore: 52,
  aiSummary:
    'Your team has strong frontend capabilities but lacks critical ML and backend infrastructure skills needed for this domain. Focus on adding an ML engineer and DevOps specialist.',
  recommendedRoles: ['ML Engineer', 'DevOps Engineer', 'Data Scientist'],
};

export async function analyzeSkillGaps(
  teamSkills: string[],
  domain: string,
  hackathonTheme: string
): Promise<GapAnalysisResult> {
  const prompt = `You are a hackathon readiness expert. Analyze the skill gaps for this team targeting a ${domain} hackathon on theme "${hackathonTheme}".

Current team skills: ${teamSkills.join(', ')}

Return ONLY a valid JSON object (no markdown):
{
  "criticalGaps": [
    {"skill": "<skill>", "priority": "high", "reason": "<why this is critical>"}
  ],
  "niceToHave": [
    {"skill": "<skill>", "priority": "medium", "reason": "<why this would help>"}
  ],
  "readinessScore": <number 0-100>,
  "aiSummary": "<2-3 sentences summarizing the gap analysis>",
  "recommendedRoles": ["<role1>", "<role2>"]
}

Include 3-5 critical gaps and 2-4 nice-to-have items relevant to ${domain}.`;

  try {
    const text = await callGemini(prompt);
    return safeJsonParse(text, defaultGapResult);
  } catch {
    return defaultGapResult;
  }
}

// ─── READINESS ANALYZER ─────────────────────────────────────────────────────────

export interface ReadinessResult {
  overallScore: number;
  domainScore: number;
  technicalScore: number;
  teamScore: number;
  checklist: Array<{
    item: string;
    status: 'complete' | 'partial' | 'missing';
    importance: 'critical' | 'important' | 'optional';
  }>;
  actionItems: string[];
  aiAdvice: string;
  estimatedPrepTime: string;
}

const defaultReadiness: ReadinessResult = {
  overallScore: 62,
  domainScore: 58,
  technicalScore: 65,
  teamScore: 68,
  checklist: [
    { item: 'Team has domain expert', status: 'partial', importance: 'critical' },
    { item: 'Development environment set up', status: 'complete', importance: 'critical' },
    { item: 'Problem statement defined', status: 'missing', importance: 'critical' },
    { item: 'Tech stack decided', status: 'complete', importance: 'important' },
    { item: 'API keys & credentials ready', status: 'partial', importance: 'important' },
    { item: 'UI/UX wireframes planned', status: 'missing', importance: 'optional' },
    { item: 'Deployment platform chosen', status: 'partial', importance: 'important' },
    { item: 'Git repository created', status: 'complete', importance: 'critical' },
  ],
  actionItems: [
    'Define your problem statement clearly',
    'Assign domain expert or plan learning sprint',
    'Set up all required API credentials',
  ],
  aiAdvice:
    'Your team is moderately prepared. Focus on clearly defining your problem statement and ensuring all team members understand the domain requirements.',
  estimatedPrepTime: '2-3 days',
};

export async function analyzeReadiness(
  teamSkills: string[],
  domain: string,
  teamSize: number
): Promise<ReadinessResult> {
  const prompt = `You are a hackathon readiness coach for ${domain} domain hackathons.

Evaluate this team:
Team size: ${teamSize} members
Team skills: ${teamSkills.join(', ')}

Return ONLY valid JSON (no markdown):
{
  "overallScore": <number 40-90>,
  "domainScore": <number 40-95>,
  "technicalScore": <number 40-95>,
  "teamScore": <number 50-90>,
  "checklist": [
    {"item": "<checklist item>", "status": "<complete|partial|missing>", "importance": "<critical|important|optional>"}
  ],
  "actionItems": ["<action1>", "<action2>", "<action3>"],
  "aiAdvice": "<2-3 sentences of specific advice for this team and domain>",
  "estimatedPrepTime": "<e.g. 3-5 days>"
}

Include 8-12 checklist items specific to ${domain} hackathons.`;

  try {
    const text = await callGemini(prompt);
    return safeJsonParse(text, defaultReadiness);
  } catch {
    return defaultReadiness;
  }
}

// ─── LEARNING PATH ──────────────────────────────────────────────────────────────

export interface LearningPath {
  targetRole: string;
  totalEstimatedTime: string;
  shortTerm: Array<{
    skill: string;
    description: string;
    resources: Array<{
      type: 'video' | 'article' | 'course' | 'project';
      title: string;
      duration: string;
      url: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    }>;
    estimatedTime: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  longTerm: Array<{
    skill: string;
    description: string;
    estimatedTime: string;
  }>;
  practiceProjects: Array<{
    title: string;
    description: string;
    skills: string[];
    difficulty: string;
  }>;
  aiMotivation: string;
}

const defaultLearningPath: LearningPath = {
  targetRole: 'Full-stack Developer',
  totalEstimatedTime: '40 hours',
  shortTerm: [
    {
      skill: 'React Fundamentals',
      description: 'Master component-based UI development',
      resources: [
        {
          type: 'video',
          title: 'React Crash Course 2024',
          duration: '3h',
          url: 'https://www.youtube.com/results?search_query=react+crash+course+2024',
          difficulty: 'beginner',
        },
        {
          type: 'article',
          title: 'React Hooks Deep Dive',
          duration: '45m',
          url: 'https://react.dev/learn',
          difficulty: 'intermediate',
        },
        {
          type: 'project',
          title: 'Build a Todo App',
          duration: '2h',
          url: 'https://github.com/topics/todo-react',
          difficulty: 'beginner',
        },
      ],
      estimatedTime: '8 hours',
      priority: 'high',
    },
    {
      skill: 'Node.js Backend',
      description: 'Build REST APIs with Express',
      resources: [
        {
          type: 'course',
          title: 'Node.js Complete Guide',
          duration: '4h',
          url: 'https://www.youtube.com/results?search_query=nodejs+express+tutorial',
          difficulty: 'intermediate',
        },
        {
          type: 'project',
          title: 'REST API with Authentication',
          duration: '3h',
          url: 'https://github.com/topics/nodejs-api',
          difficulty: 'intermediate',
        },
      ],
      estimatedTime: '10 hours',
      priority: 'high',
    },
  ],
  longTerm: [
    {
      skill: 'System Design',
      description: 'Learn to architect scalable systems',
      estimatedTime: '20 hours',
    },
    {
      skill: 'DevOps Basics',
      description: 'Docker, CI/CD, and deployment',
      estimatedTime: '15 hours',
    },
  ],
  practiceProjects: [
    {
      title: 'Full-Stack SaaS App',
      description: 'Build a complete SaaS with auth, payments, and dashboard',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      difficulty: 'intermediate',
    },
    {
      title: 'Real-time Chat App',
      description: 'WebSocket-based chat with rooms and auth',
      skills: ['Socket.io', 'React', 'Redis'],
      difficulty: 'intermediate',
    },
  ],
  aiMotivation:
    "You're on an amazing journey! With your current skills, you're well-positioned to become a strong full-stack developer. Focus on building real projects and you'll be hackathon-ready in no time! 🚀",
};

export async function generateLearningPath(
  currentSkills: string[],
  targetRole: string,
  hackathonDomain: string,
  timeAvailable: string
): Promise<LearningPath> {
  const prompt = `You are a personalized learning coach. Create a learning path for someone wanting to become a ${targetRole} for a ${hackathonDomain} hackathon.

Current skills: ${currentSkills.join(', ')}
Time available: ${timeAvailable}

Return ONLY valid JSON (no markdown):
{
  "targetRole": "${targetRole}",
  "totalEstimatedTime": "<e.g. 40 hours>",
  "shortTerm": [
    {
      "skill": "<skill name>",
      "description": "<what you will learn>",
      "resources": [
        {"type": "<video|article|course|project>", "title": "<title>", "duration": "<e.g. 2h>", "url": "https://www.youtube.com/results?search_query=<skill>+tutorial", "difficulty": "<beginner|intermediate|advanced>"}
      ],
      "estimatedTime": "<e.g. 8 hours>",
      "priority": "<high|medium|low>"
    }
  ],
  "longTerm": [
    {"skill": "<skill>", "description": "<description>", "estimatedTime": "<time>"}
  ],
  "practiceProjects": [
    {"title": "<project title>", "description": "<what to build>", "skills": ["<skill1>"], "difficulty": "<beginner|intermediate|advanced>"}
  ],
  "aiMotivation": "<motivating personalized message for this learner>"
}

Include 3-4 short term skills with 2-3 resources each, 2-3 long term skills, and 2-3 practice projects.`;

  try {
    const text = await callGemini(prompt);
    return safeJsonParse(text, defaultLearningPath);
  } catch {
    return defaultLearningPath;
  }
}

// ─── GITHUB INSIGHT ─────────────────────────────────────────────────────────────

export interface GitHubInsight {
  profileStrength: number;
  collaborationStyle: string;
  projectComplexity: string;
  codeConsistency: string;
  aiSummary: string;
  topStrengths: string[];
  improvementAreas: string[];
  hackathonReadiness: string;
}

const defaultGitHubInsight: GitHubInsight = {
  profileStrength: 70,
  collaborationStyle: 'Team Collaborator',
  projectComplexity: 'Intermediate',
  codeConsistency: 'Regular',
  aiSummary:
    'This developer shows consistent coding activity with a good variety of projects. Their repository portfolio demonstrates solid technical skills and growing open-source engagement.',
  topStrengths: [
    'Consistent Commits',
    'Diverse Languages',
    'Open Source Contributions',
  ],
  improvementAreas: [
    'Add more documentation',
    'Increase contribution frequency',
  ],
  hackathonReadiness: 'Almost Ready',
};

export async function analyzeGitHubProfile(
  username: string,
  repos: number,
  stars: number,
  contributions: number,
  topLanguages: string[],
  followers: number
): Promise<GitHubInsight> {
  const prompt = `Analyze this GitHub profile for hackathon readiness:

Username: ${username}
Repos: ${repos}
Stars: ${stars}
Estimated Contributions: ${contributions}
Top Languages: ${topLanguages.join(', ')}
Followers: ${followers}

Return ONLY valid JSON (no markdown):
{
  "profileStrength": <number 40-95>,
  "collaborationStyle": "<Solo Hacker|Team Collaborator|Open Source Contributor|Mentor>",
  "projectComplexity": "<Beginner|Intermediate|Advanced|Expert>",
  "codeConsistency": "<Sporadic|Regular|Highly Active|Prolific>",
  "aiSummary": "<2-3 sentences analyzing this specific developer's GitHub profile>",
  "topStrengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvementAreas": ["<area1>", "<area2>"],
  "hackathonReadiness": "<Ready|Almost Ready|Needs Work>"
}`;

  try {
    const text = await callGemini(prompt);
    return safeJsonParse(text, defaultGitHubInsight);
  } catch {
    return defaultGitHubInsight;
  }
}