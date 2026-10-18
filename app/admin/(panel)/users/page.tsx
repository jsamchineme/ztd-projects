import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, str } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Badge, Card, Field, PageHeader, SavedNotice, btnPrimary, btnSecondary, inputCls } from "@/components/admin/ui";
import { Select } from "@/components/admin/Select";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";

export const metadata = { title: "Users" };

const ROLES: { value: UserRole; label: string; hint: string; tone: "green" | "blue" | "gray" }[] = [
  { value: "ADMIN", label: "Admin", hint: "Everything, including managing users", tone: "green" },
  { value: "EDITOR", label: "Editor", hint: "Store, pages, blog, customers and settings", tone: "blue" },
  { value: "AUTHOR", label: "Author", hint: "Blog posts and media only", tone: "gray" },
];
const role = (r: UserRole) => ROLES.find((x) => x.value === r)!;

const NOTICES: Record<string, string> = {
  added: "User added. Share their password with them privately.",
  updated: "User updated.",
  removed: "User removed.",
};
const ERRORS: Record<string, string> = {
  taken: "Another user already has that email address.",
  short: "Passwords need at least 8 characters.",
  email: "Please enter an email address.",
};

const isTaken = (e: unknown) => (e as { code?: string })?.code === "P2002";

async function createUser(fd: FormData) {
  "use server";
  await requireUser(["ADMIN"]);
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  if (!email) redirect("/admin/users?add=1&error=email");
  if (password.length < 8) redirect("/admin/users?add=1&error=short");
  try {
    await prisma.user.create({
      data: { name: str(fd, "name") || email, email, password: await bcrypt.hash(password, 10), role: str(fd, "role") as UserRole },
    });
  } catch (e) {
    if (isTaken(e)) redirect("/admin/users?add=1&error=taken");
    throw e;
  }
  redirect("/admin/users?saved=added");
}

async function updateUser(fd: FormData) {
  "use server";
  const me = await requireUser(["ADMIN"]);
  const id = str(fd, "id");
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  if (!email) redirect(`/admin/users?edit=${id}&error=email`);
  if (password && password.length < 8) redirect(`/admin/users?edit=${id}&error=short`);
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: str(fd, "name") || email,
        email,
        // You can't change your own role and lock everyone out.
        ...(id !== me.id ? { role: str(fd, "role") as UserRole } : {}),
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
    });
  } catch (e) {
    if (isTaken(e)) redirect(`/admin/users?edit=${id}&error=taken`);
    throw e;
  }
  redirect("/admin/users?saved=updated");
}

async function deleteUser(fd: FormData) {
  "use server";
  const me = await requireUser(["ADMIN"]);
  const id = str(fd, "id");
  if (id !== me.id) await prisma.user.delete({ where: { id } });
  redirect("/admin/users?saved=removed");
}

function RoleSelect({ defaultValue, disabled }: { defaultValue: UserRole; disabled?: boolean }) {
  return (
    <Select
      name="role"
      defaultValue={defaultValue}
      disabled={disabled}
      aria-label="Role"
      options={ROLES.map((r) => ({ value: r.value, label: `${r.label} — ${r.hint}` }))}
    />
  );
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; add?: string; saved?: string; error?: string }>;
}) {
  const me = await requireUser(["ADMIN"]);
  const { edit, add, saved, error } = await searchParams;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader title="Users" description="People who can sign in to this admin.">
        {!add && (
          <Link href="/admin/users?add=1" className={btnPrimary}>
            Add user
          </Link>
        )}
      </PageHeader>
      <SavedNotice show={!!saved && !!NOTICES[saved]} text={NOTICES[saved ?? ""]} />
      {error && ERRORS[error] && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{ERRORS[error]}</div>
      )}

      {add && (
        <Card title="Add a user" className="mb-6">
          <form action={createUser} className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input name="name" className={inputCls} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required className={inputCls} />
            </Field>
            <Field label="Password" hint="At least 8 characters. They can change it under Account.">
              <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
            </Field>
            <Field label="Role">
              <RoleSelect defaultValue="EDITOR" />
            </Field>
            <div className="flex gap-2 sm:col-span-2">
              <SubmitButton>Add user</SubmitButton>
              <Link href="/admin/users" className={btnSecondary}>
                Cancel
              </Link>
            </div>
          </form>
        </Card>
      )}

      <div className="divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        {users.map((u) => {
          const isMe = u.id === me.id;
          const r = role(u.role);
          return (
            <div key={u.id}>
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[50%] bg-green/10 text-sm font-semibold uppercase text-green-dark">
                  {(u.name || u.email).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="truncate">{u.name}</span>
                    {isMe && <Badge>You</Badge>}
                    <span className="sm:hidden">
                      <Badge tone={r.tone}>{r.label}</Badge>
                    </span>
                  </div>
                  <div className="truncate text-sm text-neutral-500">{u.email}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <Badge tone={r.tone}>{r.label}</Badge>
                  <div className="mt-1 text-xs text-neutral-400">Added {formatDate(u.createdAt)}</div>
                </div>
                {edit === u.id ? (
                  <Link href="/admin/users" className="text-sm text-neutral-500 hover:text-neutral-900">
                    Close
                  </Link>
                ) : (
                  <Link href={`/admin/users?edit=${u.id}`} className="text-sm font-medium text-green hover:underline">
                    Edit
                  </Link>
                )}
              </div>

              {edit === u.id && (
                <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-5">
                  <form action={updateUser} className="grid gap-4 sm:grid-cols-2">
                    <input type="hidden" name="id" value={u.id} />
                    <Field label="Name">
                      <input name="name" defaultValue={u.name} className={inputCls} />
                    </Field>
                    <Field label="Email">
                      <input name="email" type="email" required defaultValue={u.email} className={inputCls} />
                    </Field>
                    <Field label="Role" hint={isMe ? "You can't change your own role." : undefined}>
                      <RoleSelect defaultValue={u.role} disabled={isMe} />
                    </Field>
                    <Field label="New password" hint="Leave blank to keep the current password.">
                      <input name="password" type="password" minLength={8} autoComplete="new-password" className={inputCls} />
                    </Field>
                    <div className="flex gap-2 sm:col-span-2">
                      <SubmitButton>Save changes</SubmitButton>
                      <Link href="/admin/users" className={btnSecondary}>
                        Cancel
                      </Link>
                    </div>
                  </form>
                  {!isMe && (
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
                      <p className="text-sm text-neutral-500">Once removed, they can no longer sign in with this account.</p>
                      <DeleteButton action={deleteUser} id={u.id} label="Remove user" confirmText={`Remove ${u.email}?`} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r.value} className="rounded-lg border border-neutral-200 bg-white p-4">
            <Badge tone={r.tone}>{r.label}</Badge>
            <p className="mt-2 text-neutral-600">{r.hint}</p>
          </div>
        ))}
      </div>
    </>
  );
}
