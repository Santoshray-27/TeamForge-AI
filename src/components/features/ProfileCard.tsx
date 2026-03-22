import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Github, Star, GitFork, Heart, UserPlus, Send, Trophy } from 'lucide-react';
import { User } from '../../data/mockUsers';
import { getSkillColor } from '../../data/skills';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useTeamStore } from '../../store/teamStore';

interface ProfileCardProps {
  user: User;
  showCompatibility?: boolean;
  compact?: boolean;
  onInvite?: (user: User) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  showCompatibility = true,
  compact = false,
  onInvite,
}) => {
  const { favorites, toggleFavorite, addToTeam, sentInvites, sendInvite } = useTeamStore();
  const isFavorited = favorites.includes(user.id);
  const isInvited = sentInvites.includes(user.id);

  const handleInvite = () => {
    sendInvite(user.id);
    addToTeam(user);
    onInvite?.(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-default"
    >
      {/* Header gradient */}
      <div className="h-16 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-cyan-600/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2e]/80" />
        {/* Online status */}
        <div className="absolute top-3 right-3">
          {user.isOnline ? (
            <Badge variant="success" dot size="sm">Online</Badge>
          ) : (
            <Badge size="sm">Offline</Badge>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(user.id)}
          className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-xl border-2 border-[#1a1a2e] bg-indigo-900"
            />
            {user.hackathonsWon && user.hackathonsWon > 0 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-3 h-3 text-yellow-900" />
              </div>
            )}
          </div>
          {showCompatibility && user.compatibility !== undefined && (
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">{user.compatibility}%</div>
              <div className="text-xs text-gray-500">Match Score</div>
            </div>
          )}
        </div>

        {/* Name & Info */}
        <div className="mb-3">
          <h3 className="font-bold text-white text-lg leading-tight">{user.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{user.college} · Year {user.year}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{user.bio}</p>

        {/* Skills */}
        {!compact && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {user.skills.technical.slice(0, 4).map(skill => (
                <span
                  key={skill}
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getSkillColor(skill)}`}
                >
                  {skill}
                </span>
              ))}
              {user.skills.technical.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  +{user.skills.technical.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compatibility bar */}
        {showCompatibility && user.compatibility !== undefined && (
          <div className="mb-4">
            <ProgressBar value={user.compatibility} size="sm" color="gradient" />
          </div>
        )}

        {/* GitHub Stats */}
        {!compact && (
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5" />
              <span>{user.github.repos} repos</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>{user.github.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{user.github.contributions} commits</span>
            </div>
          </div>
        )}

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {user.badges.slice(0, 2).map(badge => (
              <Badge key={badge} variant="purple" size="sm">{badge}</Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={isInvited ? 'secondary' : 'gradient'}
            size="sm"
            fullWidth
            icon={isInvited ? <UserPlus className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            onClick={handleInvite}
            disabled={isInvited}
          >
            {isInvited ? 'Invited' : 'Invite'}
          </Button>
          <button
            onClick={() => toggleFavorite(user.id)}
            className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center border transition-colors ${
              isFavorited
                ? 'bg-pink-500/20 border-pink-500/30 text-pink-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
