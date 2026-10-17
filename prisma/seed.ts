import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = /neon\.tech/.test(connectionString)
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ─────────────────────────────────────────────────────────────────
const section = (type: string, order: number, content: Record<string, unknown>) => ({
  id: `sec_${type}_${order}`,
  type,
  order,
  content,
});

async function main() {
  // `--if-empty`: used on service start — only seed a fresh database, never
  // overwrite content edited in the CMS.
  if (process.argv.includes("--if-empty") && (await prisma.page.count()) > 0) {
    console.log("✓ Database already has content — skipping seed.");
    return;
  }

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@debbskitchen.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Debb's Kitchen Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
  });

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = [
    { slug: "single-spices", name: "Single Spices", order: 1 },
    { slug: "spice-blends", name: "Spice Blends", order: 2 },
    { slug: "olive-oil", name: "Olive Oil", order: 3 },
    { slug: "vinegar", name: "Vinegar", order: 4 },
  ];
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
    catMap[c.slug] = row.id;
  }

  // ── Products (original, chef-crafted range) ───────────────────────────────
  const products: Array<{
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    compareAtCents?: number;
    category: string;
    bestSeller?: boolean;
    featured?: boolean;
    onSale?: boolean;
    inStock?: boolean;
  }> = [
    { slug: "suya-pepper-blend", name: "Suya Pepper Blend", description: "Smoky West-African street-food spice with roasted peanut, ginger and chili. Rub it on skewers, chicken or roasted vegetables.", priceCents: 1000, category: "spice-blends", bestSeller: true, featured: true },
    { slug: "habanero-chile-powder", name: "Habanero Chile Powder", description: "Bright, fruity heat from sun-dried habaneros. A little goes a long way in sauces, stews and marinades.", priceCents: 1500, category: "single-spices", bestSeller: true },
    { slug: "adobo-all-purpose", name: "Adobo All-Purpose Seasoning", description: "A balanced, garlicky everyday blend for meats, beans, rice and roasted vegetables.", priceCents: 1000, category: "spice-blends", bestSeller: true, featured: true },
    { slug: "berbere", name: "Berbere", description: "Warm Ethiopian blend of chili, fenugreek, and warm baking spices. The heart of a great wot.", priceCents: 1500, category: "spice-blends", inStock: false },
    { slug: "jollof-rice-seasoning", name: "Jollof Rice Seasoning", description: "Everything you need for a deep, smoky party-style jollof — tomato, pepper, thyme and bay.", priceCents: 950, category: "spice-blends", featured: true },
    { slug: "flippin-chicken", name: "Flippin' Chicken Rub", description: "A crowd-pleasing poultry rub: paprika, garlic, herbs and a touch of brown-sugar sweetness.", priceCents: 950, category: "spice-blends", bestSeller: true },
    { slug: "ny-pizza-seasoning", name: "NY Pizza Sauce Seasoning", description: "Oregano-forward Italian blend that turns canned tomatoes into a proper pizzeria sauce.", priceCents: 750, category: "spice-blends" },
    { slug: "maharajah-curry", name: "Organic Maharajah Curry", description: "A luxurious saffron-kissed curry powder — golden, aromatic and never harsh.", priceCents: 1200, category: "spice-blends", featured: true },
    { slug: "garlic-powder", name: "Garlic Powder", description: "Pure, pungent granulated garlic. A pantry essential for rubs, dressings and doughs.", priceCents: 850, category: "single-spices" },
    { slug: "ground-cumin", name: "Ground Cumin", description: "Earthy, toasty and freshly milled — the backbone of countless spice blends.", priceCents: 800, category: "single-spices" },
    { slug: "ginger-powder", name: "Ginger Powder", description: "Warm, zesty ground ginger for baking, tea and savory marinades.", priceCents: 750, category: "single-spices" },
    { slug: "himalayan-pink-salt", name: "Coarse Himalayan Pink Salt", description: "Hand-mined mineral-rich salt with a clean, rounded flavor. Perfect for grinders.", priceCents: 1000, category: "single-spices", inStock: false },
    { slug: "smoked-paprika", name: "Smoked Paprika", description: "Sweet Spanish pimentón smoked over oak. Deep color and gentle smoke for any dish.", priceCents: 900, category: "single-spices" },
    { slug: "chefs-blend-evoo", name: "Chef's Blend Extra Virgin Olive Oil", description: "Cold-pressed, peppery-finish olive oil for finishing, dipping and dressing.", priceCents: 2300, compareAtCents: 2800, category: "olive-oil", onSale: true, featured: true },
    { slug: "herb-infused-evoo", name: "Herb-Infused Olive Oil", description: "Extra virgin olive oil infused with rosemary, thyme and garlic.", priceCents: 1900, category: "olive-oil" },
    { slug: "aged-balsamic", name: "Aged Balsamic Vinegar", description: "Syrupy, barrel-aged balsamic with a sweet-tart balance. Drizzle over anything.", priceCents: 2100, category: "vinegar", featured: true },
    { slug: "apple-cider-vinegar", name: "Raw Apple Cider Vinegar", description: "Unfiltered, with the mother. Bright acidity for dressings, brines and tonics.", priceCents: 1400, category: "vinegar" },
  ];

  let order = 0;
  for (const p of products) {
    order += 1;
    const { category, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...rest,
        order,
        categoryId: catMap[category],
        inStock: p.inStock ?? true,
        onSale: p.onSale ?? false,
      },
      create: {
        ...rest,
        order,
        categoryId: catMap[category],
        inStock: p.inStock ?? true,
        onSale: p.onSale ?? false,
      },
    });
  }

  // ── Stores ────────────────────────────────────────────────────────────────
  const stores = [
    { name: "Natick Mall Pop-Up", address: "1245 Worcester St", city: "Natick, MA", hours: "Mon–Sat 10am–8pm, Sun 11am–6pm", order: 1 },
    { name: "Boston Public Market", address: "100 Hanover St", city: "Boston, MA", hours: "Wed–Sun 10am–6pm", order: 2 },
  ];
  for (const s of stores) {
    const existing = await prisma.store.findFirst({ where: { name: s.name } });
    if (existing) await prisma.store.update({ where: { id: existing.id }, data: s });
    else await prisma.store.create({ data: s });
  }

  // ── Videos (DK Show) ──────────────────────────────────────────────────────
  const videos = [
    { slug: "spicy-mango-salsa", title: "Spicy Mango Salsa with Plantain Chips", description: "A bright, fiery salsa that comes together in minutes.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", episode: "Ep 4", order: 1 },
    { slug: "weeknight-jollof", title: "Weeknight Jollof Rice", description: "Smoky, party-style jollof for a busy evening.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", episode: "Ep 3", order: 2 },
    { slug: "berbere-chicken-stew", title: "Berbere Chicken Stew", description: "A warming Ethiopian-inspired stew built on berbere.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", episode: "Ep 2", order: 3 },
  ];
  for (const v of videos) {
    await prisma.video.upsert({ where: { slug: v.slug }, update: v, create: v });
  }

  // ── Blog ──────────────────────────────────────────────────────────────────
  const posts = [
    { slug: "building-a-spice-rack", title: "Building a Spice Rack That Actually Gets Used", excerpt: "The ten spices and blends worth keeping within arm's reach.", category: "Guides", author: "Deborah", published: true },
    { slug: "the-art-of-the-rub", title: "The Art of the Rub", excerpt: "How to season big cuts of meat so the flavor goes all the way through.", category: "Technique", author: "Deborah", published: true },
  ];
  for (const b of posts) {
    await prisma.blogPost.upsert({ where: { slug: b.slug }, update: b, create: b });
  }

  // ── Testimonials ────────────────────────────────────────────────────────────
  const testimonials = [
    { quote: "The Suya Pepper Blend changed my grilling forever. I put it on everything.", author: "Amara O.", order: 1 },
    { quote: "Finally, an adobo that tastes like home. Perfectly balanced.", author: "Luis M.", order: 2 },
    { quote: "Fresh, fragrant, and clearly made with care. You can taste the difference.", author: "Grace T.", order: 3 },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { author: t.author, quote: t.quote } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  const settings: Record<string, unknown> = {
    siteTitle: "Debb's Kitchen",
    tagline: "Elevate your taste. Savor every moment.",
    promoBanner: "Free shipping on orders over $100",
    freeShippingThresholdCents: 10000,
    email: "hello@debbskitchen.com",
    social: {
      facebook: "https://facebook.com/debbskitchen",
      instagram: "https://instagram.com/shopdebbskitchen",
      youtube: "https://youtube.com/c/DebbsKitchenShow",
      twitter: "https://twitter.com/debbskitchen",
    },
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }

  // ── Pages ───────────────────────────────────────────────────────────────────
  const homeSections = [
    section("promoBanner", 0, { text: "Free shipping on orders over $100", link: "/shop" }),
    section("hero", 1, {
      headline: "Spice that tells a story",
      subheadline:
        "Chef-crafted blends, single spices, oils and vinegars — Afro-continental flavor for every kitchen.",
      backgroundImage: "",
      buttons: [
        { label: "Shop the Collection", href: "/shop", variant: "gold" },
        { label: "Meet Debb", href: "/about", variant: "ghost" },
      ],
    }),
    section("bestSellers", 2, { eyebrow: "Crowd favorites", title: "Best Sellers", subtitle: "The blends our customers reach for again and again.", count: 4 }),
    section("featuresGrid", 3, {
      eyebrow: "Why Debb's Kitchen",
      title: "Preparation. Portion. Presentation.",
      items: [
        { icon: "🌿", title: "Fresh & Wholesome", description: "Milled in small batches so every jar is fragrant and full of life." },
        { icon: "🌍", title: "Afro-Continental", description: "Flavors drawn from Africa and blended with global culinary traditions." },
        { icon: "👩🏾‍🍳", title: "Chef-Crafted", description: "Built by a professionally trained chef who cooks with them every day." },
      ],
    }),
    section("videoFeature", 4, { eyebrow: "The DK Show", title: "Cook along with Debb", videoSlug: "spicy-mango-salsa" }),
    section("testimonials", 5, { eyebrow: "Kind words", title: "What cooks are saying" }),
    section("newsletter", 6, { title: "Join the table", subtitle: "Recipes, new blends and the occasional discount — straight to your inbox." }),
  ];

  const aboutSections = [
    section("pageHero", 0, { eyebrow: "Our Story", headline: "Meet Deborah Odunze", subtitle: "Chef, nurse, and the cook behind every blend." }),
    section("splitContent", 1, {
      imageUrl: "",
      eyebrow: "The beginning",
      headline: "Food should be fresh, fun and wholesome",
      body: "Deborah is a professionally trained chef and registered nurse whose cooking is rooted in her Nigerian childhood and sharpened by years working alongside chefs from Italy, France, and the Americas. Debb's Kitchen is where those worlds meet — what she calls Afro-continental cuisine.",
      ctaLabel: "Shop the Collection",
      ctaLink: "/shop",
    }),
    section("featuresGrid", 2, {
      eyebrow: "What we believe",
      title: "Preparation. Portion. Presentation.",
      items: [
        { icon: "🥣", title: "Preparation", description: "Great meals begin long before the stove is lit." },
        { icon: "⚖️", title: "Portion", description: "Balance on the plate, balance in the blend." },
        { icon: "✨", title: "Presentation", description: "We eat with our eyes first — so make it beautiful." },
      ],
    }),
  ];

  const simplePage = (title: string, eyebrow: string, headline: string, subtitle: string) => [
    section("pageHero", 0, { eyebrow, headline, subtitle }),
  ];

  const pages = [
    { slug: "home", title: "Home", sections: homeSections, metaDescription: "Chef-crafted spices, blends, oils and vinegars from Debb's Kitchen." },
    { slug: "about", title: "About", sections: aboutSections, metaDescription: "The story of Deborah Odunze and Debb's Kitchen." },
    { slug: "stores", title: "Stores", sections: [section("pageHero", 0, { eyebrow: "Visit us", headline: "Find Debb's Kitchen", subtitle: "Come taste the range at one of our locations and pop-ups." }), section("storeList", 1, {})], metaDescription: "Debb's Kitchen store and pop-up locations." },
    { slug: "specials", title: "Special Deals", sections: [section("pageHero", 0, { eyebrow: "Save", headline: "Special Deals", subtitle: "Limited-time offers on favorite blends." }), section("productGrid", 1, { title: "On Sale Now", filter: "onSale", count: 8 })], metaDescription: "Special deals from Debb's Kitchen." },
    { slug: "events-gifts", title: "Events & Gifts", sections: simplePage("Events & Gifts", "Celebrate", "Events & Gifts", "Gift sets, corporate orders and catering — flavor worth sharing."), metaDescription: "Events and gifts from Debb's Kitchen." },
    { slug: "gift-card", title: "Gift Card", sections: simplePage("Give flavor", "Gift Card", "Debb's Kitchen Gift Card", "The perfect gift for the cook who has everything (except the right spice)."), metaDescription: "Debb's Kitchen gift cards." },
    { slug: "careers", title: "Careers", sections: simplePage("Join us", "Careers", "Work with Debb's Kitchen", "We're a small team that loves food. Check back for openings."), metaDescription: "Careers at Debb's Kitchen." },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, sections: JSON.stringify(p.sections), metaDescription: p.metaDescription },
      create: { slug: p.slug, title: p.title, sections: JSON.stringify(p.sections), metaDescription: p.metaDescription },
    });
  }

  console.log("✓ Seed complete");
  console.log(`  Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
