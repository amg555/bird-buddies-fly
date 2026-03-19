import { create } from 'zustand';

interface AuthStore {
  user: null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
}));