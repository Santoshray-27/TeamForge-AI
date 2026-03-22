import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Github, FlaskConical, Search, TrendingUp, BookOpen,
  ArrowRight, Zap, Star, Activity, Target, Sparkles,
  Heart, Send, Bell, Trophy, MessageCircle, Code, Award
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore } from '../../store/teamStore';
import { mockUsers } from '../../data/mockUsers';
import { ProfileCard } from '../../components/features/ProfileCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { calculateCompatibility } from '../../utils/algorithms';
import { currentUser } from '../../data/mockUsers';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

const quickActions = [
  { icon: Users, label: 'Find Teammates', path: '/team-matching', color: 'from-indigo-500 to-purple-600', desc: 'AI-powered matching', count: '50+ available' },
  { icon: Github, label: 'GitHub Analyzer', path: '/github-analyzer', color: 'from-gray-500 to-slate-700', desc: 'Analyze any profile', count: 'Real API' },
  { icon: FlaskConical, label: 'Team Chemistry', path: '/team-chemistry', color: 'from-purple-500 to-pink-600', desc: 'Predict team success', count: 'Gemini AI' },
  { icon: Search, label: 'Gap Analyzer', path: '/gap-analyzer', color: 'from-cyan-500 to-blue-600', desc: 'Find missing skills', count: '10 domains' },
  { icon: TrendingUp, label: 'Readiness Check', path: '/readiness', color: 'from-green-500 to-emerald-600', desc: 'Domain readiness', count: 'AI Checklist' },
  { icon: BookOpen, label: 'Upskilling', path: '/upskilling', color: 'from-orange-500 to-amber-600', desc: 'AI learning paths', count: 'Personalized' },
];

const radarData = [
  { skill: 'Frontend', value: 85 },
  { skill: 'Backend', value: 65 },
  { skill: 'ML/AI', value: 70 },
  { skill: 'DevOps', value: 45 },
  { skill: 'Design', value: 55 },
  { skill: 'Mobile', value: 40 },
];

const activityData = [
  { week: 'W1', commits: 12, matches: 3 },
  { week: 'W2', commits: 19, matches: 5 },
  { week: 'W3', commits: 8, matches: 2 },
  { week: 'W4', commits: 24, matches: 8 },
  { week: 'W5', commits: 17, matches: 6 },
  { week: 'W6', commits: 32, matches: 11 },
];

const notifications = [
  { icon: Heart, color: 'text-pink-400', message: 'Priya Sharma liked your profile', time: '2m ago' },
  { icon: Send, color: 'text-indigo-400', message: 'New team invite from Arjun Mehta', time: '15m ago' },
  { icon: Star, color: 'text-yellow-400', message: 'Your match score improved to 91%', time: '1h ago' },
  { icon: Bell, color: 'text-green-400', message: 'Smart India Hackathon registrations open', time: '3h ago' },
];

const hackathons = [
  { name: 'Smart India Hackathon 2025', date: 'Feb 15', domain: 'AI/ML', prize: '₹1,00,000', color: 'from-indigo-500 to-purple-600' },
  { name: 'HackMIT 2025', date: 'Mar 5', domain: 'Open', prize: '$15,000', color: 'from-cyan-500 to-blue-600' },
  { name: 'Google Solution Challenge', date: 'Mar 20', domain: 'Social Impact', prize: 'Global Recognition', color: 'from-green-500 to-emerald-600' },
];

export function Dashboard() {
  const { user } = useAuthStore();
  const { currentTeam, favorites } = useTeamStore();

  // Stable matches (no random on every render)
  const topMatches = useMemo(() => {
    return mockUsers.slice(0, 6).map(u => ({
      ...u,
      compatibility: calculateCompatibility(currentUser, u),
    }));
  }, []);

  const stats = [
    { label: 'Profile Score', value: 78, max: 100, icon: Target, color: 'indigo' as const, trend: '+5%' },
    { label: 'GitHub Activity', value: 623, max: 1000, icon: Activity, color: 'green' as const, trend: '+12%' },
    { label: 'Team Matches', value: Math.min(currentTeam.length + 8, 20), max: 20, icon: Users, color: 'purple' as const, trend: '+3' },
    { label: 'Favorites', value: Math.min(favorites.length + 2, 10), max: 10, icon: Heart, color: 'yellow' as const, trend: '+2' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white">
            Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Hacker'} 👋</span>
          </h1>
          <p className="text-gray-400 mt-1">Your hackathon journey continues. You have {topMatches.length} new teammate suggestions!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-300 font-medium">AI Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">Gemini Powered</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-gray-500 text-xs mb-3">{stat.label}</div>
            <ProgressBar value={stat.value} max={stat.max} color={stat.color} size="sm" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-white leading-tight">{action.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{action.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Activity Overview</h2>
              </div>
              <Badge variant="default" size="sm">Last 6 Weeks</Badge>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="matchesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#4b5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4b5563" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="commits" stroke="#6366f1" fill="url(#commitsGrad)" strokeWidth={2} name="Commits" />
                <Area type="monotone" dataKey="matches" stroke="#a855f7" fill="url(#matchesGrad)" strokeWidth={2} name="Matches" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Your Skill Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {radarData.map(item => (
                  <div key={item.skill}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{item.skill}</span>
                      <span className="text-white font-medium">{item.value}%</span>
                    </div>
                    <ProgressBar value={item.value} max={100} size="sm" color="indigo" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Matches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Recommended Teammates</h2>
              </div>
              <Link to="/team-matching" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMatches.slice(0, 4).map((user) => (
                <ProfileCard key={user.id} user={user} compact />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Notifications</h3>
              </div>
              <span className="w-5 h-5 bg-indigo-600 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            </div>
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <n.icon className={`w-4 h-4 ${n.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Hackathons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h3 className="font-bold text-white text-sm">Upcoming Hackathons</h3>
            </div>
            <div className="space-y-3">
              {hackathons.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{h.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" size="sm">{h.domain}</Badge>
                        <span className="text-xs text-gray-500">{h.date}</span>
                      </div>
                    </div>
                    <div className={`text-xs font-bold gradient-text`}>{h.prize}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast.success('Hackathon calendar coming soon! 🗓️')}
              className="w-full mt-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center border border-indigo-500/20 rounded-xl hover:bg-indigo-600/10 transition-all"
            >
              View All Hackathons →
            </button>
          </motion.div>

          {/* HackBot Promo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-5 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">HackBot AI</h3>
              <Badge variant="success" size="sm" dot>Live</Badge>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Get instant hackathon advice, team formation tips, and learning roadmaps from our AI assistant!
            </p>
            <div className="space-y-1.5">
              {['🏆 Winning strategies', '👥 Team formation', '📚 Learning paths'].map(tip => (
                <div key={tip} className="text-xs text-gray-300 flex items-center gap-1.5">
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-indigo-400 text-center">
              👇 Click the chat button below right
            </div>
          </motion.div>

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Profile Completion</h3>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Overall</span>
                <span className="text-white font-bold">78%</span>
              </div>
              <ProgressBar value={78} max={100} color="indigo" size="md" />
            </div>
            <div className="space-y-2">
              {[
                { item: 'Basic Info', done: true },
                { item: 'Skills Added', done: true },
                { item: 'GitHub Connected', done: true },
                { item: 'Profile Photo', done: false },
                { item: 'Portfolio Link', done: false },
              ].map(({ item, done }) => (
                <div key={item} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-600'}`}>
                    {done ? '✓' : '○'}
                  </div>
                  <span className={done ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
