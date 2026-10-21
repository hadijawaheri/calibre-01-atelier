"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { CodeStep } from "./code-step";
import { MobileStep } from "./mobile-step";

export function SignInForm() {
  const next = useSearchParams().get("next");
  const [mobile, setMobile] = useState<string | null>(null);
  const [lastMobile, setLastMobile] = useState("");

  return (
    <Card className="w-full max-w-sm rounded-none">
      <CardHeader>
        <CardTitle className="font-display text-3xl font-normal">ورود به آتلیه</CardTitle>
        <CardDescription>
          {mobile
            ? "کد تأیید را وارد کنید."
            : "با شماره موبایل وارد شوید؛ اگر حساب ندارید، ساخته می‌شود."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mobile ? (
          <CodeStep mobile={mobile} next={next} onEditMobile={() => setMobile(null)} />
        ) : (
          <MobileStep
            defaultMobile={lastMobile}
            onSent={(value) => {
              setLastMobile(value);
              setMobile(value);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
