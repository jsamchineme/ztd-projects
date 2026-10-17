"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 10000;

export function CartClient() {
  const { items, subtotalCents, setQuantity, remove, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotalCents >= FREE_SHIP_THRESHOLD || subtotalCents === 0 ? 0 : 800;
  const total = subtotalCents + shipping;

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Order failed");
      setDone(json.reference);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPlacing(false);
    }
  }

  if (done) {
    return (
      <div className="wrap section-padding text-center max-w-[600px]">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-[2.2rem] mb-3">Order received</h1>
        <p className="text-muted mb-2">
          Thank you! Your order reference is <strong className="text-ink">{done}</strong>.
        </p>
        <p className="text-muted mb-8">
          Payments aren&apos;t enabled yet — we&apos;ll be in touch to arrange payment and delivery.
        </p>
        <Link href="/shop" className="py-[13px] px-[28px] rounded-full bg-burgundy text-white inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wrap section-padding text-center">
        <h1 className="text-[2.2rem] mb-3">Your cart is empty</h1>
        <p className="text-muted mb-8">Add a blend or two to get started.</p>
        <Link href="/shop" className="py-[13px] px-[28px] rounded-full bg-burgundy text-white inline-block">
          Shop the collection
        </Link>
      </div>
    );
  }

  const field =
    "w-full py-[12px] px-[14px] border border-line rounded-input font-sans text-[.92rem] bg-white focus:outline-none focus:border-gold";

  return (
    <div className="wrap section-padding grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
      <div>
        <h1 className="text-[2.2rem] mb-6">Your Cart</h1>
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-5 items-center">
              <div className="w-20 h-20 rounded bg-cream border border-line overflow-hidden flex items-center justify-center shrink-0">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🫙</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/shop/${item.slug}`} className="font-medium hover:text-burgundy">
                  {item.name}
                </Link>
                <div className="text-muted text-sm">{formatPrice(item.priceCents)}</div>
              </div>
              <div className="flex items-center border border-line rounded-full">
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 text-lg hover:text-burgundy"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 text-lg hover:text-burgundy"
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-medium">
                {formatPrice(item.priceCents * item.quantity)}
              </div>
              <button
                type="button"
                onClick={() => remove(item.productId)}
                aria-label="Remove"
                className="text-muted hover:text-burgundy text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={placeOrder} className="bg-soft border border-line rounded p-7">
        <h2 className="text-[1.4rem] mb-5">Order Summary</h2>
        <div className="flex justify-between text-[0.95rem] mb-2">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-[0.95rem] mb-4">
          <span className="text-muted">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold text-[1.1rem] border-t border-line pt-4 mb-6">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="space-y-3 mb-5">
          <input name="name" placeholder="Full name" className={field} />
          <input type="email" name="email" required placeholder="Email *" className={field} />
          <input name="phone" placeholder="Phone" className={field} />
          <input name="address" placeholder="Address" className={field} />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" className={field} />
            <input name="postalCode" placeholder="ZIP" className={field} />
          </div>
          <textarea name="note" rows={2} placeholder="Order note (optional)" className={`${field} resize-y`} />
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full py-[14px] rounded-full bg-burgundy text-white font-medium hover:bg-burgundy-dark transition-colors disabled:opacity-60"
        >
          {placing ? "Placing order…" : "Place order"}
        </button>
        <p className="text-[0.78rem] text-muted text-center mt-3">
          Payments aren&apos;t enabled yet — this reserves your order and we&apos;ll follow up.
        </p>
        {error && <p className="text-burgundy text-sm text-center mt-3">{error}</p>}
      </form>
    </div>
  );
}
