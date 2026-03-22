import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, AlertCircle, CheckCircle, Zap, Users, ChevronDown,
  TrendingUp, Target, UserPlus, Sparkles, BarChart3
} from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { currentUser } from '../../data/mockUsers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { analyzeSkillGaps, type GapAnalysisResult } from '../../services/gemini.service';
import { calculateCompatibility } from '../../utils/algorithms';
import { ProfileCard } from '../../components/features/ProfileCard';
import toast from 'react-hot-toast';

const DOMAINS = [
  { id: 'aiml', label: 'AI / Machine Learning', icon: '🤖', color: 'from-indigo-500 to-purple-600' },
  { id: 'web3', label: 'Web3 / Blockchain', icon: '🔗', color: 'from-orange-500 to-amber-600' },
  { id: 'fintech', label: 'FinTech', icon: '💳', color: 'from-green-500 to-emerald-600' },
  { id: 'healthtech', label: 'HealthTech', icon: '🏥', color: 'from-red-500 to-pink-600' },
  { id: 'edtech', label: 'EdTech', icon: '📚', color: 'from-blue-500 to-cyan-600' },
  { id: 'climate', label: 'Climate Tech', icon: '🌱', color: 'from-teal-500 to-green-600' },
  { id: 'social', label: 'Social Impact', icon: '🌍', color: 'from-purple-500 to-pink-600' },
  { id: 'iot', label: 'IoT / Hardware', icon: '🔌', color: 'from-yellow-500 to-orange-600' },
  { id: 'arvr', label: 'AR / VR', icon: '🥽', color: 'from-cyan-500 to-blue-600' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: 'from-pink-500 to-purple-600' },
];

