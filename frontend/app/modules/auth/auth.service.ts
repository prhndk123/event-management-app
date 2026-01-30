import { axiosInstance } from "~/lib/axios";
import type { LoginSchema, RegisterSchema } from "./auth.schema";

export const authService = {
  async login(payload: LoginSchema) {
    const { data } = await axiosInstance.post("/auth/login", {
      email: payload.email,
      password: payload.password,
    });
    return data;
  },
  async register(payload: RegisterSchema) {
    const { data } = await axiosInstance.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    return data;
  },
};
