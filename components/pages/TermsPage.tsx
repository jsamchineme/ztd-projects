export interface TermsContent {
  title: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[]; groups?: { label: string; items: string[] }[] }[];
}

// Paragraph strings may contain simple inline links (trusted seed/CMS HTML).
export function TermsPage({ c }: { c: TermsContent }) {
  return (
    <div className="mx-auto max-w-[760px] px-6 pt-[60px] lg:pt-[93px] pb-[110px] text-center">
      <h1 className="font-sans font-light text-[38px] lg:text-[65px] leading-[1.15]">{c.title}</h1>
      {c.sections.map((s) => (
        <section key={s.heading} className="mt-[60px] lg:mt-[70px]">
          <h2 className="font-sans font-light text-[24px] lg:text-[30px]">{s.heading}</h2>
          <div className="mt-8 text-left space-y-5 font-sans font-light text-[17px] leading-[1.7] tracking-[0.05em] [&_a]:underline [&_a]:underline-offset-2">
            {s.paragraphs?.map((p) => (
              <p key={p} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            {s.bullets && (
              <ul className="list-disc pl-8 space-y-5">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {s.groups && (
              <div className="mx-auto w-fit space-y-6">
                {s.groups.map((g) => (
                  <div key={g.label}>
                    <p>{g.label}</p>
                    <ul className="list-disc pl-8 mt-1 space-y-1">
                      {g.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
