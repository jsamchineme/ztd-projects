import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartProvider } from "@/components/cart/CartProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
