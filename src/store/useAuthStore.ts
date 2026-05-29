import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser } from '../api/services/auth';

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,

        login: (user: AuthUser) => {
          set({ user, isLoggedIn: true });
        },

        logout: () => {
          set({ user: null, isLoggedIn: false });
        },
      }),
      {
        name: 'auth',
        partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
      }
    ),
    { name: 'AuthStore' }
  )
);
