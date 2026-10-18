import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireUser, str } from "@/lib/admin";
import { Card, Field, PageHeader, SavedNotice, inputCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export const metadata = { title: "Account" };

async function saveAccount(fd: FormData) {
  "use server";
  const me = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: me.id } });
  const next = str(fd, "newPassword");
  const data: { name: string; password?: string } = { name: str(fd, "name") || user.name };
  if (next) {
    if (!(await bcrypt.compare(str(fd, "currentPassword"), user.password))) redirect("/admin/account?error=password");
    if (next.length < 8) redirect("/admin/account?error=short");
    data.password = await bcrypt.hash(next, 10);
  }
  await prisma.user.update({ where: { id: me.id }, data });
  redirect("/admin/account?saved=1");
}

const ERRORS: Record<string, string> = {
  password: "Your current password was wrong — nothing was changed.",
  short: "New passwords need at least 8 characters.",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const me = await requireUser();
  const { saved, error } = await searchParams;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: me.id } });

  return (
    <>
      <PageHeader title="Your account" description={user.email} />
      <SavedNotice show={!!saved} text="Account updated." />
      {error && ERRORS[error] && <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{ERRORS[error]}</div>}
      <form action={saveAccount} className="max-w-md space-y-6">
        <Card>
          <Field label="Name">
            <input name="name" defaultValue={user.name} className={inputCls} />
          </Field>
        </Card>
        <Card title="Change password">
          <div className="space-y-4">
            <Field label="Current password">
              <input name="currentPassword" type="password" autoComplete="current-password" className={inputCls} />
            </Field>
            <Field label="New password" hint="Leave blank to keep your current password.">
              <input name="newPassword" type="password" minLength={8} autoComplete="new-password" className={inputCls} />
            </Field>
          </div>
        </Card>
        <SubmitButton />
      </form>
    </>
  );
}
