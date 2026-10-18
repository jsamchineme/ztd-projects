"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/components/cart/CartProvider";

// Quantity stepper + large gold "Add to Cart", as on the live product page.
export function ProductBuyBox({ product, inStock }: { product: Omit<CartItem, "quantity">; inStock: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="font-sans">
      <label htmlFor="qty" className="block font-light text-[14px] mb-2">
        Quantity <span aria-hidden="true">*</span>
      </label>
      <div className="inline-flex items-center border border-ink/60 h-[40px]">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-9 h-full">
          −
        </button>
        <input
          id="qty"
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
          className="w-10 h-full text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((v) => Math.min(99, v + 1))} className="w-9 h-full">
          +
        </button>
      </div>

      {inStock ? (
        <button
          type="button"
          onClick={() => {
            add(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="mt-8 w-full max-w-[350px] h-[48px] bg-gold text-[#fcfcfc] font-light text-[20px] hover:bg-gold-dark transition-colors"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      ) : (
        <span className="mt-8 flex items-center justify-center w-full max-w-[350px] h-[48px] bg-[#c8c8c8] text-white font-light text-[20px]">
          Out of Stock
        </span>
      )}
    </div>
  );
}
