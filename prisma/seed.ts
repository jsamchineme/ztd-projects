import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Scraped from the live Wix store: per-product description, keyed by slug.
// Product photos live at public/products/<slug>.jpg.
// Page text, blog posts and DK Show episodes migrated from the live Wix site.
const content = JSON.parse(readFileSync(join(import.meta.dirname, "data", "content.json"), "utf8"));
const scraped: Record<string, { description?: string }> = JSON.parse(
  readFileSync(join(import.meta.dirname, "data", "products.json"), "utf8"),
);

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
    imageUrl?: string;
  }> = [
    // ── Full catalog migrated from the live site (names, prices, categories,
    //    stock). Photos and descriptions are merged in from the scrape below. ──
    { slug: "ny-pizza-sauce-seasoning", name: "NY Pizza Sauce Seasoning", description: "Oregano-forward Italian blend that turns canned tomatoes into a proper pizzeria sauce.", priceCents: 750, category: "spice-blends" },
    { slug: "flippin-chicken", name: "Flippin Chicken", description: "A crowd-pleasing poultry rub: paprika, garlic, herbs and a touch of sweetness.", priceCents: 950, category: "spice-blends" },
    { slug: "chefs-blend-extra-virgin-olive-oil", name: "Chef's Blend Extra Virgin Olive Oil", description: "Cold-pressed, peppery-finish olive oil for finishing, dipping and dressing.", priceCents: 2300, category: "olive-oil" },
    { slug: "organic-maharajah-curry", name: "Organic Maharajah Curry", description: "A luxurious saffron-kissed curry powder — golden, aromatic and never harsh.", priceCents: 1200, category: "spice-blends" },
    { slug: "african-birdseye-chile-powder", name: "African Birdseye Chile Powder", description: "Fiery, fruity heat from African birdseye chilies. Use sparingly.", priceCents: 1500, category: "single-spices" },
    { slug: "suya-yaji", name: "Suya Yaji", description: "Smoky West-African street-food spice with roasted peanut, ginger and chili. Rub it on skewers, chicken or roasted vegetables.", priceCents: 1000, category: "spice-blends", bestSeller: true, featured: true, imageUrl: "/products/suya-yaji.jpg" },
    { slug: "onion-powder", name: "Onion Powder", description: "Sweet, savory granulated onion for rubs, soups, dips and doughs.", priceCents: 850, category: "single-spices" },
    { slug: "mediterranean-thyme", name: "Mediterranean Thyme", description: "Fragrant dried thyme for roasts, marinades and slow-cooked dishes.", priceCents: 750, category: "single-spices" },
    { slug: "habanero-chile-powder", name: "Habanero Chile Powder", description: "Bright, fruity heat from sun-dried habaneros. A little goes a long way in sauces, stews and marinades.", priceCents: 1500, category: "single-spices", bestSeller: true, imageUrl: "/products/habanero-chile-powder.jpg" },
    { slug: "ground-cumin", name: "Ground Cumin", description: "Earthy, toasty and freshly milled — the backbone of countless spice blends.", priceCents: 800, category: "single-spices" },
    { slug: "ginger-powder", name: "Ginger Powder", description: "Warm, zesty ground ginger for baking, tea and savory marinades.", priceCents: 750, category: "single-spices" },
    { slug: "garlic-powder", name: "Garlic Powder", description: "Pure, pungent granulated garlic. A pantry essential for rubs, dressings and doughs.", priceCents: 850, category: "single-spices" },
    { slug: "coarse-himalayan-pink-salt", name: "Coarse Himalayan Pink Salt", description: "Hand-mined mineral-rich salt with a clean, rounded flavor. Perfect for grinders.", priceCents: 1000, category: "single-spices" },
    { slug: "berbere", name: "Berbere", description: "Warm Ethiopian blend of chili, fenugreek, and warm baking spices. The heart of a great wot.", priceCents: 1500, category: "spice-blends", bestSeller: true, inStock: false, imageUrl: "/products/berbere.jpg" },
    { slug: "adobo-seasoning", name: "Adobo Seasoning", description: "A balanced, garlicky everyday blend for meats, beans, rice and roasted vegetables.", priceCents: 1000, category: "spice-blends", bestSeller: true, featured: true, imageUrl: "/products/adobo-seasoning.jpg" },
    { slug: "chefs-reserve-balsamic-vinegar", name: "Chef's Reserve Balsamic Vinegar", description: "Syrupy, barrel-aged balsamic with a sweet-tart balance. Drizzle over anything.", priceCents: 1800, category: "vinegar" },
    { slug: "ras-el-hanout", name: "Ras El Hanout", description: "A fragrant North-African blend of warm spices, florals and gentle heat.", priceCents: 1500, category: "spice-blends" },
    { slug: "cajun-seasoning", name: "Cajun Seasoning", description: "Bold, smoky Louisiana-style blend for blackening, rice and seafood.", priceCents: 1000, category: "spice-blends" },
  ];

  let order = 0;
  for (const p of products) {
    order += 1;
    const { category, ...base } = p;
    const photo = `/products/${p.slug}.jpg`;
    const rest = {
      ...base,
      // Explicit defaults so re-seeding clears flags left by earlier seeds.
      bestSeller: base.bestSeller ?? false,
      featured: base.featured ?? false,
      compareAtCents: base.compareAtCents ?? null,
      description: scraped[p.slug]?.description || base.description,
      imageUrl: existsSync(join(import.meta.dirname, "..", "public", photo)) ? photo : base.imageUrl,
    };
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
  // Drop any products no longer in the seed set (e.g. renamed slugs).
  await prisma.product.deleteMany({
    where: { slug: { notIn: products.map((p) => p.slug) } },
  });

  // ── Reviews (migrated from the live Fera reviews widget, in its display
  //    order, with full text and the store's replies) ─────────────────────
  const reviews: Array<{
    rating: number;
    title: string;
    body: string | null;
    author: string;
    location: string | null;
    verified: boolean;
    product: string | null;
    productName?: string;
    date: string;
    reply?: string;
    replyDate?: string | null;
  }> =
    JSON.parse(readFileSync(join(import.meta.dirname, "data", "reviews.json"), "utf8"));
  const productIds = Object.fromEntries(
    (await prisma.product.findMany({ select: { id: true, slug: true } })).map((p) => [p.slug, p.id]),
  );
  await prisma.review.deleteMany({});
  await prisma.review.createMany({
    data: reviews.map((r, i) => ({
      position: i,
      rating: r.rating,
      title: r.title,
      body: r.body,
      author: r.author,
      location: r.location,
      verified: r.verified,
      productId: r.product ? productIds[r.product] ?? null : null,
      productName: r.productName ?? null,
      reply: r.reply ?? null,
      replyAt: r.reply ? new Date(r.replyDate ?? r.date) : null,
      createdAt: new Date(r.date),
    })),
  });

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

  // ── Orders (sample data so the admin Orders module has realistic content).
  //    Upserted by reference; items + activity are rebuilt each seed so this
  //    stays the source of truth. Real checkout orders (ref "DK-…") are left
  //    untouched. ────────────────────────────────────────────────────────────
  const prodBySlug = Object.fromEntries(
    (await prisma.product.findMany({ select: { id: true, slug: true, name: true, priceCents: true } })).map((p) => [p.slug, p]),
  );
  type SeedItem = { slug?: string; name?: string; priceCents?: number; qty: number };
  type SeedOrder = {
    ref: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    payment: "UNPAID" | "PAID" | "REFUNDED";
    fulfillment: "UNFULFILLED" | "FULFILLED" | "CANCELLED";
    paymentMethod?: string;
    deliveryMethod?: string;
    tracking?: string;
    tags?: string[];
    note?: string;
    shippingCents: number;
    taxCents?: number;
    date: string; // ISO
    items: SeedItem[];
  };
  const orderSeed: SeedOrder[] = [
    { ref: "10058", name: "Samuel Ankamah", email: "s.ankamah@gmail.com", phone: "6175550148", address: "88 Maple Ave", city: "Natick", region: "Massachusetts", postalCode: "01760", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223197428490", tags: ["Repeat"], shippingCents: 895, date: "2026-10-15T19:39:00", items: [{ slug: "suya-yaji", qty: 1 }, { slug: "berbere", qty: 1 }] },
    { ref: "10057", name: "James Sheffield", email: "jsheffield@outlook.com", phone: "7815550192", address: "214 Beacon St", city: "Boston", region: "Massachusetts", postalCode: "02116", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "PayPal", deliveryMethod: "USPS", tracking: "9400111899223188311204", shippingCents: 895, date: "2026-09-26T22:37:00", items: [{ slug: "adobo-seasoning", qty: 1 }, { slug: "habanero-chile-powder", qty: 1 }] },
    { ref: "10056", name: "Lorraine Allen", email: "lorraine.allen@gmail.com", phone: "2025550171", address: "1510 K St NW", city: "Washington", region: "District of Columbia", postalCode: "20005", country: "United States", payment: "PAID", fulfillment: "CANCELLED", paymentMethod: "Card", deliveryMethod: "USPS", note: "Customer requested cancellation — refund issued.", shippingCents: 895, date: "2026-08-21T17:44:00", items: [{ slug: "ras-el-hanout", qty: 1 }, { slug: "cajun-seasoning", qty: 1 }] },
    { ref: "10055", name: "Deborah Odunze", email: "deborah@debbskitchen.com", phone: "5085550130", address: "1245 Worcester St", city: "Natick", region: "Massachusetts", postalCode: "01760", country: "United States", payment: "UNPAID", fulfillment: "UNFULFILLED", deliveryMethod: "USPS", tags: ["Wholesale"], note: "Bulk restock for the Natick pop-up.", shippingCents: 0, date: "2026-06-04T11:35:00", items: [{ slug: "suya-yaji", qty: 4 }, { slug: "adobo-seasoning", qty: 3 }, { slug: "berbere", qty: 3 }] },
    { ref: "10034", name: "Franklin Ndille", email: "fndille@gmail.com", phone: "3015550166", address: "77 Garrett Park Rd", city: "Rockville", region: "Maryland", postalCode: "20850", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223176540981", shippingCents: 895, date: "2023-07-28T11:23:00", items: [{ slug: "ground-cumin", qty: 1 }, { slug: "garlic-powder", qty: 1 }, { slug: "onion-powder", qty: 1 }, { slug: "ginger-powder", qty: 1 }, { slug: "mediterranean-thyme", qty: 1 }] },
    { ref: "10033", name: "Margaret Cai", email: "margaret.cai@gmail.com", phone: "6465550119", address: "320 W 38th St", city: "New York", region: "New York", postalCode: "10018", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "PayPal", deliveryMethod: "USPS", tracking: "9400111899223165327110", shippingCents: 895, date: "2023-06-12T17:42:00", items: [{ slug: "adobo-seasoning", qty: 1 }, { slug: "cajun-seasoning", qty: 1 }] },
    { ref: "10032", name: "Anwuli Odebala", email: "anwuli.o@gmail.com", phone: "7135550144", address: "5005 Westheimer Rd", city: "Houston", region: "Texas", postalCode: "77056", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223154229087", shippingCents: 895, date: "2023-05-18T23:35:00", items: [{ slug: "habanero-chile-powder", qty: 1 }, { slug: "ginger-powder", qty: 1 }] },
    { ref: "10031", name: "Lukesh Singla", email: "lukesh.singla@gmail.com", phone: "4085550108", address: "2200 Mission College Blvd", city: "Santa Clara", region: "California", postalCode: "95054", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223143119034", shippingCents: 895, date: "2023-04-29T10:52:00", items: [{ slug: "organic-maharajah-curry", qty: 1 }, { slug: "ground-cumin", qty: 1 }] },
    { ref: "10030", name: "Rodney Thompson", email: "rodt34@gmail.com", phone: "5712284537", address: "19123 Dalton Points Place", city: "Leesburg", region: "Virginia", postalCode: "20176", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "92055901755477300118792742", shippingCents: 895, date: "2023-04-27T13:04:00", items: [{ name: "Sale Set (Oregano, Berbere, & Pink Salt)", priceCents: 2400, qty: 1 }] },
    { ref: "10029", name: "Meiko Bauchman", email: "meiko.b@gmail.com", phone: "2065550137", address: "400 Pine St", city: "Seattle", region: "Washington", postalCode: "98101", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "PayPal", deliveryMethod: "USPS", tracking: "9400111899223132008921", shippingCents: 895, date: "2023-04-21T08:38:00", items: [{ slug: "suya-yaji", qty: 1 }, { slug: "adobo-seasoning", qty: 1 }, { slug: "garlic-powder", qty: 1 }, { slug: "onion-powder", qty: 1 }] },
    { ref: "10028", name: "Kathy Patrovanie", email: "kpatrovanie@gmail.com", phone: "3125550123", address: "233 S Wacker Dr", city: "Chicago", region: "Illinois", postalCode: "60606", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223120998418", shippingCents: 895, date: "2023-03-19T19:39:00", items: [{ slug: "ground-cumin", qty: 1 }, { slug: "garlic-powder", qty: 1 }, { slug: "onion-powder", qty: 1 }, { slug: "ginger-powder", qty: 1 }, { slug: "mediterranean-thyme", qty: 1 }, { slug: "habanero-chile-powder", qty: 1 }] },
    { ref: "10027", name: "Galia Afedo", email: "galia.afedo@gmail.com", phone: "4045550155", address: "191 Peachtree St NE", city: "Atlanta", region: "Georgia", postalCode: "30303", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223119887305", shippingCents: 895, date: "2023-03-10T18:14:00", items: [{ slug: "chefs-blend-extra-virgin-olive-oil", qty: 1 }, { slug: "chefs-reserve-balsamic-vinegar", qty: 1 }, { slug: "mediterranean-thyme", qty: 1 }] },
    { ref: "10026", name: "Franklin Ndille", email: "fndille@gmail.com", phone: "3015550166", address: "77 Garrett Park Rd", city: "Rockville", region: "Maryland", postalCode: "20850", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "Card", deliveryMethod: "USPS", tracking: "9400111899223108776292", tags: ["Repeat"], shippingCents: 0, date: "2023-02-10T10:00:00", items: [{ slug: "suya-yaji", qty: 2 }, { slug: "berbere", qty: 2 }, { slug: "adobo-seasoning", qty: 2 }, { slug: "habanero-chile-powder", qty: 2 }] },
    { ref: "10025", name: "Paula Paris", email: "paula.paris@gmail.com", phone: "5615550182", address: "525 Okeechobee Blvd", city: "West Palm Beach", region: "Florida", postalCode: "33401", country: "United States", payment: "PAID", fulfillment: "FULFILLED", paymentMethod: "PayPal", deliveryMethod: "USPS", tracking: "9400111899223197665189", shippingCents: 895, date: "2023-02-08T12:46:00", items: [{ slug: "cajun-seasoning", qty: 1 }] },
  ];

  for (const o of orderSeed) {
    const lineItems = o.items.map((it) => {
      const p = it.slug ? prodBySlug[it.slug] : undefined;
      return {
        productId: p?.id ?? null,
        nameSnapshot: it.name ?? p?.name ?? "Item",
        priceCents: it.priceCents ?? p?.priceCents ?? 0,
        quantity: it.qty,
        fulfilled: o.fulfillment === "FULFILLED",
      };
    });
    const subtotalCents = lineItems.reduce((n, i) => n + i.priceCents * i.quantity, 0);
    const taxCents = o.taxCents ?? 0;
    const totalCents = subtotalCents + o.shippingCents + taxCents;
    const placedAt = new Date(o.date);

    const scalars = {
      name: o.name,
      email: o.email,
      phone: o.phone ?? null,
      address: o.address ?? null,
      city: o.city ?? null,
      region: o.region ?? null,
      postalCode: o.postalCode ?? null,
      country: o.country ?? null,
      note: o.note ?? null,
      subtotalCents,
      shippingCents: o.shippingCents,
      taxCents,
      totalCents,
      paymentStatus: o.payment,
      fulfillmentStatus: o.fulfillment,
      paymentMethod: o.paymentMethod ?? null,
      deliveryMethod: o.deliveryMethod ?? null,
      trackingNumber: o.tracking ?? null,
      tags: o.tags ?? [],
      createdAt: placedAt,
    } as const;

    const existing = await prisma.order.findUnique({ where: { reference: o.ref } });
    const id = existing
      ? (await prisma.order.update({ where: { reference: o.ref }, data: scalars })).id
      : (await prisma.order.create({ data: { reference: o.ref, ...scalars } })).id;

    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.orderItem.createMany({ data: lineItems.map((li) => ({ ...li, orderId: id })) });

    // Rebuild the activity timeline (newest events have later timestamps).
    const activity: { kind: string; message: string; createdAt: Date }[] = [
      { kind: "system", message: `${o.name} placed an order`, createdAt: placedAt },
    ];
    const at = (mins: number) => new Date(placedAt.getTime() + mins * 60000);
    if (o.payment === "PAID") activity.push({ kind: "system", message: "Order marked as Paid", createdAt: at(1) });
    if (o.payment === "REFUNDED") activity.push({ kind: "system", message: "Payment refunded to customer", createdAt: at(1) });
    if (o.fulfillment === "FULFILLED") {
      if (o.tracking) {
        activity.push({ kind: "system", message: "Tracking number added", createdAt: at(120) });
        activity.push({ kind: "system", message: "Tracking link added", createdAt: at(121) });
      }
      activity.push({ kind: "system", message: `Shipping confirmation email sent to ${o.name}`, createdAt: at(122) });
    }
    if (o.fulfillment === "CANCELLED") activity.push({ kind: "system", message: "Order canceled", createdAt: at(60) });
    await prisma.orderActivity.deleteMany({ where: { orderId: id } });
    await prisma.orderActivity.createMany({ data: activity.map((a) => ({ ...a, orderId: id })) });
  }

  // ── Videos (DK Show) — the real episodes from the live site ─────────────
  const videos: Array<{ slug: string; title: string; youtubeId: string; duration?: string }> = content.videos;
  for (const [i, v] of videos.entries()) {
    const data = {
      slug: v.slug,
      title: v.title,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
      thumbnailUrl: `/videos/${v.youtubeId}.jpg`,
      duration: v.duration ?? null,
      order: i + 1,
    };
    await prisma.video.upsert({ where: { slug: v.slug }, update: data, create: data });
  }
  await prisma.video.deleteMany({ where: { slug: { notIn: videos.map((v) => v.slug) } } });

  // ── Blog ──────────────────────────────────────────────────────────────────
  const posts: Array<{ slug: string; title: string; excerpt: string; author: string; category: string; imageUrl: string; date: string; body: string }> =
    content.blog;
  for (const { date, ...b } of posts) {
    const data = { ...b, published: true, createdAt: new Date(date) };
    await prisma.blogPost.upsert({ where: { slug: b.slug }, update: data, create: data });
  }
  await prisma.blogPost.deleteMany({ where: { slug: { notIn: posts.map((p) => p.slug) } } });

  // The live site has no testimonials (it uses product reviews); clear any
  // placeholder rows left by earlier seeds.
  await prisma.testimonial.deleteMany({});

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
  // Home page, in the live site's order.
  const homeSections = [
    section("heroSlideshow", 0, {
      interval: 4500,
      slides: [
        {
          image: "/home/hero-1.jpg",
          layout: "top",
          eyebrow: "HAND-BLENDED, SMALL BATCH, NO ADDITIVES SPICES & SEASONINGS",
          title: "ELEVATE YOUR TASTE",
          buttonLabel: "Shop Now",
          buttonHref: "/shop",
        },
        {
          image: "/home/hero-2.jpg",
          layout: "low",
          focus: "88% 100%",
          title: "SUPPORT OUR BLACK WOMAN OWNED SMALL BUSINESS",
          buttonLabel: "Shop Now",
          buttonHref: "/shop",
        },
        { image: "/home/hero-3.jpg" },
      ],
    }),
    section("bestSellers", 1, {
      title: "BEST SELLERS",
      slugs: ["berbere", "suya-yaji", "habanero-chile-powder", "adobo-seasoning"],
    }),
    section("dkShowBand", 2, {
      youtubeId: "V4WHyHvF9WE",
      title: "Ep4 Spicy Mango Salsa with Plantain Chips",
      poster: "/home/dkshow-poster.jpg",
    }),
    section("instagram", 3, {
      handle: "shopdebbskitchen",
      posts: 329,
      followers: 788,
      following: 23,
      bio: [
        "Debbs Kitchen",
        "*Where everyone cooks!",
        "*Our spices turn your meals into memories",
        "*Visit our store online at",
      ],
      link: "http://www.debbskitchen.com/",
      images: Array.from({ length: 10 }, (_, i) => `/home/ig/ig-${i + 1}.jpg`),
    }),
    section("reviews", 4, {}),
  ];

  const pages = [
    { slug: "home", title: "Home", sections: homeSections, metaDescription: "Chef-crafted spices, blends, oils and vinegars from Debb's Kitchen." },
    { slug: "about", title: "About", sections: [section("aboutPage", 0, content.pages.about)], metaDescription: "The story of Deborah Odunze and Debbs Kitchen." },
    { slug: "stores", title: "Store Locations", sections: [section("storesPage", 0, content.pages.stores)], metaDescription: "Find Debbs Kitchen spices in grocery stores and online." },
    { slug: "specials", title: "Special Deals", sections: [section("pageHero", 0, { eyebrow: "Save", headline: "Special Deals", subtitle: "Limited-time offers on favorite blends." }), section("productGrid", 1, { title: "On Sale Now", filter: "onSale", count: 8 })], metaDescription: "Special deals from Debb's Kitchen." },
    { slug: "events-gifts", title: "Events & Gifts", sections: [section("eventsGiftsPage", 0, { ...content.pages["events-gifts"], spices: products.map((p) => p.name) })], metaDescription: "Event gifts and bulk orders from Debbs Kitchen." },
    { slug: "gift-card", title: "eGift Card", sections: [section("giftCardPage", 0, content.pages["gift-card"])], metaDescription: "Debbs Kitchen eGift Cards." },
    { slug: "careers", title: "Careers", sections: [section("careersPage", 0, content.pages.careers)], metaDescription: "Careers at Debbs Kitchen." },
    { slug: "contact", title: "Contact Us", sections: [section("pageHero", 0, { eyebrow: "Get in touch", headline: "Contact Us", subtitle: "Questions, wholesale or event orders — send us a note and we'll get back to you." }), section("contactForm", 1, {})], metaDescription: "Contact Debb's Kitchen." },
    { slug: "terms-conditions", title: "Terms & Conditions", sections: [section("termsPage", 0, content.pages["terms-conditions"])], metaDescription: "Debbs Kitchen terms and conditions." },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, sections: JSON.stringify(p.sections), metaDescription: p.metaDescription },
      create: { slug: p.slug, title: p.title, sections: JSON.stringify(p.sections), metaDescription: p.metaDescription },
    });
  }

  console.log("✓ Seed complete");
  console.log(`  Admin user: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
