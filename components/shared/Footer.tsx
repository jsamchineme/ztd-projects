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
    <div className="flex gap-[29px] lg:gap-[13px]">
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
        <div className="relative mx-auto max-w-[1512px] px-[22px] lg:pl-[208px] lg:pr-[60px] pt-0 lg:pt-[89px] pb-[60px] lg:pb-[52px] grid gap-[70px] lg:gap-0 lg:grid-cols-[541px_203px_194px_1fr]">
          <div id="subscribe" className="scroll-mt-28 -mx-[22px] lg:mx-0">
            <div className="flex h-[172px] items-center justify-center lg:block lg:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/dk-logo-dark.png" alt="Debb's Kitchen" className="w-[146px] lg:w-[110px] h-auto" />
            </div>
            <div className="lg:mt-[38px] w-full lg:max-w-[410px] bg-white/45 px-[22px] lg:px-[13px] pt-[14px] pb-[50px] lg:pb-[30px] lg:-ml-[13px]">
              <p className="font-sans font-light text-[16px] lg:text-[13px] leading-[23px] lg:leading-normal tracking-[0.04em] uppercase">
                Be the first to know about sales &amp; other news!
              </p>
              <FooterNewsletter />
            </div>
            {/* Phones: divider between the signup and the link groups */}
            <div className="lg:hidden mx-[22px] mt-[37px] border-t border-green/60" />
          </div>

          {GROUPS.map((g) => (
            <div key={g.title.join(" ")} className="flex gap-[21px] lg:block">
              <div className="flex w-[50px] shrink-0 justify-end items-start lg:block lg:w-auto">
                <h4 className="flex flex-col shrink-0 rotate-180 [writing-mode:vertical-rl] lg:rotate-0 lg:[writing-mode:horizontal-tb] lg:block font-sans font-light text-[31px] lg:text-[29px] leading-[30px] lg:leading-[1.2] tracking-[0.04em] lg:tracking-[0.05em]">
                  {g.title.map((line) => (
                    <span key={line} className="lg:mr-[0.3em]">
                      {line}
                    </span>
                  ))}
                </h4>
              </div>
              <div className="lg:mt-[15px]">
                <ul className={`pt-[2px] lg:pt-0 space-y-[16px] lg:space-y-[10.5px] lg:leading-[21px] ${g.title[0] === "HELP" ? "lg:max-w-[120px]" : ""}`}>
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="font-sans font-light text-[17px] lg:text-[14px] lg:leading-[21px] tracking-[0.15em] lg:tracking-[0.1em] hover:text-green-dark transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {g.title[0] === "DEBBS" && (
                  <div className="hidden lg:block mt-[19px]">
                    <Socials size="w-[25px] h-[25px]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Phones: divider + larger social row, as on the live mobile footer */}
        <div className="relative lg:hidden px-[22px]">
          <div className="border-t border-green/60 pl-[12px] pt-[36px] pb-[22px]">
            <Socials size="w-[32px] h-[32px]" />
          </div>
        </div>
      </div>

      <div className="bg-green text-[#fcfcfc]">
        <p className="mx-auto max-w-[1512px] px-6 py-[22px] lg:py-[10px] text-center font-sans font-light text-[16px] lg:text-[14px] leading-[19px] lg:leading-normal tracking-[0.2em] lg:tracking-[0.15em]">
          © {new Date().getFullYear()} by Debbs Kitchen<span className="hidden lg:inline">&nbsp;</span>
          <br className="lg:hidden" /> All Rights Reserved
        </p>
      </div>

      <BackToTop />
    </footer>
  );
}
