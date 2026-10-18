import type { OrderStatus } from "@prisma/client";
import { Badge } from "./ui";

const TONE = { PENDING: "amber", PAID: "blue", FULFILLED: "green", CANCELLED: "red" } as const;

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={TONE[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}
