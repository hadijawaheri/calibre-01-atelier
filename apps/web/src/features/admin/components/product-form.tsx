"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductDto, ProductInput } from "@kronos/contracts";
import {
  CASE_MATERIAL_LABELS,
  CASE_MATERIALS,
  COLLECTION_LABELS,
  COLLECTIONS,
  DIAL_LAYOUTS,
  MOVEMENT_TYPE_LABELS,
  MOVEMENT_TYPES,
  normalizeDigits,
  productInputSchema,
} from "@kronos/contracts";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Control, FieldPath } from "react-hook-form";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { WatchRender } from "@/features/products";
import { fieldIssues, getErrorMessage } from "@/lib/api/parse";
import { paths } from "@/lib/paths";

import { useCreateProduct, useUpdateProduct } from "../queries";

type Values = ProductInput;
type Name = FieldPath<Values>;

const LAYOUT_LABELS: Record<(typeof DIAL_LAYOUTS)[number], string> = {
  "three-hand": "سه‌عقربه",
  chronograph: "کرونوگراف",
  tourbillon: "توربیون",
  skeleton: "اسکلتون",
};

const EMPTY: Values = {
  slug: "",
  name: "",
  nameEn: "",
  reference: "",
  series: "heritage",
  tagline: "",
  description: "",
  price: 0,
  stock: 0,
  editionSize: null,
  movement: {
    type: "automatic",
    calibre: "",
    frequencyVph: 28_800,
    jewels: 25,
    powerReserveHours: 48,
  },
  case: { material: "steel", diameterMm: 40, thicknessMm: 10, waterResistanceM: 50 },
  appearance: { dial: "#1d2b4a", accent: "#c9ced6", layout: "three-hand" },
  straps: [{ id: "leather", name: "چرم مشکی", price: 0 }],
  images: [],
  highlights: [],
  isFeatured: false,
  isPublished: false,
};

const toNumber = (raw: string): number => Number(normalizeDigits(raw).replace(/[^\d.]/g, "")) || 0;

interface TextFieldProps {
  control: Control<Values>;
  name: Name;
  label: string;
  description?: string;
  ltr?: boolean;
  /** "number" stores a number; "toman" shows Toman and stores Rial */
  kind?: "text" | "number" | "toman" | "lines" | "multiline" | "color";
  className?: string;
}

function TextField({
  control,
  name,
  label,
  description,
  ltr,
  kind = "text",
  className,
}: TextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const common = {
          id: name,
          name: field.name,
          onBlur: field.onBlur,
          ref: field.ref,
          "aria-invalid": fieldState.invalid,
          dir: ltr ? ("ltr" as const) : undefined,
          className: ltr ? "text-start" : undefined,
        };
        const value: unknown = field.value;
        let control: React.ReactNode;
        if (kind === "multiline") {
          control = (
            <Textarea
              {...common}
              rows={5}
              value={String(value ?? "")}
              onChange={(e) => field.onChange(e.target.value)}
            />
          );
        } else if (kind === "lines") {
          control = (
            <Textarea
              {...common}
              rows={4}
              value={Array.isArray(value) ? value.join("\n") : ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                )
              }
            />
          );
        } else if (kind === "color") {
          control = (
            <div className="flex gap-2">
              <Input
                {...common}
                type="color"
                className="w-14 p-1"
                value={String(value)}
                onChange={(e) => field.onChange(e.target.value)}
              />
              <Input
                dir="ltr"
                className="text-start font-mono"
                aria-label={label}
                value={String(value)}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </div>
          );
        } else {
          const shown =
            kind === "toman"
              ? String(Math.round(Number(value ?? 0) / 10))
              : value === null || value === undefined
                ? ""
                : String(value);
          control = (
            <Input
              {...common}
              inputMode={kind === "text" ? undefined : "decimal"}
              value={shown}
              onChange={(e) => {
                if (kind === "text") field.onChange(e.target.value);
                else if (kind === "toman") field.onChange(toNumber(e.target.value) * 10);
                else field.onChange(toNumber(e.target.value));
              }}
            />
          );
        }
        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {control}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

interface SelectFieldProps<T extends string> {
  control: Control<Values>;
  name: Name;
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
}

