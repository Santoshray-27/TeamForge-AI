import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, CheckCircle, AlertCircle, XCircle, Zap, Clock,
  TrendingUp, Users, ChevronDown, Sparkles, BarChart3
} from 'lucide-react';
import { mockUsers, currentUser } from '../../data/mockUsers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { analyzeReadiness, type ReadinessResult } from '../../services/gemini.service';
import toast from 'react-hot-toast';

const DOMAINS = [
  { id: 'aiml', label: 'AI / Machine Learning', icon: '🤖', desc: 'Deep learning, NLP, Computer Vision' },
  { id: 'web3', label: 'Web3 / Blockchain', icon: '🔗', desc: 'DeFi, NFTs, Smart Contracts' },
  { id: 'fintech', label: 'FinTech', icon: '💳', desc: 'Payments, Banking, Trading Systems' },
  { id: 'healthtech', label: 'HealthTech', icon: '🏥', desc: 'Medical AI, Telemedicine, FHIR' },
  { id: 'edtech', label: 'EdTech', icon: '📚', desc: 'Learning Platforms, AI Tutors' },
  { id: 'climate', label: 'Climate Tech', icon: '🌱', desc: 'Carbon Tracking, Clean Energy' },
  { id: 'social', label: 'Social Impact', icon: '🌍', desc: 'NGO Tech, Accessibility, Rural' },
  { id: 'iot', label: 'IoT / Hardware', icon: '🔌', desc: 'Arduino, RasPi, Embedded Systems' },
  { id: 'arvr', label: 'AR / VR / XR', icon: '🥽', desc: 'Unity, WebXR, Spatial Computing' },
  { id: 'gaming', label: 'Gaming / Metaverse', icon: '🎮', desc: 'Game Dev, Play-to-Earn, Esports' },
];

const statusConfig = {
  complete: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', badge: 'success' as const },
  partial: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', badge: 'warning' as const },
  missing: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', badge: 'danger' as const },
};

const importanceConfig = {
  critical: { label: 'Critical', variant: 'danger' as const },
  important: { label: 'Important', variant: 'warning' as const },
  optional: { label: 'Optional', variant: 'default' as const },
};

