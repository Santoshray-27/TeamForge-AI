import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, SlidersHorizontal, Users, X,
  Sparkles, RefreshCw
} from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { technicalSkills, roles } from '../../data/skills';
import { ProfileCard } from '../../components/features/ProfileCard';
import { Button } from '../../components/ui/Button';
import { useTeamStore } from '../../store/teamStore';
import { calculateCompatibility } from '../../utils/algorithms';
import { currentUser } from '../../data/mockUsers';
import toast from 'react-hot-toast';

type SortOption = 'compatibility' | 'activity' | 'experience';

const availabilityOptions = ['Full-time', 'Part-time', 'Weekends'];
const hackathonTypes = ['AI/ML', 'Web3', 'FinTech', 'HealthTech', 'EdTech', 'Gaming', 'Mobile', 'Cloud'];

export function TeamMatching() {
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedHackathonTypes, setSelectedHackathonTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('compatibility');
  const [showFilters, setShowFilters] = useState(false);
  const [minCompatibility, setMinCompatibility] = useState(0);
  const { } = useTeamStore();

  const filteredUsers = useMemo(() => {
    let users = mockUsers.map(u => ({
      ...u,
      compatibility: calculateCompatibility(currentUser, u),
    }));

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.college.toLowerCase().includes(q) ||
        u.skills.technical.some(s => s.toLowerCase().includes(q)) ||
        u.location.toLowerCase().includes(q)
      );
    }

    if (selectedSkills.length > 0) {
      users = users.filter(u =>
        selectedSkills.some(skill => u.skills.technical.includes(skill))
      );
    }

    if (selectedRoles.length > 0) {
      users = users.filter(u =>
        selectedRoles.some(role => u.preferences.roles.includes(role))
      );
    }

    if (selectedAvailability) {
      users = users.filter(u => u.preferences.availability === selectedAvailability);
    }

    if (selectedHackathonTypes.length > 0) {
      users = users.filter(u =>
        selectedHackathonTypes.some(t => u.preferences.hackathonTypes.includes(t))
      );
    }

    if (minCompatibility > 0) {
      users = users.filter(u => (u.compatibility || 0) >= minCompatibility);
    }

    users.sort((a, b) => {
      if (sortBy === 'compatibility') return (b.compatibility || 0) - (a.compatibility || 0);
      if (sortBy === 'activity') return b.github.contributions - a.github.contributions;
      if (sortBy === 'experience') return (b.hackathonsWon || 0) - (a.hackathonsWon || 0);
      return 0;
    });

    return users;
  }, [search, selectedSkills, selectedRoles, selectedAvailability, selectedHackathonTypes, sortBy, minCompatibility]);

  const toggleSkill = (skill: string) =>
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);

  const toggleRole = (role: string) =>
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);

  const toggleHackathonType = (type: string) =>
    setSelectedHackathonTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedRoles([]);
    setSelectedAvailability('');
    setSelectedHackathonTypes([]);
    setMinCompatibility(0);
    setSearch('');
    toast.success('Filters cleared');
  };

  const activeFilterCount = selectedSkills.length + selectedRoles.length +
    (selectedAvailability ? 1 : 0) + selectedHackathonTypes.length +
    (minCompatibility > 0 ? 1 : 0);

  const highMatches = filteredUsers.filter(u => (u.compatibility || 0) >= 80).length;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            🧠 AI Team <span className="gradient-text">Matching</span>
          </h1>
          <p className="text-gray-400 mt-1">
            {filteredUsers.length} developers found • {highMatches} with 80%+ compatibility
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {(['compatibility', 'activity', 'experience'] as SortOption[]).map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  sortBy === opt ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, skill, college, or location..."
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 space-y-5 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                Advanced Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-sm transition-colors">
                  <X className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Technical Skills</label>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.slice(0, 20).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all skill-tag ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-indigo-500/50 hover:text-white'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Roles</label>
              <div className="flex flex-wrap gap-2">
                {roles.slice(0, 10).map(role => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedRoles.includes(role)
                        ? 'bg-purple-600 text-white border border-purple-500'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability + Hackathon Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedAvailability(prev => prev === opt ? '' : opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedAvailability === opt
                          ? 'bg-green-600 text-white border border-green-500'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Hackathon Types</label>
                <div className="flex flex-wrap gap-2">
                  {hackathonTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleHackathonType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedHackathonTypes.includes(type)
                          ? 'bg-cyan-600 text-white border border-cyan-500'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Min Compatibility */}
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">
                Minimum Compatibility: <span className="text-indigo-400 font-bold">{minCompatibility}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minCompatibility}
                onChange={e => setMinCompatibility(Number(e.target.value))}
                className="w-full max-w-xs"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestion Banner */}
      {filteredUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 px-5 rounded-xl bg-indigo-600/10 border border-indigo-500/20"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <p className="text-indigo-300 text-sm">
            <span className="font-semibold">AI Insight:</span> Based on your profile, we recommend focusing on
            <span className="text-white font-semibold"> ML Engineers</span> and
            <span className="text-white font-semibold"> Backend Developers</span> to complement your skills.
          </p>
        </motion.div>
      )}

      {/* Results */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No matches found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
          <Button onClick={clearFilters} variant="secondary" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <ProfileCard
                  user={user}
                  showCompatibility
                  onInvite={(u) => toast.success(`Invite sent to ${u.name}! 🎉`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom stats */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
          <div className="text-center">
            <div className="text-2xl font-black gradient-text">{filteredUsers.length}</div>
            <div className="text-gray-500 text-xs">Total Matches</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-green-400">{highMatches}</div>
            <div className="text-gray-500 text-xs">High Compatibility</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-yellow-400">
              {filteredUsers.filter(u => u.isOnline).length}
            </div>
            <div className="text-gray-500 text-xs">Online Now</div>
          </div>
        </div>
      )}
    </div>
  );
}
