"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateProfileInput, UserDto } from "@kronos/contracts";
import { updateProfileSchema } from "@kronos/contracts";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fieldIssues, getErrorMessage } from "@/lib/api/parse";

import { useUpdateProfile } from "../queries";

type FieldName = keyof UpdateProfileInput;
const FIELDS: Array<{ name: FieldName; label: string; ltr?: boolean; autoComplete: string }> = [
  { name: "firstName", label: "نام", autoComplete: "given-name" },
  { name: "lastName", label: "نام خانوادگی", autoComplete: "family-name" },
  { name: "email", label: "ایمیل (اختیاری)", ltr: true, autoComplete: "email" },
];

export function ProfileForm({ user }: { user: UserDto }) {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    },
  });
  const update = useUpdateProfile();

  const onSubmit = form.handleSubmit(async ({ email, ...values }) => {
    try {
      await update.mutateAsync({ ...values, email: email || null });
      toast.success("مشخصات ذخیره شد");
    } catch (error) {
      const issues = fieldIssues(error);
      for (const issue of issues)
        form.setError(issue.path as FieldName, { message: issue.message });
      if (issues.length === 0) toast.error(getErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>مشخصات</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="mobile">شماره موبایل</FieldLabel>
              <Input id="mobile" value={user.mobile} disabled dir="ltr" className="text-start" />
              <FieldDescription>
                شماره‌ی موبایل شناسه‌ی ورود شماست و قابل تغییر نیست.
              </FieldDescription>
            </Field>
            {FIELDS.map(({ name, label, ltr, autoComplete }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id={name}
                      autoComplete={autoComplete}
                      dir={ltr ? "ltr" : undefined}
                      className={ltr ? "text-start" : undefined}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
            {update.isPending && <Spinner data-icon="inline-start" aria-label="در حال ذخیره" />}
            ذخیره
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
