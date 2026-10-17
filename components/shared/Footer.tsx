import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
} from "./SocialIcons";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Events & Gifts", href: "/events-gifts" },
  { label: "E-Gift Card", href: "/gift-card" },
];

const HELP_LINKS = [
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Shipping & Returns", href: "/terms-conditions" },
];

const COMPANY_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Store Locations", href: "/stores" },
  { label: "DK Show", href: "/dk-show" },
  { label: "Careers", href: "/careers" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/debbskitchen", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/shopdebbskitchen", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/c/DebbsKitchenShow", Icon: YoutubeIcon },
  { label: "Twitter", href: "https://twitter.com/debbskitchen", Icon: TwitterIcon },
];

function LinkCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-green-dark text-[0.82rem] tracking-[0.12em] uppercase font-semibold mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[0.92rem] text-ink/70 hover:text-green-dark transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-mint text-ink mt-auto">
      <div className="wrap py-[56px] grid gap-[40px] md:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dk-logo.png" alt="Debb's Kitchen" className="h-[52px] w-auto mb-5" />
          <p className="text-[0.78rem] tracking-[0.1em] uppercase text-ink/70 mb-3 max-w-[300px]">
            Be the first to know about sales &amp; other news!
          </p>
          <NewsletterForm />
        </div>

        <LinkCol title="Shop" links={SHOP_LINKS} />
        <LinkCol title="Help" links={HELP_LINKS} />

        <div>
          <h4 className="text-green-dark text-[0.82rem] tracking-[0.12em] uppercase font-semibold mb-4">
            Debb&apos;s Kitchen
          </h4>
          <ul className="space-y-2 mb-5">
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[0.92rem] text-ink/70 hover:text-green-dark transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/60 text-green-dark flex items-center justify-center hover:bg-green hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green text-white/90">
        <div className="wrap py-4 text-center text-[0.8rem]">
          © {new Date().getFullYear()} Debb&apos;s Kitchen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
