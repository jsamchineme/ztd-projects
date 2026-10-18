import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, cents, requireUser, revalidateSite, str } from "@/lib/admin";
import { centsInput } from "@/lib/admin-format";
import { getSetting } from "@/lib/settings";
import { Card, Field, PageHeader, SavedNotice, inputCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export const metadata = { title: "Site settings" };

async function put(key: string, value: unknown) {
  const v = JSON.stringify(value);
  await prisma.setting.upsert({ where: { key }, update: { value: v }, create: { key, value: v } });
}

async function saveSettings(fd: FormData) {
  "use server";
  await requireUser(EDITORS);
  await put("promoBanner", str(fd, "promoBanner"));
  await put("freeShippingThresholdCents", cents(fd, "freeShipping") ?? 0);
  revalidateSite();
  redirect("/admin/settings?saved=1");
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireUser(EDITORS);
  const { saved } = await searchParams;
  const [promo, threshold] = await Promise.all([
    getSetting("promoBanner", "Free shipping on orders over $100"),
    getSetting("freeShippingThresholdCents", 10000),
  ]);

  return (
    <>
      <PageHeader title="Site settings" />
      <SavedNotice show={!!saved} text="Settings saved." />
      <form action={saveSettings} className="max-w-2xl space-y-6">
        <Card title="Announcement bar">
          <Field label="Text" hint="The teal bar at the very top of every page. Leave empty to hide it.">
            <input name="promoBanner" defaultValue={promo} className={inputCls} />
          </Field>
        </Card>
        <Card title="Shipping">
          <Field label="Free shipping on orders over ($)" hint="Orders below this pay the flat shipping rate in the cart.">
            <input name="freeShipping" inputMode="decimal" defaultValue={centsInput(threshold)} className={`${inputCls} max-w-40`} />
          </Field>
        </Card>
        <SubmitButton>Save settings</SubmitButton>
      </form>
    </>
  );
}
