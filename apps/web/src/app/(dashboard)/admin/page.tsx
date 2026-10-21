import { redirect } from "next/navigation";

import { paths } from "@/lib/paths";

export default function AdminPage() {
  redirect(paths.adminOrders);
}
