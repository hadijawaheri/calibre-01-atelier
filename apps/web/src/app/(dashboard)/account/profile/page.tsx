import type { Metadata } from "next";

import { ProfileForm } from "@/features/auth";
import { requireSession } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "مشخصات" };

export default async function ProfilePage() {
  const user = await requireSession(paths.profile);
  return (
    <div className="max-w-xl">
      <ProfileForm user={user} />
    </div>
  );
}
