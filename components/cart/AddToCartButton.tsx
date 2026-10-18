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
          "inline-flex items-center justify-center h-[40px] px-[22px] font-sans font-light text-[16px] border border-[#c8c8c8] text-white bg-[#c8c8c8] cursor-not-allowed",
          fullWidth && "w-full",
          className,
        )}
      >
        Out of Stock
      </span>
    );
  }

  const styles: Record<string, string> = {
    gold: "bg-gold text-[#fcfcfc] border-gold hover:bg-gold-dark hover:border-gold-dark",
    primary: "bg-ink text-white border-ink hover:bg-brown hover:border-brown",
    ghost: "bg-transparent text-ink border-ink hover:bg-ink hover:text-white",
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
        "inline-flex items-center justify-center gap-2 h-[40px] px-[22px] font-sans font-light text-[16px] border transition-colors duration-200 cursor-pointer",
        styles[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
