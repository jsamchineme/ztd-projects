import Link from "next/link";
import { BackToTop } from "./BackToTop";
import { FooterNewsletter } from "./FooterNewsletter";
import { SOCIAL_LINKS } from "./SocialBar";

const GROUPS: { title: string[]; links: { label: string; href: string }[] }[] = [
  {
    title: ["SHOP"],
    links: [
      { label: "SHOP ALL", href: "/shop" },
      { label: "EVENTS & GIFTS", href: "/events-gifts" },
      { label: "E-GIFT CARD", href: "/gift-card" },
    ],
  },
  {
    title: ["HELP"],
    links: [
      { label: "TERMS & CONDITIONS", href: "/terms-conditions" },
      { label: "SHIPPING & RETURNS", href: "/terms-conditions" },
    ],
  },
  {
    title: ["DEBBS", "KITCHEN"],
    links: [
      { label: "OUR STORY", href: "/about" },
      { label: "STORE LOCATIONS", href: "/stores" },
      { label: "SUBSCRIBE", href: "#subscribe" },
      { label: "CONTACT US", href: "/contact" },
    ],
  },
];

function Socials({ size }: { size: string }) {
  return (
    <div className="flex gap-[13px] lg:gap-[13px]">
      {SOCIAL_LINKS.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.icon} alt="" className={size} />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto text-ink">
      <div className="relative bg-[#ace3da] overflow-hidden">
        {/* faint green diamond texture, as on the live footer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.09]"
          style={{ backgroundImage: "url(/brand/pattern-a.png)", backgroundSize: "201px" }}
        />
        <div className="relative mx-auto max-w-[1512px] px-6 lg:pl-[208px] lg:pr-[60px] pt-[60px] lg:pt-[87px] pb-[40px] lg:pb-[52px] grid gap-[48px] lg:gap-0 lg:grid-cols-[541px_203px_194px_1fr]">
          <div id="subscribe" className="scroll-mt-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/dk-logo-black.png" alt="Debb's Kitchen" className="w-[110px] h-auto" />
            <div className="mt-[34px] w-full max-w-[410px] bg-white/45 px-[13px] py-[14px] lg:-ml-[13px]">
              <p className="font-sans font-light text-[13px] tracking-[0.04em] uppercase">
                Be the first to know about sales &amp; other news!
              </p>
              <FooterNewsletter />
            </div>
          </div>

          {GROUPS.map((g) => (
            <div key={g.title.join(" ")} className="flex gap-6 lg:block">
              <h4 className="flex shrink-0 rotate-180 [writing-mode:vertical-rl] lg:rotate-0 lg:[writing-mode:horizontal-tb] lg:block font-sans font-light text-[30px] lg:text-[28px] leading-[1.05] lg:leading-[1.2] tracking-[0.04em] lg:tracking-normal">
                {g.title.map((line) => (
                  <span key={line} className="lg:mr-[0.3em]">
                    {line}
                  </span>
                ))}
              </h4>
              <div className="lg:mt-[18px]">
                <ul className="space-y-5 lg:space-y-[13px]">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="font-sans font-light text-[17px] lg:text-[14px] lg:leading-[17px] tracking-[0.18em] lg:tracking-[0.1em] hover:text-green-dark transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {g.title[0] === "DEBBS" && (
                  <div className="hidden lg:block mt-[22px]">
                    <Socials size="w-[25px] h-[25px]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Phones: divider + larger social row, as on the live mobile footer */}
        <div className="relative lg:hidden px-6">
          <div className="border-t border-green/60 py-8">
            <Socials size="w-[32px] h-[32px]" />
          </div>
        </div>
      </div>

      <div className="bg-green text-[#fcfcfc]">
        <p className="mx-auto max-w-[1512px] px-6 py-[10px] text-center font-sans font-light text-[15px] lg:text-[14px] tracking-[0.15em]">
          © {new Date().getFullYear()} by Debbs Kitchen.
          <br className="lg:hidden" /> All Rights Reserved
        </p>
      </div>

      <BackToTop />
    </footer>
  );
}
