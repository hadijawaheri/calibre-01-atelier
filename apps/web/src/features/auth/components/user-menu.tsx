"use client";

import { LayoutDashboard, LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/lib/paths";

import { useLogout, useSession } from "../queries";

export function UserMenu() {
  const pathname = usePathname();
  const { data: user, isPending } = useSession();
  const logout = useLogout();

  if (isPending) return <Skeleton className="size-9 rounded-full" />;

  if (!user) {
    const next = pathname === paths.home ? "" : `?next=${encodeURIComponent(pathname)}`;
    return (
      <Button asChild variant="ghost" size="icon" aria-label="ورود">
        <Link href={`${paths.signIn}${next}`}>
          <User />
        </Link>
      </Button>
    );
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="حساب کاربری">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span>{name || "مشتری آتلیه"}</span>
          <span dir="ltr" className="text-end font-mono text-xs font-normal text-muted-foreground">
            {user.mobile}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={paths.orders}>
              <Package />
              سفارش‌های من
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={paths.profile}>
              <User />
              مشخصات
            </Link>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href={paths.adminOrders}>
                <LayoutDashboard />
                پنل مدیریت
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            onSelect={() => logout.mutate()}
          >
            <LogOut />
            خروج
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