export const GapAnalyzer: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [hackathonTheme, setHackathonTheme] = useState('');
  const [teamMembers, setTeamMembers] = useState([currentUser]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [searchUser, setSearchUser] = useState('');

  const allTeamSkills = [...new Set(teamMembers.flatMap(m => [...m.skills.technical, ...m.skills.tools]))];
  const availableUsers = mockUsers.filter(u => !teamMembers.find(m => m.id === u.id));
  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.skills.technical.some(s => s.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const addMember = (user: typeof mockUsers[0]) => {
    if (teamMembers.length >= 6) { toast.error('Maximum 6 members'); return; }
    setTeamMembers(prev => [...prev, user]);
    setResult(null);
  };

  const removeMember = (id: string) => {
    if (id === currentUser.id) return;
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    setResult(null);
  };

  const analyze = async () => {
    if (!selectedDomain) { toast.error('Please select a hackathon domain'); return; }
    setAnalyzing(true);
    try {
      const domainLabel = DOMAINS.find(d => d.id === selectedDomain)?.label || selectedDomain;
      const res = await analyzeSkillGaps(allTeamSkills, domainLabel, hackathonTheme || domainLabel);
      setResult(res);
      toast.success('Gap analysis complete! 🎯');
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Find best matching users for gaps
  const gapSkills = result ? [...result.criticalGaps.map(g => g.skill), ...result.niceToHave.map(g => g.skill)] : [];
  const recommendedUsers = mockUsers
    .filter(u => !teamMembers.find(m => m.id === u.id))
    .filter(u => gapSkills.some(skill =>
      u.skills.technical.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    ))
    .map(u => ({ ...u, compatibility: calculateCompatibility(currentUser, u) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 6);

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Skill <span className="gradient-text">Gap Analyzer</span></h1>
        <p className="text-gray-400 mt-1">Identify missing skills and find perfect candidates to fill them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="space-y-4">
          {/* Domain Selection */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Hackathon Domain
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {DOMAINS.map(domain => (
                <button key={domain.id} onClick={() => { setSelectedDomain(domain.id); setResult(null); }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedDomain === domain.id
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}>
                  <span className="text-xl">{domain.icon}</span>
                  <span className="text-sm font-medium">{domain.label}</span>
                  {selectedDomain === domain.id && <CheckCircle className="w-4 h-4 text-indigo-400 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Hackathon Theme (Optional)
            </h3>
            <input
              value={hackathonTheme}
              onChange={e => setHackathonTheme(e.target.value)}
              placeholder="e.g. 'Sustainable cities', 'Healthcare AI'"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Team */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" /> Your Team ({teamMembers.length})
            </h3>
            <div className="space-y-2 mb-3">
              {teamMembers.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                  <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-white flex-1 truncate">{m.name}</span>
                  {m.id !== currentUser.id && (
                    <button onClick={() => removeMember(m.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <AlertCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              placeholder="Add team member..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 mb-2"
            />
            <div className="space-y-1 max-h-36 overflow-y-auto hide-scrollbar">
              {filteredUsers.slice(0, 8).map(u => (
                <button key={u.id} onClick={() => addMember(u)}
                  className="flex items-center gap-2 w-full bg-white/5 hover:bg-white/10 rounded-lg p-2 text-left transition-colors">
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-gray-300 flex-1 truncate">{u.name}</span>
                  <ChevronDown className="w-3 h-3 text-green-400 rotate-[-90deg]" />
                </button>
              ))}
            </div>

            <Button onClick={analyze} loading={analyzing} fullWidth variant="gradient"
              leftIcon={<Search className="w-4 h-4" />} className="mt-4">
              Analyze Gaps
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center border border-indigo-500/20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-4" />
              <div className="text-lg font-semibold text-white mb-2">Analyzing Skill Gaps...</div>
              <div className="text-gray-500 text-sm">Gemini AI is evaluating your team against {DOMAINS.find(d => d.id === selectedDomain)?.label} requirements</div>
            </div>
          )}

          {!result && !analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Select Domain & Analyze</h3>
              <p className="text-gray-600 text-sm">Choose your target hackathon domain to identify skill gaps</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Readiness Score */}
                <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-purple-950/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-indigo-400 font-semibold">AI Gap Analysis</div>
                      <div className="text-2xl font-black text-white mt-1">{result.readinessScore}% Ready</div>
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="rgba(99,102,241,0.3)" strokeWidth="4" fill="none" />
                        <circle cx="40" cy="40" r="34" stroke="#6366f1" strokeWidth="4" fill="none"
                          strokeDasharray={`${2 * Math.PI * 34 * result.readinessScore / 100} ${2 * Math.PI * 34}`} strokeLinecap="round" />
                      </svg>
                      <span className="text-lg font-black text-white">{result.readinessScore}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.aiSummary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.recommendedRoles.map(r => (
                      <Badge key={r} variant="info">{r}</Badge>
                    ))}
                  </div>
                </div>

                {/* Critical Gaps */}
                {result.criticalGaps.length > 0 && (
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Critical Skill Gaps
                      <Badge variant="danger" size="sm">{result.criticalGaps.length} missing</Badge>
                    </h3>
                    <div className="space-y-3">
                      {result.criticalGaps.map((gap) => (
                        <div key={gap.skill} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="font-semibold text-white">{gap.skill}</span>
                            </div>
                            <Badge variant="danger" size="sm">Critical</Badge>
                          </div>
                          <p className="text-sm text-gray-400 ml-6">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nice to Have */}
                {result.niceToHave.length > 0 && (
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Nice to Have Skills
                    </h3>
                    <div className="space-y-3">
                      {result.niceToHave.map((gap) => (
                        <div key={gap.skill} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-400" />
                              <span className="font-semibold text-white">{gap.skill}</span>
                            </div>
                            <Badge variant="warning" size="sm">Recommended</Badge>
                          </div>
                          <p className="text-sm text-gray-400 ml-6">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Skills You Have */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Skills You Already Have
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTeamSkills.map(s => (
                      <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Candidates */}
                {recommendedUsers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      Recommended Candidates to Fill Gaps
                      <Badge variant="info" size="sm">{recommendedUsers.length} found</Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendedUsers.map(user => (
                        <ProfileCard key={user.id} user={user} showCompatibility
                          onInvite={(u) => toast.success(`Invite sent to ${u.name}! 🎉`)} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
