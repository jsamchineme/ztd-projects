export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/debbskitchen", icon: "/brand/social/facebook.png" },
  { label: "Instagram", href: "https://instagram.com/shopdebbskitchen", icon: "/brand/social/instagram.png" },
  { label: "YouTube", href: "https://youtube.com/c/DebbsKitchenShow", icon: "/brand/social/youtube.png" },
  { label: "Twitter", href: "https://twitter.com/debbskitchen", icon: "/brand/social/twitter.png" },
];

// Fixed mint strip on the left edge with the social icons (desktop only).
export function SocialBar() {
  return (
    <div className="hidden lg:flex fixed left-0 top-[40vh] z-40 w-[63px] flex-col items-center gap-[21px] py-[22px] bg-[#ace3da]">
      {SOCIAL_LINKS.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.icon} alt="" className="w-[23px] h-[23px]" />
        </a>
      ))}
    </div>
  );
}
