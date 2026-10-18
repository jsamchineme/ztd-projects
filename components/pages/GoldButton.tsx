import Link from "next/link";

// The live site's gold call-to-action: square corners, light 14px label.
export function GoldButton({
  href,
  children,
  external,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center h-[40px] px-6 min-w-[142px] bg-gold text-[#fcfcfc] font-sans font-light text-[14px] hover:bg-gold-dark transition-colors ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
