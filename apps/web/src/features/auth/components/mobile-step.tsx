"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RequestOtpInput } from "@kronos/contracts";
import { requestOtpSchema } from "@kronos/contracts";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/parse";

import { useRequestOtp } from "../queries";

interface MobileStepProps {
  defaultMobile: string;
  onSent: (mobile: string) => void;
}

export function MobileStep({ defaultMobile, onSent }: MobileStepProps) {
  const form = useForm<RequestOtpInput>({
    resolver: zodResolver(requestOtpSchema),
    mode: "onTouched",
    defaultValues: { mobile: defaultMobile },
  });
  const requestOtp = useRequestOtp();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // The schema normalises Persian digits, so the parsed value is what the API sees
      const { mobile } = requestOtpSchema.parse(values);
      await requestOtp.mutateAsync({ mobile });
      onSent(mobile);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Controller
          name="mobile"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>شماره موبایل</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                autoFocus
                dir="ltr"
                className="h-11 text-start"
                placeholder="09123456789"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" disabled={requestOtp.isPending}>
          {requestOtp.isPending && <Spinner data-icon="inline-start" aria-label="در حال ارسال" />}
          دریافت کد تأیید
        </Button>
      </FieldGroup>
    </form>
  );
}
