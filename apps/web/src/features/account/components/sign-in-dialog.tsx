"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiResponse, UserDto } from "@kronos/contracts";
import { requestOtpSchema, verifyOtpSchema } from "@kronos/contracts";
import type { ReactNode } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { ApiError, apiFetch, jsonBody } from "../api-client";
import { setSessionUser } from "../session";

const codeSchema = verifyOtpSchema.pick({ code: true });

function messageOf(e: unknown): string {
  return e instanceof ApiError ? e.message : "کاری پیش نرفت؛ دوباره تلاش کنید";
}

function MobileStep({ onSent }: { onSent: (mobile: string) => void }) {
  const form = useForm({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { mobile: "" },
  });
  const submit = form.handleSubmit(async ({ mobile }) => {
    try {
      await apiFetch<void>("/auth/otp/request", { method: "POST", ...jsonBody({ mobile }) });
      onSent(mobile);
    } catch (e: unknown) {
      form.setError("mobile", { message: messageOf(e) });
    }
  });
  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <Controller
          name="mobile"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-mobile">شمارهٔ موبایل</FieldLabel>
              <Input
                {...field}
                id="sign-in-mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                className="text-start"
                placeholder="09xxxxxxxxx"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner />}
          فرستادن کد
        </Button>
      </FieldGroup>
    </form>
  );
}

function CodeStep({
  mobile,
  onBack,
  onSignedIn,
}: {
  mobile: string;
  onBack: () => void;
  onSignedIn: (user: UserDto) => void;
}) {
  const form = useForm({ resolver: zodResolver(codeSchema), defaultValues: { code: "" } });
  const submit = form.handleSubmit(async ({ code }) => {
    try {
      const { data } = await apiFetch<ApiResponse<{ user: UserDto }>>("/auth/otp/verify", {
        method: "POST",
        ...jsonBody({ mobile, code }),
      });
      onSignedIn(data.user);
    } catch (e: unknown) {
      form.setError("code", { message: messageOf(e) });
    }
  });
  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-code">کد ۶ رقمی</FieldLabel>
              <Input
                {...field}
                id="sign-in-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                className="text-start"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            ورود
          </Button>
          <Button type="button" variant="ghost" onClick={onBack}>
            تغییر شماره
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

/** Sign-in by a code sent to the mobile; the session itself lives in httpOnly cookies set by the API. */
export function SignInDialog({
  trigger,
  onSignedIn,
}: {
  trigger: ReactNode;
  onSignedIn?: (user: UserDto) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState<string | null>(null);

  const change = (next: boolean) => {
    setOpen(next);
    if (!next) setMobile(null);
  };

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ورود به کرونوس</DialogTitle>
          <DialogDescription>
            {mobile ? (
              <>
                کدی را که به <bdi dir="ltr">{mobile}</bdi> فرستادیم وارد کنید.
              </>
            ) : (
              "شمارهٔ موبایلتان را وارد کنید تا کد ورود برایتان پیامک شود."
            )}
          </DialogDescription>
        </DialogHeader>
        {mobile ? (
          <CodeStep
            mobile={mobile}
            onBack={() => setMobile(null)}
            onSignedIn={(user) => {
              setSessionUser(user);
              change(false);
              onSignedIn?.(user);
            }}
          />
        ) : (
          <MobileStep onSent={setMobile} />
        )}
      </DialogContent>
    </Dialog>
  );
}
