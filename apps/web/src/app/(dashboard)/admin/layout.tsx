import { PageHeader } from "@/components/shared/page-header";
import { SectionNav } from "@/components/shared/section-nav";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

const LINKS = [
  { href: paths.adminOrders, label: "سفارش‌ها" },
  { href: paths.adminProducts, label: "محصولات" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Layouts do not re-run on client navigation, so every admin page checks the role again
  await requireRole("admin", paths.admin);
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6">
      <PageHeader eyebrow="مدیریت" title="پنل آتلیه" />
      <SectionNav label="بخش‌های مدیریت" links={LINKS} />
      {children}
    </div>
  );
}
