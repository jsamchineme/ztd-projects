"use client";

import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  inStock?: boolean;
  variant?: "gold" | "primary" | "ghost";
  className?: string;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  inStock = true,
  variant = "primary",
  className,
  fullWidth,
}: AddToCartButtonProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center py-[11px] px-[22px] rounded-full font-sans font-medium text-[.9rem] border border-line text-muted bg-cream cursor-not-allowed",
          fullWidth && "w-full",
          className,
        )}
      >
        Out of Stock
      </span>
    );
  }

  const styles: Record<string, string> = {
    gold: "bg-gold text-ink border-gold hover:bg-gold-dark hover:text-white",
    primary: "bg-burgundy text-white border-burgundy hover:bg-burgundy-dark",
    ghost: "bg-transparent text-ink border-line hover:border-gold hover:text-gold-dark",
  };

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 py-[11px] px-[22px] rounded-full font-sans font-medium text-[.9rem] border transition-all duration-200 cursor-pointer hover:-translate-y-[1px]",
        styles[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
