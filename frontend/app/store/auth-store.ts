import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '~/types';
import { mockCurrentUser, mockOrganizerUser } from '~/data/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  switchRole: (role: 'customer' | 'organizer') => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'organizer';
  referralCode?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock login - check if organizer email
        const isOrganizer = email.includes('organizer');
        const user = isOrganizer ? mockOrganizerUser : mockCurrentUser;
        
        set({ 
          user: { ...user, email },
          isAuthenticated: true,
          isLoading: false 
        });
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: data.role,
          referralCode: data.name.toUpperCase().slice(0, 4) + Math.random().toString(36).slice(2, 6).toUpperCase(),
          points: data.referralCode ? 10000 : 0, // Bonus points if used referral
          createdAt: new Date().toISOString(),
        };
        
        set({ 
          user: newUser,
          isAuthenticated: true,
          isLoading: false 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }));
      },

      switchRole: (role: 'customer' | 'organizer') => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
