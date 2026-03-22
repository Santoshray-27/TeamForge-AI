<h1 align="center">
  <img src="https://img.shields.io/badge/TeamForge-AI-6366f1?style=for-the-badge&logo=lightning&logoColor=white" alt="TeamForge AI" />
</h1>

<p align="center">
  <strong>AI-powered hackathon team formation platform</strong><br/>
  Find your perfect teammates, analyze GitHub profiles, predict team chemistry, and win more hackathons — all powered by Google Gemini AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [AI Services](#-ai-services)
- [Key Components](#-key-components)
- [State Management](#-state-management)
- [Data Layer](#-data-layer)
- [Scripts](#-scripts)

---

## 🌟 Overview

**TeamForge AI** is a full-featured, client-side React application that helps student developers and hackathon enthusiasts find the right teammates, assess their team's readiness, and improve their chances of winning hackathons.

The platform leverages **Google Gemini 2.0 Flash** for all AI-powered analysis tasks and uses the **GitHub REST API** for real repository data. Every analysis falls back gracefully to intelligent defaults if the API is unavailable.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Team Matching** | ML-based compatibility scoring across 50+ data points to suggest the best teammates |
| 🐙 **GitHub Analyzer** | Fetches live GitHub data and generates AI insights on coding style, collaboration, and hackathon readiness |
| ⚗️ **Team Chemistry** | Predicts win probability, collaboration score, and innovation potential for any team combination |
| 🔍 **Gap Analyzer** | Identifies missing skills for a specific hackathon domain and recommends candidates to fill them |
| 📊 **Readiness Analyzer** | Generates a scored checklist of hackathon readiness across 10+ domains with action items |
| 📚 **AI Upskilling** | Creates personalized learning roadmaps with curated resources based on current skills and target role |
| 🤖 **HackBot Chatbot** | Floating AI chatbot powered by Gemini with 11 built-in topic responses as offline fallback |
| 🌙 **Dark Mode UI** | Premium dark-mode aesthetic with glassmorphism, gradients, and smooth animations |
| 🔒 **Auth System** | Simulated login/signup with Zustand-persisted state |
| 👥 **Mock User System** | 50+ realistic mock developer profiles for instant team matching and chemistry testing |

---

## 🛠️ Tech Stack

### Core
| Library | Version | Purpose |
|---|---|---|
| React | 19.2.3 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| React Router DOM | ^7.13.1 | Client-side routing |

### Styling & Animation
| Library | Version | Purpose |
|---|---|---|
| TailwindCSS | 4.1.17 | Utility-first CSS |
| @tailwindcss/vite | 4.1.17 | Vite integration for Tailwind |
| Framer Motion | ^12.38.0 | Page transitions & micro-animations |
| GSAP | ^3.14.2 | Advanced timeline animations |

### State & Forms
| Library | Version | Purpose |
|---|---|---|
| Zustand | ^5.0.12 | Global state management |
| React Hook Form | ^7.72.0 | Form handling |
| Zod | ^4.3.6 | Schema validation |
| @hookform/resolvers | ^5.2.2 | Zod ↔ RHF integration |

### Data & APIs
| Library | Version | Purpose |
|---|---|---|
| @google/generative-ai | ^0.24.1 | Gemini AI SDK |
| @octokit/rest | ^22.0.1 | GitHub API client |
| Axios | ^1.13.6 | HTTP client |
| date-fns | ^4.1.0 | Date formatting |

### UI Components & Charts
| Library | Version | Purpose |
|---|---|---|
| Lucide React | ^0.577.0 | Icon system |
| Recharts | ^3.8.0 | Data visualization |
| React Hot Toast | ^2.6.0 | Toast notifications |
| React Markdown | ^10.1.0 | Markdown rendering |
| @dnd-kit/core | ^6.3.1 | Drag-and-drop |
| clsx + tailwind-merge | latest | Class merging utilities |

### Build Plugins
| Plugin | Purpose |
|---|---|
| @vitejs/plugin-react | React fast refresh |
| vite-plugin-singlefile | Bundle into a single HTML file for distribution |

---

## 📁 Project Structure

```
build-ai-team-platform/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── chatbot/
│   │   │   └── HackBot.tsx          # HackBot (chatbot folder version)
│   │   ├── features/
│   │   │   ├── HackBot.tsx          # HackBot (active features version)
│   │   │   └── ProfileCard.tsx      # Developer profile card component
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx  # Layout wrapper with sidebar/navbar
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   └── Sidebar.tsx          # Left navigation sidebar
│   │   └── ui/
│   │       ├── Badge.tsx            # Status badge component
│   │       ├── Button.tsx           # Reusable button with variants
│   │       ├── GlassCard.tsx        # Glassmorphism card wrapper
│   │       └── ProgressBar.tsx      # Animated progress bar
│   ├── data/
│   │   ├── hackathonDomains.ts      # 10+ hackathon domain definitions
│   │   ├── learningResources.ts     # Curated learning resources library
│   │   ├── mockUsers.ts             # 50+ realistic mock developer profiles
│   │   └── skills.ts                # Skills taxonomy and categories
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx            # Login page with form validation
│   │   │   └── Signup.tsx           # Signup page with multi-step form
│   │   ├── Dashboard/
│   │   │   └── index.tsx            # Main dashboard with stats & feed
│   │   ├── GapAnalyzer/
│   │   │   └── index.tsx            # Skill gap analysis tool
│   │   ├── GitHubAnalyzer/
│   │   │   └── index.tsx            # GitHub profile analyzer
│   │   ├── Landing/
│   │   │   └── index.tsx            # Public landing page
│   │   ├── ReadinessAnalyzer/
│   │   │   └── index.tsx            # Hackathon readiness checker
│   │   ├── TeamChemistry/
│   │   │   └── index.tsx            # Team chemistry predictor
│   │   ├── TeamMatching/
│   │   │   └── index.tsx            # AI teammate matching
│   │   └── Upskilling/
│   │       └── index.tsx            # Personalized upskilling paths
│   ├── services/
│   │   └── gemini.service.ts        # All Gemini AI API calls + fallbacks
│   ├── store/
│   │   ├── authStore.ts             # Auth state (Zustand + persist)
│   │   └── teamStore.ts             # Team selection state
│   ├── utils/
│   │   ├── algorithms.ts            # Compatibility scoring algorithms
│   │   └── cn.ts                    # clsx + tailwind-merge utility
│   ├── App.tsx                      # Root app with routing
│   ├── index.css                    # Global styles & Tailwind directives
│   ├── main.tsx                     # React entry point
│   └── vite-env.d.ts               # Vite type declarations
├── .env                             # Environment variables (API keys)
├── index.html                       # HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- A **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

```bash
# 1. Clone or download the project
cd "build-ai-team-platform (1)"

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy the example below into .env and add your keys

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

> **Demo Access**: Click **"Try Demo"** on the login page to explore the platform without creating an account.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# Required — Get from https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional — Increases GitHub API rate limit from 60 to 5000 req/hr
# Get from https://github.com/settings/tokens
VITE_GITHUB_TOKEN=your_github_token_here
```

> **Note:** All variables must be prefixed with `VITE_` to be accessible in the browser by Vite.

> **Offline Mode:** If the Gemini API key is missing or quota is exceeded, HackBot and all AI tools fall back to built-in intelligent defaults automatically — the app still works fully.

---

## 🗺️ Pages & Routes

| Route | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `Landing` | No | Hero landing page with features, testimonials, and CTAs |
| `/login` | `Login` | No | Login form with email/password validation |
| `/signup` | `Signup` | No | Signup form with profile preferences |
| `/dashboard` | `Dashboard` | Yes | Overview with stats, match feed, quick actions |
| `/team-matching` | `TeamMatching` | Yes | Browse and filter AI-matched teammates |
| `/github-analyzer` | `GitHubAnalyzer` | Yes | Analyze any GitHub profile with live API + AI |
| `/team-chemistry` | `TeamChemistry` | Yes | Build a team and get AI chemistry prediction |
| `/gap-analyzer` | `GapAnalyzer` | Yes | Identify skill gaps for a hackathon domain |
| `/readiness` | `ReadinessAnalyzer` | Yes | Get a readiness score and action checklist |
| `/upskilling` | `Upskilling` | Yes | Get a personalized AI learning roadmap |

All dashboard routes are wrapped in `DashboardLayout` (Navbar + Sidebar). Pages are **lazy-loaded** with `React.lazy()` and wrapped in `<Suspense>` for performance.

---

## 🤖 AI Services

All AI logic lives in `src/services/gemini.service.ts`. It calls the **Gemini 2.0 Flash** model via the REST API (`v1beta`) and returns typed results.

### Functions

| Function | Inputs | Returns | Fallback |
|---|---|---|---|
| `chatWithHackBot()` | message history + user message | `string` (AI reply) | Keyword-matched built-in responses (11 categories) |
| `analyzeTeamChemistry()` | array of team members (name, skills, roles) | `TeamChemistryResult` | `defaultChemistry` object |
| `analyzeSkillGaps()` | team skills, domain, hackathon theme | `GapAnalysisResult` | `defaultGapResult` object |
| `analyzeReadiness()` | team skills, domain, team size | `ReadinessResult` | `defaultReadiness` object |
| `generateLearningPath()` | current skills, target role, domain, time | `LearningPath` | `defaultLearningPath` object |
| `analyzeGitHubProfile()` | GitHub username + repo stats | `GitHubInsight` | `defaultGitHubInsight` object |

### HackBot Fallback Topics

When the Gemini API is unavailable (quota exceeded, no key, network error), HackBot matches the user's message against these keyword categories and returns a detailed built-in response:

`win/champion` · `team/roles` · `ai/ml/llm` · `web3/blockchain` · `pitch/demo` · `time/schedule` · `github/repo` · `learn/upskill` · `idea/project` · `stack/framework` · `hello/help`

---

## 🧩 Key Components

### `HackBot` (`src/components/features/HackBot.tsx`)
Floating AI chatbot widget that appears for authenticated users. Features:
- Animated open/close/minimize states (Framer Motion)
- Quick-prompt chips for common questions
- Typing indicator with bouncing dots
- Unread message badge
- Bold/markdown text formatting in messages
- Graceful offline fallback (never shows error to user)

### `DashboardLayout` (`src/components/layout/DashboardLayout.tsx`)
Wraps all dashboard pages with persistent `Navbar` and `Sidebar`. Uses React Router's `<Outlet>` for nested routing.

### `ProfileCard` (`src/components/features/ProfileCard.tsx`)
Reusable developer profile card showing avatar, skills, match score, GitHub stats, and action buttons (connect, view GitHub, add to team).

### UI Primitives (`src/components/ui/`)
- **`Button`** — primary, secondary, ghost, danger variants with loading spinner and icon support
- **`Badge`** — status badges in primary, success, warning, danger, purple variants
- **`ProgressBar`** — animated progress bar with color variants
- **`GlassCard`** — glassmorphism card with border glow effect

---

## 🗃️ State Management

State is managed with **Zustand** with the `persist` middleware for localStorage persistence.

### `authStore.ts`
```ts
{
  user: User | null          // Current logged-in user
  isAuthenticated: boolean   // Login state
  isLoading: boolean         // API loading state
  profileComplete: boolean   // Profile setup status
  login(credentials)         // Simulated login (1s delay)
  signup(data)               // Simulated signup (1.2s delay)
  logout()                   // Clear auth state
  updateProfile(data)        // Partial user update
  setProfileComplete(bool)   // Mark profile as complete
}
```

### `teamStore.ts`
```ts
{
  selectedMembers: User[]    // Members added to the team builder
  addMember(user)            // Add a user to the team
  removeMember(userId)       // Remove a user from the team
  clearTeam()                // Reset team selection
}
```

---

## 📊 Data Layer

### `mockUsers.ts`
Contains **50+ hand-crafted mock developer profiles** with:
- Realistic names, bios, and avatars (DiceBear API)
- GitHub stats (repos, stars, contributions, languages)
- Skills (technical + soft)
- Hackathon preferences (domains, roles, team size, availability)
- Compatibility scores computed by `algorithms.ts`
- A `currentUser` export used as the logged-in user template

### `hackathonDomains.ts`
Defines **10+ hackathon domains** (AI/ML, Web3, FinTech, HealthTech, IoT, AR/VR, Gaming, EdTech, Climate, Social Impact) each with:
- Required skills
- Nice-to-have skills
- Typical project types
- Judging criteria

### `skills.ts`
A categorized taxonomy of developer skills (frontend, backend, ML, DevOps, design, soft skills) used for filtering and matching.

### `algorithms.ts`
Pure functions for computing compatibility scores between two developer profiles, factoring in: skill overlap, complementary skills, domain alignment, role fit, experience level, and availability.

---

## 📜 Scripts

```bash
# Start development server (http://localhost:5173)
npm run dev

# Type-check without emitting files
npx tsc --noEmit

# Build for production (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Architecture Decisions

| Decision | Rationale |
|---|---|
| **Client-only (no backend)** | Zero deployment complexity — the entire app ships as static files |
| **Gemini REST API (not SDK)** | Direct `fetch` calls avoid bundling the full SDK in the client build |
| **`vite-plugin-singlefile`** | Bundles everything into a single `index.html` for easy sharing/embedding |
| **Lazy-loaded pages** | Reduces initial bundle size; heavy chart libraries load only when needed |
| **Zustand + persist** | Lightweight alternative to Redux; persist keeps the user logged in across refreshes |
| **Fallback responses** | Every AI call has a typed default — the app is fully usable without an API key |

---

## 📄 License

This project is for educational and hackathon demonstration purposes.

---

<p align="center">Built with ❤️ for hackathon champions ·</p>

