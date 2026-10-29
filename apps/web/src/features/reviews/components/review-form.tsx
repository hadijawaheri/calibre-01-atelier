"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiResponse, ReviewDto, UserDto } from "@kronos/contracts";
import { REVIEW_OWNERSHIPS, reviewInputSchema, updateProfileSchema } from "@kronos/contracts";
import { Star } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ApiError, apiFetch, jsonBody, setSessionUser } from "@/features/account";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { reviewsApi } from "../api";
import { OWNERSHIP_LABELS } from "../labels";

const NO_OWNERSHIP = "none";
const TEXT_MAX = 2000;

const optionalName = z.union([z.literal(""), updateProfileSchema.shape.firstName]);

// A blank name is allowed (the review then reads "کاربر کرونوس"), half a name is not
const reviewFormSchema = reviewInputSchema
  .extend({ firstName: optionalName, lastName: optionalName })
  .refine((value) => !value.firstName === !value.lastName, {
    path: ["lastName"],
    message: "نام و نام خانوادگی را با هم وارد کنید",
  });

export function ReviewForm({
  slug,
  user,
  review,
  onSaved,
  onCancel,
}: {
  slug: string;
  user: UserDto;
  review: ReviewDto | null;
  onSaved: (review: ReviewDto) => void;
  onCancel?: () => void;
}) {
  const needsName = !user.firstName;
  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: review?.rating ?? 0,
      text: review?.text ?? "",
      ownership: review?.ownership ?? null,
      firstName: "",
      lastName: "",
    },
  });

  const submit = form.handleSubmit(async ({ firstName, lastName, ...input }) => {
    try {
      if (needsName && firstName && lastName) {
        const { data } = await apiFetch<ApiResponse<UserDto>>("/users/me", {
          method: "PATCH",
          ...jsonBody({ firstName, lastName }),
        });
        setSessionUser(data);
      }
      const { data } = await reviewsApi.save(slug, input);
      onSaved(data);
    } catch (e: unknown) {
      form.setError("root", {
        message: e instanceof ApiError ? e.message : "نظر ثبت نشد؛ دوباره تلاش کنید",
      });
    }
  });

  const length = useWatch({ control: form.control, name: "text" }).trim().length;

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend variant="label">امتیاز شما</FieldLegend>
              <ToggleGroup
                type="single"
                variant="outline"
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => value && field.onChange(Number(value))}
                aria-invalid={fieldState.invalid}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <ToggleGroupItem
                    key={value}
                    value={String(value)}
                    aria-label={`${formatNumber(value)} از ۵`}
                    className="gap-1"
                  >
                    {formatNumber(value)}
                    <Star
                      aria-hidden
                      className={cn(
                        "size-3.5",
                        value <= field.value && "fill-current text-metal-ink",
                      )}
                    />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldError errors={[fieldState.error]} />
            </FieldSet>
          )}
        />

        <Controller
          name="ownership"
          control={form.control}
          render={({ field }) => (
            <FieldSet>
              <FieldLegend variant="label">این ساعت را چطور می‌شناسید؟</FieldLegend>
              <RadioGroup
                value={field.value ?? NO_OWNERSHIP}
                onValueChange={(value) => field.onChange(value === NO_OWNERSHIP ? null : value)}
              >
                {[...REVIEW_OWNERSHIPS, NO_OWNERSHIP].map((value) => (
                  <Field key={value} orientation="horizontal">
                    <RadioGroupItem value={value} id={`ownership-${value}`} />
                    <FieldLabel htmlFor={`ownership-${value}`} className="font-normal">
                      {value === NO_OWNERSHIP
                        ? "ترجیح می‌دهم نگویم"
                        : OWNERSHIP_LABELS[value as keyof typeof OWNERSHIP_LABELS]}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>
          )}
        />

        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="review-text">نظر شما</FieldLabel>
              <Textarea
                {...field}
                id="review-text"
                rows={6}
                maxLength={TEXT_MAX}
                aria-invalid={fieldState.invalid}
                placeholder="روی مچ چطور است؟ چه چیزی را دوست دارید و چه چیزی را نه؟"
              />
              <FieldDescription>
                {formatNumber(length)} از {formatNumber(TEXT_MAX)} حرف؛ دست‌کم ۲۰ حرف.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {needsName && (
          <FieldSet>
            <FieldLegend variant="label">نامی که کنار نظر می‌آید</FieldLegend>
            <FieldDescription>
              فقط نام و حرف اول نام خانوادگی نمایش داده می‌شود. خالی بگذارید تا «کاربر کرونوس» نوشته
              شود.
            </FieldDescription>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["firstName", "lastName"] as const).map((name) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`review-${name}`}>
                        {name === "firstName" ? "نام" : "نام خانوادگی"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`review-${name}`}
                        autoComplete={name === "firstName" ? "given-name" : "family-name"}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              ))}
            </div>
          </FieldSet>
        )}

        <FieldError errors={[form.formState.errors.root]} />
        <FieldDescription>نظرها پیش از انتشار خوانده و تأیید می‌شوند.</FieldDescription>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            {review ? "ثبت ویرایش" : "ثبت نظر"}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              انصراف
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
