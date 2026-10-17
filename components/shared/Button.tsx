import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "primary" | "ghost" | "dark";

const base =
  "inline-flex items-center justify-center gap-2 py-[13px] px-[30px] rounded-[2px] font-sans font-medium text-[.78rem] uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer border disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-white border-gold hover:bg-gold-dark hover:border-gold-dark",
  // Primary CTA on the live site is the gold/amber button.
  primary:
    "bg-gold text-white border-gold hover:bg-gold-dark hover:border-gold-dark",
  dark: "bg-ink text-white border-ink hover:opacity-90",
  ghost:
    "bg-transparent text-ink border-ink hover:bg-ink hover:text-white",
};

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
