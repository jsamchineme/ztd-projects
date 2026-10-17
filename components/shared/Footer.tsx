import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
} from "./SocialIcons";

const SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "Special Deals", href: "/specials" },
  { label: "Gift Card", href: "/gift-card" },
  { label: "Events & Gifts", href: "/events-gifts" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Stores", href: "/stores" },
  { label: "DK Show", href: "/dk-show" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/debbskitchen", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/shopdebbskitchen", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/c/DebbsKitchenShow", Icon: YoutubeIcon },
  { label: "Twitter", href: "https://twitter.com/debbskitchen", Icon: TwitterIcon },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-auto">
      <div className="wrap py-[64px] grid gap-[40px] md:grid-cols-[1.4fr_1fr_1fr_1.6fr]">
        <div>
          <div className="font-display text-[1.5rem] font-semibold text-white mb-3">
            Debb&apos;s <span className="text-gold">Kitchen</span>
          </div>
          <p className="text-[0.95rem] text-white/60 max-w-[280px]">
            Elevate your taste. Savor every moment. Chef-crafted, Afro-continental
            spices and blends.
          </p>
          <div className="flex gap-2 mt-5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-[0.78rem] tracking-[0.18em] uppercase mb-4">Shop</h4>
          <ul className="space-y-2">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[0.95rem] text-white/60 hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-[0.78rem] tracking-[0.18em] uppercase mb-4">Company</h4>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[0.95rem] text-white/60 hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-[0.78rem] tracking-[0.18em] uppercase mb-4">
            Join the table
          </h4>
          <p className="text-[0.95rem] text-white/60 mb-4">
            Recipes, new blends and the occasional discount.
          </p>
          <NewsletterForm dark />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.85rem] text-white/50">
          <span>© {new Date().getFullYear()} Debb&apos;s Kitchen. All rights reserved.</span>
          <span>Made with care · Afro-continental flavor</span>
        </div>
      </div>
    </footer>
  );
}
