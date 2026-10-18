import type { Metadata } from "next";
import { CartClient } from "./CartClient";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  return <CartClient freeShipThreshold={await getSetting("freeShippingThresholdCents", 10000)} />;
}
