import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Search, Star, GitFork, Users,
  TrendingUp, Zap, AlertCircle, CheckCircle, ExternalLink, RefreshCw,
  Code, Activity, Award, Globe, Calendar
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { analyzeGitHubProfile, type GitHubInsight } from '../../services/gemini.service';
import toast from 'react-hot-toast';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  blog: string | null;
  created_at: string;
  public_gists: number;
}

interface Repo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  description: string | null;
  size: number;
  open_issues_count: number;
}

function getLanguageDistribution(repos: Repo[]) {
  const langMap: Record<string, number> = {};
  repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  return Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }));
}

function getActivityRadar(repos: Repo[], followers: number) {
  const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const forks = repos.reduce((a, r) => a + r.forks_count, 0);
  return [
    { skill: 'Repos', value: Math.min(repos.length * 2, 100) },
    { skill: 'Stars', value: Math.min(stars / 3, 100) },
    { skill: 'Forks', value: Math.min(forks * 5, 100) },
    { skill: 'Followers', value: Math.min(followers / 3, 100) },
    { skill: 'Languages', value: Math.min(Object.keys(getLanguageDistribution(repos)).length * 20, 100) },
    { skill: 'Activity', value: Math.min(repos.filter(r => {
      const d = new Date(r.updated_at);
      return Date.now() - d.getTime() < 90 * 24 * 60 * 60 * 1000;
    }).length * 10, 100) },
  ];
}

function getTopRepos(repos: Repo[]) {
  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8);
}

const SAMPLE_USERS = ['torvalds', 'gaearon', 'sindresorhus', 'nicedoc', 'bradtraversy'];

