import type { Metadata } from "next";

export const metadata: Metadata = { title: "درگاه آزمایشی", robots: { index: false } };

export default function GatewayLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 studio-light">{children}</main>
  );
}
