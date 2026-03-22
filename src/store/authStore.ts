import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentUser } from '../data/mockUsers';

interface AuthState {
  user: typeof currentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileComplete: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<typeof currentUser>) => void;
  setProfileComplete: (complete: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      profileComplete: false,

      login: async (credentials) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({
          user: { ...currentUser, name: credentials.email.split('@')[0] },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signup: async (data) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1200));
        set({
          user: { ...currentUser, name: data.name },
          isAuthenticated: true,
          isLoading: false,
          profileComplete: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, profileComplete: false });
      },

      updateProfile: (data) => {
        set(state => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      setProfileComplete: (complete) => {
        set({ profileComplete: complete });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        profileComplete: state.profileComplete,
      }),
    }
  )
);
