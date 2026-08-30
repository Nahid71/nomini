import { create } from 'zustand';
import { User, Role } from '@/types';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  initAuth: () => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; fullName: string; role?: Role; department?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isStaff: () => boolean;
  isAdmin: () => boolean;
}

function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return ''; // Relative path in browser
  }
  return process.env.BACKEND_INTERNAL_URL || 'http://backend:4000';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('nomini_token');
      const savedUserStr = localStorage.getItem('nomini_user');
      if (savedToken && savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          set({ currentUser: user, token: savedToken, isInitialized: true });
          return;
        } catch {
          localStorage.removeItem('nomini_token');
          localStorage.removeItem('nomini_user');
        }
      }
    }
    set({ isInitialized: true });
  },

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nomini_token', token);
      localStorage.setItem('nomini_user', JSON.stringify(user));
    }
    set({ currentUser: user, token });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nomini_token');
      localStorage.removeItem('nomini_user');
    }
    set({ currentUser: null, token: null });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${getApiBase()}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Invalid email or password' };
      }

      get().setAuth(data.user, data.accessToken);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to authentication server' };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${getApiBase()}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      get().setAuth(data.user, data.accessToken);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to authentication server' };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    get().clearAuth();
  },

  isStaff: () => {
    const role = get().currentUser?.role;
    return role === 'ADMIN' || role === 'EMPLOYEE' || role === 'FARM_OPERATOR';
  },

  isAdmin: () => {
    return get().currentUser?.role === 'ADMIN';
  },
}));

