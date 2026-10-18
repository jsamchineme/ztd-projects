export interface AboutContent {
  title: string;
  subtitle: string;
  intro: string[];
  image: string;
  meetTitle: string;
  bio: string[];
}

export function AboutPage({ c }: { c: AboutContent }) {
  return (
    <div className="pt-[60px] lg:pt-[87px] pb-[90px] lg:pb-[118px]">
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <h1 className="font-sans font-light text-[40px] lg:text-[56px] leading-[1.2]">{c.title}</h1>
        <p className="mt-3 font-sans font-light text-[18px] lg:text-[20px]">{c.subtitle}</p>
        <div className="mt-8 space-y-6 font-sans font-light text-[17px] leading-[1.7]">
          {c.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.image}
        alt=""
        className="mt-[60px] lg:mt-[90px] mx-auto w-[calc(100%-32px)] lg:w-[calc(100%-160px)] max-w-[1352px] aspect-[1352/435] object-cover object-[50%_28%]"
      />

      <div className="mx-auto max-w-[652px] px-6 mt-[60px] lg:mt-[81px]">
        <h2 className="text-center font-sans font-bold text-[32px] lg:text-[38px]">{c.meetTitle}</h2>
        <div className="mx-auto mt-3 h-px w-[38px] bg-ink" />
        <div className="mt-10 space-y-6 font-sans font-light text-[17px] leading-[1.7]">
          {c.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
