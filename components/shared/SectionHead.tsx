interface SectionHeadProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHead({ eyebrow, title, subtitle, center = true }: SectionHeadProps) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div
      className={`max-w-section-head mb-[48px] ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-[14px]">
          {eyebrow}
        </div>
      )}
      {title && <h2 className="text-[clamp(2.1rem,4.4vw,3.1rem)] leading-[1.05]">{title}</h2>}
      {subtitle && <p className="text-muted mt-[16px] text-[1.08rem]">{subtitle}</p>}
    </div>
  );
}
