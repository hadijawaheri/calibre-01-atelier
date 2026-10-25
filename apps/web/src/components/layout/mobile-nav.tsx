"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { FAMILY_LINKS, NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const item = (href: string, label: string) => (
    <li key={href} className="border-b border-border">
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="block py-4 text-base transition-colors duration-300 hover:text-metal-ink"
      >
        {label}
      </Link>
    </li>
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ms-2 md:hidden" aria-label="منو">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display text-3xl font-medium">کرونوس</SheetTitle>
        </SheetHeader>
        <nav aria-label="منوی اصلی" className="flex flex-col gap-8 px-4">
          <ul className="border-t border-border">{NAV_LINKS.map((l) => item(l.href, l.label))}</ul>
          <div className="flex flex-col gap-2">
            <p className="label">خانواده‌ها</p>
            <ul className="border-t border-border">
              {FAMILY_LINKS.map((l) => item(l.href, l.label))}
            </ul>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
