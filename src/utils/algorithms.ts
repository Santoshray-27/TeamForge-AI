import { User } from '../data/mockUsers';

// Jaccard Similarity for skill overlap
export function jaccardSimilarity(set1: string[], set2: string[]): number {
  const intersection = set1.filter(skill => set2.includes(skill));
  const union = [...new Set([...set1, ...set2])];
  return union.length > 0 ? intersection.length / union.length : 0;
}

// Role complementarity check
export function checkRoleComplement(roles1: string[], roles2: string[]): number {
  const roleCategories: Record<string, string> = {
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "Full-stack Developer": "fullstack",
    "ML Engineer": "ml",
    "Data Scientist": "ml",
    "DevOps Engineer": "devops",
    "UI/UX Designer": "design",
    "Mobile Developer": "mobile",
    "Blockchain Developer": "blockchain",
    "Security Engineer": "security",
    "Product Manager": "product",
  };

  const cats1 = roles1.map(r => roleCategories[r] || r);
  const cats2 = roles2.map(r => roleCategories[r] || r);
  
  // Penalize exact overlap, reward complementarity
  const overlap = cats1.filter(c => cats2.includes(c)).length;
  const total = Math.max(cats1.length, cats2.length);
  const complementScore = 1 - (overlap / total);
  
  return complementScore;
}

// GitHub activity synergy
export function analyzeGitHubSynergy(github1: User['github'], github2: User['github']): number {
  const activityScore1 = Math.min(github1.contributions / 1000, 1);
  const activityScore2 = Math.min(github2.contributions / 1000, 1);
  const avgActivity = (activityScore1 + activityScore2) / 2;
  
  // Check language diversity
  const langOverlap = jaccardSimilarity(github1.topLanguages, github2.topLanguages);
  const synergyScore = avgActivity * 0.6 + (1 - langOverlap) * 0.4;
  
  return Math.min(synergyScore, 1);
}

// Main compatibility calculator
export function calculateCompatibility(user1: User, user2: User): number {
  const allSkills1 = [...user1.skills.technical, ...user1.skills.tools];
  const allSkills2 = [...user2.skills.technical, ...user2.skills.tools];
  
  const skillOverlap = jaccardSimilarity(allSkills1, allSkills2);
  const roleComplement = checkRoleComplement(user1.preferences.roles, user2.preferences.roles);
  const githubSynergy = analyzeGitHubSynergy(user1.github, user2.github);
  
  // Availability match
  const availabilityMatch = user1.preferences.availability === user2.preferences.availability ? 1 : 0.5;
  
  // Hackathon type overlap
  const hackathonMatch = jaccardSimilarity(
    user1.preferences.hackathonTypes,
    user2.preferences.hackathonTypes
  );

  const weightedScore = 
    skillOverlap * 0.25 +
    roleComplement * 0.30 +
    githubSynergy * 0.20 +
    availabilityMatch * 0.10 +
    hackathonMatch * 0.15;

  return Math.round(weightedScore * 100);
}