function SelectField<T extends string>({
  control,
  name,
  label,
  options,
  labels,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select value={String(field.value)} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {labels[option]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

function CheckField({
  control,
  name,
  label,
}: {
  control: Control<Values>;
  name: "isFeatured" | "isPublished";
  label: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <FieldLabel htmlFor={name} className="font-normal">
            {label}
          </FieldLabel>
        </Field>
      )}
    />
  );
}

function Preview({ control }: { control: Control<Values> }) {
  const [appearance, material] = useWatch({ control, name: ["appearance", "case.material"] });
  return (
    <div className="mx-auto size-48 border border-border bg-surface p-2 studio-light">
      <WatchRender
        dial={appearance.dial}
        accent={appearance.accent}
        layout={appearance.layout}
        material={material}
      />
    </div>
  );
}

function toInput(product: ProductDto): Values {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = product;
  return input;
}

export function ProductForm({ product }: { product?: ProductDto }) {
  const router = useRouter();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const form = useForm<Values>({
    resolver: zodResolver(productInputSchema),
    mode: "onTouched",
    defaultValues: product ? toInput(product) : EMPTY,
  });
  const straps = useFieldArray({ control: form.control, name: "straps" });
  const { control } = form;
  const pending = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (product) await update.mutateAsync({ id: product.id, input: values });
      else await create.mutateAsync(values);
      toast.success(product ? "تغییرات ذخیره شد" : "محصول ساخته شد");
      router.push(paths.adminProducts);
      router.refresh();
    } catch (error) {
      const issues = fieldIssues(error);
      for (const issue of issues) form.setError(issue.path as Name, { message: issue.message });
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]"
    >
      <div className="flex flex-col gap-6">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>معرفی</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <TextField control={control} name="name" label="نام فارسی" />
              <TextField control={control} name="nameEn" label="نام انگلیسی" ltr />
              <TextField
                control={control}
                name="slug"
                label="اسلاگ"
                ltr
                description="بخشی از نشانی صفحه؛ مثل primo-36000"
              />
              <TextField control={control} name="reference" label="رفرنس" ltr />
              <SelectField
                control={control}
                name="series"
                label="کلکسیون"
                options={COLLECTIONS}
                labels={COLLECTION_LABELS}
              />
              <TextField control={control} name="tagline" label="شعار کوتاه" />
              <TextField
                control={control}
                name="description"
                label="توضیحات"
                kind="multiline"
                className="sm:col-span-2"
              />
              <TextField
                control={control}
                name="highlights"
                label="ویژگی‌های برجسته (هر خط یکی)"
                kind="lines"
                className="sm:col-span-2"
              />
              <TextField
                control={control}
                name="images"
                label="تصاویر (هر خط یک مسیر)"
                kind="lines"
                ltr
                description="مثل /watches/calibre-01-alligator.png؛ بدون تصویر، نمای ساعت از رنگ‌ها ساخته می‌شود."
                className="sm:col-span-2"
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>موتور و قاب</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField
                control={control}
                name="movement.type"
                label="نوع موتور"
                options={MOVEMENT_TYPES}
                labels={MOVEMENT_TYPE_LABELS}
              />
              <TextField control={control} name="movement.calibre" label="کالیبر" ltr />
              <TextField
                control={control}
                name="movement.frequencyVph"
                label="ضربان در ساعت"
                kind="number"
                ltr
              />
              <TextField control={control} name="movement.jewels" label="یاقوت" kind="number" ltr />
              <TextField
                control={control}
                name="movement.powerReserveHours"
                label="ذخیره‌ی انرژی (ساعت)"
                kind="number"
                ltr
              />
              <SelectField
                control={control}
                name="case.material"
                label="جنس قاب"
                options={CASE_MATERIALS}
                labels={CASE_MATERIAL_LABELS}
              />
              <TextField
                control={control}
                name="case.diameterMm"
                label="قطر (میلی‌متر)"
                kind="number"
                ltr
              />
              <TextField
                control={control}
                name="case.thicknessMm"
                label="ضخامت (میلی‌متر)"
                kind="number"
                ltr
              />
              <TextField
                control={control}
                name="case.waterResistanceM"
                label="ضد آب (متر)"
                kind="number"
                ltr
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>بندها</CardTitle>
            <CardDescription>بند اول پیش‌فرض صفحه‌ی محصول است.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {straps.fields.map((strap, index) => (
              <FieldGroup
                key={strap.id}
                className="grid items-end gap-4 sm:grid-cols-[1fr_2fr_1fr_auto]"
              >
                <TextField control={control} name={`straps.${index}.id`} label="شناسه" ltr />
                <TextField control={control} name={`straps.${index}.name`} label="نام بند" />
                <TextField
                  control={control}
                  name={`straps.${index}.price`}
                  label="هزینه (تومان)"
                  kind="toman"
                  ltr
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="حذف بند"
                  disabled={straps.fields.length === 1}
                  onClick={() => straps.remove(index)}
                >
                  <Trash2 />
                </Button>
              </FieldGroup>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              disabled={straps.fields.length >= 6}
              onClick={() =>
                straps.append({ id: `strap-${straps.fields.length + 1}`, name: "", price: 0 })
              }
            >
              <Plus data-icon="inline-start" />
              افزودن بند
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-24">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>فروش</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <TextField control={control} name="price" label="قیمت (تومان)" kind="toman" ltr />
              <TextField control={control} name="stock" label="موجودی" kind="number" ltr />
              <Controller
                name="editionSize"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="editionSize">تیراژ محدود</FieldLabel>
                    <Input
                      id="editionSize"
                      dir="ltr"
                      className="text-start"
                      inputMode="numeric"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value.trim() ? toNumber(e.target.value) : null)
                      }
                    />
                    <FieldDescription>خالی یعنی تولید پیوسته.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <CheckField control={control} name="isPublished" label="نمایش در فروشگاه" />
              <CheckField control={control} name="isFeatured" label="برگزیده‌ی صفحه‌ی اول" />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>ظاهر صفحه</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Preview control={control} />
              <TextField control={control} name="appearance.dial" label="رنگ صفحه" kind="color" />
              <TextField
                control={control}
                name="appearance.accent"
                label="رنگ عقربه و شاخص"
                kind="color"
              />
              <SelectField
                control={control}
                name="appearance.layout"
                label="چیدمان"
                options={DIAL_LAYOUTS}
                labels={LAYOUT_LABELS}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" aria-label="در حال ذخیره" />}
          {product ? "ذخیره‌ی تغییرات" : "ساختن محصول"}
        </Button>
      </div>
    </form>
  );
}
