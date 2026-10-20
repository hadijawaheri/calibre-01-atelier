import type { ApiResponse, RequestOtpInput, UpdateProfileInput, UserDto, VerifyOtpInput } from "@kronos/contracts";

import { api } from "@/lib/api/client";
import { parseResponse } from "@/lib/api/parse";

export const authApi = {
  requestOtp: (input: RequestOtpInput) => api<void>("/auth/otp/request", { method: "POST", json: input }),
  verifyOtp: async (input: VerifyOtpInput) =>
    (await api<ApiResponse<{ user: UserDto }>>("/auth/otp/verify", { method: "POST", json: input })).data.user,
  logout: () => api<void>("/auth/logout", { method: "POST" }),
  /**
   * null for visitors. Unlike `api()`, a failed refresh must not send a visitor to sign-in,
   * so the one refresh attempt is made here by hand.
   */
  me: async (): Promise<UserDto | null> => {
    const read = () => fetch("/api/auth/me", { credentials: "include" });
    let res = await read();
    if (res.status === 401) {
      const refreshed = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      if (!refreshed.ok) return null;
      res = await read();
    }
    if (res.status === 401) return null;
    return (await parseResponse<ApiResponse<{ user: UserDto }>>(res)).data.user;
  },
  updateProfile: async (input: UpdateProfileInput) =>
    (await api<ApiResponse<UserDto>>("/users/me", { method: "PATCH", json: input })).data,
};
