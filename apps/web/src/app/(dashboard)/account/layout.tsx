import { PageHeader } from "@/components/shared/page-header";
import { SectionNav } from "@/components/shared/section-nav";
import { paths } from "@/lib/paths";

const LINKS = [
  { href: paths.orders, label: "سفارش‌ها" },
  { href: paths.profile, label: "مشخصات" },
];

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <PageHeader eyebrow="حساب کاربری" title="آتلیه‌ی من" />
      <SectionNav label="بخش‌های حساب" links={LINKS} />
      {children}
    </div>
  );
}
