import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "./auth.service";
import type { LoginSchema, RegisterSchema } from "./auth.schema";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  point: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginSchema) => Promise<void>;
  register: (payload: RegisterSchema) => Promise<void>;
  logout: () => void;
  setAuth: (data: { user: User; token: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      async login(payload) {
        const data = await authService.login(payload);

        // Use setAuth logic or handle manually if needed, but for now match the types
        set({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
            point: data.point,
          },
          token: data.accessToken, // Assuming API returns accessToken here too if we keep this action
          isAuthenticated: true,
        });
        localStorage.setItem("accessToken", data.accessToken);
      },

      async register(payload) {
        const data = await authService.register(payload);

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
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
