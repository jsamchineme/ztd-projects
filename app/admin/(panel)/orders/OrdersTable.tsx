"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnSecondary } from "@/components/admin/ui";
import { FulfillmentBadge, PaymentBadge } from "@/components/admin/OrderStatusBadge";
import type { FulfillmentStatus, PaymentStatus } from "@prisma/client";

export type OrderRow = {
  id: string;
  refDisplay: string;
  date: string;
  customerName: string;
  email: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  total: string;
  tags: string[];
  items: { id: string; name: string; qty: number; price: string; lineTotal: string }[];
};

export function OrdersTable({
  rows,
  bulkAction,
  canDelete,
}: {
  rows: OrderRow[];
  bulkAction: (fd: FormData) => Promise<void>;
  canDelete: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  return (
    <form action={bulkAction}>
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm shadow-sm">
          <span className="font-medium">{selected.size} selected</span>
          <span className="mx-1 h-4 w-px bg-neutral-200" />
          <button name="op" value="paid" className={cn(btnSecondary, "px-3 py-1.5")}>
            Mark as paid
          </button>
          <button name="op" value="fulfilled" className={cn(btnSecondary, "px-3 py-1.5")}>
            Mark as fulfilled
          </button>
          <button name="op" value="archive" className={cn(btnSecondary, "px-3 py-1.5")}>
            Archive
          </button>
          {canDelete && (
            <button
              name="op"
              value="delete"
              onClick={(e) => {
                if (!window.confirm(`Delete ${selected.size} order(s)? This can't be undone.`)) e.preventDefault();
              }}
              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
                  className="h-4 w-4 accent-green"
                />
              </th>
              {["Order", "Date created", "Customer", "Payment", "Fulfillment", "Total", "Items", "Tags"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((r) => (
              <RowGroup
                key={r.id}
                row={r}
                checked={selected.has(r.id)}
                onCheck={() => setSelected((s) => toggle(s, r.id))}
                open={expanded.has(r.id)}
                onToggle={() => setExpanded((s) => toggle(s, r.id))}
              />
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}

const cell = "px-4 py-3 align-middle";

function RowGroup({
  row,
  checked,
  onCheck,
  open,
  onToggle,
}: {
  row: OrderRow;
  checked: boolean;
  onCheck: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  const itemCount = row.items.reduce((n, i) => n + i.qty, 0);
  return (
    <>
      <tr className={cn("hover:bg-neutral-50", checked && "bg-green/5")}>
        <td className={cell}>
          <input type="checkbox" name="ids" value={row.id} checked={checked} onChange={onCheck} className="h-4 w-4 accent-green" />
        </td>
        <td className={cell}>
          <Link href={`/admin/orders/${row.id}`} className="font-medium text-green hover:underline">
            {row.refDisplay}
          </Link>
        </td>
        <td className={cn(cell, "whitespace-nowrap text-neutral-500")}>{row.date}</td>
        <td className={cell}>
          <div className="font-medium text-neutral-900">{row.customerName}</div>
          <div className="text-xs text-neutral-500">{row.email}</div>
        </td>
        <td className={cell}>
          <PaymentBadge status={row.paymentStatus} />
        </td>
        <td className={cell}>
          <FulfillmentBadge status={row.fulfillmentStatus} />
        </td>
        <td className={cn(cell, "font-medium")}>{row.total}</td>
        <td className={cell}>
          <button type="button" onClick={onToggle} className="inline-flex items-center gap-1 text-green hover:underline">
            {itemCount}
            <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
          </button>
        </td>
        <td className={cell}>
          <div className="flex flex-wrap gap-1">
            {row.tags.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                {t}
              </span>
            ))}
          </div>
        </td>
      </tr>
      {open && (
        <tr className="bg-neutral-50/60">
          <td />
          <td colSpan={8} className="px-4 py-3">
            <ul className="space-y-1.5">
              {row.items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-neutral-700">
                    {i.name} <span className="text-neutral-400">×{i.qty}</span>
                  </span>
                  <span className="text-neutral-500">{i.lineTotal}</span>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}
