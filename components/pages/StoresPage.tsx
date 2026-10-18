import { GoldButton } from "./GoldButton";

export interface StoresContent {
  title: string;
  subtitle: string;
  note: string;
  buttonLabel: string;
  image: string;
  groceryTitle: string;
  groceryIntro: string;
  grocery: { name: string; lines: string[]; mapUrl: string }[];
  onlineTitle: string;
  onlineIntro: string;
  online: { name: string; label: string; url: string }[];
}

const H = "font-sans font-light text-[40px] lg:text-[65px] leading-[1.15] text-center";

export function StoresPage({ c }: { c: StoresContent }) {
  return (
    <div>
      <section className="pt-[60px] lg:pt-[84px] pb-[60px] text-center px-6">
        <h1 className={H}>{c.title}</h1>
        <p className="mt-6 font-sans font-light text-[16px]">{c.subtitle}</p>
        <p className="mt-2 font-sans font-light text-[16px]">---</p>
        <p className="mt-2 font-sans font-bold text-[16px]">{c.note}</p>
        <a
          href="#findourproducts"
          className="mt-6 inline-flex items-center justify-center h-[40px] px-6 bg-gold text-[#fcfcfc] font-sans font-light text-[14px] hover:bg-gold-dark"
        >
          {c.buttonLabel}
        </a>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.image} alt="" className="w-full aspect-[1512/920] object-cover" />

      <section id="findourproducts" className="scroll-mt-10 lg:scroll-mt-[130px] bg-[#fafafa] pt-[120px] lg:pt-[247px] px-6">
        <h2 className={H}>{c.groceryTitle}</h2>
        <div className="mx-auto max-w-[644px] mt-10">
          <p className="font-sans font-light text-[16px]">{c.groceryIntro}</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-10">
            {c.grocery.map((g) => (
              <div key={g.name} className="font-sans text-[16px] leading-[1.8]">
                <p className="font-bold">{g.name}</p>
                {g.lines.map((l) => (
                  <a key={l} href={g.mapUrl} target="_blank" rel="noopener noreferrer" className="block font-light underline underline-offset-2">
                    {l}
                  </a>
                ))}
                <GoldButton href={g.mapUrl} external className="mt-4">
                  Open Map
                </GoldButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fafafa] pt-[100px] lg:pt-[150px] pb-[110px] px-6">
        <h2 className={H}>{c.onlineTitle}</h2>
        <div className="mx-auto max-w-[760px] mt-10">
          <p className="font-sans font-light text-[16px]">{c.onlineIntro}</p>
          <div className="mt-8 grid sm:grid-cols-3 gap-8">
            {c.online.map((o) => (
              <div key={o.name} className="font-sans text-[16px]">
                <p className="font-bold">{o.name}</p>
                <GoldButton href={o.url} external className="mt-3">
                  {o.label}
                </GoldButton>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
