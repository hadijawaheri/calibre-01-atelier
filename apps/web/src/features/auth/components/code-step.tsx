"use client";

import { normalizeDigits } from "@kronos/contracts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/parse";
import { formatNumber } from "@/lib/format";
import { safeRedirect } from "@/lib/safe-redirect";

import { useRequestOtp, useVerifyOtp } from "../queries";

const RESEND_SECONDS = 60;

interface CodeStepProps {
  mobile: string;
  next: string | null;
  onEditMobile: () => void;
}

export function CodeStep({ mobile, next, onEditMobile }: CodeStepProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(RESEND_SECONDS);
  const verify = useVerifyOtp();
  const resend = useRequestOtp();

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  const submit = async (value: string) => {
    setError(null);
    try {
      await verify.mutateAsync({ mobile, code: value });
      router.replace(safeRedirect(next));
      router.refresh();
    } catch (cause) {
      setError(getErrorMessage(cause));
      setCode("");
    }
  };

  const onChange = (raw: string) => {
    // No `pattern` on the input: it would reject Persian digits before they are normalised here
    const value = normalizeDigits(raw).replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (value.length === 6) void submit(value);
  };

  const onResend = async () => {
    try {
      await resend.mutateAsync({ mobile });
      setWait(RESEND_SECONDS);
      toast.success("کد تازه ارسال شد");
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (code.length === 6) void submit(code);
      }}
      noValidate
    >
      <FieldGroup>
        <Field data-invalid={error !== null}>
          <FieldLabel htmlFor="otp">کد ۶ رقمی</FieldLabel>
          <FieldDescription>
            کد به شماره‌ی{" "}
            <span dir="ltr" className="font-mono text-foreground">
              {mobile}
            </span>{" "}
            پیامک شد.{" "}
            <Button type="button" variant="link" className="h-auto p-0" onClick={onEditMobile}>
              ویرایش شماره
            </Button>
          </FieldDescription>
          <div dir="ltr" className="flex justify-center">
            <InputOTP
              id="otp"
              maxLength={6}
              value={code}
              onChange={onChange}
              autoComplete="one-time-code"
              inputMode="numeric"
              autoFocus
              disabled={verify.isPending}
              aria-invalid={error !== null}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-11 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Button type="submit" size="lg" disabled={verify.isPending || code.length !== 6}>
          {verify.isPending && <Spinner data-icon="inline-start" aria-label="در حال بررسی" />}
          ورود
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={wait > 0 || resend.isPending}
          onClick={onResend}
        >
          {wait > 0 ? `ارسال دوباره تا ${formatNumber(wait)} ثانیه‌ی دیگر` : "ارسال دوباره‌ی کد"}
        </Button>
      </FieldGroup>
    </form>
  );
}
