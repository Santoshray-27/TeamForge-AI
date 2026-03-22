import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, FileText, Code, Zap, Clock,
  ChevronRight, ExternalLink, CheckCircle, Star, Sparkles, TrendingUp, Award
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { generateLearningPath, type LearningPath } from '../../services/gemini.service';
import { currentUser } from '../../data/mockUsers';
import toast from 'react-hot-toast';

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full-stack Developer',
  'ML Engineer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer',
  'Blockchain Developer', 'UI/UX Designer', 'Security Engineer',
  'NLP Engineer', 'Computer Vision Engineer', 'Cloud Architect', 'Game Developer'
];

const DOMAINS = [
  'AI / Machine Learning', 'Web3 / Blockchain', 'FinTech', 'HealthTech',
  'EdTech', 'Climate Tech', 'Social Impact', 'IoT', 'AR/VR', 'Gaming'
];

const TIME_OPTIONS = [
  '1 week', '2 weeks', '1 month', '3 months', '6 months'
];

const resourceIcons = {
  video: { icon: Play, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Video' },
  article: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Article' },
  course: { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Course' },
  project: { icon: Code, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Project' },
};

const difficultyBadge = {
  beginner: 'success' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

export const Upskilling: React.FC = () => {
  const [targetRole, setTargetRole] = useState('');
  const [domain, setDomain] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('2 weeks');
  const [generating, setGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  const generatePath = async () => {
    if (!targetRole) { toast.error('Please select a target role'); return; }
    if (!domain) { toast.error('Please select a hackathon domain'); return; }
    setGenerating(true);
    try {
      const path = await generateLearningPath(
        currentUser.skills.technical, targetRole, domain, timeAvailable
      );
      setLearningPath(path);
      setActiveSkill(0);
      toast.success('Learning path generated! 📚');
    } catch {
      toast.error('Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleResource = (key: string) => {
    setCompletedResources(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalResources = learningPath?.shortTerm.reduce((a, s) => a + s.resources.length, 0) || 0;
  const completedCount = completedResources.size;
  const progressPercent = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Personalized <span className="gradient-text">Upskilling</span></h1>
        <p className="text-gray-400 mt-1">AI-generated learning roadmaps tailored to your role and hackathon domain</p>
      </div>

      {/* Config Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Target Role */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Target Role</label>
            <div className="relative">
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-8 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                <option value="" className="bg-gray-900">Select a role...</option>
                {ROLES.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Domain */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Hackathon Domain</label>
            <div className="relative">
              <select value={domain} onChange={e => setDomain(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-8 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                <option value="" className="bg-gray-900">Select domain...</option>
                {DOMAINS.map(d => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Time Available</label>
            <div className="relative">
              <select value={timeAvailable} onChange={e => setTimeAvailable(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-8 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Generate */}
          <div className="flex flex-col justify-end">
            <Button onClick={generatePath} loading={generating} fullWidth variant="gradient"
              leftIcon={<Sparkles className="w-4 h-4" />}>
              Generate Path
            </Button>
          </div>
        </div>

        {/* Current Skills */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Current Skills</div>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills.technical.map(s => (
              <span key={s} className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">✓ {s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {generating && (
        <div className="glass-card rounded-2xl p-12 text-center border border-indigo-500/20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-4" />
          <div className="text-lg font-semibold text-white mb-2">Creating Your Learning Path...</div>
          <div className="text-gray-500 text-sm">Gemini AI is tailoring resources for your journey</div>
        </div>
      )}

      {!learningPath && !generating && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Your AI Learning Path Awaits</h3>
          <p className="text-gray-600 text-sm">Select your target role and domain to get a personalized learning roadmap</p>
        </div>
      )}

      <AnimatePresence>
        {learningPath && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Progress & Motivation */}
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-purple-950/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Learning Path for</div>
                  <div className="text-2xl font-black text-white mt-1">{learningPath.targetRole}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    <Clock className="w-3 h-3 inline mr-1" /> {learningPath.totalEstimatedTime} total
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-400">{progressPercent}%</div>
                  <div className="text-xs text-gray-500">{completedCount}/{totalResources} done</div>
                </div>
              </div>
              <ProgressBar value={progressPercent} color="indigo" />
              <div className="mt-4 bg-white/5 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 italic">{learningPath.aiMotivation}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Short Term Skills List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-indigo-400" /> Learning Modules
                </h3>
                {learningPath.shortTerm.map((item, i) => (
                  <button key={i} onClick={() => setActiveSkill(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      activeSkill === i
                        ? 'bg-indigo-600/20 border-indigo-500/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.skill}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.estimatedTime}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'} size="sm">
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.resources.length} resources</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={Math.round(item.resources.filter((_, ri) => completedResources.has(`${i}-${ri}`)).length / item.resources.length * 100)}
                      color="indigo" size="sm" className="mt-2" />
                  </button>
                ))}

                {/* Long Term */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" /> Long-term Goals
                  </h3>
                  {learningPath.longTerm.map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 mb-2">
                      <div className="text-sm font-medium text-gray-300">{item.skill}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      <div className="text-xs text-indigo-400 mt-1"><Clock className="w-3 h-3 inline mr-1" />{item.estimatedTime}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Panel */}
              <div className="lg:col-span-2">
                {activeSkill !== null && learningPath.shortTerm[activeSkill] && (
                  <motion.div key={activeSkill} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="glass-card rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">{learningPath.shortTerm[activeSkill].skill}</h3>
                        <Badge variant={learningPath.shortTerm[activeSkill].priority === 'high' ? 'danger' : 'warning'}>
                          {learningPath.shortTerm[activeSkill].priority} priority
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{learningPath.shortTerm[activeSkill].description}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span><Clock className="w-3 h-3 inline mr-1" />{learningPath.shortTerm[activeSkill].estimatedTime}</span>
                        <span>•</span>
                        <span>{learningPath.shortTerm[activeSkill].resources.length} learning resources</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {learningPath.shortTerm[activeSkill].resources.map((resource, ri) => {
                        const resourceKey = `${activeSkill}-${ri}`;
                        const isCompleted = completedResources.has(resourceKey);
                        const { icon: RIcon, color, bg, label } = resourceIcons[resource.type] || resourceIcons.article;
                        return (
                          <motion.div key={ri} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ri * 0.08 }}
                            className={`glass-card rounded-xl p-4 border transition-all ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                <RIcon className={`w-4 h-4 ${color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="text-sm font-semibold text-white">{resource.title}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="default" size="sm">{label}</Badge>
                                      <Badge variant={difficultyBadge[resource.difficulty]} size="sm">
                                        {resource.difficulty}
                                      </Badge>
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {resource.duration}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <a href={resource.url} target="_blank" rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-colors">
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => toggleResource(resourceKey)}
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        isCompleted
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400'
                                      }`}>
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Practice Projects */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" /> Practice Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningPath.practiceProjects.map((project, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-indigo-400" />
                      </div>
                      <Badge variant={project.difficulty === 'beginner' ? 'success' : project.difficulty === 'intermediate' ? 'warning' : 'danger'} size="sm">
                        {project.difficulty}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-gray-400 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">{s}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
