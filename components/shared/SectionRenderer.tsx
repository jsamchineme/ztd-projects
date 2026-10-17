import Link from "next/link";
import { Button } from "./Button";
import { SectionHead } from "./SectionHead";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { NewsletterForm } from "./NewsletterForm";
import { ContactForm } from "./ContactForm";
import { youtubeId } from "@/lib/youtube";

interface Section {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

export interface VideoData {
  slug: string;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  thumbnailUrl?: string | null;
  episode?: string | null;
}

export interface StoreData {
  id: string;
  name: string;
  address: string;
  city?: string | null;
  hours?: string | null;
  mapUrl?: string | null;
}

export interface SectionContext {
  bestSellers?: ProductCardData[];
  gridProducts?: ProductCardData[];
  stores?: StoreData[];
  featuredVideo?: VideoData | null;
  testimonials?: { quote: string; author: string; role?: string | null }[];
}

function HeroSection({ content }: { content: Record<string, any> }) {
  const buttons: { label: string; href: string; variant?: string }[] = content.buttons ?? [];
  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="wrap grid md:grid-cols-2 gap-10 items-center py-[72px] md:py-[104px]">
        <div className="animate-fade">
          <h1 className="text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] mb-5">
            {content.headline}
          </h1>
          <p className="text-muted text-[1.15rem] max-w-[520px] mb-8">
            {content.subheadline}
          </p>
          <div className="flex flex-wrap gap-3">
            {buttons.map((b, i) => (
              <Button key={i} href={b.href} variant={(b.variant as any) ?? "primary"}>
                {b.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded bg-gradient-to-br from-accent-soft to-gold/30 border border-line overflow-hidden flex items-center justify-center">
            {content.backgroundImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.backgroundImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[6rem]">🌶️</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductRow({ products }: { products: ProductCardData[] }) {
  if (!products.length) {
    return <p className="text-center text-muted">No products yet.</p>;
  }
  return (
    <div className="grid gap-[24px] grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function SectionRenderer({
  sections,
  context = {},
}: {
  sections: Section[];
  context?: SectionContext;
}) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {sorted.map((section) => {
        const { content, id: key } = section;
        switch (section.type) {
          case "promoBanner":
            return (
              <div key={key} className="bg-burgundy text-white text-center text-[0.9rem] py-[10px] px-4">
                {content.link ? (
                  <Link href={content.link} className="hover:underline">
                    {content.text}
                  </Link>
                ) : (
                  content.text
                )}
              </div>
            );

          case "hero":
            return <HeroSection key={key} content={content} />;

          case "bestSellers":
            return (
              <section key={key} className="section-padding">
                <div className="wrap">
                  <SectionHead eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
                  <ProductRow products={(context.bestSellers ?? []).slice(0, content.count ?? 4)} />
                  <div className="text-center mt-[44px]">
                    <Button href="/shop" variant="ghost">Shop all products</Button>
                  </div>
                </div>
              </section>
            );

          case "productGrid":
            return (
              <section key={key} className="section-padding">
                <div className="wrap">
                  <SectionHead eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
                  <ProductRow products={(context.gridProducts ?? []).slice(0, content.count ?? 8)} />
                </div>
              </section>
            );

          case "featuresGrid": {
            const items: { icon: string; title: string; description: string }[] = content.items ?? [];
            return (
              <section key={key} className="section-padding bg-soft">
                <div className="wrap">
                  <SectionHead eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
                  <div className="grid gap-[28px] md:grid-cols-3">
                    {items.map((f, i) => (
                      <div key={i} className="text-center px-4">
                        <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-2xl mx-auto mb-4">
                          {f.icon}
                        </div>
                        <h3 className="text-[1.25rem] mb-2">{f.title}</h3>
                        <p className="text-muted text-[0.98rem]">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          case "splitContent":
            return (
              <section key={key} className="section-padding">
                <div className="wrap grid md:grid-cols-2 gap-10 items-center">
                  <div className="aspect-[4/3] rounded bg-cream border border-line overflow-hidden flex items-center justify-center">
                    {content.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={content.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[5rem]">👩🏾‍🍳</span>
                    )}
                  </div>
                  <div>
                    {content.eyebrow && (
                      <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-3">
                        {content.eyebrow}
                      </div>
                    )}
                    <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] mb-4">{content.headline}</h2>
                    <p className="text-muted mb-6">{content.body}</p>
                    {content.ctaLabel && (
                      <Button href={content.ctaLink ?? "#"} variant="primary">
                        {content.ctaLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            );

          case "videoFeature": {
            const video = context.featuredVideo;
            const vid = video ? youtubeId(video.youtubeUrl) : null;
            return (
              <section key={key} className="section-padding bg-ink text-white">
                <div className="wrap">
                  <SectionHead eyebrow={content.eyebrow} title={content.title} />
                  {video ? (
                    <div className="max-w-[900px] mx-auto">
                      <div className="aspect-video rounded overflow-hidden border border-white/10 bg-black">
                        {vid ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${vid}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : null}
                      </div>
                      <div className="text-center mt-6">
                        <p className="text-gold text-[0.8rem] tracking-[0.12em] uppercase mb-1">
                          {video.episode}
                        </p>
                        <h3 className="text-white text-[1.4rem]">{video.title}</h3>
                        <div className="mt-5">
                          <Button href="/dk-show" variant="gold">More episodes</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-white/60">No videos yet.</p>
                  )}
                </div>
              </section>
            );
          }

          case "testimonials": {
            const quotes = context.testimonials ?? [];
            return (
              <section key={key} className="section-padding">
                <div className="wrap">
                  <SectionHead eyebrow={content.eyebrow} title={content.title} />
                  <div className="grid gap-[28px] md:grid-cols-3">
                    {quotes.map((q, i) => (
                      <blockquote key={i} className="bg-soft border border-line rounded p-7">
                        <div className="text-gold text-4xl font-serif leading-none mb-2">&ldquo;</div>
                        <p className="font-serif italic text-[1.08rem] text-ink mb-4">{q.quote}</p>
                        <cite className="not-italic text-gold-dark font-semibold text-[0.92rem]">
                          {q.author}
                          {q.role ? `, ${q.role}` : ""}
                        </cite>
                      </blockquote>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          case "newsletter":
            return (
              <section key={key} className="section-padding bg-cream">
                <div className="wrap max-w-[720px] text-center">
                  <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] mb-3">{content.title}</h2>
                  <p className="text-muted mb-7">{content.subtitle}</p>
                  <div className="flex justify-center">
                    <NewsletterForm />
                  </div>
                </div>
              </section>
            );

          case "pageHero":
            return (
              <section key={key} className="bg-cream">
                <div className="wrap py-[72px] text-center">
                  {content.eyebrow && (
                    <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-4">
                      {content.eyebrow}
                    </div>
                  )}
                  <h1 className="text-[clamp(2.4rem,5vw,3.6rem)]">{content.headline}</h1>
                  {content.subtitle && (
                    <p className="text-muted mt-4 max-w-[640px] mx-auto text-[1.08rem]">
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </section>
            );

          case "textContent":
            return (
              <section key={key} className="section-padding">
                <div
                  className="wrap max-w-[760px] prose prose-neutral"
                  dangerouslySetInnerHTML={{ __html: content.html ?? "" }}
                />
              </section>
            );

          case "ctaBand":
            return (
              <section key={key} className="section-padding">
                <div className="wrap">
                  <div className="rounded bg-gradient-to-br from-burgundy to-burgundy-dark text-white text-center p-[56px]">
                    <h2 className="text-white text-[clamp(1.9rem,3.6vw,2.6rem)] mb-3">{content.headline}</h2>
                    {content.description && <p className="text-white/80 mb-7 max-w-[560px] mx-auto">{content.description}</p>}
                    {content.buttonLabel && (
                      <Button href={content.buttonLink ?? "#"} variant="gold">{content.buttonLabel}</Button>
                    )}
                  </div>
                </div>
              </section>
            );

          case "storeList":
            return (
              <section key={key} className="section-padding">
                <div className="wrap grid gap-[24px] md:grid-cols-2">
                  {(context.stores ?? []).map((s) => (
                    <div key={s.id} className="bg-white border border-line rounded p-6">
                      <h3 className="text-[1.3rem] mb-1">{s.name}</h3>
                      <p className="text-muted">{s.address}</p>
                      {s.city && <p className="text-muted">{s.city}</p>}
                      {s.hours && <p className="text-[0.9rem] text-gold-dark mt-3">{s.hours}</p>}
                    </div>
                  ))}
                  {(context.stores ?? []).length === 0 && (
                    <p className="text-muted">No locations listed yet.</p>
                  )}
                </div>
              </section>
            );

          case "contactForm":
            return (
              <section key={key} className="section-padding">
                <div className="wrap max-w-[680px]">
                  <ContactForm />
                </div>
              </section>
            );

          default:
            if (process.env.NODE_ENV !== "production") {
              console.warn(`Unknown section type: ${section.type}`);
            }
            return null;
        }
      })}
    </>
  );
}