// Team chemistry calculator
export function calculateTeamChemistry(team: User[]) {
  if (team.length < 2) {
    return {
      overallScore: 0,
      skillCoverage: 0,
      roleBalance: 0,
      innovationPotential: 0,
      communicationScore: 0,
      winProbability: 0,
      strengths: [],
      weaknesses: [],
      insights: [],
    };
  }

  const allSkills = team.flatMap(u => u.skills.technical);
  const uniqueSkills = [...new Set(allSkills)];
  const skillCoverage = Math.min((uniqueSkills.length / 20) * 100, 100);

  // Role balance
  const allRoles = team.flatMap(u => u.preferences.roles);
  const uniqueRoleCategories = new Set(allRoles.map(r => {
    if (r.includes("Frontend") || r.includes("UI")) return "frontend";
    if (r.includes("Backend")) return "backend";
    if (r.includes("ML") || r.includes("Data")) return "ml";
    if (r.includes("DevOps") || r.includes("Cloud")) return "devops";
    if (r.includes("Mobile")) return "mobile";
    if (r.includes("Design")) return "design";
    if (r.includes("Product") || r.includes("Manager")) return "product";
    return "other";
  }));
  const roleBalance = Math.min((uniqueRoleCategories.size / 4) * 100, 100);

  // Innovation potential (diversity of skills)
  const frontendCount = team.filter(u => u.skills.technical.some(s => ["React", "Vue.js", "Angular"].includes(s))).length;
  const mlCount = team.filter(u => u.skills.technical.some(s => ["TensorFlow", "PyTorch", "Python"].includes(s))).length;
  const backendCount = team.filter(u => u.skills.technical.some(s => ["Node.js", "Go", "Rust", "Django"].includes(s))).length;
  
  const diversityScore = Math.min(((frontendCount > 0 ? 1 : 0) + (mlCount > 0 ? 1 : 0) + (backendCount > 0 ? 1 : 0)) / 3 * 100, 100);
  const innovationPotential = (diversityScore + skillCoverage) / 2;

  const avgContributions = team.reduce((sum, u) => sum + u.github.contributions, 0) / team.length;
  const communicationScore = Math.min((avgContributions / 1000) * 100, 100);

  const overallScore = (skillCoverage * 0.3 + roleBalance * 0.25 + innovationPotential * 0.25 + communicationScore * 0.2);

  // Win probability based on team strength
  const avgHackathonsWon = team.reduce((sum, u) => sum + (u.hackathonsWon || 0), 0) / team.length;
  const winProbability = Math.min(
    (overallScore * 0.5 + Math.min(avgHackathonsWon / 5, 1) * 50),
    95
  );

  // Identify strengths
  const strengths: string[] = [];
  if (skillCoverage > 70) strengths.push("Diverse Skill Set");
  if (roleBalance > 70) strengths.push("Balanced Team Roles");
  if (communicationScore > 60) strengths.push("High GitHub Activity");
  if (mlCount > 0) strengths.push("AI/ML Capabilities");
  if (frontendCount > 0 && backendCount > 0) strengths.push("Full-Stack Coverage");

  const weaknesses: string[] = [];
  if (skillCoverage < 40) weaknesses.push("Limited Skill Diversity");
  if (roleBalance < 40) weaknesses.push("Unbalanced Role Distribution");
  if (communicationScore < 30) weaknesses.push("Low GitHub Activity");
  if (mlCount === 0) weaknesses.push("Missing ML/AI Skills");
  if (team.length < 3) weaknesses.push("Small Team Size");

  const insights: string[] = [
    overallScore > 75 ? "🔥 This team has exceptional synergy for hackathon success!" : "💡 This team has good potential with some areas to strengthen.",
    frontendCount > 0 && backendCount > 0 ? "✅ Full-stack development capability confirmed." : "⚠️ Consider adding backend/frontend expertise.",
    avgHackathonsWon > 3 ? "🏆 Experienced team with proven track record!" : "📈 Team has room to grow with more experience.",
  ];

  return {
    overallScore: Math.round(overallScore),
    skillCoverage: Math.round(skillCoverage),
    roleBalance: Math.round(roleBalance),
    innovationPotential: Math.round(innovationPotential),
    communicationScore: Math.round(communicationScore),
    winProbability: Math.round(winProbability),
    strengths,
    weaknesses,
    insights,
  };
}

// Gap analysis
export function analyzeSkillGaps(teamSkills: string[], domainSkills: string[]) {
  const missing = domainSkills.filter(skill => !teamSkills.includes(skill));
  const covered = domainSkills.filter(skill => teamSkills.includes(skill));
  const coveragePercentage = (covered.length / domainSkills.length) * 100;

  return {
    missing,
    covered,
    coveragePercentage: Math.round(coveragePercentage),
    criticalGaps: missing.slice(0, Math.ceil(missing.length / 2)),
    niceToHave: missing.slice(Math.ceil(missing.length / 2)),
  };
}

// Readiness score
export function calculateReadiness(completedItems: string[], totalItems: string[]): number {
  return Math.round((completedItems.length / totalItems.length) * 100);
}
