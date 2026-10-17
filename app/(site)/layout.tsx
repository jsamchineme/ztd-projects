import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { CartProvider } from "@/components/cart/CartProvider";
import { getSetting } from "@/lib/settings";

// Reads the promo text from the DB on each request (and keeps builds DB-free).
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const promo = await getSetting("promoBanner", "Free shipping on orders over $100");

  return (
    <CartProvider>
      <AnnouncementBar text={promo} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
