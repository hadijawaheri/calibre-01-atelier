"use client";

import type { CaseMaterial, Collection, MovementType } from "@kronos/contracts";
import {
  CASE_MATERIAL_LABELS,
  CASE_MATERIALS,
  COLLECTION_LABELS,
  COLLECTIONS,
  MOVEMENT_TYPE_LABELS,
  MOVEMENT_TYPES,
} from "@kronos/contracts";
import { SlidersHorizontal } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { formatNumber } from "@/lib/format";

import { useCatalogParams } from "./use-catalog-params";

interface OptionGroupProps<T extends string> {
  legend: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: T[];
  onChange: (next: T[]) => void;
}

function OptionGroup<T extends string>({
  legend,
  options,
  labels,
  selected,
  onChange,
}: OptionGroupProps<T>) {
  const id = useId();
  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <FieldGroup data-slot="checkbox-group">
        {options.map((option) => (
          <Field key={option} orientation="horizontal">
            <Checkbox
              id={`${id}-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={(checked) =>
                onChange(
                  checked ? [...selected, option] : selected.filter((value) => value !== option),
                )
              }
            />
            <FieldLabel htmlFor={`${id}-${option}`} className="font-normal">
              {labels[option]}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}

function FilterFields() {
  const [params, setParams] = useCatalogParams();
  const id = useId();
  // Any filter change goes back to the first page
  const update = (patch: { [K in keyof typeof params]?: (typeof params)[K] | null }) =>
    setParams({ ...patch, page: null });

  return (
    <FieldGroup>
      <OptionGroup<Collection>
        legend="کلکسیون"
        options={COLLECTIONS}
        labels={COLLECTION_LABELS}
        selected={params.collection}
        onChange={(collection) => update({ collection })}
      />
      <Separator />
      <OptionGroup<CaseMaterial>
        legend="جنس قاب"
        options={CASE_MATERIALS}
        labels={CASE_MATERIAL_LABELS}
        selected={params.material}
        onChange={(material) => update({ material })}
      />
      <Separator />
      <OptionGroup<MovementType>
        legend="موتور"
        options={MOVEMENT_TYPES}
        labels={MOVEMENT_TYPE_LABELS}
        selected={params.movement}
        onChange={(movement) => update({ movement })}
      />
      <Separator />
      <Field orientation="horizontal">
        <FieldLabel htmlFor={`${id}-stock`} className="font-normal">
          فقط موجود
        </FieldLabel>
        <Switch
          id={`${id}-stock`}
          checked={params.inStock}
          onCheckedChange={(inStock) => update({ inStock: inStock || null })}
        />
      </Field>
    </FieldGroup>
  );
}

export function useActiveFilterCount(): number {
  const [params] = useCatalogParams();
  return (
    params.collection.length +
    params.material.length +
    params.movement.length +
    (params.inStock ? 1 : 0)
  );
}

export function CatalogFilters() {
  return (
    <aside aria-label="فیلتر محصولات" className="hidden lg:block">
      <div className="sticky top-24">
        <FilterFields />
      </div>
    </aside>
  );
}

export function CatalogFiltersSheet({ total }: { total: number }) {
  const active = useActiveFilterCount();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal data-icon="inline-start" />
          فیلترها
          {active > 0 && <span className="text-gold tabular-nums">({formatNumber(active)})</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>فیلترها</SheetTitle>
          <SheetDescription>{formatNumber(total)} ساعت با این فیلترها</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4">
          <FilterFields />
        </div>
        <SheetFooter>
          <ClearFiltersButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ClearFiltersButton() {
  const [, setParams] = useCatalogParams();
  const active = useActiveFilterCount();
  return (
    <Button
      variant="ghost"
      disabled={active === 0}
      onClick={() =>
        setParams({
          collection: null,
          material: null,
          movement: null,
          inStock: null,
          q: null,
          page: null,
        })
      }
    >
      پاک کردن فیلترها
    </Button>
  );
}