export const ReadinessAnalyzer: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [teamMembers, setTeamMembers] = useState([currentUser]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [searchUser, setSearchUser] = useState('');

  const allTeamSkills = [...new Set(teamMembers.flatMap(m => [...m.skills.technical, ...m.skills.tools]))];
  const availableUsers = mockUsers.filter(u => !teamMembers.find(m => m.id === u.id));
  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.skills.technical.some(s => s.toLowerCase().includes(searchUser.toLowerCase()))
  ).slice(0, 8);

  const addMember = (user: typeof mockUsers[0]) => {
    if (teamMembers.length >= 6) { toast.error('Maximum 6 members'); return; }
    setTeamMembers(prev => [...prev, user]);
    setResult(null);
  };

  const analyze = async () => {
    if (!selectedDomain) { toast.error('Please select a domain'); return; }
    setAnalyzing(true);
    try {
      const domainLabel = DOMAINS.find(d => d.id === selectedDomain)?.label || selectedDomain;
      const res = await analyzeReadiness(allTeamSkills, domainLabel, teamMembers.length);
      setResult(res);
      toast.success('Readiness analysis complete! 🎯');
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const completedItems = result?.checklist.filter(c => c.status === 'complete').length || 0;
  const partialItems = result?.checklist.filter(c => c.status === 'partial').length || 0;
  const missingItems = result?.checklist.filter(c => c.status === 'missing').length || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBar = (score: number): 'green' | 'yellow' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Readiness <span className="gradient-text">Analyzer</span></h1>
        <p className="text-gray-400 mt-1">Evaluate your team's readiness for specific hackathon domains</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config */}
        <div className="space-y-4">
          {/* Domain Selector */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Select Domain
            </h3>
            <div className="space-y-2">
              {DOMAINS.map(domain => (
                <button key={domain.id} onClick={() => { setSelectedDomain(domain.id); setResult(null); }}
                  className={`flex items-start gap-3 w-full p-3 rounded-xl border text-left transition-all ${
                    selectedDomain === domain.id
                      ? 'bg-indigo-600/20 border-indigo-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}>
                  <span className="text-xl flex-shrink-0">{domain.icon}</span>
                  <div>
                    <div className={`text-sm font-medium ${selectedDomain === domain.id ? 'text-white' : 'text-gray-300'}`}>
                      {domain.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{domain.desc}</div>
                  </div>
                  {selectedDomain === domain.id && <CheckCircle className="w-4 h-4 text-indigo-400 ml-auto flex-shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" /> Team ({teamMembers.length})
            </h3>
            <div className="space-y-2 mb-3">
              {teamMembers.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                  <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-white flex-1 truncate">{m.name}</span>
                  {m.id !== currentUser.id && (
                    <button onClick={() => setTeamMembers(prev => prev.filter(t => t.id !== m.id))}
                      className="text-gray-600 hover:text-red-400 text-xs transition-colors">✕</button>
                  )}
                </div>
              ))}
            </div>
            <input value={searchUser} onChange={e => setSearchUser(e.target.value)}
              placeholder="Add team member..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 mb-2" />
            <div className="space-y-1 max-h-32 overflow-y-auto hide-scrollbar">
              {filteredUsers.map(u => (
                <button key={u.id} onClick={() => addMember(u)}
                  className="flex items-center gap-2 w-full bg-white/5 hover:bg-white/10 rounded-lg p-2 text-left transition-colors">
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                  <span className="text-xs text-gray-300 flex-1 truncate">{u.name}</span>
                  <ChevronDown className="w-3 h-3 text-green-400 -rotate-90" />
                </button>
              ))}
            </div>
            <Button onClick={analyze} loading={analyzing} fullWidth variant="gradient"
              leftIcon={<Target className="w-4 h-4" />} className="mt-4">
              Analyze Readiness
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center border border-indigo-500/20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-4" />
              <div className="text-lg font-semibold text-white mb-2">Evaluating Readiness...</div>
              <div className="text-gray-500 text-sm">AI is checking 20+ domain-specific requirements</div>
            </div>
          )}

          {!result && !analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Domain</h3>
              <p className="text-gray-600 text-sm">Choose a hackathon domain and click Analyze to see your readiness</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Score Overview */}
                <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-purple-950/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-indigo-400 font-semibold">Overall Readiness</div>
                      <div className={`text-5xl font-black mt-1 ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Est. prep time: {result.estimatedPrepTime}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-green-500/20 rounded-xl p-3">
                        <div className="text-xl font-bold text-green-400">{completedItems}</div>
                        <div className="text-xs text-gray-500">Done</div>
                      </div>
                      <div className="bg-amber-500/20 rounded-xl p-3">
                        <div className="text-xl font-bold text-amber-400">{partialItems}</div>
                        <div className="text-xs text-gray-500">Partial</div>
                      </div>
                      <div className="bg-red-500/20 rounded-xl p-3">
                        <div className="text-xl font-bold text-red-400">{missingItems}</div>
                        <div className="text-xs text-gray-500">Missing</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Domain Match', value: result.domainScore, bar: getScoreBar(result.domainScore) },
                      { label: 'Technical', value: result.technicalScore, bar: getScoreBar(result.technicalScore) },
                      { label: 'Team', value: result.teamScore, bar: getScoreBar(result.teamScore) },
                    ].map(({ label, value, bar }) => (
                      <div key={label} className="bg-white/5 rounded-xl p-3">
                        <div className={`text-lg font-bold ${getScoreColor(value)}`}>{value}%</div>
                        <ProgressBar value={value} color={bar} size="sm" className="mt-1" />
                        <div className="text-xs text-gray-500 mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300 leading-relaxed">{result.aiAdvice}</p>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                    Domain Readiness Checklist
                    <span className="text-xs text-gray-500 ml-auto">{completedItems}/{result.checklist.length} complete</span>
                  </h3>
                  <div className="space-y-2">
                    {result.checklist.map((item, i) => {
                      const { icon: Icon, color, bg, badge } = statusConfig[item.status];
                      const { label: impLabel, variant: impVariant } = importanceConfig[item.importance];
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-center gap-3 p-3 rounded-xl border ${bg}`}>
                          <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                          <span className="text-sm text-gray-300 flex-1">{item.item}</span>
                          <Badge variant={badge} size="sm">{item.status}</Badge>
                          <Badge variant={impVariant} size="sm">{impLabel}</Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Items */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" /> Action Items to Improve
                  </h3>
                  <div className="space-y-2">
                    {result.actionItems.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-indigo-400 font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm text-gray-300">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Skills */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" /> Team Skill Coverage
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTeamSkills.map(skill => (
                      <span key={skill} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
