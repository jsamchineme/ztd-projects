"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartCount() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream transition-colors"
    >
      <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-burgundy text-white text-[0.68rem] font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
