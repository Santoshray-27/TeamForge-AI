import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Plus, X, Users, Zap, Trophy, TrendingUp,
  CheckCircle, AlertTriangle, Sparkles, Download, Brain
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { mockUsers } from '../../data/mockUsers';
import { currentUser } from '../../data/mockUsers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { analyzeTeamChemistry, type TeamChemistryResult } from '../../services/gemini.service';
import { useTeamStore } from '../../store/teamStore';
import toast from 'react-hot-toast';

export const TeamChemistry: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<typeof mockUsers>([currentUser]);
  const [search, setSearch] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<TeamChemistryResult | null>(null);
  const { currentTeam, addToTeam } = useTeamStore();

  const availableUsers = mockUsers.filter(u => !selectedMembers.find(m => m.id === u.id));
  const filteredAvailable = availableUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.skills.technical.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const addMember = (user: typeof mockUsers[0]) => {
    if (selectedMembers.length >= 6) { toast.error('Maximum 6 team members'); return; }
    setSelectedMembers(prev => [...prev, user]);
    setResult(null);
  };

  const removeMember = (id: string) => {
    if (id === currentUser.id) { toast.error("Can't remove yourself"); return; }
    setSelectedMembers(prev => prev.filter(m => m.id !== id));
    setResult(null);
  };

  const analyze = async () => {
    if (selectedMembers.length < 2) { toast.error('Add at least 2 team members'); return; }
    setAnalyzing(true);
    try {
      const teamData = selectedMembers.map(m => ({
        name: m.name,
        skills: m.skills,
        preferences: m.preferences,
      }));
      const chemResult = await analyzeTeamChemistry(teamData);
      setResult(chemResult);
      toast.success('Team chemistry analyzed! 🧪');
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveTeam = () => {
    selectedMembers.forEach(m => {
      if (!currentTeam.find(t => t.id === m.id)) addToTeam(m);
    });
    toast.success('Team saved! 🎉');
  };

  const allSkills = [...new Set(selectedMembers.flatMap(m => m.skills.technical))];
  const radarData = result ? [
    { skill: 'Technical', value: result.technicalBalance },
    { skill: 'Creative', value: result.creativeScore },
    { skill: 'Leadership', value: result.leadershipScore },
    { skill: 'Collaboration', value: result.collaborationScore },
    { skill: 'Communication', value: result.communicationScore },
    { skill: 'Innovation', value: result.innovationPotential === 'High' ? 90 : result.innovationPotential === 'Medium' ? 65 : 40 },
  ] : [];

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Team <span className="gradient-text">Chemistry</span></h1>
        <p className="text-gray-400 mt-1">Predict win probability and collaboration synergy with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Builder */}
        <div className="lg:col-span-1 space-y-4">
          {/* Current Team */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Your Team ({selectedMembers.length}/6)
            </h3>
            <div className="space-y-2">
              {selectedMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {member.name} {member.id === currentUser.id && <span className="text-indigo-400 text-xs">(You)</span>}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{member.preferences.roles[0]}</div>
                  </div>
                  {member.id !== currentUser.id && (
                    <button onClick={() => removeMember(member.id)}
                      className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <Button onClick={analyze} loading={analyzing} fullWidth
                leftIcon={<FlaskConical className="w-4 h-4" />} variant="gradient">
                Analyze Chemistry
              </Button>
              {result && (
                <Button onClick={saveTeam} fullWidth variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}>
                  Save Team
                </Button>
              )}
            </div>
          </div>

          {/* Add Members */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-green-400" /> Add Members
            </h3>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search developers..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 mb-3"
            />
            <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
              {filteredAvailable.slice(0, 15).map(user => (
                <button key={user.id} onClick={() => addMember(user)}
                  className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors text-left">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.skills.technical.slice(0, 3).join(', ')}</div>
                  </div>
                  <Plus className="w-4 h-4 text-green-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center border border-indigo-500/20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-4" />
              <div className="text-lg font-semibold text-white mb-2">Analyzing Team Chemistry...</div>
              <div className="text-gray-500 text-sm">Gemini AI is evaluating 50+ compatibility factors</div>
            </div>
          )}

          {!result && !analyzing && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <FlaskConical className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Ready to Analyze</h3>
              <p className="text-gray-600 text-sm">Add team members and click "Analyze Chemistry" to get AI predictions</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {allSkills.slice(0, 8).map(s => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">{s}</span>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Win Probability Banner */}
                <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Gemini AI Analysis</div>
                      <div className="text-white font-bold">{result.teamPersonality}</div>
                    </div>
                    <Badge variant="info" className="ml-auto">{result.workingStyle}</Badge>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.aiInsights}</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Overall Score', value: result.overallScore, icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/20', bar: 'indigo' as const },
                    { label: 'Win Probability', value: result.winProbability, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20', bar: 'yellow' as const },
                    { label: 'Collaboration', value: result.collaborationScore, icon: Users, color: 'text-green-400', bg: 'bg-green-500/20', bar: 'green' as const },
                    { label: 'Technical', value: result.technicalBalance, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20', bar: 'cyan' as const },
                    { label: 'Leadership', value: result.leadershipScore, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20', bar: 'purple' as const },
                    { label: 'Communication', value: result.communicationScore, icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/20', bar: 'cyan' as const },
                  ].map(({ label, value, icon: Icon, color, bg, bar }) => (
                    <div key={label} className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                      <div className="text-2xl font-black text-white">{value}%</div>
                      <ProgressBar value={value} color={bar} size="sm" className="mt-2" />
                    </div>
                  ))}
                </div>

                {/* Radar Chart */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Team Profile Radar</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Strength Areas
                    </h3>
                    <div className="space-y-2">
                      {result.strengthAreas.map(s => (
                        <div key={s} className="flex items-center gap-2 text-sm text-gray-300 bg-green-500/10 rounded-lg p-2">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Risk Factors
                    </h3>
                    <div className="space-y-2">
                      {result.riskFactors.map(r => (
                        <div key={r} className="flex items-center gap-2 text-sm text-gray-300 bg-amber-500/10 rounded-lg p-2">
                          <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" /> {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Member Contributions */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4">Member Contributions</h3>
                  <div className="space-y-3">
                    {selectedMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{m.name}</span>
                            <span className="text-xs text-gray-500">{m.preferences.roles[0]}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {m.skills.technical.slice(0, 4).map(s => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-gray-500">Activity</div>
                          <div className="text-sm font-bold text-white">{m.github.contributions.toLocaleString()}</div>
                        </div>
                      </div>
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
