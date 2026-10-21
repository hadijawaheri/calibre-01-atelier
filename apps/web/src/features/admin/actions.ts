"use server";

import { updateTag } from "next/cache";

import { requireRole } from "@/lib/auth/dal";

/** The storefront caches the catalogue; an admin edit must show up on the next visit. */
export async function refreshCatalog(): Promise<void> {
  await requireRole("admin");
  updateTag("catalog");
}
