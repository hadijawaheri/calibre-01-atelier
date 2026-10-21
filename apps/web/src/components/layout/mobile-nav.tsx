"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="منو">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">آتلیه کرونوس</SheetTitle>
        </SheetHeader>
        <nav aria-label="منوی اصلی" className="flex flex-col px-4">
          {NAV_LINKS.map((link, index) => (
            <div key={link.href}>
              {index > 0 && <Separator />}
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-lg hover:text-gold"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
