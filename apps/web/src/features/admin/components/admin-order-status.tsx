"use client";

import type { OrderDto, OrderStatus } from "@kronos/contracts";
import { ADMIN_STATUS_TRANSITIONS, ORDER_STATUS_LABELS } from "@kronos/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useUpdateOrderStatus } from "@/features/orders";
import { getErrorMessage } from "@/lib/api/parse";

export function AdminOrderStatus({ order }: { order: OrderDto }) {
  const router = useRouter();
  const options = ADMIN_STATUS_TRANSITIONS[order.status];
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [trackingCode, setTrackingCode] = useState(order.trackingCode ?? "");
  const update = useUpdateOrderStatus();

  if (options.length === 0) return null;

  const submit = () => {
    if (!status) return;
    update.mutate(
      { id: order.id, status, trackingCode: status === "shipped" ? trackingCode : undefined },
      {
        onSuccess: () => {
          toast.success(`وضعیت به «${ORDER_STATUS_LABELS[status]}» تغییر کرد`);
          setStatus("");
          router.refresh();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <FieldGroup className="flex-row flex-wrap items-end gap-3">
      <Field className="w-48">
        <FieldLabel htmlFor="next-status">وضعیت بعدی</FieldLabel>
        <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
          <SelectTrigger id="next-status">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {ORDER_STATUS_LABELS[option]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      {status === "shipped" && (
        <Field className="w-48">
          <FieldLabel htmlFor="tracking">کد رهگیری مرسوله</FieldLabel>
          <Input
            id="tracking"
            dir="ltr"
            className="text-start"
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
          />
        </Field>
      )}
      <Button
        onClick={submit}
        variant={status === "cancelled" ? "destructive" : "default"}
        disabled={!status || update.isPending}
        className="w-fit"
      >
        {update.isPending && <Spinner data-icon="inline-start" aria-label="در حال ذخیره" />}
        ثبت وضعیت
      </Button>
    </FieldGroup>
  );
}
