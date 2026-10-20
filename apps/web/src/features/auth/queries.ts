"use client";

import type { UserDto } from "@kronos/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { paths } from "@/lib/paths";

import { authApi } from "./api";

export const sessionKey = ["session"] as const;

export function useSession() {
  return useQuery({ queryKey: sessionKey, queryFn: authApi.me, staleTime: 5 * 60_000 });
}

export function useRequestOtp() {
  return useMutation({ mutationFn: authApi.requestOtp });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (user) => queryClient.setQueryData<UserDto | null>(sessionKey, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Personal data from the old session must not survive the logout
      queryClient.clear();
      queryClient.setQueryData(sessionKey, null);
      router.replace(paths.home);
      router.refresh();
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData<UserDto | null>(sessionKey, user);
      router.refresh();
    },
  });
}
