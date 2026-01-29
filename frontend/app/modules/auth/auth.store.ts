import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "./auth.service";
import type { LoginSchema, RegisterSchema } from "./auth.schema";
import type { User } from "~/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (payload: LoginSchema) => Promise<void>;
  register: (payload: RegisterSchema) => Promise<void>;
  logout: () => void;
  setAuth: (data: { user: User; token: string }) => void;
  updateProfile: (data: Partial<User>) => void;
  switchRole: (role: "CUSTOMER" | "ORGANIZER") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      async login(payload) {
        set({ isLoading: true });
        try {
          const data = await authService.login(payload);

          set({
            // Ensure the data shape matches User type.
            // In a real app, backend should return the exact shape or we map it here.
            user: { ...data, id: data.id.toString() } as User,
            token: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("accessToken", data.accessToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      async register(payload) {
        set({ isLoading: true });
        try {
          const data = await authService.register(payload);

          set({
            // Ensure the data shape matches User type.
            user: { ...data.user, id: data.user.id.toString() } as User,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout() {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setAuth(data: { user: User; token: string }) {
        localStorage.setItem("accessToken", data.token);
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      switchRole: (role: "CUSTOMER" | "ORGANIZER") => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
