"use client";

import type { OrderDto } from "@kronos/contracts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/parse";

import { useCancelOrder, usePayOrder } from "../queries";

export function OrderActions({ order }: { order: OrderDto }) {
  const router = useRouter();
  const pay = usePayOrder();
  const cancel = useCancelOrder();

  if (order.status !== "pending_payment") return null;

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        disabled={pay.isPending || pay.isSuccess}
        onClick={() =>
          pay.mutate(order.id, { onError: (error) => toast.error(getErrorMessage(error)) })
        }
      >
        {pay.isPending && <Spinner data-icon="inline-start" aria-label="در حال انتقال" />}
        پرداخت سفارش
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={cancel.isPending}>
            لغو سفارش
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>سفارش {order.number} لغو شود؟</AlertDialogTitle>
            <AlertDialogDescription>
              ساعت‌های رزروشده به انبار برمی‌گردند و این کار قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                cancel.mutate(order.id, {
                  onSuccess: () => {
                    toast.success("سفارش لغو شد");
                    router.refresh();
                  },
                  onError: (error) => toast.error(getErrorMessage(error)),
                })
              }
            >
              لغو سفارش
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
