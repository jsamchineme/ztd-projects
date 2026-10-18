import type { FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { Badge } from "./ui";

const PAYMENT = {
  PAID: { tone: "green", label: "Paid" },
  UNPAID: { tone: "red", label: "Unpaid" },
  REFUNDED: { tone: "gray", label: "Refunded" },
} as const;

const FULFILLMENT = {
  FULFILLED: { tone: "green", label: "Fulfilled" },
  UNFULFILLED: { tone: "red", label: "Unfulfilled" },
  CANCELLED: { tone: "dark", label: "Canceled" },
} as const;

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { tone, label } = PAYMENT[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  const { tone, label } = FULFILLMENT[status];
  return <Badge tone={tone}>{label}</Badge>;
}
