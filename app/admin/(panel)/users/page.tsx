import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, str } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { Badge, Card, Field, PageHeader, Table, btnSecondary, inputCls, td } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";

export const metadata = { title: "Users" };

const ROLES: { value: UserRole; label: string; hint: string }[] = [
  { value: "ADMIN", label: "Admin", hint: "Everything, including users" },
  { value: "EDITOR", label: "Editor", hint: "Store, content and customers" },
  { value: "AUTHOR", label: "Author", hint: "Blog posts and media only" },
];

async function createUser(fd: FormData) {
  "use server";
  await requireUser(["ADMIN"]);
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  if (!email || password.length < 8) throw new Error("Email and a password of at least 8 characters are required.");
  await prisma.user.create({
    data: { name: str(fd, "name") || email, email, password: await bcrypt.hash(password, 10), role: str(fd, "role") as UserRole },
  });
  revalidatePath("/admin/users");
}

async function updateUser(fd: FormData) {
  "use server";
  const me = await requireUser(["ADMIN"]);
  const id = str(fd, "id");
  const password = str(fd, "password");
  if (password && password.length < 8) throw new Error("Passwords need at least 8 characters.");
  await prisma.user.update({
    where: { id },
    data: {
      // You can't demote yourself and lock everyone out.
      ...(id !== me.id ? { role: str(fd, "role") as UserRole } : {}),
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    },
  });
  revalidatePath("/admin/users");
}

async function deleteUser(fd: FormData) {
  "use server";
  const me = await requireUser(["ADMIN"]);
  const id = str(fd, "id");
  if (id === me.id) throw new Error("You can't delete your own account.");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export default async function UsersPage() {
  const me = await requireUser(["ADMIN"]);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader title="Users" description="People who can sign in to this admin." />
      <Table head={["User", "Role", "New password", "Added", ""]}>
        {users.map((u) => (
          <tr key={u.id}>
            <td className={td}>
              <div className="font-medium">
                {u.name} {u.id === me.id && <Badge>You</Badge>}
              </div>
              <div className="text-xs text-neutral-500">{u.email}</div>
            </td>
            <td className={td} colSpan={2}>
              <form action={updateUser} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="role" defaultValue={u.role} disabled={u.id === me.id} className={`${inputCls} w-32`}>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <input name="password" type="password" placeholder="Leave blank to keep" autoComplete="new-password" className={`${inputCls} w-48`} />
                <button className={btnSecondary}>Update</button>
              </form>
            </td>
            <td className={`${td} whitespace-nowrap text-neutral-500`}>{dateTime(u.createdAt)}</td>
            <td className={`${td} text-right`}>
              {u.id !== me.id && (
                <DeleteButton action={deleteUser} id={u.id} label="Remove" className="text-sm text-red-600 hover:underline" confirmText={`Remove ${u.email}?`} />
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Card title="Add a user" className="mt-8 max-w-2xl">
        <form action={createUser} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" className={inputCls} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required className={inputCls} />
          </Field>
          <Field label="Password" hint="At least 8 characters. Share it with them privately.">
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <Field label="Role">
            <select name="role" defaultValue="EDITOR" className={inputCls}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.hint}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <SubmitButton>Add user</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
