import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "primary" | "ghost" | "dark";

const base =
  "inline-flex items-center justify-center gap-2 py-[13px] px-[28px] rounded-full font-sans font-medium text-[.95rem] tracking-[0.01em] transition-all duration-200 cursor-pointer border disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink border-gold hover:bg-gold-dark hover:text-white hover:-translate-y-[2px]",
  primary:
    "bg-burgundy text-white border-burgundy hover:bg-burgundy-dark hover:-translate-y-[2px]",
  dark: "bg-ink text-white border-ink hover:opacity-90 hover:-translate-y-[2px]",
  ghost:
    "bg-transparent text-ink border-line hover:border-gold hover:text-gold-dark",
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