export const GitHubAnalyzer: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [langData, setLangData] = useState<{ name: string; value: number }[]>([]);
  const [radarData, setRadarData] = useState<{ skill: string; value: number }[]>([]);
  const [topRepos, setTopRepos] = useState<Repo[]>([]);
  const [estimatedContrib, setEstimatedContrib] = useState(0);
  const [aiInsight, setAiInsight] = useState<GitHubInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (uname?: string) => {
    const name = uname || username.trim();
    if (!name) { toast.error('Enter a GitHub username'); return; }
    setLoading(true); setError(''); setUserData(null); setAiInsight(null);

    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
      if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${name}`, { headers }),
        fetch(`https://api.github.com/users/${name}/repos?per_page=100&sort=updated`, { headers }),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('GitHub user not found');
        if (userRes.status === 403) throw new Error('API rate limit. Try again in 1 minute.');
        throw new Error('Failed to fetch GitHub data');
      }

      const user: GitHubUser = await userRes.json();
      const repoList: Repo[] = reposRes.ok ? await reposRes.json() : [];

      setUserData(user);
      setRepos(repoList);
      setLangData(getLanguageDistribution(repoList));
      setRadarData(getActivityRadar(repoList, user.followers));
      setTopRepos(getTopRepos(repoList));

      const contrib = Math.floor(
        repoList.reduce((a, r) => a + r.stargazers_count * 5 + r.forks_count * 3, 0) +
        user.followers * 2 + user.public_repos * 10
      );
      setEstimatedContrib(Math.min(contrib, 5000));

      // AI Analysis
      setAiLoading(true);
      const langs = getLanguageDistribution(repoList).map(l => l.name);
      analyzeGitHubProfile(name, user.public_repos, repoList.reduce((a, r) => a + r.stargazers_count, 0), contrib, langs, user.followers)
        .then(insight => { setAiInsight(insight); setAiLoading(false); })
        .catch(() => setAiLoading(false));

      toast.success(`Profile analyzed! 🔍`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);

  const readinessColor = aiInsight?.hackathonReadiness === 'Ready'
    ? 'text-green-400' : aiInsight?.hackathonReadiness === 'Almost Ready'
    ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">
          🐙 GitHub <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="text-gray-400 mt-1">Deep dive into any GitHub profile with AI-powered insights</p>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <Button
            onClick={() => analyze()}
            loading={loading}
            size="lg"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Analyze Profile
          </Button>
        </div>

        {/* Sample Users */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-gray-500">Try:</span>
          {SAMPLE_USERS.map(u => (
            <button
              key={u}
              onClick={() => { setUsername(u); analyze(u); }}
              className="text-xs px-3 py-1.5 bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 rounded-lg text-gray-400 hover:text-indigo-300 transition-all"
            >
              @{u}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">✕</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="skeleton h-6 w-3/4 mb-4" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {userData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="relative">
                  <img
                    src={userData.avatar_url}
                    alt={userData.login}
                    className="w-24 h-24 rounded-2xl border-2 border-indigo-500/30"
                  />
                  {aiInsight && (
                    <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold ${readinessColor} bg-[#0a0a0f] border border-current`}>
                      {aiInsight.hackathonReadiness}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black text-white">{userData.name || userData.login}</h2>
                    <span className="text-gray-500">@{userData.login}</span>
                    <a
                      href={userData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  </div>
                  {userData.bio && <p className="text-gray-300 text-sm mt-2 max-w-xl">{userData.bio}</p>}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {userData.location && (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Globe className="w-3.5 h-3.5" /> {userData.location}
                      </span>
                    )}
                    {userData.blog && (
                      <a
                        href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-indigo-400 text-xs hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {userData.blog}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {new Date(userData.created_at).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Stat Pills */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Repos', value: userData.public_repos, icon: Code, color: 'text-indigo-400' },
                    { label: 'Followers', value: userData.followers, icon: Users, color: 'text-purple-400' },
                    { label: 'Total Stars', value: totalStars, icon: Star, color: 'text-yellow-400' },
                    { label: 'Total Forks', value: totalForks, icon: GitFork, color: 'text-cyan-400' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                      <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                      <div className="text-lg font-black text-white">{stat.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insight Banner */}
            <AnimatePresence>
              {aiInsight && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-5 border border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-white text-sm">AI Profile Analysis</span>
                        <Badge variant="purple" size="sm">Gemini AI</Badge>
                        <Badge
                          variant={aiInsight.hackathonReadiness === 'Ready' ? 'success' : aiInsight.hackathonReadiness === 'Almost Ready' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {aiInsight.hackathonReadiness}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{aiInsight.aiSummary}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-green-400 font-medium mb-1">💪 Strengths</div>
                          {aiInsight.topStrengths.map(s => (
                            <div key={s} className="flex items-center gap-1.5 text-xs text-gray-300 mb-0.5">
                              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs text-amber-400 font-medium mb-1">📈 Improve</div>
                          {aiInsight.improvementAreas.map(a => (
                            <div key={a} className="flex items-center gap-1.5 text-xs text-gray-300 mb-0.5">
                              <TrendingUp className="w-3 h-3 text-amber-400 flex-shrink-0" /> {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="text-3xl font-black gradient-text">{aiInsight.profileStrength}</div>
                      <div className="text-xs text-gray-500">Profile Score</div>
                    </div>
                  </div>
                </motion.div>
              )}
              {aiLoading && (
                <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center animate-pulse">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Gemini AI analyzing profile...</div>
                    <div className="text-xs text-gray-500 mt-0.5">Getting deep insights about this developer</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Breakdown */}
              {langData.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-white">Language Breakdown</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={160}>
                      <PieChart>
                        <Pie data={langData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {langData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '12px' }}
                          formatter={(val) => [`${val}%`, 'Usage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {langData.map((lang, i) => (
                        <div key={lang.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                              <span className="text-gray-300">{lang.name}</span>
                            </div>
                            <span className="text-white font-medium">{lang.value}%</span>
                          </div>
                          <ProgressBar value={lang.value} max={100} size="sm" color="indigo" animate={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Radar */}
              {radarData.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white">Activity Profile</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="55%" height={180}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {radarData.map(item => (
                        <div key={item.skill}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-400">{item.skill}</span>
                            <span className="text-white font-medium">{Math.round(item.value)}%</span>
                          </div>
                          <ProgressBar value={item.value} max={100} size="sm" color="purple" animate={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collaboration Style & Stats */}
            {aiInsight && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Collaboration Style', value: aiInsight.collaborationStyle, icon: Users, color: 'text-indigo-400' },
                  { label: 'Project Complexity', value: aiInsight.projectComplexity, icon: Code, color: 'text-purple-400' },
                  { label: 'Code Consistency', value: aiInsight.codeConsistency, icon: Activity, color: 'text-cyan-400' },
                  { label: 'Est. Contributions', value: estimatedContrib.toLocaleString(), icon: TrendingUp, color: 'text-green-400' },
                ].map(item => (
                  <div key={item.label} className="glass-card rounded-xl p-4 text-center">
                    <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
                    <div className="text-sm font-bold text-white">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Top Repositories */}
            {topRepos.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-white">Top Repositories</h3>
                  <Badge variant="default" size="sm">{repos.length} total</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topRepos.map(repo => (
                    <a
                      key={repo.name}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/8 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-semibold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                          {repo.name}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                      </div>
                      {repo.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        {repo.language && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="w-3 h-3" /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-cyan-400">
                          <GitFork className="w-3 h-3" /> {repo.forks_count}
                        </span>
                        <span className="text-xs text-gray-600 ml-auto">
                          {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Star Distribution Bar Chart */}
            {topRepos.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-white">Repository Stars Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topRepos.slice(0, 6)} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(0, 12)} />
                    <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}
                      formatter={(v) => [v, '⭐ Stars']}
                    />
                    <Bar dataKey="stargazers_count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Re-analyze */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => analyze()}
                loading={loading || aiLoading}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Re-analyze Profile
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!userData && !loading && !error && (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Github className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">Analyze Any GitHub Profile</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Enter any GitHub username to get deep insights about their coding style, project complexity, and hackathon readiness — powered by Gemini AI.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {SAMPLE_USERS.map(u => (
              <button
                key={u}
                onClick={() => { setUsername(u); analyze(u); }}
                className="px-4 py-2 bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/30 rounded-xl text-sm text-gray-400 hover:text-indigo-300 transition-all"
              >
                @{u}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


