import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../data/mockUsers';

interface TeamState {
  currentTeam: User[];
  favorites: string[];
  sentInvites: string[];
  selectedDomain: string;
  addToTeam: (user: User) => void;
  removeFromTeam: (userId: string) => void;
  toggleFavorite: (userId: string) => void;
  sendInvite: (userId: string) => void;
  setDomain: (domain: string) => void;
  clearTeam: () => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      currentTeam: [],
      favorites: [],
      sentInvites: [],
      selectedDomain: 'ai-ml',

      addToTeam: (user) =>
        set(state => ({
          currentTeam: state.currentTeam.find(u => u.id === user.id)
            ? state.currentTeam
            : [...state.currentTeam, user],
        })),

      removeFromTeam: (userId) =>
        set(state => ({
          currentTeam: state.currentTeam.filter(u => u.id !== userId),
        })),

      toggleFavorite: (userId) =>
        set(state => ({
          favorites: state.favorites.includes(userId)
            ? state.favorites.filter(id => id !== userId)
            : [...state.favorites, userId],
        })),

      sendInvite: (userId) =>
        set(state => ({
          sentInvites: [...state.sentInvites, userId],
        })),

      setDomain: (domain) => set({ selectedDomain: domain }),

      clearTeam: () => set({ currentTeam: [] }),
    }),
    {
      name: 'team-storage',
    }
  )
);
